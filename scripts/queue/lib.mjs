// Seat queue: claim evaluation.
//
// The whole point of this file is REFUSAL. A queue that fires work is the
// parallel wrapper the L3 fleet ruling warns about; a queue that refuses is the
// tighter contract the scan-fix post-mortem asks for. Every function below
// answers "why may this NOT proceed", and the CLI exits non-zero on any refusal.
//
// evaluateClaim is pure so it can be verified by violation without touching disk.

import fs from "node:fs";
import path from "node:path";

export const REPO_ROOT = path.resolve(new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

export const R = Object.freeze({
  NO_CARD: "NO_CARD",
  NO_SEAT: "NO_SEAT",
  WRONG_SEAT: "WRONG_SEAT",
  ALREADY_CLAIMED: "ALREADY_CLAIMED",
  DEPENDENCY_OPEN: "DEPENDENCY_OPEN",
  DEPENDENCY_MALFORMED: "DEPENDENCY_MALFORMED",
  STORE_TOKEN_HELD: "STORE_TOKEN_HELD",
  MAINTENANCE_WINDOW: "MAINTENANCE_WINDOW",
  UNKNOWN_STORE: "UNKNOWN_STORE",
  CARD_CLOSED: "CARD_CLOSED",
});

const MIN = 60 * 1000;

export function parseHm(hm) {
  const m = /^(\d{2}):(\d{2})$/.exec(hm);
  if (!m) throw new Error(`bad HH:MM: ${hm}`);
  return Number(m[1]) * 60 + Number(m[2]);
}

// A window is [start, end) in UTC minutes on a given UTC weekday.
export function inMaintenanceWindow(now, windows, store) {
  const dow = now.getUTCDay();
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  for (const w of windows || []) {
    if (w.store !== store) continue;
    if (w.weekday !== dow) continue;
    const s = parseHm(w.start_utc);
    const e = parseHm(w.end_utc);
    if (mins >= s && mins < e) return w;
  }
  return null;
}

export function isExpired(iso, now) {
  if (!iso) return true;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return true;
  return t <= now.getTime();
}

/**
 * @param {object} state
 *   state.card            card.json contents, or null if absent
 *   state.claim           existing claim.json, or null
 *   state.closeExists     boolean: this card's own close artifact is on disk
 *   state.seats           { seatName: [repoName, ...] }
 *   state.deps            { depId: {present:bool, parsed:bool, hasLeaveBehind:bool} }
 *   state.storeTokens     { storeName: {card, seat, expires_at} | null }
 *   state.config          { stores:[], maintenance_windows:[] }
 * @param {object} req     { seat, now: Date, force?: boolean }
 * @returns {{ok:boolean, refusals:Array<{code:string,detail:string}>}}
 */
export function evaluateClaim(state, req) {
  const refusals = [];
  const push = (code, detail) => refusals.push({ code, detail });
  const now = req.now;

  const card = state.card;
  if (!card) {
    push(R.NO_CARD, "no card.json for that id");
    return { ok: false, refusals };
  }

  if (state.closeExists) {
    push(R.CARD_CLOSED, `close artifact already present at ${card.close_artifact}`);
  }

  // Seat must be registered, and must own the card's repo. This is SEAT-01
  // enforced at claim time instead of remembered.
  const owned = state.seats?.[req.seat];
  if (!owned) {
    push(R.NO_SEAT, `seat "${req.seat}" is not in _catalog/seat_register.json`);
  } else if (card.repo && card.repo !== "doc_repo" && !owned.includes(card.repo)) {
    const owner = Object.entries(state.seats).find(([, rs]) => rs.includes(card.repo));
    push(
      R.WRONG_SEAT,
      `card targets repo "${card.repo}" which belongs to seat "${owner ? owner[0] : "unregistered"}", not "${req.seat}"`
    );
  }

  // A live claim by anyone blocks. A claim by this same seat also blocks, because
  // re-claiming your own card silently is how one seat runs a card twice.
  const claim = state.claim;
  if (claim && !isExpired(claim.expires_at, now)) {
    push(
      R.ALREADY_CLAIMED,
      `held by seat "${claim.seat}" since ${claim.claimed_at}, expires ${claim.expires_at}`
    );
  }

  for (const [depId, d] of Object.entries(state.deps || {})) {
    if (!d.present) {
      push(R.DEPENDENCY_OPEN, `depends_on "${depId}" has no close artifact`);
    } else if (!d.parsed) {
      push(R.DEPENDENCY_MALFORMED, `depends_on "${depId}" close is not valid JSON`);
    } else if (!d.hasLeaveBehind) {
      // ENFORCEMENT: every lane finish declares its leave_behind before it can
      // close. A close missing it did not follow the contract, so it does not
      // satisfy a dependency.
      push(R.DEPENDENCY_MALFORMED, `depends_on "${depId}" close has no leave_behind`);
    }
  }

  const store = card.needs_store;
  if (store) {
    if (!state.config?.stores?.includes(store)) {
      push(R.UNKNOWN_STORE, `card needs_store "${store}" which is not in config.stores`);
    }
    const tok = state.storeTokens?.[store];
    if (tok && tok.card !== card.id && !isExpired(tok.expires_at, now)) {
      push(
        R.STORE_TOKEN_HELD,
        `store "${store}" held by card "${tok.card}" (seat ${tok.seat}) until ${tok.expires_at}`
      );
    }
    const win = inMaintenanceWindow(now, state.config?.maintenance_windows, store);
    if (win) {
      push(
        R.MAINTENANCE_WINDOW,
        `store "${store}" is inside its maintenance window ${win.start_utc}-${win.end_utc} UTC (${win.note || "scheduled"})`
      );
    }
  }

  return { ok: refusals.length === 0, refusals };
}

// ---------- disk helpers ----------

export function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

export function queueDir() {
  return path.join(REPO_ROOT, "_queue");
}
export function cardDir(id) {
  return path.join(queueDir(), "cards", id);
}
export function configPath() {
  return path.join(queueDir(), "config.json");
}
export function tokensPath() {
  return path.join(queueDir(), "tokens", "store.json");
}

export function loadSeats() {
  const reg = readJson(path.join(REPO_ROOT, "_catalog", "seat_register.json"));
  const out = {};
  const arr = Array.isArray(reg) ? reg : reg?.seats || [];
  for (const s of arr) out[s.name] = (s.repos || []).map((r) => r.name);
  // `integration` is a top-level key in the register rather than a member of
  // `seats`, because it is the doc_repo checkout and merge target and explicitly
  // "not a planner seat". It still has to be claimable, so it is loaded here and
  // owns doc_repo alone. Reading only `seats` silently loses it.
  if (reg && !Array.isArray(reg) && reg.integration?.name) {
    out[reg.integration.name] = ["doc_repo"];
  }
  return out;
}

export function loadDepState(card) {
  const deps = {};
  for (const depId of card.depends_on || []) {
    const dc = readJson(path.join(cardDir(depId), "card.json"));
    const closePath = dc?.close_artifact ? path.join(REPO_ROOT, dc.close_artifact) : null;
    const present = !!closePath && fs.existsSync(closePath);
    const parsed = present ? readJson(closePath) : null;
    deps[depId] = {
      present,
      parsed: !!parsed,
      hasLeaveBehind: !!parsed && Object.prototype.hasOwnProperty.call(parsed, "leave_behind"),
    };
  }
  return deps;
}

export function loadState(id) {
  const card = readJson(path.join(cardDir(id), "card.json"));
  const config = readJson(configPath()) || { stores: [], maintenance_windows: [] };
  return {
    card,
    config,
    claim: readJson(path.join(cardDir(id), "claim.json")),
    closeExists: !!card?.close_artifact && fs.existsSync(path.join(REPO_ROOT, card.close_artifact)),
    seats: loadSeats(),
    deps: card ? loadDepState(card) : {},
    storeTokens: readJson(tokensPath()) || {},
  };
}

export function minutesFromNow(now, minutes) {
  return new Date(now.getTime() + minutes * MIN).toISOString();
}
