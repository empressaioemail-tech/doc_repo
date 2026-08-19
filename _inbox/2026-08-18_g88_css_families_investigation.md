---
doc_id: 2026-08-18_g88_css_families_investigation
date: 2026-08-18
status: active
lane: OPS-17 Lane B
plan_row: G-88 (scoped as A-070, same session)
type: read-only investigation
owner: planner
related_canonical:
  [
    30b_smartcity_design_system.html,
    30b_smartcity_design_system.md,
    30c_smartcity_platform_ia.html,
    30c_smartcity_platform_ia.md,
    _decisions/2026-08-17_smartcity_visual_law.md,
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
  ]
---

# G-88 investigation: the three missing CSS families

Read-only. No repo state changed. This file is the only thing written.

## The headline, before anything else

**The CSS for all three families already exists, fully written, in the design-system spec's own `<style>` block.** This is not a design job. It is a PORT with a small number of named editorial decisions the operator has to make.

`30b_smartcity_design_system.html` lines 236-253 and 316-344 carry complete, token-only rules for `cite`, `atomchip`, `mxgroup`, `mx`, `mxrow`, and every `mx-*` state. `30c_smartcity_platform_ia.html` carries a second copy at lines 170-175, 219-246, and 338-344. The two copies **disagree in five places**, enumerated in section 5.

The framing in the dispatch ("a design agent will invent all three") is correct about the risk and wrong about the cost. The executor does not invent anything. The executor copies known-good rules into `web/shell.css`, resolves five spec-vs-spec conflicts and one law conflict, and re-vendors.

## Verification posture

Clones read, both clean, both at the commits the dispatch named:

```
$ cd /p/tmp/g75-dash && git remote -v && git status --porcelain && git log --oneline -1
origin	https://github.com/empressaioemail-tech/smartcity-dashboards.git (fetch)
origin	https://github.com/empressaioemail-tech/smartcity-dashboards.git (push)
cdfca39 feat(g80): the chrome follows the pack, everywhere identity appears (#19)

$ cd /p/tmp/g82v && git remote -v | head -2 && git status --porcelain && git log --oneline -1
origin	https://github.com/empressaioemail-tech/smartcity-kit.git (fetch)
origin	https://github.com/empressaioemail-tech/smartcity-kit.git (push)
830fbe3 fix(g87): the constraint gate can see .design-sync
```

Two corrections to the dispatch's own framing, both minor and neither changing the work:

- The kit clone is on `g87/constraint-gate-sees-design-sync`, not `main`. Its vendor manifest pins upstream at `cdfca39`, which is the product clone's HEAD, so the vendored copies are current.
- `vendor/sc-kit.css` is 4329 bytes against the product's 4409. That is CRLF, not drift. `vendor/UPSTREAM.json` states the counting rule: "sha256 is taken over CRLF-normalized (\r\n -> \n) UTF-8 content". The copies are identical in git.

## Correction to the section pointers

The dispatch cites "30b section 3.1" for `mx*` and `cite`, and "30b section 6.3" for `atomchip`. Traced to source:

| Claim | Actual location | Verdict |
|---|---|---|
| `mx*` and `cite` load-bearing, 30b 3.1 | `30b_smartcity_design_system.md` section 3.1 "Load-bearing" | CORRECT |
| `atomchip` at 30b 6.3 | **30b has no section 6.3.** In the `.md` the class sits at 3.9 "Class inventory"; in the `.html` it sits at 7.3c. | WRONG DOC |
| where 6.3 actually is | `30c_smartcity_platform_ia.md` line 180, `### 6.3 Atom language` | the pointer belongs to 30c |

```
$ grep -n "6\.3" 30c_smartcity_platform_ia.md | head
180:### 6.3 Atom language
```

This matters practically: **30b contains zero markup examples of `atomchip`**, only CSS.

```
$ grep -n 'class="atomchip' 30b_smartcity_design_system.html
(exit 1, no match)
```

An executor pointed only at 30b would have CSS with no markup contract for the one family the dispatch calls not-load-bearing. Point them at 30c section 6.3 and 30c HTML lines 1825-1955.

## Answer to question 3, first, because it is the most urgent question asked

**No product markup references any of these classes. Nothing unstyled is shipping.**

```
$ cd /p/tmp/g75-dash
$ grep -nE "(mxrow|mxgroup|mx-pass|mx-fail|mx-unc|mx-unchecked|atomchip|basisline|\"cite|'cite| cite | finding )" web/index.html web/app.js
exit=1  (1 = no match)
```

This is the good outcome. The families do not exist at all rather than existing half-built. No live surface degrades while this row is open, and the work has no cleanup leg.

Also worth stating because it reframes where the work lands: `web/sc-kit.css` is **tokens only**, 80 lines, no component rules at all. Every one of the 109 shipped classes is defined in `web/shell.css`. All three families land in `shell.css`; `sc-kit.css` is not touched, and no new token is needed by any of them.

---

# Family 1: the applicability matrix, `mx*`

## What it is, quoted

`30b_smartcity_design_system.md` section 3.1, verbatim:

> **Applicability matrix, inverted, grouped by corpus.** Rows are grouped under a corpus header that states the full canonical title once ("2018 International Building Code", "Template Unified Development Code"); rows then carry section identifiers only. This is how the matrix stays dense without ever printing an abbreviation alone, and it is the reason the corpus grouping is structural rather than cosmetic.
>
> Four values: Pass, Fail, Uncertain, Unchecked. Pass is the quietest row on the page: gray text, no rail, no fill. Fail gets the critical rail and wash. Uncertain gets the warn rail and wash. Unchecked gets a diagonal hatch, the plat-drawing convention for nobody has been here yet. The inversion is the ruling: a plans examiner is paid to find unresolved rows, not to admire passing ones, and unreviewed is more dangerous than failed so it must never read as clean. Green-for-good would spend the loudest treatment on the rows needing no one.

`30b_smartcity_design_system.html` section 4.4, the callout, verbatim:

