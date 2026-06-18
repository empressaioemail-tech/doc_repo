---
id: 2026-06-17_extension-agent_brief_failure_state_and_attachment_upload
title: extension-agent — brief never resolves the spinner on failure; build attachment upload (PB-301)
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
kind: dispatch
related: [2026-06-17_cc-agent-C_brief_national_baseline_no_jurisdiction_gate, 75i_investor_radar_prelaunch_sprint]
---

# extension-agent — brief failure state + attachment upload

Two bugs from live QA on `research/research.html` (v0.6.12), address `17003 simsbrook pflugerville`.

## Bug 1 — the brief spins forever on failure

The subtitle shows "Brief failed" but the main panel stays on "Building property brief..." with the spinner running indefinitely. The brief actually returned **HTTP 403** (`jurisdiction_not_available`) — the UI never handled the non-200 and never stopped the spinner.

Fix:
- On any `/brief` response that is non-200 OR carries a failed/error status, **stop the spinner** and render a real terminal state — surface the actual message (`message`/`error` from the body), not an indefinite "Building…".
- The backend is being fixed in parallel ([`cc-agent-C brief national-baseline`](2026-06-17_cc-agent-C_brief_national_baseline_no_jurisdiction_gate.md)) so addresses will now return **200**: Central TX serves warmed/cited code; everywhere else returns the national baseline + a **websearch** local layer with `coverage.degraded=true` and a web-scraped reason. Render that as a **successful brief with a "web search — unverified, web-scraped" disclosure banner** on the affected sections (not a failure). Drive the banner + the per-section provenance/confidence off the EngineEnvelope `coverage{degraded, reason}` and section provenance already on the response. The web-scraped disclosure is required wherever websearch data is shown (commitment #1).
- Keep "Brief failed" only for genuine errors (network, 5xx), with a retry affordance — never a silent permanent spinner.

## Bug 2 — attachment upload is stubbed (PB-301)

`src/research/research-app.js:452, 484, 1266` stub CC&R/HOA document upload with "coming soon" alerts. Build the real upload:
- Wire the `+ Add` attachment control to the presign-upload endpoint cc-agent-C is exposing (contract handed over in that dispatch's close: URL, request shape, returned upload URL, object path, size/type limits). Replace all three PB-301 stubs.
- Upload flow: request presign → PUT the file to the returned URL → attach the object reference to the property profile. Show progress + the attached doc in the ATTACHMENTS list. Handle failure (size/type/network) with a clear inline message, not an alert.
- Attachments are **tenant-private** (the profile panel already says "This profile is yours. Private, never pooled.") — do not send file contents anywhere but the presign target.

## Coordinate

The presign endpoint contract is owned by cc-agent-C (paired dispatch). Don't hardcode an endpoint guess — use the contract from its close. The brief-degraded-banner shape depends on the EngineEnvelope `coverage` field, already present.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-brief-extension_extension-agent_brief_state_and_attachment_close.md` — the version bump, the failure/degraded-state handling (with a screen capture of a Pflugerville brief rendering degraded instead of spinning), the attachment upload working end to end against a live presign, and the prod-verify checklist re-run.
