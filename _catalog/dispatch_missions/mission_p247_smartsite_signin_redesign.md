## Mission — P-247: Smart Site sign in / landing redesign

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

Fresh clone of `empressaioemail-tech/hauska-map` from `origin/main`, on a new
branch `feat/p247-signin-redesign`. Declare the commit you started from before
you write anything. This is the same repo and surface as the currently-live
sign in card (P-122 Batch 7, `PricingModal.tsx`'s sibling sign-in component,
merged `hauska-map` PR #375) — read that component first so the redesign
replaces it rather than sitting beside it.

### The design handoff

Full brief, copy (verbatim, do not rewrite), tokens, layout spec, interaction
spec and the example parcel's illustrative values are in
`_design/handoffs/2026-09-16_smartsite_signin_redesign/README.md` in this repo
(doc_repo), with the design-of-record markup in
`Smart Site Sign In.dc.html` in the same folder. Read both before starting.
The `.dc.html` file is a design reference, not code to lift — recreate it with
this repo's own components and `pe-tokens.css`, pixel-accurate to the spec.

Three states: the card (state 1, replaces what's live now), a tabbed sample
report over the real aerial map (state 2), and a mocked Claude conversation
screen for affiliate screenshots (state 3, no Smart Site chrome — it is
Claude's own light shell, not the dark app shell).

### What must be real, not mockup

The design's own example parcel table is explicitly illustrative ("Mockup.
Values illustrative, not live."). Production must wire state 2 to real data
for the three sample-parcel links (an Austin infill lot, a Bastrop tract, a
Hays corridor lot) — real zoning, setbacks, buildable envelope, flood and
terrain facts with real citations, through this app's existing data path for
an anonymous/no-account read. Every value keeps its citation and an explicit
`absent` case (render the `reported absent` chip, never an empty string, a
dash, or a zero) — do not fabricate a value the record does not have for any
of the three sample parcels.

### Design-system exception, carried from the brief

Orange (`#E8963B`) as a solid button fill on the primary CTA is a deliberate,
operator-approved departure from this repo's design-system rule that gold is
reserved for the brand mark and the unread dot. If a CI check or lint rule
enforces that reservation, add these two buttons to its allow-list rather than
routing around the check silently — name the exception in the same commit.

### Assets

The Claude starburst mark and the aerial basemap are drawn placeholders in the
design file. Swap in the real aerial basemap (this repo already renders one
live) and the official Claude mark asset before this ships — do not ship the
placeholders.

### Verification (exit-bounded — every command must terminate on its own; no watch, tail, or serve)

Run this package's test suite and typecheck; confirm both exit 0, paste real
output. Add tests for the three real-data sample-parcel loads (state 2) proving
each renders its `absent` case correctly for at least one field the record
does not carry — a fixture that only exercises the fully-populated path would
miss exactly the defect class this design is built to avoid. If this repo's
harness can visually verify layout, confirm the three-up instrument row, the
Claude channel block, and the tabbed state 2 panel render at both the desktop
and mobile breakpoints named in the spec.

### Close

Commit (one focused PR covering the redesign; a second PR for the real-data
wiring if that is cleaner as a separate concern — your call, but each PR title
must match its diff), push, open a PR with `gh pr create` (base `main`). Do NOT
merge it yourself. Do NOT deploy.
