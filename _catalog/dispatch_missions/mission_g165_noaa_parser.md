## Mission - G-165: the NOAA Atlas 14 parser never matches, so every county is served Bastrop's default

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `hauska-engine`. You write nothing in `doc_repo`
(hand any doc edit back as a diff, uncommitted) and nothing in `smartcity-dashboards` or `smartcity-os`.

### What is actually wrong

`packages/adapters/src/hydrology/noaaAtlas14.ts` `parsePfdsDepthTable` parses a `<tr><td>` HTML table.
**The live HDSC endpoint (`hdsc.nws.noaa.gov`) no longer returns HTML; it returns a JavaScript
array-literal payload, `quantiles=[[...]]`.** So the parser never matches, and the code path that
depends on it falls through to `parameter/noaa-atlas14/default`, which is **Bastrop's 9.5in regional
default**, applied to every county regardless of location.

**Confirm both halves yourself before changing anything.** G-125 established this on 2026-09-14 by
direct curl of the real endpoint AND by every live production run in its probe returning
`rainfallSource: 'default'` and never `'noaa-atlas14'` on the no-parameter path. Re-run the curl. The
endpoint is live and third-party, so if it has changed again, say what it returns now rather than
assuming the 2026-09-14 shape.

### Why this is the most severe defect in this program's named state

    20|The number is wrong AND the citation is wrong, in the same payload, and the citation is the part a
reader trusts. The engine carries `rainfallSource: noaa-atlas14`, cites NOAA Atlas 14 seven times, pairs
return period to depth in `rainfallCurve`, and renders "100-yr (NOAA Atlas 14)" while the depth behind it
came from a Bastrop default. That is a fabricated value presented as an earned one, which is the defect
class `ENFORCEMENT.md` opens with, and it is worse than an absent value because an absence forces a
decision while this one is silently believed.

It is also why a design must not be "fixed" to match it: `_design/smartcity-flood-study/` carries a stale
claim that naming a depth by return period "would need a local rainfall atlas nobody has cited yet", and
that design is deliberately left failing (G-164) because correcting the prose would make the page agree
with the invented number. **Your fix is what makes that design repairable. Do not touch the design.**

### Acceptance, verbatim from the row

> `parsePfdsDepthTable` parses the live HDSC payload shape and returns a depth that VARIES WITH LOCATION,
> proven by two points whose Atlas 14 depths genuinely differ returning different values; a parse failure
> REFUSES rather than falling through, so `rainfallSource` can never read `noaa-atlas14` on a number the
> parser did not produce; and any surviving fallback is named, counted and marked on read rather than
> presented as a measured value.

Read the middle clause as the load-bearing one. **The fallback is not the defect; presenting a fallback
under a NOAA citation is.** If a default survives for a location Atlas 14 genuinely does not cover, it is
allowed, and it must be distinguishable on the read from a parsed value.

### Prove it by violation, in both directions, before you call it done

- **Pre-fix, show the defect:** two points whose true Atlas 14 depths differ, both returning the same
  Bastrop default under a `noaa-atlas14` citation. That is the falsifier for the claim that location
  matters, and it must fail on the pre-fix code.
- **Post-fix, show it can refuse:** perturb the payload shape and confirm the code REFUSES rather than
  quietly falling through. A parser that silently returns the default when handed garbage is the same
  defect wearing the new code.
- **Your `<tr><td>` fixture is now the wrong fixture.** Whatever fixture the existing tests use, check it
  against the live shape rather than trusting it, and if it encodes the old HTML shape, it is the reason
  the suite stayed green while production was wrong. Say so in the close; that distinction is the lesson.

### What you must not do

- **Do not loosen the check to make it pass.** Widening so a value the parser did not produce still
  reads `noaa-atlas14` is the defect, not the fix.
- **Do not repair `_design/smartcity-flood-study/` or any design.** That is `doc_repo` and another row.
- **Known pre-existing, not yours:** this row's predecessor recorded that `hauska-engine`'s full
  engine-core suite has four pre-existing failures. If you see four failures on an untouched baseline,
  they are not a regression you caused, and you should name them as inherited rather than chase them or
  report them as new.

### Evidence your close must carry

- The live endpoint's actual payload shape, pasted, with the moment you read it (a third-party payload
  needs a timestamp or it is not a ground-truth).
- The pre-fix violation: two differing locations, one identical Bastrop default, `rainfallSource`
  reading `noaa-atlas14` over it.
- The post-fix: two points returning genuinely different depths, plus the perturbed-payload refusal.
- The test suite's baseline and after counts, with any pre-existing failures named as inherited.
- Your snapshot (repo, ref, moment read) and the exact commit your checks ran against per `ENFORCEMENT.md`.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
