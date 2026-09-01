#!/usr/bin/env node
// Verify the queue by violating it.
//
// ENFORCEMENT: "Before reporting any check, audit, or guard as working, run it
// against a known violation and confirm it fails. A check observed only passing
// has not been observed working."
//
// Every refusal code below is constructed and asserted to fire. Every refusal
// that has an inverse (an expired lease, a token held by the same card, a time
// outside the window) is asserted NOT to fire, because a control that refuses
// everything is as broken as one that refuses nothing.
//
//   node scripts/queue/self-test.mjs

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { evaluateClaim, inMaintenanceWindow, parseHm, unblockAt, nextWakeSeconds, readJson, R } from "./lib.mjs";

let pass = 0, fail = 0;
const results = [];

function t(name, fn) {
  try {
    fn();
    pass++; results.push(["PASS", name, ""]);
  } catch (e) {
    fail++; results.push(["FAIL", name, e.message]);
  }
}
const assert = (c, m) => { if (!c) throw new Error(m); };
const codes = (r) => r.refusals.map((x) => x.code);
const hasCode = (r, c) => codes(r).includes(c);

// Tuesday 2026-09-01. Chosen because it is the window that cost two runs.
const TUE_0530 = new Date("2026-09-01T05:30:00Z");
const TUE_0630 = new Date("2026-09-01T06:30:00Z");
const TUE_0500 = new Date("2026-09-01T05:00:00Z");
const TUE_0600 = new Date("2026-09-01T06:00:00Z");
const WED_0530 = new Date("2026-09-02T05:30:00Z");

const CONFIG = {
  stores: ["cortex-prod", "hauska-factory"],
  maintenance_windows: [
    { store: "cortex-prod", weekday: 2, start_utc: "05:00", end_utc: "06:00", note: "Neon" },
  ],
};

const SEATS = {
  integration: ["doc_repo"],
  property: ["hauska-factory", "legacy-design-tools"],
  govtech: ["smart-files"],
};

function base(over = {}) {
  return {
    card: { id: "c1", lane: "L", repo: "hauska-factory", plan_row: "F-01",
            dispatch: "_dispatches/x.md", close_artifact: "_inbox/x_close.json",
            depends_on: [], premises: [] },
    claim: null,
    closeExists: false,
    seats: SEATS,
    deps: {},
    storeTokens: {},
    config: CONFIG,
    ...over,
  };
}
const req = (over = {}) => ({ seat: "property", now: TUE_0630, ...over });

// ---- the not-vacuous case: a clean claim must actually be granted ----
t("NOT VACUOUS: clean claim is granted with zero refusals", () => {
  const r = evaluateClaim(base(), req());
  assert(r.ok, `expected ok, got refusals: ${JSON.stringify(codes(r))}`);
  assert(r.refusals.length === 0, "expected zero refusals");
});

t("NO_CARD fires when card is absent", () => {
  const r = evaluateClaim(base({ card: null }), req());
  assert(!r.ok && hasCode(r, R.NO_CARD), `got ${codes(r)}`);
});

t("NO_SEAT fires for an unregistered seat", () => {
  const r = evaluateClaim(base(), req({ seat: "ghost" }));
  assert(!r.ok && hasCode(r, R.NO_SEAT), `got ${codes(r)}`);
});

t("WRONG_SEAT fires when another seat owns the repo", () => {
  const r = evaluateClaim(base(), req({ seat: "govtech" }));
  assert(!r.ok && hasCode(r, R.WRONG_SEAT), `got ${codes(r)}`);
});

t("WRONG_SEAT does NOT fire for a doc_repo card from any seat", () => {
  const s = base(); s.card.repo = "doc_repo";
  const r = evaluateClaim(s, req({ seat: "govtech" }));
  assert(!hasCode(r, R.WRONG_SEAT), `got ${codes(r)}`);
});

