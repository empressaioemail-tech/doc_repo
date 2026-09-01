const fs = require("fs");
const text = fs.readFileSync("P:/doc_repo/_inbox/2026-08-07_T1_bastrop_cohort_apply.log", "utf8");
const idx = text.indexOf('{\n  "event": "R4-depth-cost.done"');
const o = JSON.parse(text.slice(idx));
console.log(JSON.stringify({
  verifyPass: o.outcomes.verifyPass,
  verifyFail: o.outcomes.verifyFail,
  promoted: o.outcomes.promoted,
  divergences: o.parcelRingSourceDivergences.length,
  wallMsTotal: o.timing?.wallMsTotal,
  dryRun: o.dryRun,
  processed: o.processed,
}, null, 2));
