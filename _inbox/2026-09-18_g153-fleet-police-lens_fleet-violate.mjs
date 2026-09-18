#!/usr/bin/env node
/**
 * G-153. A VIOLATION SUITE FOR THE FLEET LENS, WHICH DOES NOT SHIP ONE.
 *
 * `_design/smartcity-police-lens/` carries `violate.mjs`; `_design/smartcity-fleet-lens/` does
 * not, and this lane needs both directions on both instruments (the row's acceptance: "Both
 * check.mjs pass with non-zero matched-input counts and fail against planted violations both
 * ways"). This file is that second direction for Fleet. It is a SCRATCH instrument, not a design
 * folder file: the dispatch fixes this lane's writes to the two `check.mjs` files, so nothing was
 * added to `_design/` -- see the close's `leave_behind` for the note that Fleet would be better
 * served by a durable `violate.mjs` of its own.
 *
 * HOW IT PLANTS. Every plant runs in a THROWAWAY COPY of the design folder under the OS temp dir,
 * and `check.mjs` locates its sources through `import.meta.url`, so the copy is self-contained.
 * The real folder is never written to, which is why there is no restore step to get wrong. The
 * last thing this file does is hash the artboards again and refuse if they moved.
 *
 * THREE KINDS OF CASE, AND ALL THREE ARE REQUIRED:
 *   - a PLANTED VIOLATION must exit 1 and the failure output must name the rule it broke;
 *   - a PLANTED NON-VIOLATION (a positive control) must still exit 0, because a rule nobody can
 *     satisfy is not a rule -- the inventory rule is position-scoped and its needle list carries a
 *     COMPUTED exclusion set, so a denial sentence and a duplicated verbatim source sentence are
 *     both legal and are asserted to be;
 *   - a PLANT ABOUT THE INSTRUMENT ITSELF, which is the dispatch's named trap.
 *
 * THE TRAP, AS A PAIR. `check.mjs` used to hardcode `/\bOPR-[A-Za-z0-9]+/g`; in `FL-OPR-01` the
 * `\b` sits happily before `OPR`, so it extracted the truncated `OPR-01` and failed it against the
 * namespaced format -- an extraction bug that reads as a defective board. The dump this file checks
 * against declares the BARE `/^OPR-\d{2}$/` (it was taken at f776b4bf, before the ruling, and the
 * dispatch forbids recapturing it), so the trap cannot be reached by editing an artboard. It is
 * instead built as a NARROW SYNTHETIC RECAPTURE of the operator axis -- the declared format and
 * every operator reference, in the dump and on the boards, moved into the ruling's namespace -- and
 * the SAME fixture is run through TWO instruments: the fixed one, which must PASS, and the old
 * extractor restored, which must FAIL. The old extractor sees `OPR-nn` inside `FL-OPR-nn`, fails it
 * against `/^FL-OPR-\d{2}$/`, and reports the board as defective.
 *
 * ONE MORE DIRECTION ON THE WIDENED EXTRACTOR, which is why the extractor is wider than the format
 * rather than equal to it: a predicate that refuses references outside the declared format must be
 * able to SEE one. On today's board the namespaced `FL-OPR-02` IS such a reference (the dump still
 * declares the bare format), so one case plants it and requires the refusal to name it. An
 * extractor as strict as the format would find nothing to refuse and pass.
 *
 *   node _inbox/2026-09-18_g153_fleet_violate.mjs [--inspect] [--src <design folder>]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

/**
 * WHERE IT READS FROM, AND WHY IT IS NOT DERIVED FROM THIS FILE'S OWN LOCATION. The fix this
 * suite is built around lives in `_design/smartcity-fleet-lens/check.mjs` as an UNCOMMITTED
 * working-tree change in the integration seat's checkout (doc_repo commits are planner-owned, so
 * this lane never committed it). Deriving the source from `import.meta.url` would make a copy of
 * this file run against whichever checkout it was copied into -- and in the planner's seat worktree
 * that is the PRE-FIX instrument, which would make every case below report the opposite of what it
 * measures. It defaults to the checkout that carries the fix and takes `--src` to point it at any
 * other copy, which is the honest way round: the instrument under test is named, not assumed.
 */