t("ALREADY_CLAIMED fires on a live claim", () => {
  const s = base({ claim: { seat: "property", claimed_at: "x", expires_at: "2026-09-01T09:00:00Z" } });
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.ALREADY_CLAIMED), `got ${codes(r)}`);
});

t("ALREADY_CLAIMED fires even for the SAME seat re-claiming", () => {
  const s = base({ claim: { seat: "property", claimed_at: "x", expires_at: "2026-09-01T09:00:00Z" } });
  const r = evaluateClaim(s, req({ seat: "property" }));
  assert(hasCode(r, R.ALREADY_CLAIMED), "same-seat re-claim must still block");
});

t("INVERSE: an EXPIRED claim does not block", () => {
  const s = base({ claim: { seat: "property", claimed_at: "x", expires_at: "2026-09-01T05:00:00Z" } });
  const r = evaluateClaim(s, req({ now: TUE_0630 }));
  assert(!hasCode(r, R.ALREADY_CLAIMED), `expired lease should not block; got ${codes(r)}`);
});

t("DEPENDENCY_OPEN fires when a dep close is absent", () => {
  const s = base({ deps: { d1: { present: false, parsed: false, hasLeaveBehind: false } } });
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.DEPENDENCY_OPEN), `got ${codes(r)}`);
});

t("DEPENDENCY_MALFORMED fires when a dep close lacks leave_behind", () => {
  const s = base({ deps: { d1: { present: true, parsed: true, hasLeaveBehind: false } } });
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.DEPENDENCY_MALFORMED), `got ${codes(r)}`);
});

t("INVERSE: a contract-complete dep close does not block", () => {
  const s = base({ deps: { d1: { present: true, parsed: true, hasLeaveBehind: true } } });
  const r = evaluateClaim(s, req());
  assert(r.ok, `got ${codes(r)}`);
});

t("STORE_TOKEN_HELD fires when another card holds the store", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  s.storeTokens = { "cortex-prod": { card: "other", seat: "property", expires_at: "2026-09-01T09:00:00Z" } };
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.STORE_TOKEN_HELD), `got ${codes(r)}`);
});

t("INVERSE: a token held by THIS card does not block", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  s.storeTokens = { "cortex-prod": { card: "c1", seat: "property", expires_at: "2026-09-01T09:00:00Z" } };
  const r = evaluateClaim(s, req());
  assert(!hasCode(r, R.STORE_TOKEN_HELD), `got ${codes(r)}`);
});

t("INVERSE: an EXPIRED store token does not block", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  s.storeTokens = { "cortex-prod": { card: "other", seat: "property", expires_at: "2026-09-01T05:00:00Z" } };
  const r = evaluateClaim(s, req({ now: TUE_0630 }));
  assert(!hasCode(r, R.STORE_TOKEN_HELD), `got ${codes(r)}`);
});

t("MAINTENANCE_WINDOW fires inside the Tuesday 05:00-06:00 window", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  const r = evaluateClaim(s, req({ now: TUE_0530 }));
  assert(!r.ok && hasCode(r, R.MAINTENANCE_WINDOW), `got ${codes(r)}`);
});

t("INVERSE: outside the window the same card is claimable", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  const r = evaluateClaim(s, req({ now: TUE_0630 }));
  assert(r.ok, `got ${codes(r)}`);
});

t("INVERSE: a card needing NO store is claimable inside the window", () => {
  const r = evaluateClaim(base(), req({ now: TUE_0530 }));
  assert(r.ok, `a no-store card must not be blocked by a store window; got ${codes(r)}`);
});

t("UNKNOWN_STORE fires for a store not in config", () => {
  const s = base(); s.card.needs_store = "some-other-db";
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.UNKNOWN_STORE), `got ${codes(r)}`);
});

t("CARD_CLOSED fires when the close artifact already exists", () => {
  const r = evaluateClaim(base({ closeExists: true }), req());
  assert(!r.ok && hasCode(r, R.CARD_CLOSED), `got ${codes(r)}`);
});