> Pass is the quietest row on the page: gray text, no fill, no rail. **Uncertain** gets an amber rail and wash. **Unchecked** gets a diagonal hatch — the visual language of "nobody has been here yet" from a plat drawing — because unreviewed is more dangerous than failed and must never read as clean. A reviewer scanning two hundred sections should be pulled to exactly the rows that need a human.

## Markup structure it implies

Verbatim from `30b_smartcity_design_system.html` lines 929-937:

```html
<div class="sc mx" style="border:0;border-radius:0">
  <div class="mxgroup"><span class="c">Template Unified Development Code</span><span class="lic">Local &middot; adopted 2024</span></div>
  <div class="mxrow mx-unc"><i class="rail"></i><span class="sec">Section 7.2.6</span><span class="txt">Drainage plan required &mdash; site grades conflict between sheets C-101 and C-201</span><span class="pill p-warn"><span class="gl">?</span> Uncertain</span></div>
  <div class="mxrow mx-pass"><i class="rail"></i><span class="sec">Section 5.3.2</span><span class="txt">Front setback</span><span class="pill p-ok"><span class="gl">&#10003;</span> Passed</span></div>
  <div class="mxgroup"><span class="c">2018 International Building Code</span><span class="lic">Licensed &middot; citation only</span></div>
  <div class="mxrow mx-unchecked"><i class="rail"></i><span class="sec">Section 802.3</span><span class="txt">Interior finish classification &mdash; not yet evaluated</span><span class="pill p-quiet"><span class="gl">&ndash;</span> Unchecked</span></div>
  <div class="mxrow mx-fail"><i class="rail"></i><span class="sec">Section 1004.5</span><span class="txt">Occupant load exceeds the value the submitted plan is designed to</span><span class="pill p-crit"><span class="gl">&times;</span> Fails code</span></div>
</div>
```

Contract: `.mx` is the bordered container. `.mxgroup` is a corpus header carrying `.c` (canonical title) and `.lic` (licence badge). `.mxrow` is a four-column grid: `i.rail`, `.sec`, `.txt`, then a `.pill` that is NOT part of the family. Exactly one `mx-*` state class per row. 30c line 1109 adds a `.grow` spacer and a `.t-caption` section count to `.mxgroup`; both of those classes already ship.

**Structural rule worth stating as an acceptance item**: the row rail always pairs with a pill in the same row. That is the color law from 30b 1.2a — "a row rail always pairs with a pill in the same row" — and the markup honors it in every specimen.

## Exact class vocabulary and existence check

| Class | In product CSS? | Notes |
|---|---|---|
| `mx` | ABSENT | container |
| `mxgroup` | ABSENT | corpus header |
| `mxgroup .c` | ABSENT | child selector, not a standalone class |
| `mxgroup .lic` | ABSENT | |
| `mxrow` | ABSENT | |
| `mxrow .sec` | ABSENT | |
| `mxrow .txt` | ABSENT | |
| `mx-pass` | ABSENT | |
| `mx-fail` | ABSENT | |
| `mx-unc` | ABSENT | |
| `mx-unchecked` | ABSENT | |
| `rail` | **PRESENT** | already shipped, but SCOPED — see collision note |
| `pill`, `p-ok`, `p-warn`, `p-crit`, `p-quiet`, `gl` | **PRESENT** | consumed, not built |

Raw evidence:

```
$ cd /p/tmp/g75-dash
$ grep -nE "\.(mx|mxrow|mxgroup|mx-pass|mx-fail|mx-unc|mx-unchecked|cite|atomchip|finding|basisline|meter)\b" web/sc-kit.css web/shell.css
exit=1  (1 = no match)

$ for c in sec txt c lic corpus sect did conf f fid fbody ftitle fmeta fact gl sep; do ...; done
sec      ABSENT
txt      ABSENT
c        ABSENT
lic      ABSENT
corpus   ABSENT
sect     ABSENT
did      ABSENT
conf     ABSENT
f        ABSENT
fid      ABSENT
fbody    ABSENT
ftitle   ABSENT
fmeta    ABSENT
fact     ABSENT
gl       PRESENT
sep      PRESENT
```

**All absent, verified. There is no partial implementation.**

### `.rail` collision, flagged

`.rail` exists in the product but every rule is scoped, and one of them means something completely different:

```
$ grep -n "rail" /p/tmp/g75-dash/web/shell.css
261:.srcreg .rail { align-self: stretch; background: var(--sc-line); border-radius: var(--sc-r-full); }
262:.srcreg.ok .rail { background: var(--sc-ok); }
263:.srcreg.partial .rail { background: var(--sc-warn); }
264:.srcreg[data-disposition="Mounted"] .rail { background: var(--sc-restricted); }
265:.srcreg[data-disposition="Island"] .rail { background: var(--sc-warn); }
603:  grid-template-columns: minmax(0, 1fr) var(--sc-rail);
622:.colstack.rail > .region { flex: 1; min-height: 260px; }
624:.colstack.rail > .panel { flex: none; }
817:  .colstack, .colstack.rail { overflow: visible; min-height: 0; }
818:  .colstack.rail > .region { min-height: 320px; }
```

`.srcreg .rail` is a severity rail. `.colstack.rail` is a LAYOUT MODIFIER meaning "the 380px context rail column". Same token, two unrelated meanings, already shipped. Adding `.mxrow > .rail` makes three. No CSS conflict — every rule is scoped — but the kit's `stylesheetClasses()` counts bare tokens, so `rail` will not change the denominator, and a reader of the class inventory has no way to tell the two meanings apart. Recommend naming this in the WDLL as a known, accepted overload rather than discovering it mid-build.

## Spec CSS available to port, verbatim

`30b_smartcity_design_system.html` lines 251-253 and 316-328:

