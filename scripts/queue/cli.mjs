#!/usr/bin/env node
// Seat queue CLI.
//
//   node scripts/queue/cli.mjs status [--seat <name>]
//   node scripts/queue/cli.mjs claim --card <id> --seat <name> --worktree <p> --branch <b>
//   node scripts/queue/cli.mjs release --card <id> --seat <name> [--reason <text>]
//   node scripts/queue/cli.mjs addendum --card <id> --author <name> --text <text>
//   node scripts/queue/cli.mjs enqueue --file <card.json>
//
// claim EXITS NON-ZERO on any refusal. That is the control. Every claim and
// every refusal is written to _queue/log/<seat>.jsonl, per ENFORCEMENT: a
// refusal that leaves no name is how an unattributed mutation becomes
// unanswerable.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  REPO_ROOT, R, evaluateClaim, loadState, readJson, queueDir, cardDir,
  tokensPath, configPath, minutesFromNow, isExpired, loadSeats,
  nextWakeSeconds, unblockAt, checkWorktree,
} from "./lib.mjs";

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const writeJson = (p, o) => {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n", "utf8");
};

function record(seat, entry) {
  const p = path.join(queueDir(), "log", `${seat || "unknown"}.jsonl`);
  ensureDir(path.dirname(p));
  fs.appendFileSync(p, JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n", "utf8");
}

function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function listCardIds() {
  const d = path.join(queueDir(), "cards");
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((n) => fs.existsSync(path.join(d, n, "card.json"))).sort();
}

function addenda(id) {
  const d = path.join(cardDir(id), "addenda");
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".md")).sort()
    .map((f) => ({ name: f, body: fs.readFileSync(path.join(d, f), "utf8") }));
}

// ---------------- status ----------------
if (cmd === "status") {
  const seat = flag("seat");
  const now = new Date();
  const ids = listCardIds();
  if (!ids.length) die("no cards in _queue/cards", 0);

  console.log(`queue status  ${now.toISOString()}${seat ? `  seat=${seat}` : ""}`);
  console.log("");
  const tokens = readJson(tokensPath()) || {};
  for (const [store, t] of Object.entries(tokens)) {
    if (t && !isExpired(t.expires_at, now)) {
      console.log(`  STORE ${store}: held by "${t.card}" (seat ${t.seat}) until ${t.expires_at}`);
    }
  }
  console.log("");

  for (const id of ids) {
    const st = loadState(id);
    const res = evaluateClaim(st, { seat: seat || "__none__", now });
    const owner = Object.entries(st.seats).find(([, rs]) => rs.includes(st.card.repo));
    const mine = seat && owner && owner[0] === seat;
    // Hide other seats' cards behind a marker rather than dropping them, so a
    // seat can see the board without being able to take what is not its own.
    if (seat && !mine && st.card.repo !== "doc_repo") {
      console.log(`  [other:${owner ? owner[0] : "?"}] ${id}`);
      continue;
    }
    if (res.ok) {
      console.log(`  CLAIMABLE  ${id}  (${st.card.lane}, ${st.card.repo}${st.card.needs_store ? `, store=${st.card.needs_store}` : ""})`);
    } else {
      const codes = res.refusals.map((r) => r.code).join(",");
      console.log(`  blocked    ${id}  [${codes}]`);
      for (const r of res.refusals) console.log(`               - ${r.detail}`);
    }
  }
  process.exit(0);
}