// ---- window boundary arithmetic, both edges ----
t("window boundary: 05:00 is INSIDE, 06:00 is OUTSIDE", () => {
  assert(inMaintenanceWindow(TUE_0500, CONFIG.maintenance_windows, "cortex-prod"), "05:00 must be inside");
  assert(!inMaintenanceWindow(TUE_0600, CONFIG.maintenance_windows, "cortex-prod"), "06:00 must be outside");
});

t("window is weekday-scoped: Wednesday 05:30 is outside", () => {
  assert(!inMaintenanceWindow(WED_0530, CONFIG.maintenance_windows, "cortex-prod"), "Wed must be outside");
});

t("window is store-scoped: another store is unaffected", () => {
  assert(!inMaintenanceWindow(TUE_0530, CONFIG.maintenance_windows, "hauska-factory"), "other store unaffected");
});

t("parseHm rejects malformed input rather than defaulting", () => {
  let threw = false;
  try { parseHm("5:00"); } catch { threw = true; }
  assert(threw, "parseHm must throw, not default");
});

// ---- multiple refusals accumulate rather than short-circuiting ----
t("refusals accumulate: wrong seat AND maintenance window both reported", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  const r = evaluateClaim(s, req({ seat: "govtech", now: TUE_0530 }));
  assert(hasCode(r, R.WRONG_SEAT) && hasCode(r, R.MAINTENANCE_WINDOW),
    `expected both, got ${codes(r)}`);
});

// ---- operator authorization: a loop must not start a deploy by ticking ----

t("NEEDS_OPERATOR_GO fires on an operator card with no authorization file", () => {
  const s = base(); s.card.authorization = "operator"; s.authorization = null;
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.NEEDS_OPERATOR_GO), `got ${codes(r)}`);
});

t("INVERSE: an authorized operator card is claimable", () => {
  const s = base(); s.card.authorization = "operator";
  s.authorization = { card: "c1", operator: "nick", reason: "go", authorized_at: "x" };
  const r = evaluateClaim(s, req());
  assert(r.ok, `got ${codes(r)}`);
});

t("INVERSE: a seat-authorization card needs no operator go", () => {
  const s = base(); s.card.authorization = "seat";
  const r = evaluateClaim(s, req());
  assert(!hasCode(r, R.NEEDS_OPERATOR_GO), `got ${codes(r)}`);
});

t("INVERSE: an absent authorization field defaults to seat, not operator", () => {
  const r = evaluateClaim(base(), req());
  assert(!hasCode(r, R.NEEDS_OPERATOR_GO), "missing field must not imply operator");
});

// ---- pacing ----

t("unblockAt returns the window END for a maintenance-blocked card", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  const t0 = unblockAt(s, req({ now: TUE_0530 }));
  assert(t0 && t0.toISOString() === "2026-09-01T06:00:00.000Z", `got ${t0 && t0.toISOString()}`);
});

t("unblockAt is null (unknowable) when a dependency is open", () => {
  const s = base({ deps: { d1: { present: false, parsed: false, hasLeaveBehind: false } } });
  assert(unblockAt(s, req()) === null, "a dep another seat must close has no knowable time");
});

t("unblockAt takes the LATEST clear time when two refusals apply", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  // token clears 06:30, window clears 06:00 -> answer must be 06:30
  s.storeTokens = { "cortex-prod": { card: "other", seat: "property", expires_at: "2026-09-01T06:30:00.000Z" } };
  const t0 = unblockAt(s, req({ now: TUE_0530 }));
  assert(t0 && t0.toISOString() === "2026-09-01T06:30:00.000Z", `got ${t0 && t0.toISOString()}`);
});

t("nextWakeSeconds is 0 when something is claimable now", () => {
  assert(nextWakeSeconds([base()], req()) === 0, "claimable now must wake immediately");
});

