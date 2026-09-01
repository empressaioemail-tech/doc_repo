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
  STATE_UNREADABLE: "STATE_UNREADABLE",
  WORKTREE_MISMATCH: "WORKTREE_MISMATCH",
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

  // A control input that could not be read is not an absent control input. Any
  // unreadable state refuses before anything else is evaluated, because every
  // check below would be reasoning from a file it could not see.
  for (const u of state.unreadable || []) {
    push(R.STATE_UNREADABLE, u);
  }

  const card = state.card;
  if (!card) {
    push(R.NO_CARD, "no card.json for that id");
    return { ok: false, refusals };
  }

  if (state.worktreeCheck && !state.worktreeCheck.ok) {
    push(R.WORKTREE_MISMATCH, state.worktreeCheck.detail);
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
    // Store token REMOVED 2026-09-01 on operator ruling. It serialised the whole
    // store when conflicts are row-scoped, and cost four lanes an afternoon while
    // the actual job is filling a database with data we already hold. Counties do
    // not conflict with each other. If concurrent load becomes a real measured
    // problem, fix it where it is measured, not with a queue-wide lock.

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

// Store holders are a LIST under a cap. Tolerates the old single-holder shape so a
// token written before the cap landed is still honoured rather than silently dropped.
export function liveStoreHolders(storeTokens, store, now) {
  const raw = storeTokens?.[store];
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : Array.isArray(raw.holders) ? raw.holders : [raw];
  return arr.filter((t) => t && t.card && !isExpired(t.expires_at, now));
}

// ---------- disk helpers ----------

// ABSENT and UNREADABLE are two different states and collapsing them is how a
// control fails open. Found 2026-09-01 by the property seat during queue-init: a
// tokens file written with a PowerShell UTF-8 BOM parsed as garbage, readJson
// caught and returned null, and "a store token exists" became "no token held".
// The claim was then GRANTED over a live token.
//
// Absent is a real and expected state and returns null. Present-but-unparseable
// is a broken control input and throws. Callers that must not crash catch it and
// turn it into a refusal, never into a permission.
export function readJson(p, { strict = false } = {}) {
  let raw;
  try {
    raw = fs.readFileSync(p, "utf8");
  } catch (e) {
    if (e?.code === "ENOENT") return null; // genuinely absent
    if (strict) throw new Error(`unreadable: ${p}: ${e.message}`);
    return null;
  }
  // Strip a UTF-8 BOM rather than choking on it; PowerShell writes them by
  // default and a BOM is not a corrupt file.
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  try {
    return JSON.parse(raw);
  } catch (e) {
    if (strict) throw new Error(`unparseable JSON: ${p}: ${e.message}`);
    return null;
  }
}

// Two independently derived inputs: what the claim DECLARES, and what git says is
// actually checked out there. A claim that cannot name where the work happens was
// already refused; this refuses one that names somewhere it is not.
export function checkWorktree(worktree, branch, execFileSync) {
  if (!worktree || !branch) return { ok: false, detail: "worktree and branch are required" };
  if (!fs.existsSync(worktree)) return { ok: false, detail: `worktree does not exist: ${worktree}` };
  let head;
  try {
    head = execFileSync("git", ["-C", worktree, "rev-parse", "--abbrev-ref", "HEAD"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (e) {
    return { ok: false, detail: `not a git checkout or git failed at ${worktree}: ${String(e.message).slice(0, 120)}` };
  }
  if (head !== branch) {
    return { ok: false, detail: `declared branch "${branch}" but ${worktree} is on "${head}"` };
  }
  return { ok: true, detail: `${worktree} is on ${head}` };
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
  // Every one of these is a control input, so all are read strictly and a read
  // failure becomes a refusal rather than a default. `unreadable` is checked
  // first in evaluateClaim.
  const unreadable = [];
  const strict = (p) => {
    try {
      return readJson(p, { strict: true });
    } catch (e) {
      unreadable.push(e.message);
      return null;
    }
  };
  const card = strict(path.join(cardDir(id), "card.json"));
  const config = strict(configPath()) || { stores: [], maintenance_windows: [] };
  let closeHasLeaveBehind = false;
  if (card?.close_artifact) {
    const closePath = path.join(REPO_ROOT, card.close_artifact);
    if (fs.existsSync(closePath)) {
      const parsed = strict(closePath);
      closeHasLeaveBehind = !!parsed && Object.prototype.hasOwnProperty.call(parsed, "leave_behind");
    }
  }
  return {
    card,
    config,
    unreadable,
    claim: strict(path.join(cardDir(id), "claim.json")),
    authorization: strict(path.join(cardDir(id), "authorization.json")),
    closeExists: !!card?.close_artifact && fs.existsSync(path.join(REPO_ROOT, card.close_artifact)),
    closeHasLeaveBehind,
    seats: loadSeats(),
    deps: card ? loadDepState(card) : {},
    storeTokens: strict(tokensPath()) || {},
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
// A closed card is FINISHED, not waiting. Found 2026-09-01 by the property seat:
// next-wake labelled every CARD_CLOSED row "unknowable (waiting on another seat or
// an operator go)" because unblockAt had no branch for it and fell through to null.
// Harmless while something else was claimable; on a fully closed board it would have
// told a loop to keep polling a finished board forever.
export function isDone(state, req) {
  if (!state.card) return false;
  return evaluateClaim(state, req).refusals.some((r) => r.code === R.CARD_CLOSED);
}

export function unblockAt(state, req) {
  const now = req.now;
  if (isDone(state, req)) return "done";
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
  let anyDone = false;    // at least one card is finished
  let anyOpen = false;    // at least one card is not finished

  for (const st of states) {
    if (!st.card) continue;
    const owner = Object.entries(st.seats || {}).find(([, rs]) => rs.includes(st.card.repo));
    const mine = st.card.repo === "doc_repo" || (owner && owner[0] === req.seat);
    if (!mine) continue; // another seat's card changing does not wake this seat
    anyOpen = true;

    const res = evaluateClaim(st, req);
    if (res.ok) return 0;

    const t = unblockAt(st, req);
    if (t === "done") { anyDone = true; continue; } // finished, never a reason to wake
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

  // Every card for this seat is finished. Not "wait a while" - there is nothing to
  // wait for. null tells the caller the board is complete so a loop stops instead of
  // sleeping on a finished board.
  if (anyOpen && anyDone && best === null && !watchingInFlight) return null;

  if (best !== null && best <= now) return 0;
  const secs = best === null
    ? (watchingInFlight ? depWatchPoll : idlePoll)
    : Math.min(
        Math.ceil((best - now) / 1000),
        watchingInFlight ? depWatchPoll : Infinity
      );
  return Math.min(3600, Math.max(60, secs));
}

// ---------- release ----------
//
// DOUBLE-CLOSE-AUDIT 2026-09-01: a mandatory --reason that defaults to "close"
// is a ceremony (dispatch_overrides.log, sixteen identical strings). Split the
// verb. Infer close when --as is omitted IFF the close is contract-complete so
// the three live lanes keep working. Otherwise refuse and print both forms.
// Do not add these codes to R: that is the claim refusal set and this card
// does not change it.

export const RELEASE = Object.freeze({
  NO_CARD: "NO_CARD",
  AS_UNKNOWN: "AS_UNKNOWN",
  CLOSE_INCOMPLETE: "CLOSE_INCOMPLETE",
  REASON_REQUIRED: "REASON_REQUIRED",
  STEAL_REQUIRES_FORCE: "STEAL_REQUIRES_FORCE",
  SEAT_MISMATCH: "SEAT_MISMATCH",
});

export function releaseForms(id, seat) {
  const s = seat || "<seat>";
  const c = id || "<id>";
  return [
    `  To finish:      node scripts/queue/cli.mjs release --card ${c} --seat ${s} --as close`,
    `  To put it down: node scripts/queue/cli.mjs release --card ${c} --seat ${s} --as abandon --reason "<why>"`,
  ].join("\n");
}

export function inferReleaseAs(state, asFlag) {
  if (asFlag) return asFlag;
  if (state.closeExists && state.closeHasLeaveBehind) return "close";
  return null;
}

export function evaluateRelease(state, req) {
  const forms = releaseForms(state.card?.id, req.seat);
  const refusals = [];
  const push = (code, detail) => refusals.push({ code, detail });

  if (!state.card) {
    push(RELEASE.NO_CARD, "no card.json for that id");
    return { ok: false, as: null, result: null, refusals, forms };
  }

  const allowed = new Set(["close", "abandon", "steal"]);
  if (req.as && !allowed.has(req.as)) {
    push(RELEASE.AS_UNKNOWN, `--as must be close, abandon, or steal; got "${req.as}"`);
    return { ok: false, as: req.as, result: null, refusals, forms };
  }

  const inferred = inferReleaseAs(state, req.as);
  if (!inferred) {
    push(
      RELEASE.CLOSE_INCOMPLETE,
      "release without --as only succeeds when the close artifact exists and carries leave_behind"
    );
    return { ok: false, as: null, result: null, refusals, forms };
  }

  const reason = typeof req.reason === "string" ? req.reason.trim() : "";
  const otherSeat = state.claim && state.claim.seat !== req.seat;

  if (inferred === "close") {
    if (!state.closeExists) push(RELEASE.CLOSE_INCOMPLETE, "close artifact is absent");
    else if (!state.closeHasLeaveBehind) push(RELEASE.CLOSE_INCOMPLETE, "close artifact has no leave_behind");
    if (otherSeat) {
      push(RELEASE.SEAT_MISMATCH, `held by ${state.claim.seat}. To take it: --as steal --force --reason`);
    }
    if (refusals.length) return { ok: false, as: "close", result: null, refusals, forms };
    return { ok: true, as: "close", result: "RELEASED", refusals: [], forms };
  }

  if (inferred === "abandon") {
    if (!reason) push(RELEASE.REASON_REQUIRED, "--as abandon requires --reason");
    if (otherSeat) {
      push(RELEASE.SEAT_MISMATCH, `held by ${state.claim.seat}. To take it: --as steal --force --reason`);
    }
    if (refusals.length) return { ok: false, as: "abandon", result: null, refusals, forms };
    return { ok: true, as: "abandon", result: "ABANDONED", refusals: [], forms };
  }

  if (!req.force) push(RELEASE.STEAL_REQUIRES_FORCE, "--as steal requires --force");
  if (!reason) push(RELEASE.REASON_REQUIRED, "--as steal requires --reason");
  if (refusals.length) return { ok: false, as: "steal", result: null, refusals, forms };
  return { ok: true, as: "steal", result: "STEAL", refusals: [], forms };
}

export function closeAddendumPath(closeArtifact, atIso) {
  const ext = path.extname(closeArtifact);
  const base = ext ? closeArtifact.slice(0, -ext.length) : closeArtifact;
  const stamp = String(atIso).replace(/[:.]/g, "-");
  return `${base}-addendum-${stamp}${ext || ".json"}`;
}

export function cardClosedAddendumHint(id, seat) {
  const s = seat || "<seat>";
  return `node scripts/queue/cli.mjs close-addendum --card ${id} --seat ${s} --text "<what changed>"`;
}