// ---------------- claim ----------------
if (cmd === "claim") {
  const id = flag("card"), seat = flag("seat");
  const worktree = flag("worktree"), branch = flag("branch");
  if (!id || !seat) die("usage: claim --card <id> --seat <name> --worktree <p> --branch <b>");
  if (!worktree || !branch) die("REFUSED: --worktree and --branch are required; a claim that cannot name where the work happens is not a claim");

  const now = new Date();
  const st = loadState(id);
  // Verified against git, not taken on the claim's word.
  st.worktreeCheck = checkWorktree(worktree, branch, execFileSync);
  const res = evaluateClaim(st, { seat, now });

  if (!res.ok) {
    record(seat, { verb: "claim", card: id, result: "REFUSED", refusals: res.refusals, invocation: argv.join(" ") });
    console.error(`REFUSED claim "${id}" for seat "${seat}":`);
    for (const r of res.refusals) console.error(`  ${r.code}: ${r.detail}`);
    process.exit(1);
  }

  const cfg = readJson(configPath()) || {};
  const claim = {
    card: id, seat, worktree, branch,
    claimed_at: now.toISOString(),
    expires_at: minutesFromNow(now, cfg.lease_ttl_minutes ?? 90),
    holder_label: `${seat}:${branch}`,
  };
  writeJson(path.join(cardDir(id), "claim.json"), claim);

  if (st.card.needs_store) {
    const tokens = readJson(tokensPath()) || {};
    tokens[st.card.needs_store] = {
      card: id, seat,
      held_at: now.toISOString(),
      expires_at: minutesFromNow(now, cfg.store_ttl_minutes ?? 60),
    };
    writeJson(tokensPath(), tokens);
  }

  record(seat, { verb: "claim", card: id, result: "GRANTED", claim, invocation: argv.join(" ") });

  console.log(`CLAIMED ${id} -> seat ${seat} (${branch}) until ${claim.expires_at}`);
  if (st.card.needs_store) console.log(`STORE TOKEN ${st.card.needs_store} held by ${id}`);
  console.log("");
  console.log(`dispatch: ${st.card.dispatch}`);
  console.log(`plan row: ${st.card.plan_row}`);
  console.log(`close to: ${st.card.close_artifact}`);
  console.log("");
  console.log("RE-VERIFY THESE PREMISES BEFORE STARTING. A queued card may be against a moved base.");
  for (const p of st.card.premises || []) console.log(`  - ${p}`);
  const ad = addenda(id);
  if (ad.length) {
    console.log("");
    console.log(`ADDENDA (${ad.length}) added after this card was written:`);
    for (const a of ad) {
      console.log(`  --- ${a.name} ---`);
      for (const line of a.body.split("\n")) console.log(`  ${line}`);
    }
  }
  process.exit(0);
}

// ---------------- release ----------------
if (cmd === "release") {
  const id = flag("card"), seat = flag("seat"), reason = flag("reason", "close");
  if (!id || !seat) die("usage: release --card <id> --seat <name> [--reason <text>]");
  const st = loadState(id);
  if (!st.card) die(`REFUSED: no card "${id}"`);

  // Release is keyed to the LIVE CLAIM IDENTITY, not to the seat. Found
  // 2026-09-01 by the double-close audit: two lanes of one seat both worked
  // cad-serve-reconcile because seat-only keying let lane 1 drop lane 2's live
  // claim in 284ms without --force. ALREADY_CLAIMED blocks a second CLAIM by the
  // same seat; nothing was blocking a second RELEASE, which undid it.
  if (st.claim && !has("force")) {
    if (st.claim.seat !== seat) {
      record(seat, { verb: "release", card: id, result: "REFUSED", code: "SEAT_MISMATCH",
                     detail: `held by ${st.claim.seat}`, invocation: argv.join(" ") });
      die(`REFUSED: card "${id}" is held by seat "${st.claim.seat}", not "${seat}". Use --force only on an operator ruling.`);
    }
    const wt = flag("worktree"), br = flag("branch");
    if (st.claim.worktree && (!wt || !br)) {
      die(`REFUSED: this claim names a worktree and branch, so release must too.
` +
          `  held by: ${st.claim.worktree} on ${st.claim.branch}
` +
          `  run: release --card ${id} --seat ${seat} --worktree <path> --branch <branch>
` +
          `Seat alone is not identity: two lanes of one seat are two lanes.`);
    }
    if (st.claim.worktree && (wt !== st.claim.worktree || br !== st.claim.branch)) {
      record(seat, { verb: "release", card: id, result: "REFUSED", code: "CLAIM_IDENTITY_MISMATCH",
                     detail: `claim is ${st.claim.worktree}@${st.claim.branch}, caller is ${wt}@${br}`,
                     invocation: argv.join(" ") });
      die(`REFUSED: card "${id}" is held by a DIFFERENT LANE of your seat.
` +
          `  claim : ${st.claim.worktree} on ${st.claim.branch}
` +
          `  caller: ${wt} on ${br}
` +
          `That lane may still be working. Use --force only on an operator ruling; it logs a STEAL.`);
    }
  }
  if (st.claim && has("force") && st.claim.seat === seat) {
    record(seat, { verb: "release", card: id, result: "STEAL", detail: `forced over ${st.claim.worktree}@${st.claim.branch}`, invocation: argv.join(" ") });
  }
  const cp = path.join(cardDir(id), "claim.json");
  if (fs.existsSync(cp)) fs.rmSync(cp);
  if (st.card.needs_store) {
    const tokens = readJson(tokensPath()) || {};
    if (tokens[st.card.needs_store]?.card === id) {
      delete tokens[st.card.needs_store];
      writeJson(tokensPath(), tokens);
    }
  }
  record(seat, { verb: "release", card: id, result: "RELEASED", reason, invocation: argv.join(" ") });
  console.log(`RELEASED ${id} (${reason})`);
  process.exit(0);
}

