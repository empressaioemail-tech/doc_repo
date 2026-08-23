#!/usr/bin/env node
/**
 * P-59 mud scorer spec instrument (doc_repo only).
 *
 * Validates `_inbox/2026-08-23_p59_mud_scorer_spec.json` structure and runs
 * directional self-tests. Does NOT score rails or touch product repos.
 *
 * Usage:
 *   node scripts/p59-mud-scorer-spec-instrument.mjs --self-test
 *   node scripts/p59-mud-scorer-spec-instrument.mjs --validate
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_PATH = join(ROOT, "_inbox", "2026-08-23_p59_mud_scorer_spec.json");

const REQUIRED_TOP = [
  "railKey",
  "atomFamily",
  "kind",
  "numeratorMode",
  "thresholdPct",
  "denominator",
  "numerator",
  "absenceProbe",
  "honestEmptyRules",
];

/** @param {unknown} spec */
export function validateSpecShape(spec) {
  const failures = [];
  if (!spec || typeof spec !== "object") {
    return { pass: false, failures: ["spec is not an object"] };
  }
  for (const key of REQUIRED_TOP) {
    if (!(key in spec)) {
      failures.push(`missing required field: ${key}`);
    }
  }
  if (spec.railKey !== "mud") {
    failures.push(`railKey must be mud, got ${JSON.stringify(spec.railKey)}`);
  }
  if (spec.atomFamily !== "special-district-fact") {
    failures.push(
      `atomFamily must be special-district-fact, got ${JSON.stringify(spec.atomFamily)}`,
    );
  }
  if (spec.numeratorMode !== "distinct-parcel-keys") {
    failures.push(
      `mud must use distinct-parcel-keys numerator (pipelines use atom-count); got ${JSON.stringify(spec.numeratorMode)}`,
    );
  }
  if (spec.thresholdPct !== 90) {
    failures.push(`thresholdPct must be 90 (COUNTY_RAIL_DECLARATION); got ${spec.thresholdPct}`);
  }
  const denom = spec.denominator;
  if (!denom || denom.kind !== "txgio-parcel-distinct-feature-index") {
    failures.push("denominator.kind must be txgio-parcel-distinct-feature-index");
  }
  if (!denom?.query || !String(denom.query).includes("DISTINCT feature_index")) {
    failures.push("denominator.query must count DISTINCT feature_index");
  }
  const probe = spec.absenceProbe;
  if (!probe || probe.table !== "tx_special_district") {
    failures.push("absenceProbe.table must be tx_special_district");
  }
  if (probe?.reach?.kind !== "statewide") {
    failures.push("absenceProbe.reach must be statewide for mud");
  }
  if (!Array.isArray(spec.honestEmptyRules) || spec.honestEmptyRules.length < 4) {
    failures.push("honestEmptyRules must enumerate at least four distinct cases");
  }
  const ruleIds = new Set(
    (spec.honestEmptyRules || []).map((r) => r?.id).filter(Boolean),
  );
  for (const requiredId of [
    "county-coverage-marker",
    "features-zero-districts-positive",
    "zero-districts-statewide",
  ]) {
    if (!ruleIds.has(requiredId)) {
      failures.push(`honestEmptyRules missing required id: ${requiredId}`);
    }
  }
  return { pass: failures.length === 0, failures };
}

/** @param {Record<string, unknown>} spec */
export function diffVsPipelineRails(spec) {
  return {
    mudNumeratorMode: spec.numeratorMode,
    pipelineNumeratorMode: "atom-count",
    mudHasStatewideAbsenceProbe: spec.absenceProbe?.table === "tx_special_district",
    pipelineHasAbsenceProbe: false,
    mudThreshold: spec.thresholdPct,
    pipelineThreshold: 90,
    bastropTargetPct: 98.26,
    bastropEvidence:
      "48021 mud + rrc-pipelines + rail-corridor all 98.26% post-L16 / post-P-59 cp2",
  };
}

