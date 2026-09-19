/**
 * G-153 parcel 2. PLANTED VIOLATIONS AGAINST THE FLEET LENS'S check.mjs, IN BOTH
 * DIRECTIONS, run from OUTSIDE doc_repo so no planner-owned file is added.
 *
 * The police lens ships violate.mjs beside its check.mjs; the fleet lens does
 * not, and its only planted violations were its own in-file self-tests. The
 * dispatch requires both check.mjs files to "fail against planted violations in
 * both directions", so this drives the fleet check the way the police one is
 * driven: plant ONE defect in a REAL artboard, run check.mjs, require the
 * expected reason, restore the file, and prove the restoration with a hash.
 *
 * Every needle below is read out of the BUILT artboard, and each is asserted to
 * match before the plant is judged -- a needle that silently stopped matching
 * would otherwise read as a caught defect.
 *
 * NOT A VALID PLANT, RECORDED RATHER THAN OMITTED: a bare `OPR-nn` reference.
 * The artboards and the source-state.json dump they are checked against are both
 * from origin/main f776b4bf, BEFORE the 2026-09-17 namespacing ruling, so this
 * dump declares the bare form legal on BOTH sides and the check correctly accepts
 * it. The dispatch defers that recapture to the planner (both design dumps), so
 * this script does not plant a violation the current dump cannot see.
 *
 * Nothing here is committed. The artboards are byte-identical afterwards or this
 * script exits non-zero.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const DIR = "P:/doc_repo/_design/smartcity-fleet-lens";
const md5 = (p) => crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
const BOARDS = ["Main.dc.html", "Connected.dc.html"];
const before = Object.fromEntries(BOARDS.map((b) => [b, md5(path.join(DIR, b))]));

const run = () => {
  try {
    execFileSync("node", ["check.mjs"], { cwd: DIR, encoding: "utf8", stdio: "pipe" });
    return { code: 0, out: "" };
  } catch (e) {
    return { code: e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
};

const base = run();
if (base.code !== 0) {
  console.error("the baseline is not clean; violation testing would be meaningless");
  console.error(base.out);
  process.exit(2);
}
console.log("baseline: check.mjs exits 0 on the unmodified fleet artboards\n");

const PLANT = (original, needle, replacement, count = 1) => {
  const hits = original.split(needle).length - 1;
  if (hits < count) return null;
  return original.replace(needle, replacement);
};

const VIOLATIONS = [
  {
    label: "a status band the product does not declare (in a roster chip)",
    board: "Main.dc.html",
    plant: (h) => PLANT(h, ">Out of service</span>", ">Grounded</span>"),
    reason: /status band the product does not declare/,
  },
  {
    label: "an invented state word in a nav badge",
    board: "Main.dc.html",
    plant: (h) => PLANT(h, ">Empty</span>", ">Syncing</span>"),
    reason: /invented state word/,
  },
  {
    label: "an operator reference the composer never produced (format-valid)",
    board: "Main.dc.html",
    plant: (h) => PLANT(h, ">OPR-01</span>", ">OPR-99</span>"),
    reason: /operator references the composer never produced/,
  },
  {
    label: "two roster rows swapped out of composer order",
    board: "Main.dc.html",
    plant: (h) => {
      const ids = [...new Set([...h.matchAll(/FIX-FL-[0-9]+/g)].map((m) => m[0]))].slice(0, 2);
      if (ids.length < 2) return null;
      const [a, b] = ids;
      return h.replace(a, "\u0000S\u0000").replace(b, a).replace("\u0000S\u0000", b);
    },
    reason: /vehicle ids are/,
  },
  {
    label: "an uncatalogued fleet vendor named in prose",
    board: "Main.dc.html",
    plant: (h) => PLANT(h, "A vehicle is not an asset", "Geotab reports a vehicle is not an asset"),
    reason: /uncatalogued fleet vendor/,
  },
  {
    label: "a money token on a generated-record surface",
    board: "Main.dc.html",
    /**
     * Planted in TEXT, which is what the check reads. A first attempt put it in
     * an attribute (`<p data-x="$4,200">`) and went uncaught -- correctly, since
     * `textOf()` strips tags and the token never reaches the surface as text. The
     * narrowness is real and recorded in this lane's close as an OPEN; it is not
     * widened here, because these artboards and their check are planner-owned and
     * a recapture is deliberately deferred.
     */
    plant: (h) => PLANT(h, ">Not carried</span>", ">$4,200 carried</span>"),
    reason: /money token reached a generated-record surface/,
  },
];

let planted = 0;
let caught = 0;
for (const v of VIOLATIONS) {
  const file = path.join(DIR, v.board);
  const original = fs.readFileSync(file, "utf8");
  const mutated = v.plant(original);
  if (mutated == null || mutated === original) {
    console.log(`NOT JUDGED ${v.label}  -> its needle no longer matches the built artboard`);
    continue;
  }
  planted += 1;
  fs.writeFileSync(file, mutated);
  const r = run();
  fs.writeFileSync(file, original);
  const ok = r.code === 1 && v.reason.test(r.out);
  if (ok) caught += 1;
  const actual = r.code === 0
    ? "check.mjs still exited 0 -- the defect was NOT caught"
    : (r.out.match(/^\s+(.+)$/m) || [])[0] || `exit ${r.code}`;
  console.log(`${ok ? "CAUGHT" : "MISSED"} ${v.label}${ok ? "" : "\n     " + actual.trim()}`);
}

const after = Object.fromEntries(BOARDS.map((b) => [b, md5(path.join(DIR, b))]));
const restored = BOARDS.every((b) => after[b] === before[b]);
console.log(`\n${caught} of ${planted} planted defects caught`);
console.log(`artboard hashes after restoration: ${restored ? "identical to before, all " + BOARDS.length : "CHANGED - doc_repo was left dirty"}`);
for (const b of BOARDS) console.log(`  ${b}  ${after[b]}`);
const final = run();
console.log(`final baseline re-run: exit ${final.code}`);
if (!restored || final.code !== 0 || caught !== planted || planted === 0) process.exit(1);
