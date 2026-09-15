## Mission — P-219: both PDF products draw every setback line from an ordinance repealed five months ago

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The defect, verified at source by the integration seat before you were dispatched

```
FACET  setbackRulesFact / brief section setbacks-envelope
       front 30 · side 10 · rear 30 · side_interior 5 · SIDE_CORNER 20
       districtCode SF-1 · jurisdictionKey bastrop-development-code
       citation Ordinance 2026-06, effective 2026-04-14
       (its own note records that it repealed the B3 Place Types)

ENGINE feasibility sheets 1, 4, 5, 9 · siteplan sheets 1, 2
       25 / 5 / 25 · NO corner-side value at all
       source string  bastrop-per-parcel/34049/front
       citation Ordinance 2019-51   <-- REPEALED 2026-04-14
```

Read live 2026-09-15 from `smartsite.cloud/api/spine/property-atoms/48021%3A34049/facets`.
The facet is right. **The engine is wrong, and every drawn setback line, the envelope polygon
and the buildable-area figure on both PDF products derive from the 2019 values.** The cover of
the feasibility study is the first thing a buyer reads.

**Second half, and it is why a corner lot is the worst case to find this on: the engine has no
corner-side concept.** Edge 1 is `side_corner` in the facet carrying 20 ft. The site plan
labels that same line "SIDE 5' (TYP.)". A front/side/rear triple cannot express a corner lot.

### You are fixing the root of FOUR carded symptoms, not a fifth bug

```
F24    Bastrop's own GIS layers disagree (ordinance text vs stale numeric columns)
P-154  the conflict row built to disclose that disagreement
P-214  the raw "edge 1: R32 ... != expected 5ft for role side" string a customer saw
       -- that "expected 5ft" IS this repealed side setback
D2     the wrong buildable-area figure on both PDF covers
```

Do not re-derive any of them. If your fix lands, say in the close which of the four you expect
it to retire and which it does not, so the integration seat can route the remainder.

### What you build

1. **The engine resolves setbacks from the same `setbackRulesFact` the facet uses.** One
   source, not two.
2. **It honours `side_corner`.** A corner lot draws its corner-side setback, not a side value.
3. **`bastrop-per-parcel/*` is RETIRED** — repoint consumers first, then retire. The retired
   path returns a **decline**, and a CI check fails if it reappears. Retirement is proven by
   decline, never by documentation. **The retirement item stays in THIS row**; do not split it
   into a follow-on, because a "read from X instead of Y" change that leaves Y alive is how an
   invisible defect becomes a visible regression later.

### D2's PDF half, which is yours because it is the same work

P-216 closed against `hauska-map`'s `adaptAtomChainToBakedFacets()` and fixed the FACETS
surface only. **The PDFs still print "19,052 sq ft of buildable area, 64% of the 29,989 sq ft
lot" in the largest type on the cover**, while `draw.derivedFigures.denies` lists
`buildable_area` and `lot_coverage_pct` outright.

That figure is wrong twice: barred by the policy the wire enforces, and numerically wrong
because it comes off the 2019 setbacks. **Decide the policy once.** If it prints, it prints off
the ruled table and all three surfaces agree. If it is withheld, it comes off both covers. What
must not stand is the panel withholding, the facets endpoint having served a zero, and the PDF
shouting a number.

If you conclude the policy call is above your pay grade, say so and propose both options rather
than picking the quiet one.

### Falsifiers, pre-register before you write anything

- If the engine now agrees with the facet but `bastrop-per-parcel/*` still answers, you have
  repointed the consumer and left the store. That is the documented wrong order.
- If a non-corner lot renders correctly and you never tested a corner lot, you have not tested
  the half that was missing. 48021:34049 IS a corner lot; use it.
- If your fix makes the buildable figure disappear from the PDFs without a stated policy
  decision, you have chosen withholding by omission.
- If the numbers now match but you cannot say WHICH source the engine reads, you have patched a
  value rather than a provenance.
- If you find the 2019 values are still authoritative for some district or some parcel, that is
  a bigger finding than this row and you escalate rather than continuing.

### Do not

Change the facet or `setbackRulesFact` — the facet is the correct side. Edit the setback corpus
or any ruled table. Invent a corner-side value for a district that has none. Touch
`smartcity-os` or `smartcity-dashboards`. Deploy without the operator's go.

### Close

`_inbox/<date>_p219-repealed-ordinance_close.json`, `planRows` `["P-219"]`, with: which code
path resolved the 2019 values and where it read them, the retirement decline plus the CI check
that fails on reappearance, a regenerated feasibility and siteplan for 48021:34049 showing
30/10/30/20 and a real corner-side line, your policy decision on the buildable figure with both
options stated, and which of the four symptoms you expect this to retire. `leave_behind` is
required.

**Commit your close to doc_repo main and PUSH it.** Six lanes this week left doc_repo artifacts
stranded in a worktree where no instrument could see them.