export function runSelfTests() {
  const cases = [];

  let spec;
  try {
    spec = JSON.parse(readFileSync(SPEC_PATH, "utf8"));
  } catch (err) {
    return {
      ok: false,
      cases: [
        {
          name: "spec file parses",
          expectPass: true,
          pass: false,
          error: String(err),
        },
      ],
    };
  }

  const shape = validateSpecShape(spec);
  cases.push({
    name: "valid spec shape PASSES",
    expectPass: true,
    pass: shape.pass === true,
    failures: shape.failures,
    whatWouldProveWrong: "valid spec FAILS shape check",
  });

  const broken = structuredClone(spec);
  broken.numeratorMode = "atom-count";
  const brokenGrade = validateSpecShape(broken);
  cases.push({
    name: "atom-count numerator on mud FAILS (must be distinct-parcel-keys)",
    expectPass: true,
    pass: brokenGrade.pass === false,
    failures: brokenGrade.failures,
    whatWouldProveWrong: "atom-count mud spec PASSES (instrument is vacuous)",
  });

  const noProbe = structuredClone(spec);
  noProbe.absenceProbe = {
    ...noProbe.absenceProbe,
    reach: { kind: "enumerated-counties", counties: ["48201"] },
  };
  const noProbeGrade = validateSpecShape(noProbe);
  cases.push({
    name: "Harris-only absence reach on mud FAILS",
    expectPass: true,
    pass: noProbeGrade.pass === false,
    failures: noProbeGrade.failures,
    whatWouldProveWrong: "enumerated-counties reach PASSES for mud",
  });

  const diff = diffVsPipelineRails(spec);
  cases.push({
    name: "mud differs from pipelines on numeratorMode",
    expectPass: true,
    pass:
      diff.mudNumeratorMode === "distinct-parcel-keys" &&
      diff.pipelineNumeratorMode === "atom-count",
    diff,
    whatWouldProveWrong: "numerator modes match pipelines (spec would not close the gap)",
  });

  cases.push({
    name: "product repo PR flagged required",
    expectPass: true,
    pass: spec.productRepoPR?.required === true,
    whatWouldProveWrong: "productRepoPR.required is false",
  });

  const ok = cases.every((c) => c.pass === c.expectPass);
  return { ok, cases, specPath: SPEC_PATH, diffVsPipelineRails: diff };
}

function parseArgs(argv) {
  return {
    selfTest: argv.includes("--self-test") || (!argv.includes("--validate") && argv.length === 0),
    validate: argv.includes("--validate"),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();

  if (!selfTest.ok) {
    process.stdout.write(
      JSON.stringify({ control: "p59-mud-scorer-spec", selfTest, validate: null }, null, 2) +
        "\n",
    );
    process.exit(1);
  }

  let spec;
  try {
    spec = JSON.parse(readFileSync(SPEC_PATH, "utf8"));
  } catch (err) {
    process.stdout.write(
      JSON.stringify(
        {
          control: "p59-mud-scorer-spec",
          selfTest,
          validate: { pass: false, error: String(err) },
        },
        null,
        2,
      ) + "\n",
    );
    process.exit(1);
  }

  const shape = validateSpecShape(spec);
  const report = {
    control: "p59-mud-scorer-spec",
    selfTest: { ok: selfTest.ok, caseNames: selfTest.cases.map((c) => c.name) },
    validate: {
      pass: shape.pass,
      failures: shape.failures,
      railKey: spec.railKey,
      atomFamily: spec.atomFamily,
      thresholdPct: spec.thresholdPct,
      numeratorMode: spec.numeratorMode,
      honestEmptyRuleCount: spec.honestEmptyRules?.length ?? 0,
      productRepoPRRequired: spec.productRepoPR?.required ?? null,
      gapStillMissing: spec.gapVsPipelinesRailCorridor?.stillMissing ?? [],
      diffVsPipelineRails: diffVsPipelineRails(spec),
    },
  };
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(shape.pass ? 0 : 2);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