```css
.mxgroup{display:flex; align-items:center; gap:10px; padding:9px var(--sc-3); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line); flex-wrap:wrap}
.mxgroup .c{font:500 12px/16px var(--sc-font-data); color:var(--sc-ink)}
.mxgroup .lic{font:500 10px/1 var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); border:1px solid var(--sc-line); border-radius:3px; padding:3px 6px}

.mx{border:1px solid var(--sc-line); border-radius:var(--sc-r); overflow:hidden; background:var(--sc-surface)}
.mxrow{display:grid; grid-template-columns:3px 132px minmax(0,1fr) auto; align-items:center; gap:var(--sc-3);
  border-bottom:1px solid var(--sc-line-faint); padding-right:var(--sc-3); min-height:42px}
.mxrow:last-child{border-bottom:0}
.mxrow > .rail{align-self:stretch; background:transparent; min-height:42px}
.mxrow .sec{font:500 12px/1 var(--sc-font-data); color:var(--sc-ink-2); padding-left:var(--sc-3)}
.mxrow .txt{font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2); padding:8px 0}
.mx-pass .sec{color:var(--sc-ink-3)} .mx-pass .txt{color:var(--sc-ink-3)}
.mx-fail > .rail{background:var(--sc-crit)} .mx-fail{background:var(--sc-crit-wash)} .mx-fail .txt{color:var(--sc-ink)}
.mx-unc > .rail{background:var(--sc-warn)} .mx-unc{background:var(--sc-warn-wash)} .mx-unc .txt{color:var(--sc-ink)}
.mx-unchecked > .rail{background:var(--sc-line-strong)}
.mx-unchecked{background:repeating-linear-gradient(135deg, transparent 0 6px, var(--sc-quiet-wash) 6px 13px)}
.mx-unchecked .txt{color:var(--sc-ink)}
```

Every value is a token or a geometry constant. No new color, radius, or duration is declared. This satisfies 30b section 7.1: "Component classes may be extended only by composing existing ones, never by declaring a new color, radius, duration, or type step."

**One 12px-floor violation in this block**: `.mxgroup .lic` sets 10px. See section 4a.

---

# Family 2: the code citation, `cite`

## What it is, quoted

`30b_smartcity_design_system.md` section 3.1, verbatim:

> **Code citation, no body slot.** It has no slot for body copy. Licensed model-code text cannot leak into a screenshot, an export, or a PDF because the component that would carry it does not exist.
>
> Two render forms, and the form is chosen by the source, not by available space.
>
> *Licensed model code.* The chip renders the **full canonical title** and the section, composed inside one chip across two parts: corpus line ("2018 International Building Code") above identifier line ("Section 802.3"). An abbreviation alone is prohibited by the ICC Code Connect terms in `_smartcity_masters/33a_smartcity_plan_review.md`, so the compact form `IBC 802.3` does not exist in this system, at any density, including inside the applicability matrix. Section identifier and heading may display alongside our analysis; the full section body may not. The **2018 International Building Code** is the only licensed corpus this system renders.
>
> *Local ordinance.* A city's own adopted code is not subject to the constraint and is the safe demo material. The chip renders the local short form, for example "Template UDC Section 5.3.2", and may link to full quoted text.

This is the family with a legal constraint attached. The absence of a body slot is the enforcement mechanism, not a styling choice.

## Markup structure it implies

Verbatim from `30b_smartcity_design_system.html` lines 867-869:

```html
<a class="cite model" href="#s4"><span class="corpus">2018 International Building Code</span><span class="sect">Section 1004.5</span></a>
<a class="cite" href="#s4">Template UDC Section 5.3.2 <em>local</em></a>
<a class="cite" href="#s4">Template UDC Section 7.2.6 <em>local</em></a>
```

Contract: the element is an `<a>`. Two forms. Bare `.cite` is the local form — single line, free text, an `<em>` marker reading "local". `.cite.model` is the licensed form — column layout, `.corpus` over `.sect`. There is no third form and no children other than these.

## Exact class vocabulary and existence check

| Class | In product CSS? |
|---|---|
| `cite` | ABSENT |
| `model` (the `.cite.model` modifier) | ABSENT |
| `corpus` | ABSENT |
| `sect` | ABSENT |
| `cite em` | element selector, no class |

All absent, same grep as above (exit 1).

Note `.model` is not on 30b's product class list as a standalone token — the inventory writes it as `cite.model`. The kit's `stylesheetClasses()` regex `\.(-?[_a-zA-Z][\w-]*)` will extract `cite`, `model`, `corpus`, and `sect` as four separate tokens from the ported CSS. **The denominator grows by four for this family, not one.** An executor sizing the re-vendor leg needs that number.

## Spec CSS available to port, verbatim

`30b_smartcity_design_system.html` lines 236-243:

```css
.cite{display:inline-flex; align-items:baseline; gap:6px; padding:2px 7px; border-radius:var(--sc-r-control);
  border:1px solid var(--sc-line); background:var(--sc-surface-2); font:500 12px/16px var(--sc-font-data); color:var(--sc-ink); text-decoration:none; white-space:nowrap}
.cite em{font-style:normal; color:var(--sc-ink-3); font-weight:400; font-size:11px}
.cite:hover{border-color:var(--sc-accent); color:var(--sc-accent)}
.cite.model{flex-direction:column; align-items:flex-start; gap:1px; padding:3px 8px}
.cite.model .corpus{font:400 10px/13px var(--sc-font-data); color:var(--sc-ink-3); letter-spacing:.01em}
.cite.model .sect{font:500 12px/16px var(--sc-font-data); color:var(--sc-ink)}
.cite.model:hover .sect{color:var(--sc-accent)}
```

**Two 12px-floor violations in this block**: `.cite em` at 11px, `.cite.model .corpus` at 10px. See section 4a. The corpus line is the harder of the two, because it is the licensed canonical title — the one string the ICC terms require rendered in full — and 10px is where the spec put it precisely because the string is long, while `.cite` sets `white-space:nowrap`.

---

# Family 3: the atom chip, `atomchip`

## What it is, quoted

The dispatch calls this NOT load-bearing, and 30b agrees by placement — it is in the class inventory, not in the load-bearing five. `30b_smartcity_design_system.md` line 364, verbatim:

