---
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [43_cortex_qa_backlog, 00_current_state, 11_roadmap]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier drop
> per HR-11. Body preserved as cc-agent-C wrote it. State advance since the
> report was written: PR #62 has been merged by the operator — verified via
> `gh pr view 62` (`state: MERGED`, tip `13762ce`) and `gh run view
> 26261220824` (`conclusion: success`). The full Cortex QA close-out
> (QA-16 #59, QA-23 #60, QA-19 #61, QA-18 #62) is now merged.

# QA-18 PR #62 — conflict resolution + CI green

## Outcome

QA-18 (`feat/qa-18-client-document-upload`, **PR #62**) is rebased onto
`main`, CI is green, and the PR is `MERGEABLE` / `mergeStateStatus: CLEAN`
— ready for the operator to merge. Branch tip `13762ce`.

## Work done

**Rebase.** The branch was a single commit (`b1f823c`) on merge-base
`0239fcd`. Rebased onto `origin/main` (`623b75e`, carrying QA-16 #59 /
QA-23 #60 / QA-19 #61). One conflict, in
`artifacts/design-tools/src/components/ClaudeChat.tsx` — two additive
overlaps where QA-19 (auto-scroll) and QA-18 (file upload) each inserted
adjacent declarations and handlers. Resolved by keeping both sides and
restoring the `};` that closes `handleScroll`. `ClaudeChat.test.tsx`
auto-merged. Rebased feature commit: `559d303`.

**CitationChip mock fix** — committed separately as `13762ce`. See the
finding below.

## Decision-relevant finding — dispatch §2 fix was still incomplete

The dispatch's §2 (already corrected twice during planning) said QA-18
added **3** store slices and that `CitationChip.test.tsx`'s mock needed
those 3. Auditing every `useEngagementsStore` selector in `ClaudeChat.tsx`
against source showed QA-18 actually added **5** store members the
component reads:

- 3 record slices — `attachedDocumentsByEngagement`,
  `uploadingDocumentByEngagement`, `documentUploadErrorByEngagement`
  (throw on `[engagementId]` indexing during render)
- 2 actions — `loadAttachedDocuments`, `uploadAttachedDocument`

`loadAttachedDocuments` is invoked from a **mount `useEffect`**, so even
after adding the 3 slices the dispatch named, `CitationChip.test.tsx`
would still have thrown `loadAttachedDocuments is not a function`. Added
all 5, mirroring the complete mock already in `ClaudeChat.test.tsx`.

Root cause of the dispatch miss: the same truncated-traceback failure
mode flagged earlier — the CI traceback stopped at line 174, before the
effect that calls `loadAttachedDocuments`. The planning-side correction
caught the 3rd slice but not the 2 actions. Generalized lesson: verifying
a prescribed fix against source means auditing the **complete** set of
dependencies the code touches, not only the ones a traceback surfaces.

## Environmental note — local build/test could not run

Local `pnpm run build` and `pnpm run test` could not execute on the
Windows workstation:

- `build` fails because win32 native binaries (`lightningcss`, `esbuild`)
  are absent — the lockfile is pinned linux-x64-only via
  `pnpm-workspace.yaml` overrides.
- The documented workaround (lift the win32 overrides, install) failed:
  the workstation's SSL-intercepting proxy blocks fetching the native
  tarballs from npm (`UNABLE_TO_VERIFY_LEAF_SIGNATURE` — same root cause
  as the gcloud token-refresh failure). `--use-system-ca` and a scoped
  `strict-ssl=false --force` install did not get the tarballs through.
- `pnpm-workspace.yaml` + `pnpm-lock.yaml` were reverted to clean state;
  the only committed change is the CitationChip fix.

Local verification was therefore limited to `pnpm run typecheck`
(**green**). Build + test were confirmed on CI (Linux), which is
authoritative.

## CI result

GitHub Actions run `26261220824` on `13762ce`:

- **Typecheck** — pass (1m07s)
- **Test** — pass (3m48s)

`design-tools`: **326 / 326** passed (29 test files). The dispatch's
"323" was the stale pre-rebase figure — the 3 fixed `CitationChip` tests
plus 3 tests QA-19/QA-23 added to `ClaudeChat.test.tsx` net to 326. Zero
failures workspace-wide (api-server 1077, portal-ui 437, plan-review 181,
adapters 201, codes 125, scripts 83, … all green).

## State / handoff

- `feat/qa-18-client-document-upload` force-pushed (`b1f823c` → `13762ce`).
- PR #62 `MERGEABLE` / `CLEAN` — **awaiting operator merge**. Run posture
  is operator-supervised; PR not merged by the agent.
- Out of scope and still queued: QA-22 site-context, codex-reviewer-qa
  scaffold.