t("nextWakeSeconds counts down to the window end", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  const secs = nextWakeSeconds([s], req({ now: TUE_0530 }));
  assert(secs === 1800, `expected 1800 from 05:30 to 06:00, got ${secs}`);
});

t("nextWakeSeconds clamps into the ScheduleWakeup range [60,3600]", () => {
  const s = base(); s.card.needs_store = "cortex-prod";
  const near = nextWakeSeconds([s], req({ now: new Date("2026-09-01T05:59:30Z") }));
  assert(near === 60, `30s to the window end must clamp up to 60, got ${near}`);
  const far = base({ deps: { d1: { present: false, parsed: false, hasLeaveBehind: false } } });
  const secs = nextWakeSeconds([far], req());
  assert(secs >= 60 && secs <= 3600, `idle poll out of range: ${secs}`);
});

t("nextWakeSeconds ignores cards belonging to other seats", () => {
  const mine = base(); mine.card.id = "mine"; mine.card.needs_store = "cortex-prod";
  const theirs = base(); theirs.card.id = "theirs"; theirs.card.repo = "smart-files";
  // theirs is claimable by govtech, but property must not be woken by it
  const secs = nextWakeSeconds([mine, theirs], req({ seat: "property", now: TUE_0530 }));
  assert(secs === 1800, `another seat's claimable card must not wake this one; got ${secs}`);
});

// ---- watching the card in front ----

t("waiting on an IN-FLIGHT dependency polls tight, not the idle interval", () => {
  const s = base({ deps: { d1: { present: false, parsed: false, hasLeaveBehind: false, claimed: true } } });
  const secs = nextWakeSeconds([s], req(), { idlePollSeconds: 1200, depWatchPollSeconds: 300 });
  assert(secs === 300, `expected the dep-watch poll, got ${secs}`);
});

t("waiting on an UNSTARTED dependency uses the idle interval", () => {
  const s = base({ deps: { d1: { present: false, parsed: false, hasLeaveBehind: false, claimed: false } } });
  const secs = nextWakeSeconds([s], req(), { idlePollSeconds: 1200, depWatchPollSeconds: 300 });
  assert(secs === 1200, `nobody is working it; expected idle poll, got ${secs}`);
});

t("an in-flight dependency SHORTENS a longer knowable wait", () => {
  // one card blocked by the window until 06:00 (1800s away), another waiting on
  // an in-flight dep. The seat must wake at the tighter of the two.
  const win = base(); win.card.id = "win"; win.card.needs_store = "cortex-prod";
  const dep = base({ deps: { d1: { present: false, parsed: false, hasLeaveBehind: false, claimed: true } } });
  dep.card.id = "dep";
  const secs = nextWakeSeconds([win, dep], req({ now: TUE_0530 }), { idlePollSeconds: 1200, depWatchPollSeconds: 300 });
  assert(secs === 300, `expected 300 (tighter than the 1800s window), got ${secs}`);
});

t("a satisfied dependency makes the card claimable and wakes immediately", () => {
  const s = base({ deps: { d1: { present: true, parsed: true, hasLeaveBehind: true, claimed: false } } });
  assert(nextWakeSeconds([s], req()) === 0, "the card in front closed; start now");
});

t("an operator card behind a closed dependency still waits for the go", () => {
  const s = base({ deps: { d1: { present: true, parsed: true, hasLeaveBehind: true, claimed: false } } });
  s.card.authorization = "operator"; s.authorization = null;
  const r = evaluateClaim(s, req());
  assert(hasCode(r, R.NEEDS_OPERATOR_GO) && !hasCode(r, R.DEPENDENCY_OPEN),
    `dependency is satisfied but the go is not; got ${codes(r)}`);
});

// ---- the two bypasses the property seat found on 2026-09-01 ----