> `.atomchip` | The evidence chip. Compact, reserved-accent, carries a 10px mono record identifier. Marks openable recorded evidence and fetches on tap. Variants: `.dead` for an unservable record, `.web` for an unverified source that must never wear the reserved accent.

`30b_smartcity_design_system.md` section 1.2a, which is where the ruling actually lives and which IS law:

> `#4CC9C0` is the value SmartSite reserves for atoms. That reservation ports here unchanged as the dark-theme value, which is where it is used, and the reservation is on the **meaning**, not merely the hex: `--sc-atom` marks a thing you can open and read the record of. It is not chrome, not emphasis, not a link color, and not a second accent.
>
> **Light-theme value is law.** The light value is `#177F78` and the dark value is `#4CC9C0`. [...] `#4CC9C0` on white measures roughly 2.0:1 and fails contrast for anything that has to be read; `#177F78` is the contrast-legal sibling at roughly 5.2:1 and is the same hue family. This is settled, not an open question.
>
> **Collision rule is law.** `--sc-atom` dark `#4CC9C0` sits near `--sc-accent` dark `#4EAFC2`. They separate by **form**, not hue: the accent never appears as a chip, and the evidence chip always carries a compact label and a 10px mono record identifier. If that separation proves too fine in build, **move `--sc-accent` dark, never `--sc-atom`.** Do not invent a third teal.
>
> Rules. Numbers, emphasis, web links, and unverified sources never wear the atom accent. A web or unverified source is visually distinct and labeled unverified; it is never an atom chip.

`30c_smartcity_platform_ia.md` section 6.3, verbatim, which is the behavioral spec the dispatch's "6.3" pointer was reaching for:

> The atom render comes from SmartSite, retokened to this kit. Two surfaces: the **fact-row chip**, which opens one small popover under its row, one at a time, fetch on tap; and the **answer accordion**, where numbered citations become the same reserved chips and grow in place.
>
> Honesty rules restated on the components so they cannot be simplified away: never-bare confidence, so value and basis together or the number is omitted; asserted stays asserted and is never dressed as calibrated; forbidden, unknown and unservable all degrade identically to local BRIEF plus full record unavailable, and the word forbidden never leaks; no citable records in scope means no chips at all and plain prose; absent lineage links render nothing and relationships are never fabricated; a half-written citation is held during streaming and raw markup never flashes. Web and unverified sources are visually distinct, labeled unverified, and never wear the atom chip.

## Markup structure it implies

**Not in 30b.** 30b has zero atomchip markup (verified, grep exit 1). Every specimen is 30c HTML:

```html
<!-- 30c line 1825 -->
<button class="atomchip" id="cp-fact" aria-expanded="false">Record <span class="did">zoning &middot; 48021-34137</span></button>
<!-- 30c line 1871 -->
<button class="atomchip" data-card="z">1 <span class="did">zoning</span></button>
<!-- 30c line 1875 -->
<button class="atomchip dead" data-card="d">3 <span class="did">permit 1998-0442</span></button>
<!-- 30c line 1905 -->
<button class="atomchip" data-walk="parcel">Record <span class="did">parcel 48021-34137</span></button>
<!-- 30c line 1955 -->
<span class="atomchip web">Web &middot; unverified</span>, which is not a recorded source and carries no atom.
```

Contract, and it is sharper than 30b implies: the openable forms are `<button>` with `aria-expanded`. The `.web` form is a `<span>`, non-interactive, because it is not openable. `.did` is the 10px mono record identifier. The label before `.did` is either the word "Record" or a citation number.

## Exact class vocabulary and existence check

| Class | In product CSS? |
|---|---|
| `atomchip` | ABSENT |
| `did` | ABSENT |
| `dead` (as `.atomchip.dead`) | ABSENT |
| `web` (as `.atomchip.web`) | ABSENT |

All absent (same grep, exit 1). Tokens `--sc-atom` and `--sc-atom-wash` DO exist and are correct in all three theme blocks:

```
$ cd /p/tmp/g75-dash && for t in --sc-atom --sc-atom-wash ... ; do n=$(grep -o -- "$t:" web/sc-kit.css web/shell.css | wc -l); echo "$t -> $n defs"; done
--sc-atom -> 3 defs
--sc-atom-wash -> 3 defs
```

Three definitions = `:root, .sc-light`, the `prefers-color-scheme: dark` block, and `:root[data-theme="dark"], .sc-dark`. Light `#177F78`, dark `#4CC9C0`, matching the 1.2a law exactly. **The token half of this family already shipped and is correct. Only the component rules are missing.**

## Spec CSS available to port, verbatim

`30b_smartcity_design_system.html` lines 244-250:

```css
.atomchip{display:inline-flex;align-items:center;gap:5px;padding:2px 7px;border-radius:var(--sc-r-control);
  border:1px solid color-mix(in srgb, var(--sc-atom) 45%, transparent);background:var(--sc-atom-wash);
  font:500 10px/14px var(--sc-font-ui);color:var(--sc-atom);text-decoration:none;cursor:pointer;white-space:nowrap;vertical-align:2px}
.atomchip .did{font:400 10px/14px var(--sc-font-data);opacity:.75}
.atomchip:hover{border-color:var(--sc-atom)}
.atomchip.dead{color:var(--sc-quiet);background:var(--sc-quiet-wash);border-color:color-mix(in srgb, var(--sc-quiet) 40%, transparent);border-style:dashed}
.atomchip.web{color:var(--sc-ink-3);background:var(--sc-surface-2);border-color:var(--sc-line);border-radius:var(--sc-r-full)}
```

This is the ONE family whose 10px type is explicitly sanctioned by the type law. See section 4a.

---

# 4. The visual law the CSS must obey

## 4a. The 12px type floor, and the collision that is the single biggest finding here

The law, `30b_smartcity_design_system.md` section 1.3, verbatim:

> **Type law.** 12px is the floor and nothing renders below it, with one named exception: the **evidence chip label** may set at 10px, because the chip has to read as a citation mark rather than a button and SmartSite sets it near 9.5px. The exception is the chip label only. The body of BRIEF and FULL, and every other string in the system, stays at the 12px floor. Nothing else inherits this.

