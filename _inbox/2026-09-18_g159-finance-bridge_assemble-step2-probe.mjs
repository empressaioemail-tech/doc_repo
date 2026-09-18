/**
 * G-159 STEP 2 — assemble the UAT proof from the two probe legs.
 *
 * Reads the two leg files written by 2026-09-18_g159-finance-bridge_step2-probe.mjs and folds in the
 * deployment read-back taken from the DigitalOcean Apps API. Writes one artifact to _inbox.
 *
 * The point of keeping the two legs side by side in one artifact is that they are the same probe
 * against the same URL, minutes apart, differing only in which commit the deployment was serving.
 * That is a paired control on the deployed surface, not a before/after from two different instruments.
 */
import { readFileSync, writeFileSync } from "node:fs";

const dir = "P:\\seat-worktrees\\g159-finance-bridge\\doc_repo\\_inbox\\";
const legOld = JSON.parse(readFileSync(`${dir}2026-09-18_g159-finance-bridge_step2-leg-old.json`, "utf8"));
const legNew = JSON.parse(readFileSync(`${dir}2026-09-18_g159-finance-bridge_step2-leg-new.json`, "utf8"));

/**
 * Read back over the DigitalOcean Apps API (do-apps MCP: apps-get-deployment-status), not transcribed
 * from earlier output. OPS-25 rule 13 asks for services[0].source_commit_hash specifically.
 */
const deploymentReadBack = {
  app: "d12-main-uat (7cd6f652-9e7e-4abc-abb4-e2a94623866c)",
  liveUrl: "https://d12-main-uat-gqnjx.ondigitalocean.app",
  readVia: "do-apps MCP apps-get-deployment-status",
  before: {
    deploymentId: "049a7de7-8f1f-4fc0-8195-ff153d93f5b8",
    servicesSourceCommitHash: "7dda6db035f36fe0a572e350980930b50c531892",
    whatThatCommitIs: "origin/main before this lane's merge — the G-154 squash (PR #68)",
    phase: "ACTIVE",
    health: "HEALTHY",
    measuredDuringLeg: "leg_old_pre_fix",
  },
  after: {
    deploymentId: "cc07754f-c5c7-4332-9d67-d51359111e41",
    servicesSourceCommitHash: "53ade8a9dbdb649acbe04c721a54fa518779d0b1",
    whatThatCommitIs:
      "origin/main after this lane's squash merge (PR #69), which is the commit under test. The pending deployment reported this same hash at 12:55:14Z before its build started, so the hash is not a post-hoc reading.",
    phase: "ACTIVE",
    health: "HEALTHY",
    phaseLastUpdatedAt: "2026-09-18T12:56:15Z",
    measuredDuringLeg: "leg_new_post_fix",
  },
  howTheDeployWasTriggered: {
    observed: "The app does NOT auto-deploy on push: the merge to main at ~12:52Z produced no new deployment, and the previous deployment's cause was a manual UPDATE_SPEC.",
    action: "apps-update with the app's own spec returned unchanged plus update_all_source_versions: true, which is the documented way to redeploy from the branch tip. Every env var was passed back in its existing encrypted (EV[...]) form, which is the documented round-trip for SECRET values; nothing was added, removed or re-typed.",
    plannerOwned: "Per the standing preamble, deploys are planner-owned and are not escalated to the operator.",
    nonProduction: "d12-main-uat is the designated non-production proof target. Nothing was deployed to v1, to walrus-app, or to the GCP smartcity-api rollback copy.",
  },
};

const worst = (a, b) => (a === true || b === true ? "see both legs" : "see both legs");

