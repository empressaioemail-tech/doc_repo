## Mission — P-214: P-154's conflict disclosure is real and is rendered as a developer diff

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What a customer sees right now

Live `smartsite.cloud`, Bastrop parcel `48021:8723767`, under **"More facts"**:

```
edge 1: R32 35.02831192164916ft != expected 5ft for role side;
edge 4: R32 53.60964475445567ft != expected 25ft for role rear
```

Internal edge index, internal role token, an unrounded 14-decimal float, and assertion syntax,
on a customer surface, on the design-partner county that is also the surface probe's anchor.

### Established before you start, so you do not re-derive it

**YOU ALREADY KNOW WHAT THIS IS. Do not spend a lane discovering it.** The string is
**P-154's R-1 conflict row**, shipped by legacy-design-tools `803cd0d5` (PR #688,
2026-09-14T14:34:27Z), "feat(mcp): print the R-1 conflict row in get_smart_site (P-154, OPS-23
wave 6; A-148)". The operator confirms Bastrop rendered correctly earlier the same day, which
brackets the change to that deploy.

**So the INTENT is correct and ratified.** A-148 established that Bastrop's current zoning layer
says 30/10/30/20 in the ordinance text and 25/5/25 in stale numeric shortcut columns that were
never refreshed, and the operator's ruling was that our card must say so. "expected 5ft for role
side" is that stale numeric side value. **This row does not remove the disclosure. It fixes how
the disclosure is rendered.** Deleting it would undo a ratified decision.

**Correction to an earlier planner claim, recorded so you do not inherit it:** this seat first
wrote that the string was panel-generated because it is absent from the `get_smart_site`
depth-node payload. That inference was wrong. The PE panel reads its own adapter, so absence
from the MCP payload proves nothing about what the panel's own path serves. Establish where the
string is composed before you change anything, and say which file emits it.

### THE PART THAT IS NOT A FORMATTING BUG, and it decides this mission

The panel's numbers disagree with the record we serve:

```
panel says          "expected 5ft for role side"
served brief says    sideFt: 10        (setbacks-envelope section, disposition present)
served setbackRules  SF-1, bastrop-development-code, effective 2026-04-14, with citation

panel says          "edge 1 ... 35.02831192164916ft"
served edge 1        distanceFeet 121.99991662273543, role side, setback state ABSENT
                     ("No parcel or ROW adjacency mapped for this edge")
```

So the panel is evaluating against a setback source that disagrees with `setbackRulesFact`, and
against edge measurements that are not the served ones. **A fix that rounds the float, renames
the token, or hides the string would bury a real conflict between two sources and leave the
customer with a confident wrong number instead of an ugly right one.** That is the failure mode
this mission exists to prevent.

Find what `R32` is and where the panel's "expected" values and edge lengths come from. Name
both sources. If the panel's source turns out to be correct and the served record wrong, that is
a bigger finding and you escalate rather than continuing.

### Two further defects in the same payload, same parcel

**Same self-contradiction class as P-207, different rail.** The brief's `setbacks-envelope`
section reads `present` with 30/10/30/20 while the `envelope` overlay in the SAME response
reads `refused`, `atom_path_pending`, "Buildable envelope not computed." One response, two
opposite claims about whether an envelope exists.

**F25 vintage lie.** The UI prints "as of 2026-08-08" while the payload's `bakedAt` is
2026-09-10. Values from one date, label from another.

Fix all three or say why one is out of scope. Do not fix the visible one and leave the other
two, which is how this parcel came to carry three at once.

### Done looks like

No customer-facing string contains an internal identifier, an unrounded float, or assertion
syntax — proven by a fixture built from THIS parcel that fails on current code and passes
after. And the panel's setback source either agrees with the served `setbackRulesFact`, or the
disagreement is surfaced as a **declared conflict in prose naming both sources and their
vintages**, never as a diff.

A declared conflict is an acceptable and preferred outcome. We already have a ruling that a
card must admit when sources disagree; this is that, done properly.

### Falsifiers, pre-register before you write anything

- If your fixture passes on the pre-fix code, it does not test this defect.
- If you make the string DISAPPEAR, you have undone a ratified disclosure (A-148). The conflict
  is real and the customer is entitled to know about it. Only its rendering is in scope.
- If you make the panel agree with the record by adopting the record's numbers WITHOUT checking
  which is right, you have chosen the convenient source rather than the correct one.
- If the envelope overlay and the brief section still disagree after your change, you fixed the
  rendering and not the coherence.

### Do not

Remove the conflict disclosure — A-148 ratified it and only its RENDERING is in scope. Change
the bake or any setback table; the conflict is real and correcting the city's stale columns is
not this lane's job. Invent a setback value for any parcel. Touch `smartcity-os` or
`smartcity-dashboards`. Deploy without the operator's go — note that a merge to
legacy-design-tools main AUTO-DEPLOYS, which is how this reached production in the first place.

### Close

`_inbox/<date>_p214-panel-raw-assertion_close.json`, `planRows` `["P-214"]`, with: what `R32`
is and both sources named with vintages, which source is correct and how you determined it, the
fixture failing before and passing after, a live read of `48021:8723767` showing the customer
string, and the disposition of all three defects. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Three lanes this week left doc_repo
artifacts stranded in a worktree where no instrument could see them. If you cannot push, say so
in your handback rather than leaving them.