Anti-pattern A5, same doc:

> **A5. 9px type.** Refuse: 12px floor, enforced. If content will not fit at 12px, cut content; do not shrink type.

**The product enforces this. The spec's own stylesheet does not.**

The product is clean:

```
$ cd /p/tmp/g75-dash
$ grep -oE "font(-size)?: *[^;}]*" web/shell.css | grep -oE "\b[0-9]+px" | sort -n -u
12px
13px
14px
15px
16px
18px
19px
20px
22px
26px
30px
32px

$ grep -nE "font(-size)?: *[^;}]*\b(9|10|11)px" web/shell.css
exit=1  (1 = no match)
```

**Zero sub-12px type in 827 lines of shipping product CSS.** The floor is real and held.

The spec's `<style>` block is not. Sub-12px declarations inside the three target families plus their immediate neighbors:

| Rule | Size | Sanctioned by the named exception? |
|---|---|---|
| `.atomchip` | 10px | **YES** — this IS the evidence chip label |
| `.atomchip .did` | 10px | **YES** — the record identifier is part of the chip label |
| `.cite em` | 11px | **NO** |
| `.cite.model .corpus` | 10px | **NO** |
| `.mxgroup .lic` | 10px | **NO** |
| `.basisline` | 11px | **NO** (out of named scope, see G6) |
| `.prov` | 11px | **NO** — and the product already resolved this one |

**The precedent is already set and it is the strongest single input to this row.** The product took 30b's `.prov` and raised it:

```
30b_smartcity_design_system.html:230
  border:1px solid var(--sc-line); background:var(--sc-surface-2); font:400 11px/1 var(--sc-font-data); color:var(--sc-ink-3); white-space:nowrap}

/p/tmp/g75-dash/web/shell.css:153-165
.prov {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 20px;
  padding: 0 7px;
  border-radius: var(--sc-r-control);
  border: 1px solid var(--sc-line);
  background: var(--sc-surface-2);
  font: 400 13px/18px var(--sc-font-data);
  font-variant-numeric: tabular-nums;
  color: var(--sc-ink-3);
  white-space: nowrap;
}
```

11px in the spec, 13px shipped. The product deliberately departed from 30b's literal CSS to obey 30b's own type law, and added `tabular-nums` while it was there. An executor porting 30b verbatim would reintroduce A5 in three places and would be reversing a decision the product already made.

**This is guess-point G1 and it is not an executor decision.**

## 4b. Quiet-on-satisfied, loud-on-unresolved, and INVERTED APPLICABILITY

The ruling, `_decisions/2026-08-17_smartcity_visual_law.md`, verbatim:

> Applicability matrix inverts status because a plans examiner is paid for unresolved rows; green-for-pass would spend the loudest treatment on work that needs no one. Unchecked hatch is the plat convention for "nobody has been here yet," which is more dangerous than Fail.

Reversal criteria from the same record: "Reverse inverted matrix only if examiners reject quiet-pass in a staff sitting." Not open.

The ported CSS implements this correctly, and it should be verified rather than assumed:

- `.mx-pass` sets `.sec` and `.txt` to `--sc-ink-3` and declares **no background and no rail color**. `mxrow > .rail` stays `transparent` from the base rule. Pass is quiet by getting nothing.
- `.mx-fail` gets `--sc-crit` rail plus `--sc-crit-wash` background plus text promoted to `--sc-ink`.
- `.mx-unc` gets `--sc-warn` rail plus `--sc-warn-wash` background plus text promoted to `--sc-ink`.
- `.mx-unchecked` gets a `--sc-line-strong` rail and the hatch, text promoted to `--sc-ink`.

**Acceptance item worth writing literally**: `.mx-pass` must declare no `background` and no rail `background`. A hand adding a green wash to Pass is the exact failure the ruling forbids, and it is a one-line change no test currently catches.

The hatch, verbatim, is the plat convention:

```css
.mx-unchecked{background:repeating-linear-gradient(135deg, transparent 0 6px, var(--sc-quiet-wash) 6px 13px)}
```

Token-only (`--sc-quiet-wash`), 135deg, 6px stripe on a 13px period. The transparent band is 6px and the wash band 7px — deliberate asymmetry, not a typo, and identical in 30b and 30c.

The kit already encodes the quiet-default rule at the API level and this is the shape any new wrapper must match:

```
/p/tmp/g82v/test/law.test.mjs
test("law 3: an unqualified Pill is the quietest form", () => {
  assert.equal(render(React.createElement(kit.Pill, null, "Pass")), '<span class="pill p-quiet">Pass</span>');
});
```

A matrix-row wrapper with no state prop must render `mx-pass`, not a bare `mxrow`, or it will be the loudest-by-default shape the law forbids. That is a leg-2 acceptance item.

## 4c. Provenance chip rules

30b section 3.1, verbatim:

> **Provenance chip.** Anatomy: source name, separator, last-read time. States: current, and stale (warn border, warn text, warn wash). Every value originating outside the product carries one in its panel header. Staleness is a chip state, not a toast. [...] Companion is the basis line: confidence always carries its state (baseline, provenance-backed, or earned) plus source count, timestamp, and a link into reasoning. A bare confidence number with no basis is prohibited by the component's shape.

`.prov` ships. **`.prov.stale` does not:**

```
$ cd /p/tmp/g75-dash && grep -n "stale" web/shell.css
exit=1  (1 = no match)
```

30b line 234 has it:

```css
.prov.stale{border-color:color-mix(in srgb, var(--sc-warn) 45%, transparent); color:var(--sc-warn); background:var(--sc-warn-wash)}
.prov.stale b{color:var(--sc-warn)}
```

**This is a fourth missing piece the dispatch did not name.** The provenance chip is one of the five load-bearing components, it ships, and it ships WITHOUT the one state the spec calls out by name. A stale source currently renders identical to a current one. That is a live honesty defect on shipped surfaces, unlike the three named families which do not exist at all. Flagged for the operator; not folded into this row's scope unasked.

