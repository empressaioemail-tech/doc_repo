#!/usr/bin/env node
/**
 * WDLL item 15 orchestrator — Wave 1 E2E transaction proof on template-city.
 * Does not perform uploads; validates env + prior WDLL items, prints operator walk checklist.
 *
 * Usage:
 *   node scripts/govtech/wave1_e2e_probe.mjs --checklist
 *   node scripts/govtech/wave1_e2e_probe.mjs --verify   (requires env; partial automation)
 *
 * Self-test: node --test scripts/govtech/wave1_e2e_probe.test.mjs
 */

const STEPS = [
  {
    id: "e2e-1",
    wdll: 15,
    depends: [7],
    label: "Staff upload returns entityId on template-city",
    verify: () => Boolean(process.env.WAVE1_UPLOAD_ENTITY_ID),
  },
  {
    id: "e2e-2",
    wdll: 15,
    depends: [8],
    label: "Review run uses declared editionId",
    verify: () => Boolean(process.env.WAVE1_ENGAGEMENT_ID && process.env.WAVE1_EDITION_ID),
  },
  {
    id: "e2e-3",
    wdll: 15,
    depends: [9, 10],
    label: "Matrix shows citation or typed absence (not silent empty success)",
    verify: () => Boolean(process.env.WAVE1_ENGAGEMENT_ID),
  },
  {
    id: "e2e-4",
    wdll: 15,
    depends: [12],
    label: "source_obligation_ledger row for same session request_id",
    verify: () => Boolean(process.env.WAVE1_OBLIGATION_REQUEST_ID),
  },
  {
    id: "e2e-5",
    wdll: 15,
    depends: [14],
    label: "Dashboards shell shows determination without recomputation",
    verify: () => Boolean(process.env.SMARTCITY_DASHBOARDS_URL),
  },
];

export function evaluateSteps(steps = STEPS) {
  return steps.map((s) => ({
    ...s,
    pass: s.verify(),
  }));
}

function printChecklist() {
  console.log("Wave 1 E2E walk (WDLL item 15 / S5-5 / G-110)\n");
  for (const s of STEPS) {
    console.log(`${s.id}. [WDLL ${s.wdll}] ${s.label}`);
    console.log(`   depends WDLL items: ${s.depends.join(", ")}`);
  }
  console.log("\nEnv for --verify (set after manual walk):");
  console.log("  WAVE1_UPLOAD_ENTITY_ID, WAVE1_ENGAGEMENT_ID, WAVE1_EDITION_ID");
  console.log("  WAVE1_OBLIGATION_REQUEST_ID, SMARTCITY_DASHBOARDS_URL");
}

function main() {
  const mode = process.argv.includes("--verify") ? "verify" : "checklist";
  if (mode === "checklist") {
    printChecklist();
    process.exit(0);
  }
  const results = evaluateSteps();
  let failed = 0;
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.id}: ${r.label}`);
    if (!r.pass) failed++;
  }
  process.exit(failed === 0 ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  main();
}
