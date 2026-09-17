## Mission — P-270: a setback citation without an effective date is a conflict row, not a silent pick

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` AND `legacy-design-tools` and open
one PR per repo. You do not merge or deploy; the integration seat does both. Any doc_repo change is
handed back as a diff in your close.

### Why this is the top customer row

P-254 measured the customer-visible defect list on 2026-09-17. **This is the widest defect in it:
29 of the 31 payloads that carry a setback citation at all.** It is reported under two ids, XD-11
(map/MCP) and X11 (LDT, seen on Pflugerville); they are one defect and you fix it once, in the one
place each repo decides it.

The card-truth lane (`2026-09-17_card-truth-p270-p272-p291_dispatch.md`) shipped P-272 and P-291 in
hauska-map #416 and **explicitly did not build P-270 in either repo**. Nothing about it is started.

### The standing ruling you are implementing

MOST-CURRENT SOURCE WINS (operator 2026-09-11,
`_decisions/2026-09-11_setback_source_most_current_wins.md`): for setbacks and every dimensional
rule, the source with the most recent effective date supplies the value; tier breaks ties only on
equal or unreadable dates; dates are read AT SOURCE (ordinance effective date, ArcGIS
`editingInfo.lastEditDate`), never assumed from source kind; **an unreadable date produces a
conflict row carrying both values, never a silent pick.**

The defect is the last clause. Today a citation is served with no effective date and the surface
prints it as though it were current. That is a silent pick: the reader cannot tell whether the rule
is from this year or from 2011, and nothing declares the degradation.

### What to build

1. **Find the one place in each repo that decides it.** Not the places that render it — the place
   that resolves a citation. hauska-map's card-truth lane found the same rule living in FOUR files
   with one copy drifted; expect the same shape here and consolidate rather than patch each site.
   Name the files you found and say whether they had diverged.
2. **A citation with no readable effective date does not serve as a plain citation.** It produces a
   conflict row that carries both values and names the source whose date could not be read. It is
   never dropped silently and the value is never presented as current.
3. **Distinguish the three states.** A date that is absent at source, a date that is present but
   unparseable, and a date that was never looked for are three different states, and none of them is
   the others. Do not collapse them into "no date". A fabricated or defaulted date is the worst
   outcome available here: it enters a most-current-wins comparison and silently wins or loses it.
4. **Never default the date.** If you find yourself writing a fallback so the comparison does not
   raise, stop: the refusal is the correct behaviour.
5. **The surface says so.** A reader must be able to see that the rule's vintage is unknown. Name
   the exact string and where it renders, in each repo.
6. Say what the 29-of-31 population becomes after the change, measured, not asserted.

### Verify by violation

Pre-register your falsifiers before you run them, and state what result would prove each wrong.

- A citation whose date is unreadable must produce a conflict row. Show the pre-fix code serving it
  silently and the post-fix code refusing — a revert-and-run, as the card-truth lane did (it
  restored the pre-fix guard and showed 3 of 13 tests failing).
- A citation whose date IS readable must still serve normally. A control that can only refuse is not
  a control; assert the agreeing case too.
- A parcel with two sources of different dates must still pick the more current one, unchanged.

### The three-question gate

Answer in your close: what executes this, what triggers it, what fails when it is violated, and what
bypasses it. Name the bypasses honestly — a second render path that formats a citation without going
through your resolver is one, and if one exists, say so rather than assuming you found them all.

### Constraints

- No store writes, no deploys, no merges.
- County 48491 (Williamson) was restored from a point-in-time branch on 2026-09-17; do not touch it
  in any store.
- hauska-map main now carries #416 (P-272, P-291) and legacy-design-tools main carries #715 (P-279).
  Branch from current `origin/main` in each and declare the SHA you got.

### Close

Declare: the start commits, the PR numbers, the files where the decision lived (and whether they had
diverged), the falsifiers with both directions shown, the measured post-fix population, the
three-question gate answers, and `leave_behind`.