Bearing on the three families: the `.cite` and `.mxrow` blocks sit adjacent to `.prov` in the spec and share its idiom. Whatever ruling resolves the `.prov` 11px-to-13px precedent should resolve `.prov.stale` in the same pass.

## 4d. Light/dark token pairs — every token each family should consume

All confirmed present in `web/sc-kit.css` with 3 definitions each (light, `prefers-color-scheme` dark, `[data-theme="dark"]`) unless marked structural (1 definition, theme-independent).

**`mx*` consumes:**

| Token | Role | Light | Dark |
|---|---|---|---|
| `--sc-line` | `.mx` border, `.mxgroup` bottom border, `.lic` border | `#D2DAE1` | `#29343F` |
| `--sc-line-faint` | `.mxrow` bottom border | `#E4E9EE` | `#1D262F` |
| `--sc-line-strong` | `.mx-unchecked` rail | `#AEBAC5` | `#3B4854` |
| `--sc-surface` | `.mx` ground | `#FFFFFF` | `#12191F` |
| `--sc-surface-2` | `.mxgroup` ground | `#F6F8FA` | `#18212A` |
| `--sc-ink` | `.mxgroup .c`, promoted `.txt` | `#101820` | `#E6EDF3` |
| `--sc-ink-2` | resting `.sec` / `.txt` | `#46586A` | `#A2B2C0` |
| `--sc-ink-3` | `.lic`, `.mx-pass` text | `#6C7E8E` | `#7B8B99` |
| `--sc-crit` / `--sc-crit-wash` | `.mx-fail` | `#AF2A22` / `#FBE6E4` | `#EF7B72` / `rgba(239,123,114,.14)` |
| `--sc-warn` / `--sc-warn-wash` | `.mx-unc` | `#9A5B08` / `#FBEEDA` | `#DDA14C` / `rgba(221,161,76,.14)` |
| `--sc-quiet-wash` | `.mx-unchecked` hatch | `#E9EEF2` | `rgba(123,139,153,.14)` |
| `--sc-font-data` / `--sc-font-ui` | `.sec` / `.txt` | structural | structural |
| `--sc-r` / `--sc-3` | radius / gutter | structural | structural |

**`cite` consumes:** `--sc-line`, `--sc-surface-2`, `--sc-ink`, `--sc-ink-3`, `--sc-accent` (hover only: light `#0B6A7B`, dark `#4EAFC2`), `--sc-font-data`, `--sc-r-control`.

**`atomchip` consumes:** `--sc-atom` (light `#177F78`, dark `#4CC9C0`), `--sc-atom-wash` (light `#DFF2F0`, dark `rgba(76,201,192,.14)`), `--sc-quiet` + `--sc-quiet-wash` for `.dead`, `--sc-ink-3` + `--sc-surface-2` + `--sc-line` for `.web`, `--sc-font-ui` + `--sc-font-data`, `--sc-r-control`, `--sc-r-full`.

**Nothing in any of the three families needs a token that does not already ship. Zero new tokens.** That is the strongest single fact about the size of this work.

Note the `.web` variant is token-correct by construction: it drops `--sc-atom` entirely for `--sc-ink-3` / `--sc-surface-2` / `--sc-line` and swaps `--sc-r-control` for `--sc-r-full`, so an unverified source is a differently-SHAPED chip in neutral color. That satisfies "never wear the reserved accent" structurally rather than by convention.

---

# 5. Guess-points. Every one is an operator question, not an executor decision.

## G1. The 12px floor versus the spec's own 10px and 11px values — BLOCKING

Three declarations in the target families set type below the floor without the named exception covering them: `.cite em` 11px, `.cite.model .corpus` 10px, `.mxgroup .lic` 10px.

Facts that constrain the answer: the product has zero sub-12px type today; the type law names exactly one exception and it is the evidence chip label; the product already raised `.prov` from 11px to 13px when it shipped that component.

Three coherent resolutions, and they are genuinely different products:

1. **Port verbatim.** Fastest, reintroduces A5 in three places, contradicts the `.prov` precedent.
2. **Raise all three to 12px** and let the geometry absorb it. `.mxrow`'s 132px `.sec` column and `.cite.model`'s width both grow. The corpus line is the risk: "2018 International Building Code" at 12px mono is materially wider than at 10px and `.cite` sets `white-space:nowrap`.
3. **Extend the named exception** to cover licence and corpus badges, written into 30b section 1.3 as a second named exception with its reason, then port verbatim.

**Recommendation: option 3 for `.cite.model .corpus` and `.mxgroup .lic`, option 2 for `.cite em`.** Reasoning: the corpus line and the licence badge are both citation marks in exactly the sense the existing exception describes — they read as provenance stamps rather than as language, and the ICC terms force the corpus string to be long, so shrinking content is not available and A5's "cut content" remedy does not apply. `.cite em` is the word "local", which is language, reads as a sentence fragment, and has no length pressure at all; it goes to 12px. But the exception has to be WRITTEN into 30b before the CSS ships, or the next reader finds three unexplained floor violations and a doc that says there is one exception.

**This is the operator's call because it amends the type law.** An executor who resolves it silently either ships an anti-pattern or ships a geometry the design was not drawn for.

## G2. 30b versus 30c — five divergences, no stated precedence

Both docs carry a full copy of these rules and they are not identical. Normalized comparison of `30b_smartcity_design_system.html` lines 236-253 + 316-344 against `30c_smartcity_platform_ia.html` lines 170-175 + 219-246 + 338-344:

