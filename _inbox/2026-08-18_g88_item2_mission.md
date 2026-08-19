# G-88 item 2: port the four CSS families into smartcity-dashboards

You are an executor on OPS-17 Lane B. This is acceptance item 2 of the approved WDLL at
`P:\doc_repo\_inbox\2026-08-18_g88_design_into_apps_WDLL.md` and nothing else. Read that card
before you start; it is the contract you are graded against.

## STEP 0 — your own clone, nobody else's

Two sibling executors are working the same repo in parallel on different files. Clone fresh to a
directory nobody else owns:

    git clone https://github.com/empressaioemail-tech/smartcity-dashboards.git P:/tmp/g88-css
    cd P:/tmp/g88-css && npm ci

Do NOT work in `P:/tmp/g75-dash` or `P:/tmp/b82-dash`. Push your branch immediately after your
first commit; a tmp clone can be recycled out from under you.

## THE WORK

Port four component families from the design system spec into `web/shell.css`. **This is a PORT,
not a design job.** The CSS already exists, fully written and token-only, in the spec's own
`<style>` block.

Source: `P:\doc_repo\30b_smartcity_design_system.html`, roughly lines 236-253 and 316-344 for
`cite`, `atomchip`, `mx`, `mxgroup`, `mxrow` and the `mx-*` states. The fourth family,
`finding` / `basisline` / `meter`, is specified in the same 30b section as the matrix (section 4.4).
Read the spec and take the rules from it. Roughly 26 rules across the first three families.

Full prior investigation, read it and do not re-derive it:
`P:\doc_repo\_inbox\2026-08-18_g88_css_families_investigation.md`.

### Three operator rulings you must apply. These are not yours to revisit.

**G1 — the 12px type floor holds.** 30b's own CSS sets `.cite em` at 11px, `.cite.model .corpus`
at 10px and `.mxgroup .lic` at 10px. **Raise all three to 12px.** The product ships zero sub-12px
declarations in 827 lines and already resolved this conflict once by shipping `.prov` at 13px
where 30b says 11px. A verbatim port would reintroduce the anti-pattern and reverse a decision the
product already made. The operator ruled the floor holds and accepted the consequence: 30b's own
specimens stop matching what ships.

**G2 — 30b governs the CSS, 30c governs atomchip markup.** `30b` and
`30c_smartcity_platform_ia.html` both carry these rules and they diverge in five places with no
stated precedence, including `.mxrow` at 132px versus 108px and `.cite.model:hover .sect` present
in one and absent in the other. **Every divergence resolves to 30b.** Take atomchip MARKUP from
30c section 6.3, because 30b contains no atomchip specimens at all. **Name all five divergences in
your close, with the value you shipped for each.**

**G6 — the fourth family ships.** `finding` / `basisline` / `meter` is in scope. It composes
`.cite` and `.prov` and is the unit of a comment letter.

### Hard constraints, each enforced by an existing test that will fail you

- **`web/sc-kit.css` must be byte-unchanged.** Verify by git blob hash, not by eye. It is
  byte-identical across three repos and a repo that edits a token value has forked the system.
- **Zero new tokens.** `--sc-atom` and `--sc-atom-wash` already ship in all three theme blocks.
  Every colour, size and radius must be an existing `var(--sc-*)`.
- **`shell.css` may declare no colour and no token.** The test asserts literally: no `:root`, no
  hex of any length outside comments, no `rgb()` or `rgba()`. If a rule you are porting carries a
  literal colour, map it to the token that already carries that value; if none does, STOP and
  report rather than inventing one.
- **No font declaration below 12px** anywhere in `shell.css` after your change.
- **Introduce no class that has no rule.** A test diffs every `class="..."` in the HTML and every
  runtime `classList` call against defined classes.
- Do not add markup to `web/index.html`. This item ships CSS only. The screens come later and are
  a different item.

## VERIFY (exit-bounded, every command terminates)

    npm test          # expect 185 pass or more, 0 fail
    git hash-object web/sc-kit.css    # must equal the value on origin/main
    grep -nE "font-size:\s*(([0-9]|10|11)px|0\.[0-9]+rem)" web/shell.css   # expect no new hits
    grep -nE "#[0-9a-fA-F]{3,8}|rgba?\(" web/shell.css                     # expect no hits outside comments

Do not start a server. Do not run a watch. Every command above exits on its own.

## THEN

Open a PR against `main`. Title it `G-88 item 2: port cite, mx, atomchip and finding into shell.css`.
Wait for CI and report the check-run conclusion STRING, not a `gh` exit code.

**Do NOT merge.** The planner verifies and merges. Verification never delegates below the planner.

Write your close to exactly `P:\doc_repo\_inbox\2026-08-19_b88-2_close.json`. Carry: the PR
number and head SHA, the CI conclusion string, the class list you shipped with a count, the five
30b-versus-30c divergences and the value shipped for each, the three sub-12px declarations and what
you raised them to, the `sc-kit.css` blob hash before and after, and anything the spec left
ambiguous that you had to decide. If you had to decide something the rulings above do not cover,
say so loudly rather than burying it.