// ---------------- extend ----------------
// A long card silently losing its claim is the failure mode that makes a stolen
// lease possible. Only the holding LANE may extend, for the same reason release
// is identity-keyed.
if (cmd === "extend") {
  const id = flag("card"), seat = flag("seat");
  const wt = flag("worktree"), br = flag("branch");
  const mins = Number(flag("minutes", "90"));
  if (!id || !seat) die("usage: extend --card <id> --seat <name> --worktree <p> --branch <b> [--minutes N]");
  if (!Number.isFinite(mins) || mins <= 0 || mins > 480) die("REFUSED: --minutes must be 1..480");
  const now = new Date();
  const st = loadState(id);
  if (!st.claim) die(`REFUSED: card "${id}" is not claimed; nothing to extend`);
  if (st.claim.seat !== seat) die(`REFUSED: held by seat "${st.claim.seat}"`);
  if (st.claim.worktree && (wt !== st.claim.worktree || br !== st.claim.branch)) {
    record(seat, { verb: "extend", card: id, result: "REFUSED", code: "CLAIM_IDENTITY_MISMATCH",
                   detail: `claim is ${st.claim.worktree}@${st.claim.branch}, caller is ${wt}@${br}`, invocation: argv.join(" ") });
    die(`REFUSED: only the holding lane may extend. A neighbour must not extend a lease it does not hold.`);
  }
  const claim = { ...st.claim, expires_at: minutesFromNow(now, mins) };
  writeJson(path.join(cardDir(id), "claim.json"), claim);
  const cfg = readJson(configPath()) || {};
  if (st.card.needs_store) {
    const tokens = readJson(tokensPath()) || {};
    if (tokens[st.card.needs_store]?.card === id) {
      tokens[st.card.needs_store].expires_at = minutesFromNow(now, Math.min(mins, cfg.store_ttl_minutes ?? 60));
      writeJson(tokensPath(), tokens);
    }
  }
  record(seat, { verb: "extend", card: id, result: "EXTENDED", expires_at: claim.expires_at, invocation: argv.join(" ") });
  console.log(`EXTENDED ${id} until ${claim.expires_at}`);
  process.exit(0);
}

// ---------------- addendum ----------------
if (cmd === "addendum") {
  const id = flag("card"), author = flag("author"), text = flag("text");
  if (!id || !author || !text) die("usage: addendum --card <id> --author <name> --text <text>");
  if (!readJson(path.join(cardDir(id), "card.json"))) die(`REFUSED: no card "${id}"`);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const p = path.join(cardDir(id), "addenda", `${stamp}_${author}.md`);
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, `_added ${new Date().toISOString()} by ${author}_\n\n${text}\n`, "utf8");
  record(author, { verb: "addendum", card: id, result: "WRITTEN", file: path.relative(REPO_ROOT, p), invocation: "addendum" });
  console.log(`ADDENDUM -> ${path.relative(REPO_ROOT, p)}`);
  console.log("It will be printed to whichever seat claims this card.");
  process.exit(0);
}