| Rule | 30b | 30c | Matters? |
|---|---|---|---|
| `.mxrow` `grid-template-columns` | `3px 132px minmax(0,1fr) auto` | `3px 108px minmax(0,1fr) auto` | **YES.** 24px of section-identifier column. "Section 1004.5" in 12px mono is near the 108px limit; at G1-option-2 sizing it would clip or wrap. |
| `.cite.model .corpus` | has `letter-spacing:.01em` | no letter-spacing | minor, but it is the licensed canonical title |
| `.cite.model:hover .sect` | present, `color:var(--sc-accent)` | **absent** (`grep -c "cite.model:hover" 30c…html` = 0) | **YES.** The licensed form loses its hover affordance in 30c. |
| `.atomchip.dead` | no cursor | adds `cursor:pointer` | Agree in effect (30b inherits `cursor:pointer` from the base rule), disagree in explicitness. 30c 6.3 requires a dead record to still be clickable, since unservable degrades to "local BRIEF plus full record unavailable". |
| `.atomchip.web` | no cursor | adds `cursor:default` | **YES, genuine conflict.** 30b inherits `cursor:pointer` from the base rule; 30c makes web non-interactive. 30c is right — the `.web` markup specimen is a `<span>`, not a `<button>`. |

Everything else in the three families is byte-equal modulo whitespace.

