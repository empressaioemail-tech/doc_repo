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
  NEEDS_OPERATOR_GO: "NEEDS_OPERATOR_GO",
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

  // A loop claims and begins work without a human in the path. That is fine for
  // ordinary cards and wrong for deploys to production, irreversible deletions,
  // and anything requiring credentials. Those carry authorization:"operator" and
  // stay refused until an authorization file exists, so a loop cannot start one
  // by being the next thing to tick.
  if (card.authorization === "operator" && !state.authorization) {
    push(
      R.NEEDS_OPERATOR_GO,
      `card is authorization:"operator" and has no _queue/cards/${card.id}/authorization.json`
    );
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
    // `claimed` is what lets a waiting seat watch the card in front of it. A
    // dependency somebody is actively working is worth checking back on soon; a
    // dependency nobody has started is not, and waking every few minutes to find
    // it still unstarted is the chatter this pacing exists to avoid.
    const depClaim = readJson(path.join(cardDir(depId), "claim.json"));
    deps[depId] = {
      present,
      parsed: !!parsed,
      hasLeaveBehind: !!parsed && Object.prototype.hasOwnProperty.call(parsed, "leave_behind"),
      claimed: !!depClaim,
      claimExpiresAt: depClaim?.expires_at ?? null,
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
    authorization: readJson(path.join(cardDir(id), "authorization.json")),
    closeExists: !!card?.close_artifact && fs.existsSync(path.join(REPO_ROOT, card.close_artifact)),
    seats: loadSeats(),
    deps: card ? loadDepState(card) : {},
    storeTokens: readJson(tokensPath()) || {},
  };
}

export function minutesFromNow(now, minutes) {
  return new Date(now.getTime() + minutes * MIN).toISOString();
}

// ---------- pacing ----------
//
// A loop that polls a fixed interval is chatty on a quiet board and late on a
// busy one. The queue already knows when most blocks clear, so it can say when
// it is worth waking. Refusals with no knowable clear time (a dependency another
// seat must close, a wrong seat, a missing operator go) return null, which the
// caller treats as "no scheduled change" rather than "never".

export function windowEnd(now, win) {
  const e = parseHm(win.end_utc);
  const d = new Date(now);
  d.setUTCHours(Math.floor(e / 60), e % 60, 0, 0);
  return d;
}

/**
 * When could this card first become claimable? Every refusal must clear, so the
 * answer is the LATEST of the individual clear times. Any unknowable refusal
 * makes the whole answer unknowable.
 * @returns {Date|null} null when unknowable
 */
export function unblockAt(state, req) {
  const now = req.now;
  const res = evaluateClaim(state, req);
  if (res.ok) return now;

  let latest = now;
  for (const r of res.refusals) {
    let t = null;
    if (r.code === R.MAINTENANCE_WINDOW) {
      const win = inMaintenanceWindow(now, state.config?.maintenance_windows, state.card.needs_store);
      if (win) t = windowEnd(now, win);
    } else if (r.code === R.STORE_TOKEN_HELD) {
      const tok = state.storeTokens?.[state.card.needs_store];
      if (tok?.expires_at) t = new Date(Date.parse(tok.expires_at));
    } else if (r.code === R.ALREADY_CLAIMED) {
      if (state.claim?.expires_at) t = new Date(Date.parse(state.claim.expires_at));
    }
    if (t === null || Number.isNaN(t?.getTime())) return null;
    if (t > latest) latest = t;
  }
  return latest;
}

/**
 * Seconds until the board could change for this seat, clamped to the
 * ScheduleWakeup range [60, 3600]. Returns 0 when something is claimable now.
 * @param {Array} states  loadState() results for every card
 */
export function nextWakeSeconds(states, req, opts = {}) {
  const now = req.now;
  const cfg = states[0]?.config || {};
  const idlePoll = opts.idlePollSeconds ?? cfg.idle_poll_seconds ?? 1200;
  const depWatchPoll = opts.depWatchPollSeconds ?? cfg.dep_watch_poll_seconds ?? 300;

  let best = null;        // earliest knowable unblock time
  let watchingInFlight = false; // waiting on a dependency somebody is working now

  for (const st of states) {
    if (!st.card) continue;
    const owner = Object.entries(st.seats || {}).find(([, rs]) => rs.includes(st.card.repo));
    const mine = st.card.repo === "doc_repo" || (owner && owner[0] === req.seat);
    if (!mine) continue; // another seat's card changing does not wake this seat

    const res = evaluateClaim(st, req);
    if (res.ok) return 0;

    const t = unblockAt(st, req);
    if (t !== null) {
      if (best === null || t < best) best = t;
      continue;
    }
    // Unknowable. If the only thing standing in the way is a dependency that is
    // currently claimed, the card in front is in flight and this seat should
    // check back soon rather than sleeping out the idle interval.
    const blockedOnDeps = res.refusals.every(
      (r) => r.code === R.DEPENDENCY_OPEN || r.code === R.DEPENDENCY_MALFORMED
    );
    if (blockedOnDeps && Object.values(st.deps || {}).some((d) => !d.present && d.claimed)) {
      watchingInFlight = true;
    }
  }

  if (best !== null && best <= now) return 0;
  const secs = best === null
    ? (watchingInFlight ? depWatchPoll : idlePoll)
    : Math.min(
        Math.ceil((best - now) / 1000),
        watchingInFlight ? depWatchPoll : Infinity
      );
  return Math.min(3600, Math.max(60, secs));
}