const srcArg = process.argv.indexOf("--src");
const SRC = (srcArg >= 0 && process.argv[srcArg + 1]) || "P:/doc_repo/_design/smartcity-fleet-lens";
const BOARDS = ["Main.dc.html", "Connected.dc.html"];
const inspectOnly = process.argv.includes("--inspect");

/** The check's own extractors, copied so the plants land inside markup it actually reads. */
const CELL_RE = /font:400 13px\/18px var\(--sc-font-(?:data|ui)\); color:var\(--sc-[a-z0-9-]+\);">([^<]*)</g;
const LABEL_RE = /letter-spacing:\.0[68]em; text-transform:uppercase; color:var\(--sc-ink-3\);[^"]*">([^<]*)</g;
const CHIP_RE = /border-radius:var\(--sc-r-full\); padding:2px 8px; white-space:nowrap;">([^<]*)<\/span>/g;

const read = (rel) => fs.readFileSync(path.join(SRC, rel), "utf8");
const cellValues = (h) => [...h.matchAll(CELL_RE)].map((m) => m[1].trim());

if (inspectOnly) {
  for (const b of BOARDS) {
    const h = read(b);
    for (const probe of [">OPR-01<", ">Operators<", ">Out of service<", ">FIX-FL-1005<"]) {
      const i = h.indexOf(probe);
      if (i >= 0) console.log(`RAW ${b} ${JSON.stringify(probe)} @${i}: ${JSON.stringify(h.slice(i - 100, i + probe.length + 12))}`);
    }
    const cells = cellValues(h);
    const opr = cells.filter((c) => /OPR-\d\d/.test(c));
    console.log(`\n=== ${b} (${cells.length} cells) ===`);
    console.log(`operator-ish cells: ${JSON.stringify(opr.slice(0, 8))}`);
    console.log(`labels: ${JSON.stringify([...h.matchAll(LABEL_RE)].map((m) => m[1].trim()).slice(0, 24))}`);
    console.log(`chips: ${JSON.stringify([...h.matchAll(CHIP_RE)].map((m) => m[1].trim()).slice(0, 6))}`);
  }
  process.exit(0);
}

/** A fresh throwaway copy of the design folder. */
function freshCopy(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `g153-fleet-${label}-`));
  for (const f of fs.readdirSync(SRC)) fs.cpSync(path.join(SRC, f), path.join(dir, f), { recursive: true });
  return dir;
}