**Recommendation: 30c wins on `.mxrow` 108px, `.atomchip.dead`, and `.atomchip.web`; 30b wins on `.cite.model:hover .sect` and the corpus letter-spacing.** Reasoning: 30c is the later, layout-level document and its values were derived against real composed screens (its `.mxrow` sits inside a Plan Review region at line 1108, 30b's sits in a full-width doc plate), so its geometry is the tested one; and 30c's cursor rules match its own markup specimens, which 30b does not have. 30b wins where 30c merely dropped a declaration rather than changing one — a missing hover rule is an omission, not a decision.

**But this is a ruling, not a derivation.** Whichever way it goes, one of the two canonical docs is then wrong and needs amending, and that is planner work, not executor work.

**The deeper issue: the doc set has two copies of one stylesheet with no stated precedence.** 30b section 7.1 says the system ships as "one file, no build step, no package to version, no second source of truth". 30c carrying a duplicate copy of these rules already violates that. Recommend the WDLL name a single source of truth and record the violation.

## G3. `.mxgroup` — does it take `.grow` and `.t-caption`?

30b's specimen (line 930): `<div class="mxgroup"><span class="c">…</span><span class="lic">…</span></div>`.
30c's (line 1109): the same plus `<span class="grow" style="flex:1"></span><span class="t-caption">28 sections</span>`.

Both `.grow` and `.t-caption` already ship, so no CSS is at stake, but the markup contract differs and the section count is a real piece of product information. Note 30c uses an inline `style="flex:1"` on `.grow`, which the kit's gate 4 forbids in components (the `inline-style-prop` hatch), so if that spacer is wanted, `.grow` needs `flex:1` in CSS or the row needs a different layout. **Operator question: does the corpus header carry a section count?** If yes, a small `.mxgroup .grow{flex:1}` rule is in scope.

## G4. Interactive states nobody specified

Neither doc specifies, for any of the three families:

- **Focus.** The product ships a global `:focus-visible{outline:2px solid var(--sc-focus); outline-offset:2px; border-radius:3px}` at `web/shell.css:15-19`. `.cite` is an `<a>` and `.atomchip` is a `<button>`, so both inherit it. `.cite`'s radius is `--sc-r-control` (4px) and the focus ring forces 3px; `.atomchip.web` is `--sc-r-full`. Probably fine, definitely unverified. Recommend the WDLL require a visual check rather than a ruling.
- **`.mxrow` hover or selection.** The queue table has `.dt tbody tr:hover td` and `tr[aria-selected="true"]`. The matrix has neither. A reviewer scanning two hundred rows plausibly wants row hover. **Not specified. Do not invent it** — flag as a deferred question rather than have an executor add it.
- **`.atomchip[aria-expanded="true"]`.** 30c's specimen carries `aria-expanded="false"` (line 1825) and 6.3 says the chip "opens one small popover under its row, one at a time". There is no open-state rule anywhere. A chip that opens a popover with no visual open state is a real gap, and it is exactly the kind of thing a design agent fills in silently.
- **Disabled.** Not specified for any of the three. Probably correct — none has a disabled meaning — but say so rather than leave it open.

## G5. Where the rules go, and in what house style

The product's CSS is NOT a copy of 30b's. It is a hand-authored implementation on the same tokens: expanded formatting, sectioned with `/* ---------- pills, provenance ---------- */` comments, and it diverges from 30b deliberately in at least `.pill` padding (`0 8px` vs 30b's `0 8px 0 7px`), `.p-*` borders (30b sets a per-state `color-mix` border-color, the product does not), and `.prov` type. Porting 30b's minified multi-rule-per-line style into an 827-line file written in the opposite style is a review problem.

**Recommendation: reformat to house style on the way in, one rule per block, with a section comment naming the source and the G1/G2 rulings.** Say this in the WDLL explicitly, because "port the CSS" reads as "paste the CSS".

## G6. Not a guess-point, a scope question: three families or four?

The dispatch names three. The delta between 30b's declared product-class list and what actually ships is **45 classes**, computed with the kit's own counting rule:

```
$ node -e "…stylesheetClasses() over vendor/sc-kit.css + vendor/shell.css vs 30b section 3.9 product class list…"
SPEC declared product classes: 102
SHIPPED: 109

SPEC-DECLARED BUT NOT SHIPPED (45):
atomchip  avatar  basisline  btn-danger  btn-icon  chip  cite  cp-a  cp-card  cp-card-b
cp-card-f  cp-card-h  cp-claim  cp-composer  cp-honest  cp-kv  cp-pop  cp-u  cz-body
cz-card  cz-nav  cz-top  field  filterbar  finding  gridlines  hint  kbd  lensswitch
meter  mx  mx-fail  mx-pass  mx-unc  mx-unchecked  mxgroup  mxrow  p4bar  parcel  ph
phone  sc  seg  sheet  toast

SHIPPED BUT NOT SPEC-DECLARED (52):
actionbar  assets-tab  badge  badge-off  basis  citizen-lookup  cp-src-l  cz-scroll
demo  doc  ds-tab  fill  flush  gl  grow  has-value  id  is-max  is-presented  k  kv
lede  lens  menu-btn  mount-note  n  nm  ok  on  open  partial  rail  reg-group  roster
roster-list  roster-note  sep  solo  st-k  stage  stage-esc  stage-scrim  sub  subj  t
t-caption  t-data  t-label  titlerow  unbuilt  v  word
```

The "109 of 109 classes covered" claim is true, and it is a claim about the SHIPPED stylesheet, which is the right denominator for a wrapper. It is not a claim that the shipped stylesheet implements the design system. It implements roughly 57 of the 102 classes 30b declares, plus 52 classes 30b never declared.

The three named families are 12 of the 45. **The one directly adjacent to them is `finding` + `basisline` + `meter`** — the finding row is specified in the same 30b section 4.4 as the matrix, composes `.cite` and `.prov` inside itself, and section 3.3 calls it "the unit of a comment letter". Its CSS is equally complete in both specs (30b lines 330-344) and introduces no new tokens. Building the matrix and the citation for a Plan Review screen and then having no finding row is an odd stopping point: 30b 4.4's own plate pairs them, and the second plate (4.4b) is nothing but finding rows.

**Recommendation: extend G-88 leg 1 from three families to four — add `finding`/`basisline`/`meter` — and separately record `.prov.stale` as a defect on an already-shipped component.** The marginal cost is small (the CSS is written, it needs the same G1/G2 rulings, it introduces no new tokens) and it is the difference between "Plan Review can be drawn" and "Plan Review can be drawn except for the thing the product exists to produce". The remaining 33 classes stay out of scope and should be recorded, not built.

**This is the operator's call. It is not folded into the sizing below except where marked.**

---

# 6. Recommended build order and size

Sizes are rule counts and new class tokens, not time.

**Step 0 (planner, blocking, before any executor work): rule G1 and G2.** Both are amendments to canonical docs. Neither is derivable from the docs as they stand. An executor who starts before these are ruled will guess, and both guesses are the kind that get discovered in a design review three steps later.

**Step 1: `cite` first.** 7 rules, 4 new class tokens (`cite`, `model`, `corpus`, `sect`). Smallest, most constrained, carries the ICC legal requirement, and is consumed by both the matrix specimens and the finding row. Building it first means the matrix's own specimens render correctly the moment the matrix lands. Depends on G1 (two of its three floor violations are here) and G2 (two of the five divergences are here).

**Step 2: `mx*` second.** 14 rules, 11 new class tokens (`mx`, `mxgroup`, `c`, `lic`, `mxrow`, `sec`, `txt`, `mx-pass`, `mx-fail`, `mx-unc`, `mx-unchecked`). Largest of the three, most law attached, and its specimens contain `.cite`. Depends on G1 (`.lic`), G2 (the 132/108 column), G3 (the section count).

**Step 3: `atomchip` last.** 5 rules, 4 new class tokens (`atomchip`, `did`, `dead`, `web`). Genuinely independent of the other two, not load-bearing, tokens already ship, and its only open questions are G2 cursors and G4 open-state. Last because it is the one that can be cut if the row runs long without blocking a Plan Review screen.

**Step 3b, only if the operator accepts G6: `finding` / `basisline` / `meter`.** 12 rules, 10 new class tokens (`finding`, `crit`, `fid`, `fbody`, `ftitle`, `fmeta`, `fact`, `basisline`, `conf`, `meter`; the meter fill `f` makes 11 if `.f` is not already counted). Must come after `cite` and `prov` because it composes both.

**Totals.** Three named families: **26 rules, 19 new class tokens.** With G6: **38 rules, roughly 29 new class tokens.**

## The denominator claim, stated so leg 2 can hold it

A-070 leg 2 requires the kit to keep "109 of 109" true "against a BIGGER denominator, and STATE the new denominator". The kit counts distinct class-selector tokens across both vendored stylesheets with comments stripped (`test/_lib.mjs`, `stylesheetClasses()`), and `test/gate3-classes.test.mjs` hard-asserts `SHIPPED.size === 109`.

Predicted new denominators, subject to the G1/G2/G3 rulings not adding or removing selectors:

- three families: **109 + 19 = 128**
- with G6: **109 + 29 = 138**
- plus `.mxgroup .grow{flex:1}` if G3 says yes: no new token, `grow` already ships
- plus `.prov.stale`: **+1** (`stale`)

`rail` is already in the 109 and does not increment. The count is of TOKENS, not of components — `cite` alone contributes four. An executor sizing the wrapper work from "three families" will undercount by roughly a factor of four.

Whatever the number is, it must be computed from the merged stylesheet and pasted, not predicted from this document. Three assertions in `test/gate3-classes.test.mjs` change: the `SHIPPED.size` equality, the strays check, and the coverage check. Plus every new class needs a gallery entry whose `covers` list exactly equals what it renders — gate 3 asserts that equality directly.

---

# 7. What this investigation did not do

- **UNRUN: no build, no test run, no dev server.** Exit-bounded verification only. The kit's `npm test` was not executed and no claim here rests on it; the test files were read, not run. The predicted denominators are arithmetic on a class extraction run with `node -e`, not a test result.
- **UNRUN: no visual check of anything.** Every statement about how these families look is read from CSS text and spec prose. Focus-ring geometry (G4), the 108-vs-132 column at raised type (G1 x G2), and the hatch at real row density are all unverified by eye.
- Live Bastrop not touched. G-52 and G-24 not started. No repo state changed in either clone or in doc_repo beyond this file.

# 8. Gate asymmetry, reported as directed

The `CANON_OVERRIDE` in this dispatch records that the canon gate and the dispatch-template gate fired on one of four near-identical read-only investigator prompts, the one naming a repo in `owner/name` form, and that adding the sanctioned override made the brief dispatch-shaped and tripped the second gate the siblings never hit. A-070 records the same finding. Nothing in this investigation contradicts it. The mechanism as observed here: both gates key on dispatch SHAPE, not on whether the agent writes anything, so a read-only prompt phrased with a clone path (`P:\tmp\g75-dash`) passes and the same prompt phrased with a repo name does not. This report was produced under the override, read-only throughout, and the planner verifies.
