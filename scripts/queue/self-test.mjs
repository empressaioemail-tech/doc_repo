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

import { evaluateClaim, inMaintenanceWindow, parseHm, R } from "./lib.mjs";

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

for (const [s, n, m] of results) console.log(`${s}  ${n}${m ? `\n      ${m}` : ""}`);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