function runCheck(dir) {
  try {
    return { exit: 0, out: execFileSync(process.execPath, [path.join(dir, "check.mjs")], { encoding: "utf8", cwd: dir }) };
  } catch (err) {
    return { exit: err.status ?? 1, out: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

const mutateFile = (dir, rel, fn) => {
  const p = path.join(dir, rel);
  const before = fs.readFileSync(p, "utf8");
  const after = fn(before);
  if (after === before) throw new Error(`plant did not change ${rel} (the pattern it looks for is not there any more)`);
  fs.writeFileSync(p, after);
};

/**
 * Replace the CAPTURE of the first match of `re` whose text is exactly `text`, keeping that match's
 * own markup. Written this way because the markup around a cell is the check's business, not this
 * file's: a plant that spells the style prefix out by hand stops planting the moment the generator
 * changes a colour token, and it fails as "needle not found" rather than as a caught violation.
 */
const swapMatched = (re, text, newText) => (html) => {
  let hit = false;
  const out = html.replace(new RegExp(re.source, re.flags), (m) => {
    if (hit || !m.includes(`>${text}<`)) return m;
    hit = true;
    return m.replace(`>${text}<`, `>${newText}<`);
  });
  if (!hit) throw new Error(`no ${re.source.slice(0, 30)}... match carrying ${JSON.stringify(text)}`);
  return out;
};
const swapCell = (t, n) => swapMatched(CELL_RE, t, n);
const swapLabel = (t, n) => swapMatched(LABEL_RE, t, n);
const swapChip = (t, n) => swapMatched(CHIP_RE, t, n);

/** Append markup to the body, for the plants that are about vocabulary rather than structure. */
const append = (markup) => (html) => {
  const i = html.indexOf("</body>");
  if (i < 0) throw new Error("no </body> in this board");
  return html.slice(0, i) + markup + html.slice(i);
};

/** Every operator reference in the dump, moved into the ruling's namespace (with its format). */
const recaptureDump = (text) => text
  .replace('"OPERATOR_REF_FORMAT": "/^OPR-', '"OPERATOR_REF_FORMAT": "/^FL-OPR-')
  .replace(/"OPR-(\d{2})"/g, '"FL-OPR-$1"');
/**
 * Only `Main.dc.html` carries operator references (the second board is the "what does the page say
 * once it has filled" board and has none), and a plant that rewrites a board it does not change is
 * a plant that errors instead of measuring, so the recapture covers the board that has the axis.
 *
 * EVERY occurrence is moved, not just the ones inside a cell: the board also carries the four
 * references in PROSE ("the stride, measured and not drawn: OPR-01 2 of 4, ..."), and a recapture
 * that missed those would be refused by the recaptured format for a reason that has nothing to do
 * with the trap. The lookbehind keeps a single pass from re-prefixing its own output.
 */
const RECAPTURE_BOARDS = ["Main.dc.html"];
const recaptureBoard = (html) => html.replace(/(?<![\w-])OPR-(\d{2})/g, "FL-OPR-$1");

/** Restoring the pre-lane extractor, verbatim from the dispatch: `/\bOPR-[A-Za-z0-9]+/g`. */
const DERIVED_EXTRACTOR = "  return new RegExp('[A-Za-z0-9-]*' + stem + '[A-Za-z0-9-]+', 'g');";

/**
 * THE PRE-LANE INSTRUMENT, READ FROM GIT RATHER THAN RECONSTRUCTED. This lane's `check.mjs` edits
 * are uncommitted (the dispatch requires it), so `HEAD` still holds the file the lane found, and a
 * plant that hand-deletes the four new self-tests would be assuming what the old file looked like.
 * The old file is fetched, asserted to be the old file, and used as-is.
 */
const PRE_LANE_CHECK = (() => {
  const src = execFileSync("git", ["-C", "P:/doc_repo", "show", "HEAD:_design/smartcity-fleet-lens/check.mjs"], { encoding: "utf8" });
  if (!src.includes("\\bOPR-[A-Za-z0-9]+") || src.includes("candidateReFor")) {
    throw new Error("HEAD's check.mjs is not the pre-lane instrument any more (it is committed, or it already carries the derived extractor)");
  }
  return src;
})();

const cases = [
  {
    name: "BASELINE: the unmodified copy passes, so every CAUGHT below is the plant and not the harness",
    apply: () => {},
    expectExit: 0,
    expect: [],
    positive: true,
  },

  /* --- rule 1: a driver is a person, and the reference column is where a name would arrive --- */
  {
    name: "a driver name arriving in the operator-reference column",
    apply: (dir) => mutateFile(dir, "Main.dc.html", swapCell("OPR-01", "J. Halloran")),
    expectExit: 1,
    expect: ["cells name people: J. Halloran"],
  },
  {
    name: "an operator reference the composer never minted",
    apply: (dir) => mutateFile(dir, "Main.dc.html", swapCell("OPR-01", "OPR-77")),
    expectExit: 1,
    expect: ["operator references the composer never produced: OPR-77"],
  },
  {
    name: "a NAMESPACED reference on a board whose declared format is still the bare one (the widened extractor must SEE it)",
    apply: (dir) => mutateFile(dir, "Main.dc.html", swapCell("OPR-02", "FL-OPR-02")),
    expectExit: 1,
    expect: ["operator reference outside the declared format /^OPR-\\d{2}$/: FL-OPR-02"],
  },

  /* --- rule 2: a vehicle is not an asset, and the position scoping is the whole rule --- */
  {
    name: "asset-inventory vocabulary in an ASSERTIVE position (a column header)",
    apply: (dir) => mutateFile(dir, "Main.dc.html", swapLabel("Operators", "Asset register")),
    expectExit: 1,
    expect: ["a column header or tile key asserts an asset: Asset register"],
  },
  {
    name: "inventory vocabulary this design wrote, outside any quoted source sentence",
    apply: (dir) => mutateFile(dir, "Main.dc.html", append('<p style="display:none">Acquisition cost</p>')),
    expectExit: 1,
    expect: ["inventory vocabulary this design wrote, outside any quoted source sentence: acquisition cost"],
  },
  {
    name: "a money token on a generated-record surface",
    apply: (dir) => mutateFile(dir, "Main.dc.html", append('<p style="display:none">$1,200</p>')),
    expectExit: 1,
    expect: ["a money token reached a generated-record surface"],
  },

  /* --- the shared vocabulary: vendors, bands, ids, order --- */
  {
    name: "an uncatalogued fleet vendor named",
    apply: (dir) => mutateFile(dir, "Main.dc.html", append('<p style="display:none">Geotab</p>')),
    expectExit: 1,
    expect: ["an uncatalogued fleet vendor is named: geotab"],
  },
  {
    name: "a status band the product does not declare",
    apply: (dir) => mutateFile(dir, "Main.dc.html", swapChip("Out of service", "In orbit")),
    expectExit: 1,
    expect: ["status band the product does not declare: In orbit"],
  },
  {
    name: "a vehicle id outside the declared format",
    apply: (dir) => mutateFile(dir, "Main.dc.html", (h) => h.split("FIX-FL-1005").join("FIX-FL-100")),
    expectExit: 1,
    expect: ["vehicle id outside the declared format: FIX-FL-100"],
  },
  {
    name: "a roster the composer did not produce (two ids swapped out of order)",
    apply: (dir) => mutateFile(dir, "Main.dc.html", (h) => h.split("FIX-FL-1005").join("FIX-FL-1099").split("FIX-FL-1010").join("FIX-FL-1005").split("FIX-FL-1099").join("FIX-FL-1010")),
    expectExit: 1,
    expect: ["vehicle ids are", "the composer says"],
  },
  {
    name: "no domain/gate pair rendered at all",
    apply: (dir) => mutateFile(dir, "Main.dc.html", (h) => h.split(" &middot; gatedBy ").join(" &middot; gate ")),
    expectExit: 1,
    expect: ["NO domain/gate pair rendered"],
  },

  /* --- positive controls: the half of each rule that must NOT fire --- */
  {
    name: "POSITIVE CONTROL: a denial sentence naming an asset stays legal (the rule is position-scoped)",
    apply: (dir) => mutateFile(dir, "Main.dc.html", append("<p>This vehicle row is not an asset.</p>")),
    expectExit: 0,
    expect: [],
    positive: true,
  },
  {
    name: "POSITIVE CONTROL: the product's own verbatim sentence, duplicated where the design wrote it, stays legal (the exclusion set is computed)",
    apply: (dir) => {
      const dump = JSON.parse(read("source-state.json"));
      const sentence = dump.axis.bases.NOT_AN_ASSET_BASIS;
      if (!/asset|inventory/i.test(sentence)) throw new Error("the verbatim sentence this control leans on does not carry inventory vocabulary any more");
      mutateFile(dir, "Main.dc.html", append(`<p style="display:none">${sentence}</p>`));
    },
    expectExit: 0,
    expect: [],
    positive: true,
  },

  /* --- the instrument itself, three directions on one fixture --- */
  {
    name: "THE TRAP, FIXED SIDE: a synthetic recapture into the namespaced form passes",
    apply(dir) {
      for (const b of RECAPTURE_BOARDS) mutateFile(dir, b, recaptureBoard);
      mutateFile(dir, "source-state.json", recaptureDump);
    },
    expectExit: 0,
    expect: [],
    positive: true,
  },
  {
    name: "THE TRAP, PRE-LANE SIDE: the pre-lane instrument REFUSES A VERDICT on the recaptured namespace - its own bare-form fixture is stale, and nothing reaches the boards (the second half of the named trap)",
    preLane: true,
    apply(dir) {
      for (const b of RECAPTURE_BOARDS) mutateFile(dir, b, recaptureBoard);
      mutateFile(dir, "source-state.json", recaptureDump);
    },
    expectExit: 2,
    expect: [
      "SELF-TEST FAILED: operator: accepts the declared format",
      "artboards would be worthless and it does not report one",
    ],
  },
  {
    name: "THE TRAP, GUARDED SIDE: reintroducing the old extractor in TODAY's instrument makes it refuse a verdict instead",
    oldExtractor: true,
    apply(dir) {
      for (const b of RECAPTURE_BOARDS) mutateFile(dir, b, recaptureBoard);
      mutateFile(dir, "source-state.json", recaptureDump);
    },
    expectExit: 2,
    expect: [
      "SELF-TEST FAILED: operator: the derived extractor returns the namespaced form whole",
      "SELF-TEST FAILED: operator: accepts the declared format",
    ],
  },
];

const boardHashes = () => BOARDS.map((b) => `${b} ${crypto.createHash("md5").update(read(b)).digest("hex")}`).join("  ");
const before = boardHashes();

let held = 0;
let caught = 0;
const failures = [];

console.log(`# G-153 Fleet violation suite | ${new Date().toISOString()}`);
console.log(`design folder: ${SRC}`);
console.log(`planted cases: ${cases.length} (${cases.filter((c) => c.positive).length} of them positive controls)\n`);

for (const c of cases) {
  const dir = freshCopy(c.preLane ? "prelane" : c.oldExtractor ? "oldextractor" : "plant");
  try {
    if (c.preLane) mutateFile(dir, "check.mjs", () => PRE_LANE_CHECK);
    if (c.oldExtractor) {
      mutateFile(dir, "check.mjs", (src) => {
        if (!src.includes(DERIVED_EXTRACTOR)) throw new Error("the derived extractor line is not where this plant expects it");
        return src.replace(DERIVED_EXTRACTOR, "  return /\\bOPR-[A-Za-z0-9]+/g;");
      });
    }
    c.apply(dir);
    const { exit, out } = runCheck(dir);
    const missing = c.expect.filter((needle) => !out.includes(needle));
    const ok = exit === c.expectExit && missing.length === 0;
    if (ok) {
      if (c.positive) held += 1; else caught += 1;
      console.log(`${c.positive ? "HELD  " : "CAUGHT"} ${c.name}  [exit ${exit}]`);
    } else {
      failures.push(`${c.name}: exit ${exit} (expected ${c.expectExit})${missing.length ? "; the output never named " + JSON.stringify(missing) : ""}`);
      console.log(`MISSED ${c.name}  [exit ${exit}, expected ${c.expectExit}]`);
      console.log(out.split("\n").filter(Boolean).slice(0, 14).map((l) => `       | ${l}`).join("\n"));
    }
  } catch (err) {
    failures.push(`${c.name}: ${err.message}`);
    console.log(`ERROR  ${c.name}: ${err.message}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const after = boardHashes();
console.log(`\nartboard hashes after the run: ${before === after ? "identical to before, both boards (every plant ran in a throwaway copy)" : "*** MOVED: a plant wrote to the real design folder ***"}`);
console.log(`${caught} planted violation(s) caught, ${held} positive control(s) held, of ${cases.length} cases`);
if (before !== after || failures.length) {
  for (const f of failures) console.error(`  FAILURE: ${f}`);
  process.exit(1);
}
process.exit(0);
