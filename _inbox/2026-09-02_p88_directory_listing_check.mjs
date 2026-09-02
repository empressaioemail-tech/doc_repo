// P-88 listing copy checker. File-based, self-tests in BOTH directions before it is trusted.
// Usage: node check_listing.mjs <path-to-submission-pack.md>
import { readFileSync } from "node:fs";

const LIMITS = { name: 100, tagline: 55, description: 2000 };

// Tokens that must NOT appear in the submitted copy, each with the rule that forbids it.
// HARD: must not appear at all, in any grammatical form.
const HARD = [
  ["nationwide", "dispatch bound: never nationwide"],
  ["statewide", "dispatch bound: never statewide"],
  ["export_instrument", "F1: not functional in production"],
  ["export an instrument", "F1: not functional in production"],
  ["ask the map", "readiness blocked"],
  ["request records", "readiness blocked, P-85 item 4"],
  ["check a request", "readiness blocked, P-85 item 4"],
  ["feasibility", "masters 00: not live generate"],
  ["workos", "masters 08 name hygiene: no vendors in customer material"],
  ["stripe", "masters 08 name hygiene"],
  ["hauska", "masters 08 name hygiene + 2026-08-26 no-collapse ruling"],
  ["property explorer", "masters 01: retired name"],
  ["digital twin", "masters 01 never-lead list"],
  ["blockchain", "masters 01 never-lead list"],
  ["tokeniz", "masters 01 never-lead list"],
  ["substrate", "masters 01 never-lead list"],
  ["roi", "masters 08: never a savings or ROI figure"],
  ["%", "masters 08: no percentage figure"],
  ["—", "no em dash in body prose"],
  ["–", "no en dash in body prose"],
];

// CLAIM: forbidden only when ASSERTED. A denial is allowed and is often required.
// This is the meaning-shaped half: the predicate reads the token AND its polarity,
// not the token alone. Added 2026-09-02 after the presence-shaped version flagged
// "no listings or sold prices", which is the sentence that keeps the promise.
const CLAIM = [
  ["sold price", "dispatch bound: TX non-disclosure, MLS route closed"],
  ["comps", "dispatch bound: no comps"],
  ["site plan", "F1: reachable only via export_instrument"],
  ["terrain", "F1: reachable only via export_instrument"],
  ["dossier", "F1 + masters 08 name hygiene"],
  ["owner data", "reachable only via export_instrument"],
  ["valuation", "masters 06: not valuation"],
  ["guarantee", "masters 08: no approves/permits/certifies claim"],
  ["certif", "masters 08: no approves/permits/certifies claim"],
];

const NEGATORS = ["no ", "not ", "never ", "without ", "nor "];

/** True when every occurrence of tok sits inside a negation window. */
function alwaysNegated(hay, tok) {
  let i = 0;
  while ((i = hay.indexOf(tok, i)) !== -1) {
    const window = hay.slice(Math.max(0, i - 40), i);
    if (!NEGATORS.some((n) => window.includes(n))) return false;
    i += tok.length;
  }
  return true;
}

function extractBlocks(md) {
  const out = [];
  const re = /```\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md))) out.push(m[1].replace(/\n$/, ""));
  return out;
}

export function checkCopy({ name, tagline, description }) {
  const problems = [];
  for (const [field, limit] of Object.entries(LIMITS)) {
    const v = { name, tagline, description }[field];
    if (v == null) { problems.push(`${field}: MISSING`); continue; }
    if (v.length > limit) problems.push(`${field}: ${v.length} chars exceeds ${limit}`);
  }
  const hay = `${name}\n${tagline}\n${description}`.toLowerCase();
  for (const [tok, rule] of HARD) {
    if (hay.includes(tok.toLowerCase())) problems.push(`forbidden token "${tok}" present (${rule})`);
  }
  for (const [tok, rule] of CLAIM) {
    const t = tok.toLowerCase();
    if (hay.includes(t) && !alwaysNegated(hay, t)) {
      problems.push(`claim token "${tok}" asserted rather than denied (${rule})`);
    }
  }
  return problems;
}

// ---- self-test: the checker must FAIL on known-bad input and PASS on known-good ----
function selfTest() {
  const cases = [
    { label: "known-good minimal", input: { name: "Smart Site", tagline: "One place.", description: "Central Texas parcels, cited." }, expectFail: false },
    { label: "tagline over 55", input: { name: "Smart Site", tagline: "x".repeat(56), description: "ok" }, expectFail: true },
    { label: "description over 2000", input: { name: "Smart Site", tagline: "t", description: "x".repeat(2001) }, expectFail: true },
    { label: "says nationwide", input: { name: "Smart Site", tagline: "t", description: "Nationwide coverage." }, expectFail: true },
    { label: "names a dead tool", input: { name: "Smart Site", tagline: "t", description: "Export an instrument for any parcel." }, expectFail: true },
    { label: "names a vendor", input: { name: "Smart Site", tagline: "t", description: "Sign in with WorkOS AuthKit." }, expectFail: true },
    { label: "em dash present", input: { name: "Smart Site", tagline: "t", description: "One place — all the layers." }, expectFail: true },
    { label: "missing description", input: { name: "Smart Site", tagline: "t" }, expectFail: true },
    { label: "claim token DENIED is allowed", input: { name: "Smart Site", tagline: "t", description: "It does no valuation and no sold prices." }, expectFail: false },
    { label: "claim token ASSERTED is refused", input: { name: "Smart Site", tagline: "t", description: "Get sold prices for any parcel." }, expectFail: true },
    { label: "site plan asserted is refused", input: { name: "Smart Site", tagline: "t", description: "Export a site plan." }, expectFail: true },
    { label: "site plan denied is allowed", input: { name: "Smart Site", tagline: "t", description: "There is no site plan export here." }, expectFail: false },
  ];
  let bad = 0;
  for (const c of cases) {
    const failed = checkCopy(c.input).length > 0;
    const ok = failed === c.expectFail;
    if (!ok) bad++;
    console.log(`  [${ok ? "ok" : "SELFTEST-BROKEN"}] ${c.label}: expectFail=${c.expectFail} got=${failed}`);
  }
  if (bad > 0) { console.error(`SELF-TEST FAILED (${bad}). The checker is not trustworthy; do not use its verdict.`); process.exit(2); }
  console.log(`  self-test: ${cases.length}/${cases.length}, fails on bad input AND passes on good input, including polarity cases (not vacuous).\n`);
}

const path = process.argv[2];
console.log("SELF-TEST (both directions):");
selfTest();

if (!path) { console.error("no submission pack path given"); process.exit(2); }
// CRLF-tolerant: a line-ending change must not silently empty the block list.
const md = readFileSync(path, "utf8").split("\r\n").join("\n");
const blocks = extractBlocks(md);
// Field order in the pack: name, tagline, description, coverage-variant, then prompts.
const [name, tagline, description] = blocks;
if (!name || !tagline || !description) {
  console.error(`FAIL: extracted ${blocks.length} fenced blocks, expected at least 3. The pack shape changed or the fences did not parse.`);
  process.exit(2);
}
console.log(`SUBJECT: ${path}`);
console.log(`  name        ${name.length}/${LIMITS.name}`);
console.log(`  tagline     ${tagline.length}/${LIMITS.tagline}`);
console.log(`  description ${description.length}/${LIMITS.description}`);
const problems = checkCopy({ name, tagline, description });
if (problems.length) { console.error("\nFAIL:"); for (const p of problems) console.error("  - " + p); process.exit(1); }
console.log("\nPASS: within every limit, no forbidden token.");
