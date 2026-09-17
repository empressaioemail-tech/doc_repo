## Mission — P-324: resolve the share-identifier question, then ship the pixel and campaign attribution

You launch no sub-agents (FAN-DEPTH 0). You resolve one open question, then you push, deploy and
verify two repos in a fixed order. You fix your own failed deploys rather than escalating them.

Read `_inbox/2026-09-17_smartsite_meta_pixel_utm_handoff.md` in full before anything else. It is the
staging seat's own account, it is honest about what it did not verify, and this mission only adds the
ordering and the two gates.

### What is already built and NOT pushed

| Repo | Worktree | Branch | Commit |
|---|---|---|---|
| `hauska-map` | `P:/seat-worktrees/integration/hauska-map-meta-pixel` | `feat/meta-pixel-and-utm-source` | `369fd77` |
| `legacy-design-tools` | `P:/seat-worktrees/integration/ldt-utm-source` | `feat/utm-source-tag` | `c47b8c7b` |

Both were branched from each repo's `origin/main` at `0489bc8` and `7219b707`. **Both mains have
moved since** (map through #416 and LDT through #715 and #716). Rebase, re-run the suites, and
declare what moved. Do not assume a clean replay: #416 changed
`apps/property-explorer/src/lib/fact-sheet-resolver.ts` and consolidated a rule that used to live in
four files, and this branch touches `src/lib/auth.ts` and `src/main.tsx` in the same app.

The defect this fixes is real and worth keeping in view: `peGhlContact.ts` wrote a hardcoded
`source-organic` tag on **every** new signup, so a click from a paid ad was filed as organic. That is
a wrong value asserted as fact, which is worse than a missing one.

### GATE 1 — answer 3a before you push, and answer it locally

`fbq("track","PageView")` sends the page address as `dl`. This app's deep links put identifiers in
that address: a share landing is `/share?g=<grantId>` or `/s/<uuid>`, a parcel view carries
`parcelNodeId`, and `/share#<token>` puts the human token in the fragment.

**A share grant id is a capability identifier, not an analytics tag.** If it reaches Meta, Meta
receives something that names an access grant, and learns which browser opened which share. Treat
that as a data-sharing decision, not a deploy detail.

The staging seat deliberately shipped no mitigation because it had not verified what `fbevents.js`
actually puts in `dl`, and shipping a mitigation against unverified behaviour is how confident wrong
claims get made. That was the right call. Your job is to end the uncertainty.

**Run the probe on a local `vite dev` server, not on a preview.** The tag loads there too. The
handoff's original ordering (push, let a preview build, probe the preview) fires PageViews tagged
with preview URLs into the LIVE pixel id and mixes preview traffic into the ad data the operator
reads. Probing locally dissolves the dependency between the two decisions entirely, at no cost. If
you believe a local probe cannot answer it, say why before reaching for a preview.

The probe: load `/share?g=<a grant id>` with Meta Pixel Helper, read the `dl` value on the PageView
event, and record it verbatim. Test the fragment form `/share#<token>` separately — query string and
fragment are different questions and `dl` may carry one and not the other. Also test a parcel deep
link carrying `parcelNodeId`.

Then decide, and state the decision with its reason: suppress the pixel on identifier-bearing routes,
strip the identifier from the address bar before the pixel fires, or accept and disclose. If you
choose accept-and-disclose, the privacy page must say so plainly; it currently does not claim shares
are withheld, and an earlier draft that did was removed as an overclaim, so do not reintroduce one.

**Record the verbatim `dl` values in your close.** A summary of what you saw is not evidence.

### GATE 2 — the cortex leg is blocked until P-323 clears

The handoff's deploy order is cortex first, then the app, and that order is correct: if the app ships
first, campaign parameters arrive at a `session-exchange` that ignores `campaign`.

But `legacy-design-tools`' deploy workflow now runs P-279's tagged-revision credential check after
the canary deploy and again after the traffic shift, and it **exits 1 on violation**. `cortex-api`
carries 15 failing tags today, so both jobs go red for a reason that has nothing to do with your
change. The deploy still happens; what you lose is the ability to tell YOUR failure from the standing
one, and a deploy job that is red by default is how a working control gets reclassified as noise.

So: **do not ship the cortex leg through a red gate.** P-323
(`_dispatches/2026-09-17_p323-tag-hygiene_dispatch.md`) clears the tags. Confirm a clean P-279 run on
`cortex-api` before you deploy it, and name the run you read. If P-323 has not landed, stop after
Gate 1 and report; do not work around the check and do not make it advisory.

### Then deploy, in this order

1. **`legacy-design-tools` (cortex-api)**, under its deploy lease. Confirm `POST
   /auth/session-exchange` still returns 200/201, and that a new signup with no campaign still
   creates a GHL contact with **no** source tag.
2. **`hauska-map` (Vercel, Property Explorer)**. `hauska-map` links to whichever project
   `.vercel/project.json` names and has been linked to `cmdcenter` when the work was for
   `property-explorer`. The correct ids are `prj_vcZGXbqdffk5C20WzaplEpzFynK3` (project) and
   `team_4TH5lNnFHcBGx4EKNapJ2MVG` (org); Root Directory is `apps/property-explorer`. Deploy from a
   fresh clone: `P:/hauska-map` was 370 commits behind, one commit ahead and dirty on 2026-09-17.
   Judge success by the live alias, never by the CLI exit code, which has returned 255 on a
   deployment that shipped fine.
3. Verify on the live site: the tag is in `<head>`; no CSP violation for `connect.facebook.net`;
   Pixel Helper reports PageView. The CSP allowance is production-only in effect — nothing in CI
   notices its absence, so this check is the only thing that catches it.
4. Land with `?utm_source=share&utm_medium=share`, sign in with a new account, read the GHL contact:
   the tag must be `source-share`.
5. Repeat with `?utm_source=facebook&utm_medium=paid`: the contact must have **no** source tag and
   the log must carry the unmapped entry. That is the correct outcome, not a bug — there is no paid
   member among the four provisioned `source-*` tags, so the fix removes a false label without
   supplying a true one (3b).
6. `/privacy` still serves real HTML and shows the 17 September 2026 date.

### Say this out loud in your close

Organic signup volume **will drop**, because signups arriving with no campaign parameters now get no
source tag where previously every one was `source-organic`. The bucket becomes a measurement instead
of a guess, and it shrinks. Someone will read that dashboard and think something broke.

### What you must not do

- Do not push before Gate 1 is answered.
- Do not deploy cortex-api through a red P-279 gate, and do not make that check advisory.
- Do not write the throwaway Postgres credential into any repo file. The staging seat kept it out of
  every file deliberately; keep it that way. The integration suites (`pe-ghl-contact`,
  `pe-magic-link`, `pe-paywall-stripe`) need Postgres with `pgvector` and `postgis` and the
  **direct, non-pooled** URL, because the harness sets `search_path` as a startup parameter and
  Neon's pooler rejects it.
- Do not implement named conversion events or the Conversions API. Both are named gaps, not this
  deploy (gap 1 and 2 in the handoff).
- Do not touch county 48491 in any store.

### Close

Declare: the rebase result and what moved under you, the verbatim `dl` values for all three link
shapes, your 3a decision with its reason, the P-279 run you read before the cortex leg, both deploy
targets with their verification, the GHL contact reads for both campaign cases, and `leave_behind`.