// ---------------- next-wake ----------------
// Prints seconds until this seat's board could change. A loop passes this to
// ScheduleWakeup instead of guessing an interval.
if (cmd === "next-wake") {
  const seat = flag("seat");
  if (!seat) die("usage: next-wake --seat <name>");
  const now = new Date();
  const states = listCardIds().map((id) => loadState(id));
  const secs = nextWakeSeconds(states, { seat, now });
  const lines = [];
  for (const st of states) {
    if (!st.card) continue;
    const owner = Object.entries(st.seats).find(([, rs]) => rs.includes(st.card.repo));
    const mine = st.card.repo === "doc_repo" || (owner && owner[0] === seat);
    if (!mine) continue;
    const t = unblockAt(st, { seat, now });
    const label = t === "done" ? "done"
      : t === null ? "unknowable (waiting on another seat or an operator go)"
      : t <= now ? "NOW" : t.toISOString();
    lines.push(`  ${st.card.id}: ${label}`);
  }
  if (secs === null) {
    console.log("next_wake_seconds=none");
    console.log("BOARD COMPLETE for this seat. Every card is closed. Stop the loop; do not sleep.");
    for (const l of lines) console.log(l);
    process.exit(0);
  }
  console.log(`next_wake_seconds=${secs}`);
  for (const l of lines) console.log(l);
  process.exit(0);
}

// ---------------- authorize ----------------
if (cmd === "authorize") {
  const id = flag("card"), operator = flag("operator"), reason = flag("reason");
  if (!id || !operator || !reason) die("usage: authorize --card <id> --operator <name> --reason <text>");
  const card = readJson(path.join(cardDir(id), "card.json"));
  if (!card) die(`REFUSED: no card "${id}"`);
  if (card.authorization !== "operator") {
    die(`REFUSED: card "${id}" is authorization:"${card.authorization || "seat"}" and needs no operator go. Writing one would be decoration.`);
  }
  const auth = { card: id, operator, reason, authorized_at: new Date().toISOString() };
  writeJson(path.join(cardDir(id), "authorization.json"), auth);
  record("operator", { verb: "authorize", card: id, result: "AUTHORIZED", auth, invocation: argv.join(" ") });
  console.log(`AUTHORIZED ${id} by ${operator}: ${reason}`);
  process.exit(0);
}

// ---------------- enqueue ----------------
if (cmd === "enqueue") {
  const file = flag("file");
  if (!file) die("usage: enqueue --file <card.json>");
  const card = readJson(path.resolve(file));
  if (!card) die(`REFUSED: cannot read ${file}`);
  for (const k of ["id", "lane", "dispatch", "repo", "plan_row", "close_artifact"]) {
    if (!card[k]) die(`REFUSED: card is missing required field "${k}"`);
  }
  if (!fs.existsSync(path.join(REPO_ROOT, card.dispatch))) {
    die(`REFUSED: dispatch "${card.dispatch}" does not exist. A card that cannot name a compiled dispatch is not a card.`);
  }
  const seats = loadSeats();
  if (card.repo !== "doc_repo" && !Object.values(seats).some((rs) => rs.includes(card.repo))) {
    die(`REFUSED: repo "${card.repo}" is owned by no registered seat`);
  }
  card.enqueued = new Date().toISOString();
  writeJson(path.join(cardDir(card.id), "card.json"), card);
  record("planner", { verb: "enqueue", card: card.id, result: "ENQUEUED", invocation: argv.join(" ") });
  console.log(`ENQUEUED ${card.id} -> _queue/cards/${card.id}/card.json`);
  process.exit(0);
}

die(`unknown command "${cmd || ""}". Commands: status, next-wake, claim, release, extend, addendum, authorize, enqueue`);