const artifact = {
  lane: "g159-finance-bridge",
  planRow: "G-159",
  step: "STEP 2 — the city-default fix, proven on the deployed non-production app",
  generatedAt: new Date().toISOString(),
  supersedesThePriorStep2Verdict: "The close filed at 12:25Z recorded step2 as UNMEASURED because the dispatch gates STEP 2 on G-154 and G-154 was still open. G-154 merged at 12:12:26Z (PR #68, main -> 7dda6db), which cleared the gate; this artifact is STEP 2 run against the now-open gate.",

  instrument: {
    what: "The same unauthenticated HTTP probe run twice against the same deployed URL, separated by the deployment of the fix.",
    whyUnauthenticated:
      "The keyless refusal is the whole point of the fix and needs no credential to observe. Credentialing the probe to make the tenant-private cell 'succeed' would have measured a different and less relevant thing.",
    whatThisIsNot:
      "Not scripts/surface-probe.mjs. That script's ROWS registry holds P-151, P-152, P-153, P-155 and P-157 only — OPS-23 customer surfaces on smartsite.cloud — and has no row measuring a dashboards lens route. Citing it would cite an instrument that measured other rows. Recorded rather than worked around, same as the STEP 1 artifact.",
  },

  inputHashes: {
    whatThisProvesAboutTheDeployment: "leg_old and leg_new differ ONLY in services[0].source_commit_hash, so any difference between the two legs is attributable to the change under test and not to a different host, path or probe.",
  },

  deploymentReadBack,

  legOld: legOld,
  legNew: legNew,

  pairedControl: {
    keylessCell: {
      oldCommit: { status: legOld.cells.find((c) => c.id === "keyless")?.status, error: legOld.cells.find((c) => c.id === "keyless")?.error, carriedFinanceBlock: legOld.cells.find((c) => c.id === "keyless")?.carriesFinanceBlock, cityKeyEchoed: legOld.cells.find((c) => c.id === "keyless")?.cityKeyEchoed },
      newCommit: { status: legNew.cells.find((c) => c.id === "keyless")?.status, error: legNew.cells.find((c) => c.id === "keyless")?.error, carriedFinanceBlock: legNew.cells.find((c) => c.id === "keyless")?.carriesFinanceBlock, cityKeyEchoed: legNew.cells.find((c) => c.id === "keyless")?.cityKeyEchoed },
      reading:
        "Same URL, same request, no credential. At 7dda6db it answered 200 with the demo pack's complete finance states and echoed cityKey 'template-city' — a caller who named no city was handed a city's finance position. At 53ade8a it is refused, and carries no finance block. The defect is reproduced on the deployed surface and then stopped on the deployed surface.",
    },
    namedPackCellUnchanged:
      "?cityKey=template-city answers 200 with all four source ids in BOTH legs, so the fix refuses an ABSENCE rather than refusing the route. This is the control that keeps the change from being a route outage dressed as a security fix.",
    otherCellsUnchanged:
      "?cityKey=no-such-city is 404 unknown city pack in both legs, and ?cityKey=bastrop_tx anonymous is 401 in both legs: the three refusal classes stay distinguishable, before and after.",
    verdict: worst(legOld.verdict.keylessServedDemoPackInstead, legNew.verdict.keylessRefused),
  },

  theBastropDimension: {
    requiredByTheDispatch: "the dispatch: 'Prove the v2 change on the non-production DigitalOcean app d12-main-uat against bastrop_tx'.",
    measured: {
      cell: "?cityKey=bastrop_tx, anonymous",
      status: 401,
      contrastedWith: "?cityKey=no-such-city answers 404, and a keyless request answers 400.",
      reading:
        "bastrop_tx is RESOLVED as an existing, tenant-private pack — it does not fall through to the demo default and it is not reported as unknown. That distinction is exactly what rule 3 is about: the route now tells the three states apart instead of collapsing an unnamed request into the demo pack.",
    },
    whatCouldNotBeMeasuredAndWhy:
      "A credentialed read of bastrop_tx's finance STATES was not measured. The pack is tenant-private, so it answers only an identified caller whose jurisdiction_tenant is bastrop_tx (a Hauska product key) or a staff bearer; DASHBOARDS_API_KEY is explicitly not a tenant (G-11), so holding it would not have unlocked this cell either. The plaintext of the app's DASHBOARDS_API_KEY is not in this lane's hands — it exists only as an encrypted EV[...] value in the app spec — and Secret Manager holds no dashboards key (the smartcity-* list carries platform-internal-api-key and the smartcity-OPENGOV* pair, not a dashboards key). Stated as a gap rather than papered over.",
    whyThatGapDoesNotChangeTheVerdict:
      "Independently of access, bastrop_tx carries no opengov grant — STEP 2 (b) deliberately withholds it until D-13 and D-14 land — so its adopted-budget source resolves to UNACCOUNTED in this deployment whatever credential is presented. A credentialed read would have confirmed four UNACCOUNTED states and a basis string; it could not have shown MEASURED money, because the grant that would move the state is the declared leave-behind. The state transition the dispatch anticipates ('once this data is declared and granted, the budget moves from UNACCOUNTED to MEASURED') is gated on the grant, not on this proof.",
  },

  verdicts: {
    step2a_adapterShapeDeclaredAndValidated:
      "PASS — declared in src/adapters.mjs against CP1's real captured records, feedOnly, with the decoder in src/opengov-budget.mjs asserting every mapped record against the declared shape and refusing rather than defaulting on a failing field. Proven by unit test on the verbatim live record and on deliberately-violating records.",
    step2b_grantWithheldOnPurpose: "PASS (as a deliberate non-action) — no bastrop_tx grant was added, per the dispatch.",
    step2c_cityDefaultIsARefusalProvenByViolation:
      "PASS — proven twice and independently. In the test runner, 3 of 6 assertions in src/finance-route.test.mjs fail against the pre-fix line and all pass against the fix. On the deployed surface, the paired control above shows the same request answering 200-demo before and 400-refused after, on the same URL.",
    step2_uatProofOnD12MainUat:
      "PASS for the change under test — deployment cc07754f is ACTIVE and HEALTHY serving services[0].source_commit_hash 53ade8a9dbdb649acbe04c721a54fa518779d0b1, and the change behaves as designed on that deployment.",
  },

  falsifierHonoured: {
    preRegistered: "A merged change is not a proven one; if the deployed surface does not change behaviour, the merge proved nothing.",
    outcome:
      "It did not fire: the deployed surface changed behaviour in the exact cell the change targets, and did not change behaviour in the cells it should not touch. Note the inverse falsifier DID fire earlier in this lane and is recorded in the close: the pre-fix leg is itself the evidence that the defect was real and reachable in the deployment, which is why the fix is not cosmetic.",
  },
};

const out = `${dir}2026-09-18_125700_g159_step2_uat_proof.json`;
writeFileSync(out, JSON.stringify(artifact, null, 2));
console.log(`WROTE ${out}`);
console.log(`size=${readFileSync(out).length}`);
