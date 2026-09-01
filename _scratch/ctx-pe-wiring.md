# ctx-pe-wiring scratch (F-06 / Band 0 PE)

LESSON 2026-08-30: #310 only grew LAYER_ABSENCE_VERDICTS. The BFF private union in api/_lib/verdict-layer-merge.ts still dropped stamp-missing and unmeasured, so layerAbsenceFromRecord returned null. Customer copy came from zoningFact declineReason ("this area is not zoned or not stamped") and the grey box "in this area" collapse. Growing the client closed set without the BFF union is a starved mechanism.

GROUND-TRUTH 2026-08-30T10:30:46-05: fail-then-pass on origin/main a275a45: layerAbsenceFromRecord(stamp-missing)=null; layerAbsenceFromRecord(unmeasured)=null; verdictLayersFromCortexRoot did not copy served zoning verdicts; yearBuilt undefined. After the union grow and served-zoning copy, those fixtures pass (329 tests).

DEAD-END: treating #310 / a redeploy of main as this card. Redeploying current main changes nothing.

OPEN: customer-done is a live brief plus a deployed-bundle assert of CTX-PE-WIRING-2026-08-30. Planner commits, deploys, writes _inbox/2026-08-30_ctx_pe_live.json. Subagent does not deploy.

OPEN: rail-absence serve path (manifest cell / rail_absence table) is the Abs lane. PE can NAME county-coverage when the wire arrives. Zero atoms is not unmeasured. Do not SELECT tx_rrc_well (P-50).