t("STATE_UNREADABLE fires and does NOT fall through to a grant", () => {
  const s = base({ unreadable: ["unparseable JSON: _queue/tokens/store.json"] });
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.STATE_UNREADABLE), `got ${codes(r)}`);
});

t("INVERSE: no unreadable inputs does not fire STATE_UNREADABLE", () => {
  const r = evaluateClaim(base({ unreadable: [] }), req());
  assert(!hasCode(r, R.STATE_UNREADABLE) && r.ok, `got ${codes(r)}`);
});

t("WORKTREE_MISMATCH fires when git disagrees with the declared branch", () => {
  const s = base({ worktreeCheck: { ok: false, detail: 'declared "a" but on "b"' } });
  const r = evaluateClaim(s, req());
  assert(!r.ok && hasCode(r, R.WORKTREE_MISMATCH), `got ${codes(r)}`);
});

t("INVERSE: a verified worktree does not fire WORKTREE_MISMATCH", () => {
  const s = base({ worktreeCheck: { ok: true, detail: "ok" } });
  const r = evaluateClaim(s, req());
  assert(r.ok, `got ${codes(r)}`);
});

// ---- readJson: the exact regression, reproduced ----

const TMP = path.join(os.tmpdir(), "queue-selftest");
fs.mkdirSync(TMP, { recursive: true });

t("REGRESSION: a UTF-8 BOM token file PARSES instead of reading as no-token", () => {
  const p = path.join(TMP, "bom.json");
  // Exactly what PowerShell writes by default, and exactly what made a live store
  // token invisible on 2026-09-01.
  fs.writeFileSync(p, "﻿" + JSON.stringify({ "cortex-prod": { card: "x" } }), "utf8");
  const v = readJson(p, { strict: true });
  assert(v && v["cortex-prod"]?.card === "x", `BOM file must parse, got ${JSON.stringify(v)}`);
});

t("strict readJson THROWS on a corrupt file rather than returning null", () => {
  const p = path.join(TMP, "corrupt.json");
  fs.writeFileSync(p, "{not json at all", "utf8");
  let threw = false;
  try { readJson(p, { strict: true }); } catch { threw = true; }
  assert(threw, "a present-but-unparseable control input must not read as absent");
});

t("readJson returns null for a genuinely ABSENT file, even strict", () => {
  const v = readJson(path.join(TMP, "does-not-exist.json"), { strict: true });
  assert(v === null, "absent is a real state and is not an error");
});

t("non-strict readJson still tolerates corruption (non-control callers)", () => {
  const p = path.join(TMP, "corrupt.json");
  assert(readJson(p) === null, "non-strict path keeps its old behaviour");
});

t("a CLOSED card reports done, never \"unknowable\"", () => {
  const s = base({ closeExists: true });
  assert(unblockAt(s, req()) === "done", `closed card must report done, got ${String(unblockAt(s, req()))}`);
});

t("a fully closed board returns null so a loop STOPS instead of polling", () => {
  const a = base({ closeExists: true }); a.card.id = "a";
  const b = base({ closeExists: true }); b.card.id = "b";
  assert(nextWakeSeconds([a, b], req()) === null, "no card left is not a reason to wait");
});

t("INVERSE: one open card among closed ones still produces a wake", () => {
  const done = base({ closeExists: true }); done.card.id = "done";
  const open = base(); open.card.id = "open"; open.card.needs_store = "cortex-prod";
  const secs = nextWakeSeconds([done, open], req({ now: TUE_0530 }));
  assert(secs === 1800, `a closed sibling must not suppress a real wake; got ${secs}`);
});

t("a closed card does not drag the board into the idle poll", () => {
  const done = base({ closeExists: true }); done.card.id = "done";
  const ready = base(); ready.card.id = "ready";
  assert(nextWakeSeconds([done, ready], req()) === 0, "claimable sibling wins");
});

for (const [s, n, m] of results) console.log(`${s}  ${n}${m ? `\n      ${m}` : ""}`);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
