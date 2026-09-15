#!/usr/bin/env node
/**
 * LANE CLAIM — stops two sessions executing one dispatch.
 *
 * WHY THIS EXISTS. On 2026-09-14 the G-126 dispatch was compiled ONCE and handed
 * to TWO sessions. Both started. One found live evidence mid-execution (fresh file
 * timestamps, then a merged commit appearing in its own fetch) and stood down. That
 * cost real coordination overhead and could have been a write collision.
 *
 * WHERE THE OBVIOUS FIX FAILS. A check inside the dispatch COMPILER would not have
 * caught this: the dispatch was compiled once. The collision is at EXECUTION start,
 * so the claim has to be taken there.
 *
 * THE THREE-QUESTION GATE, answered honestly:
 *
 *   1. What executes this?   This script, run by the agent as its first action, and
 *                            `scripts/dispatch.mjs` at compile time as a second net.
 *   2. What triggers it?     The claim step compiled into every dispatch header, so
 *                            it travels with the dispatch rather than being remembered.
 *   3. What fails?           `claim` exits 3 when a live claim is held by another
 *                            seat. The agent stands down. Non-zero is the control.
 *   4. What bypasses it?     Named in full below, because the answer is never none.
 *
 * WHAT BYPASSES IT (do not pretend otherwise):
 *   - An agent that never runs the claim step. The header makes that visible, not
 *     impossible. This is the biggest hole and it is a real one.
 *   - A dispatch handed to a session out of band, without its compiled header.
 *   - Editing `_catalog/lane_claims.json` by hand.
 *   - Two sessions claiming in the same instant. This is a file, not a lock; the
 *     read-modify-write is not atomic across processes. It narrows a window of
 *     minutes to a window of milliseconds. It does not close it.
 *   - A seat that claims and then dies. Mitigated by staleness, not prevented:
 *     a claim older than STALE_HOURS reports as stale and does not block.
 *
 * Claims are LOCAL STATE, not canon. The file is committed so peers can see it,
 * but a claim is evidence that someone started, never proof that they finished.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const CLAIMS = path.join(REPO, "_catalog", "lane_claims.json");

/** A claim older than this reports stale and stops blocking. A dead session must
 *  not hold a lane forever, and a long lane must not be silently stolen either —
 *  stale is REPORTED, never auto-released. */
export const STALE_HOURS = 8;

const EXIT = { OK: 0, USAGE: 2, HELD: 3, STALE_HELD: 4 };

export function emptyRegistry() {
  return {
    _purpose:
      "Open lane claims. Written by scripts/lane-claim.mjs at execution start. " +
      "A claim means a seat STARTED a lane, never that it finished. See the script header " +
      "for what bypasses this.",
    _staleHours: STALE_HOURS,
    claims: {},
  };
}

export function load(file = CLAIMS) {
  if (!fs.existsSync(file)) return emptyRegistry();
  const raw = fs.readFileSync(file, "utf8").trim();
  if (!raw) return emptyRegistry();
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || typeof parsed.claims !== "object") {
    throw new Error(`lane_claims.json is present but not a claims registry: ${file}`);
  }
  return parsed;
}

function save(reg, file = CLAIMS) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(reg, null, 2) + "\n", "utf8");
}

export function ageHours(claim, now = Date.now()) {
  const t = Date.parse(claim.startedAt);
  if (!Number.isFinite(t)) return Infinity;
  return (now - t) / 3_600_000;
}

export function isStale(claim, now = Date.now()) {
  return ageHours(claim, now) > STALE_HOURS;
}

/**
 * The decision this whole file exists to make.
 * Returns one of: "free" | "yours" | "held" | "stale".
 */
export function evaluate(reg, lane, seat, now = Date.now()) {
  const claim = reg.claims?.[lane];
  if (!claim) return { state: "free", claim: null };
  if (claim.seat === seat) return { state: "yours", claim };
  if (isStale(claim, now)) return { state: "stale", claim };
  return { state: "held", claim };
}

function fmt(claim) {
  return `seat=${claim.seat} row=${claim.planRow} started=${claim.startedAt} (${ageHours(claim).toFixed(1)}h ago)`;
}

/* ------------------------------- commands ------------------------------- */

function cmdClaim(args) {
  const { lane, seat, row, dispatch, force } = args;
  if (!lane || !seat) return usage("claim needs --lane and --seat");
  const reg = load();
  const v = evaluate(reg, lane, seat);

  if (v.state === "held") {
    console.error(`LANE HELD: ${lane} is already claimed.\n  ${fmt(v.claim)}`);
    console.error(`\nSTAND DOWN. Do not execute this dispatch.`);
    console.error(`Confirm with that seat before proceeding. If that seat is genuinely gone,`);
    console.error(`the operator releases it: node scripts/lane-claim.mjs release --lane ${lane} --seat ${v.claim.seat}`);
    return EXIT.HELD;
  }
  if (v.state === "stale" && !force) {
    console.error(`LANE HELD BUT STALE: ${lane}\n  ${fmt(v.claim)}`);
    console.error(`\nOlder than ${STALE_HOURS}h. This is REPORTED, not auto-released — a long lane`);
    console.error(`must not be silently stolen. Confirm the holder is gone, then re-run with --force.`);
    return EXIT.STALE_HELD;
  }

  reg.claims[lane] = {
    lane,
    seat,
    planRow: row ?? null,
    dispatch: dispatch ?? null,
    startedAt: new Date().toISOString(),
    ...(v.state === "stale" ? { tookOverFrom: v.claim.seat, tookOverAt: new Date().toISOString() } : {}),
  };
  save(reg);
  console.log(`CLAIMED ${lane} for ${seat}${row ? ` (${row})` : ""}. Proceed.`);
  return EXIT.OK;
}

function cmdRelease(args) {
  const { lane, seat } = args;
  if (!lane || !seat) return usage("release needs --lane and --seat");
  const reg = load();
  const claim = reg.claims?.[lane];
  if (!claim) { console.log(`No open claim on ${lane}. Nothing to release.`); return EXIT.OK; }
  if (claim.seat !== seat) {
    console.error(`REFUSED: ${lane} is held by ${claim.seat}, not ${seat}. A seat releases its own lane.`);
    return EXIT.HELD;
  }
  delete reg.claims[lane];
  save(reg);
  console.log(`RELEASED ${lane}.`);
  return EXIT.OK;
}

function cmdCheck(args) {
  const { lane, seat } = args;
  if (!lane) return usage("check needs --lane");
  const reg = load();
  const v = evaluate(reg, lane, seat ?? "__none__");
  if (v.state === "free") { console.log(`FREE: ${lane}`); return EXIT.OK; }
  if (v.state === "yours") { console.log(`YOURS: ${lane} — ${fmt(v.claim)}`); return EXIT.OK; }
  if (v.state === "stale") { console.log(`STALE: ${lane} — ${fmt(v.claim)}`); return EXIT.STALE_HELD; }
  console.log(`HELD: ${lane} — ${fmt(v.claim)}`);
  return EXIT.HELD;
}

function cmdStatus() {
  const reg = load();
  const rows = Object.values(reg.claims ?? {});
  if (!rows.length) { console.log("No open lane claims."); return EXIT.OK; }
  console.log(`${rows.length} open lane claim(s):`);
  for (const c of rows.sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    console.log(`  ${isStale(c) ? "STALE " : "live  "}${c.lane.padEnd(26)} ${fmt(c)}`);
  }
  return EXIT.OK;
}

/* -------------------------------- self-test -------------------------------- */
/** Both directions. A check observed only passing has not been observed working. */
function cmdSelftest() {
  const now = Date.UTC(2026, 8, 14, 12, 0, 0);
  const iso = (h) => new Date(now - h * 3_600_000).toISOString();
  let failed = 0;
  const t = (name, got, want) => {
    const ok = got === want;
    if (!ok) failed++;
    console.log(`  ${ok ? "pass" : "FAIL"}  ${name}${ok ? "" : `  got=${got} want=${want}`}`);
  };

  const reg = { claims: { "g126-tenant-isolation": { lane: "g126-tenant-isolation", seat: "cente-f6", planRow: "G-126", startedAt: iso(1) } } };

  // POSITIVE: the control must FIRE on the real collision.
  t("a second seat on a held lane is HELD", evaluate(reg, "g126-tenant-isolation", "cente-a2", now).state, "held");
  // NEGATIVE: it must NOT fire where it should not. A check that always blocks is as wrong as one that never does.
  t("an unclaimed lane is FREE", evaluate(reg, "g127-rbac", "cente-a2", now).state, "free");
  t("the holding seat re-entering is YOURS", evaluate(reg, "g126-tenant-isolation", "cente-f6", now).state, "yours");
  // NOT VACUOUS: prove the predicate can distinguish, not merely return a string.
  const stale = { claims: { x: { lane: "x", seat: "s1", planRow: "G-1", startedAt: iso(STALE_HOURS + 1) } } };
  t("a claim past the window is STALE", evaluate(stale, "x", "s2", now).state, "stale");
  const fresh = { claims: { x: { lane: "x", seat: "s1", planRow: "G-1", startedAt: iso(STALE_HOURS - 1) } } };
  t("a claim inside the window still HOLDS", evaluate(fresh, "x", "s2", now).state, "held");
  // Boundary: staleness must not be strict-greater by accident at the edge.
  t("exactly at the window is not yet stale", isStale({ startedAt: iso(STALE_HOURS) }, now), false);
  // Malformed input must not read as free.
  t("an unparseable timestamp is stale, never free", evaluate({ claims: { x: { lane: "x", seat: "s1", startedAt: "not-a-date" } } }, "x", "s2", now).state, "stale");
  // Empty registry.
  t("empty registry is FREE", evaluate(emptyRegistry(), "anything", "s", now).state, "free");

  console.log(failed ? `\n${failed} self-test(s) FAILED` : "\nall self-tests pass (both directions, boundary, and not-vacuous)");
  return failed ? 1 : EXIT.OK;
}

/* --------------------------------- cli --------------------------------- */

function usage(msg) {
  if (msg) console.error(`lane-claim: ${msg}\n`);
  console.error(`Usage:
  node scripts/lane-claim.mjs claim   --lane <id> --seat <id> [--plan-row <id>] [--dispatch <path>] [--force]
  node scripts/lane-claim.mjs release --lane <id> --seat <id>
  node scripts/lane-claim.mjs check   --lane <id> [--seat <id>]
  node scripts/lane-claim.mjs status
  node scripts/lane-claim.mjs selftest

Exit codes: 0 ok · 2 usage · 3 held by another seat · 4 held but stale`);
  return EXIT.USAGE;
}

function parse(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") out.force = true;
    else if (a.startsWith("--")) out[a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = argv[++i];
    else out._.push(a);
  }
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parse(process.argv.slice(3));
  args.row = args.planRow ?? args.row;
  const cmd = process.argv[2];
  const fn = { claim: cmdClaim, release: cmdRelease, check: cmdCheck, status: () => cmdStatus(), selftest: () => cmdSelftest() }[cmd];
  process.exit(fn ? fn(args) : usage(cmd ? `unknown command "${cmd}"` : null));
}
