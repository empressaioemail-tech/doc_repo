---
id: 2026-08-19_g96_document_generation_investigation
title: G-96 document generation investigation
date: 2026-08-19
status: complete for the dispatched scope, with three rows named unrun
owner: lane G-96
plan_row: G-96
related: [90_operations/OPS-17_govtech_stack_plan_of_record.md, 2026-08-19_wave3_surfaces_and_vpat_WDLL, 2026-08-12_smartcity_accessibility_audit_PASS1]
purpose: Establish every document-emitting path in the sellable product line, measure what each one actually produces, identify the surface that produced the site-plan PDF the operator holds, recommend a generator, and state how each 504.2.2 property will be verified for the evidence pack. Read-only. No code, no PR.
---

# G-96 document generation investigation

## What changes in the brief

Three findings move the work.

**The SmartCity PDF export is not a raster.** The planner's reasoning was that html2canvas rasterises the DOM and jsPDF wraps the bitmap, so the output has no text layer and fails 1.1.1 and 1.4.5 as well as 504.2.2. That is wrong for this bundle. Every application-level PDF path draws vector text through jsPDF `.text()` and jspdf-autotable. html2canvas is present in the bundle as an optional dependency of the jsPDF `html()` plugin and has no call site: the token `.html(` occurs zero times in 5,578,225 bytes, and all six `addImage(` sites sit inside html2canvas, the jsPDF html plugin, and canvg. So 1.1.1 and 1.4.5 do not apply to these documents, and the export is not an image of text.

**504.2.2 still fails, and replacement is still the answer, for a different reason.** The literals `/StructTreeRoot` and `/MarkInfo` occur zero times in the entire bundle, and jsPDF's own `putCatalog` writes only `/Type /Catalog`, `/Pages`, `/OpenAction` and `/PageLayout`. jsPDF 4.2.1 has no tagged-PDF capability at all, so no configuration reaches a structure tree. `setLanguage` and `setDocumentProperties` exist in the library but are never called by the application, so there is no `/Lang` and no title either. The verdict survives; the rationale that gets written into the ACR must change, because a reviewer who opens one of these PDFs will find selectable text and will not believe a 1.1.1 finding.

**The three new product repos emit no documents at all.** Measured on the served bundles, not on the repos: `smartcity-dashboards`, `smart-files` and `plan-review` contain zero PDF generation. The Dashboards shell register already says so in its own words, row 71 of the Homes table, "Print / PDF export of a record", disposition "Not built". The document problem in this program is entirely inherited from two older surfaces.

## Per-path table

Every cell below is measured. The measurement is named in the last column. Where a cell is code-measured rather than artifact-measured it says so.

| Surface | Document | Client or server | Library | Text layer | /StructTreeRoot | /MarkInfo | /Lang | Title | Measured by |
|---|---|---|---|---|---|---|---|---|---|
| SmartCity (smartcityos.io) | 15 PDF paths, one library, one code family | client | jsPDF 4.2.1 + jspdf-autotable | yes, vector | no | no | no | no | bundle read: 7 `new vn(` plus 8 dynamic-import sites; shared helpers `Pu`, `Ur`, `Kh`, `wf`, `Fm` all call `.text()` or autoTable; `putCatalog` source read; 0 occurrences of `/StructTreeRoot` and `/MarkInfo`; `setLanguage` and `setDocumentProperties` each present once as a definition and never called |
| SmartCity Reports Center | 36 named reports, one generator | client | none | not a PDF | n/a | n/a | n/a | n/a | emits a `text/plain` Blob named `{id}-report.txt` |
| SmartCity | 5 CSV exports | client | none | not a PDF | n/a | n/a | n/a | n/a | five `new Blob([...], {type:"text/csv"})` sites with `a.download` |
| SmartCity report-detail modal | Export PDF, Export Excel, Print | client | none | nothing is produced | n/a | n/a | n/a | n/a | the handler fires a toast, waits 1500ms on `setTimeout`, then fires "Export Complete". No Blob, no save, no print dialog. The Print button likewise only toasts "Opening print dialog" |
| SmartCity brand page | Download PNG | client | none | not a document | n/a | n/a | n/a | n/a | `<a href={logo} download="smartcity-os-logo-dark.png">`, a static asset |
| SmartSite / Property Explorer | `pdf-site-plan`, 3 sheets | server, engine-api | pdf-lib plus @pdf-lib/fontkit | yes, but glyph-fragmented | no | no | no | no | pypdf on the operator's actual file `P:/tmp/VPAT/48021_34649_site_plan.pdf` |
| SmartSite / Property Explorer | `pdf-dossier` | server, engine-api | pdf-lib | code says vector text | no | no | no | no | code-measured only, see Unrun |
| SmartSite / Property Explorer | `pdf-flood-drainage` | server, engine-api | pdf-lib | code says vector text | no | no | no | no | code-measured only, see Unrun |
| SmartCity Dashboards | none | n/a | none | n/a | n/a | n/a | n/a | n/a | served `/app.js`, 44,233 bytes, zero hits for jsPDF, html2canvas, pdf-lib, window.print, application/pdf, .pdf, text/csv, download |
| Smart Files | none generated; stored blobs served through | server passthrough | none | inherits the uploaded file | inherits | inherits | inherits | inherits | served `/app.js`, 24,929 bytes, one `.pdf` hit and it is the file-kind classifier `n.endsWith(".pdf")` returning "Sheet"; `src/server.mjs` serves `getBlob` with `content-disposition: inline` |
| Plan Review | none | n/a | none | n/a | n/a | n/a | n/a | n/a | served `/app.js`, 33,987 bytes, zero hits for every token above |

Counting rule for the SmartCity row: a PDF path is one application-level `.save()` on a jsPDF document. There are 30 `.save(` occurrences in the bundle; 13 are canvas 2D context saves inside html2canvas and Leaflet, 2 are jsPDF library internals, and 15 are application PDF paths. Two of those 15 switch on a report kind internally, 4 department variants and 5 report kinds, so the document TYPE count is 22 under the rule "one type per distinct rendered layout" and 15 under the rule "one type per call site". Both numbers are given because remediation cost tracks the second and the ACR surface list tracks the first.

## Which surface produced the site-plan PDF

`hauska-engine`, rendered server-side, surfaced through SmartSite. The chain, each link measured.

The file's own metadata names the library: `/Producer` and `/Creator` are both `pdf-lib (https://github.com/Hopding/pdf-lib)`. `pdf-lib` occurs zero times in the SmartCity bundle, so it is not a SmartCity artifact.

The filename shape is generated by `hauska-map` at `apps/property-explorer/src/browse/SitePlanExportSection.tsx`, whose `filenameFor` returns `${parcelNodeId.replace(":", "_")}_site_plan.pdf`. Parcel node `48021:34649` yields exactly `48021_34649_site_plan.pdf`, the operator's filename.

The disclaimer in the same file, `HONESTY_LINE`, reads "Derived from public GIS records. Not a boundary survey. Not for legal record." That string appears verbatim in the extracted text of page 1.

The sheet id is `SP-48021-34649`, and `packages/engine-core/src/site-plan/pdf/render.ts:1152` builds it as `SP-${model.parcelNodeId.replace(/:/g, "-")}`.

The renderer is `packages/engine-core/src/site-plan/pdf/render.ts`, which imports `PDFDocument` from `pdf-lib` and `fontkit` from `@pdf-lib/fontkit`, and is exported as `emitPdfSitePlan`. It is served by `services/engine-api/src/routes/parcel-terrain.ts`, which registers `POST /:parcelNodeId/site-plan-export/refresh`, `GET /:parcelNodeId/site-plan-export` and `GET /:parcelNodeId/site-plan-export/download`, with `pdf-site-plan` mapped to `application/pdf`. The browser calls it through the BFF route `/api/pe-site-plan-export`.

The deployed SmartSite bundle confirms the surface is live and client-free: `https://smartsite.cloud/assets/index-r7cV3_O3.js`, 1,727,863 bytes, contains `pe-site-plan-export` 3 times, `_site_plan.pdf` once, "PDF site-plan sheet" once, "Not a boundary survey" once, and jsPDF, pdf-lib and html2canvas zero times each. All PDF generation for this surface is server-side.

**This matters for the ACR scope map.** The Dashboards shell mounts SmartSite as an iframe at `https://smartsite.cloud/?parcelNodeId=`, per `src/mounts.mjs`. So although Dashboards generates no documents, a Dashboards staff user reaches a pdf-lib site-plan PDF without leaving the product. A scope map that lists Dashboards as document-free is true about generation and false about what a user can obtain.

## The site-plan PDF's worse defect

Missing tags is the finding the brief expected. The measured file has a second defect that is larger and is not visible from the library name.

Tracked headings and labels are drawn glyph by glyph. `render.ts:373` says so in its own comment: "tracked runs are drawn glyph-by-glyph with an em-based advance." The consequence is that the content stream has no word units. Extracting text from the operator's file gives 416 lines, of which 268 are a single character, 64.4 percent. Counting rule: pypdf `extract_text()` output split on newline, counting lines whose stripped length equals 1. Page 1 is 57.8 percent, page 2 is 63.2 percent, page 3 is 69.1 percent. The document's own title extracts as S, M, A, R, T on five separate lines.

An untagged PDF's reading order is taken from content-stream order, so this is what assistive technology receives. Adding `/StructTreeRoot`, `/MarkInfo` and `/Lang` to this file would produce a document that passes an automated tag check and still reads out one letter at a time. **The reading-order fix is a renderer change, not a metadata change, and it is the expensive half of this path.**

A related but non-conformance symptom sits alongside it: each `drawText` call registers its own font resource, so page 1 carries 84 font resource entries that all resolve to 4 base fonts. That is a file-size problem, not an accessibility one, and it is noted only so it is not rediscovered as one.

## Generator recommendation

**Recommendation: headless Chromium print-to-PDF, from semantic HTML, run server-side. Do not fix jsPDF, do not extend pdf-lib.**

The reason is not a preference, it is a measurement, and the proof is already on the operator's machine. Four PDFs in `P:/tmp` were produced on 2026-08-13 and 2026-08-14 by `Skia/PDF m151` with creator `HeadlessChrome/151.0.0.0`. Every one of them carries the complete 504.2.2 property set with no special effort: `/MarkInfo` with `/Marked true`, `/StructTreeRoot`, `/Lang` of `en`, a real `/Title`, and `/ViewerPreferences` with `/DisplayDocTitle true`. Walking the structure tree of `Empressa_Positioning_Onepager.pdf` gives `/Document` 1, `/H1` 1, `/H2` 3, `/P` 4, `/NonStruct` 50, with `/StructParents` present on the page and 2,725 characters of clean extractable text.

That last histogram is the honest part of the recommendation and must travel with it. Chromium tags what the HTML says. Fifty `/NonStruct` nodes are fifty divs. **Tag quality is a direct function of HTML semantics**, which means this is not a generator swap that fixes conformance by itself; it is a generator swap that makes the G-94 and G-95 semantic work count twice. That is an argument for it rather than against it, but the ACR cannot claim a clean structure tree without also having clean headings, lists, tables and figure alternatives in the source HTML.

Neither alternative survives contact.

jsPDF cannot be configured into compliance. There is no structure-tree API in the library, so `/StructTreeRoot` is unreachable. `setLanguage` and `setDocumentProperties` would give `/Lang` and a title, which is two of the five properties, and the ACR would still read Does Not Support on 504.2.2. Spending on it buys a partial row.

pdf-lib is the same shape with one extra step of temptation. `doc.setTitle()` and `doc.setLanguage()` exist, so `/Lang` and a title are one line each in `render.ts`, `dossier.ts` and `flood-drainage.ts`. `/StructTreeRoot` is not offered and would have to be hand-built as raw PDF objects, in parallel with a renderer that draws glyph by glyph. The site-plan sheet is also a drawing, and a drawing's accessible form is a text alternative plus a structured summary, not a tag over vector strokes. Sheet 2, the summary sheet, is a table of parcel facts and is genuinely HTML-shaped; sheet 1 and sheet 3 are a plan and an aerial and want `/Figure` with `/Alt` plus the existing summary as the long description.

### Cost to these three repos specifically

This is the constraint that makes the recommendation non-obvious, so it is priced rather than waved at.

All three repos declare `"dependencies": {"pg": "^8.23.0"}` and nothing else, start with `node src/server.mjs` and no build step, and ship a `FROM node:22-alpine` Dockerfile that copies `src` and `web` and runs. Adding Puppeteer or Playwright to any of them means leaving alpine or running `apk add chromium`, an image roughly 300 to 400 MB larger, a Chromium sandbox decision on Cloud Run, and a cold start that now includes a browser launch. That is a real change to the deploy shape of three services that currently deploy in seconds.

Three ways to buy the same output at different prices.

**One shared render service, not three dependencies.** A single small service, or a route on an existing one, accepts HTML and returns a tagged PDF. The three product repos keep `pg` as their only dependency and gain one `fetch`. This is the recommendation. It also matches where the work belongs: the documents are product surfaces, the renderer is substrate.

**Client-side `window.print()` against a print stylesheet.** Zero new dependencies, zero image change, and Chromium and Edge produce the same tagged output measured above because it is the same code path. The costs are real: the user gets the browser print dialog rather than a download, filename control is limited, and tagging quality now depends on the viewer's browser, which an ACR cannot claim uniformly across Firefox and Safari. There are currently zero `@media print` rules across `sc-kit.css`, `shell.css` and `styles.css` in all three repos, so the print stylesheet is greenfield work in the kit, which is exactly the file G-94 has already opened. This is the cheapest path to a document that is tagged today and it is a legitimate answer for staff-facing register views. It is not a good answer for anything that must be generated unattended.

**Generate at write time, store in Smart Files.** Smart Files already stores and serves blobs with content addressing. If reports are generated by a job rather than a click, the render service writes the PDF into Smart Files and the product surfaces link to it. This removes the browser from every product image and gives the evidence pack a stable artifact to inspect, which the 504.2.2 verification below depends on.

For the SmartSite site-plan family the recommendation is narrower and does not follow the same path. The three sheets are drawings with a facts table, they are already server-side, and the renderer is 13,096 lines of deliberate cartography built to a binding sheet standard. Replacing it with HTML is not proportionate. The proportionate sequence is: add `setTitle` and `setLanguage` to all three emitters, which is three lines and removes two of the five failures; then fix the glyph-by-glyph tracked runs so words are words, which is the reading-order fix and is the one that matters; then decide whether sheet 2's summary is re-emitted as an HTML-derived tagged page bound alongside the drawing sheets. Tagging a drawing is the last question, not the first.

## Sizing

**Document types across the line.** Twenty-two rendered layouts across the original SmartCity under the layout rule, 15 under the call-site rule, plus 3 server-side pdf-lib types on SmartSite, plus 5 CSV exports and one plain-text report generator that are not PDFs and carry no 504.2.2 obligation. Zero on Dashboards, Smart Files and Plan Review.

**The SmartCity 15 are one fix at the library seam and 15 at the content seam.** They share one library, one header helper, one footer helper, one section-title helper, one metric-row helper and one table helper. Swapping the generator is a single change to those six helpers plus each call site's data shaping; nobody has to rewrite 15 documents from scratch. What does not share is the semantic content: a heading level, a table header association and a figure alternative have to be decided per document, and that is 22 decisions no shared helper can make.

**The SmartSite 3 are one fix.** `render.ts`, `dossier.ts` and `flood-drainage.ts` are three call sites of one pattern in one directory, they already share `format.ts`, `layout.ts`, `line-box.ts` and `template-tokens.ts`, and the tracked-text change lands in the tracked-run helper in `render.ts` once.

**The new three are zero fixes and one decision.** Nothing to remediate. The decision is whether Homes-table row 71, "Print / PDF export of a record", stays "Not built" through the ACR. If it ships during Wave 3 it must ship through the recommended generator, because a new untagged document path added during a conformance program is worse than an old one.

## How each 504.2.2 property will be verified

The evidence pack has to prove these, not claim them. Every check below is a one-shot command against a produced artifact, and each has already been run against a real file in the course of this investigation, so none is aspirational.

| Property | Verification | Pass condition | Already demonstrated on |
|---|---|---|---|
| `/StructTreeRoot` | pypdf: `reader.trailer["/Root"]` contains `/StructTreeRoot`, then walk `/K` and emit a tag histogram | key present AND the histogram contains at least one `/Document` and at least one `/P`, with the `/NonStruct` share reported next to it rather than hidden | `Empressa_Positioning_Onepager.pdf`: `/Document` 1, `/H1` 1, `/H2` 3, `/P` 4, `/NonStruct` 50 |
| `/MarkInfo` | `root["/MarkInfo"]` | present and `/Marked` is `True`. A `/MarkInfo` without `/Marked True` is a fail, not a partial | same file: `{'/Type': '/MarkInfo', '/Marked': True}` |
| `/Lang` | `root["/Lang"]` | non-empty and a valid BCP-47 tag | same file: `en` |
| Document title | `reader.metadata["/Title"]` AND `root["/ViewerPreferences"]["/DisplayDocTitle"]` | title non-empty and not the filename, and `DisplayDocTitle` is `True`. Both are required: a title the viewer never displays does not satisfy the criterion in practice | same file: title present, `/DisplayDocTitle: True` |
| Reading order | two checks, both needed. Mechanical: `extract_text()` split on newline, share of single-character lines. Structural: walk the structure tree in `/K` order and compare emitted order to visual order on a sampled page | single-character-line share under 2 percent, and structure order matches visual order | the failing case is measured: the site-plan PDF is 64.4 percent single-character lines, 268 of 416 |

Two instruments are named and not yet available. **veraPDF or PAC** is the external check a federal reviewer is most likely to run, and neither is installed on this machine; the pypdf checks above are necessary but they are the author's own instrument, and DEV_PROCESS 4.2 says nobody verifies themselves as the final word. Installing one of them before the evidence pack closes is cheap and worthwhile. **A screen-reader pass** on one produced PDF is the only check that catches a tag tree that is structurally valid and semantically wrong.

The gating rule for this evidence, stated so it cannot be quietly softened: **a property is verified against a produced artifact, never against the generator's source.** Everything in the table above except the unrun rows meets that bar today.

## Unrun, and why

**`pdf-dossier` and `pdf-flood-drainage` were not measured against an artifact.** No dossier or flood-drainage PDF exists on this machine, and producing one requires a POST to `engine-api`, which is running a generator. The dispatch forbids that and I did not do it. What I have instead is stronger than a library-name inference and weaker than a measurement: both emitters live in the same directory as the site-plan renderer, both call `PDFDocument.create()` from `pdf-lib`, and a grep across the entire `site-plan` tree returns zero calls to `.setTitle`, `.setLanguage`, `.setAuthor`, `.setSubject`, `.setKeywords`, `.setCreator` and `.setProducer`. So the three untagged properties are established by code and the reading-order property is not established at all for those two documents. What I would run: `POST /v1/property-nodes/48021:34649/dossier-export/refresh` and the flood-drainage equivalent against a non-production engine-api instance, then `GET .../download` and the five checks above. What I expect: the same result as the site plan on all four metadata properties, and a materially better reading-order number, because the dossier is a prose-and-table document rather than a drawing and is less likely to be dominated by tracked display type. That expectation is pre-registered so a different result is a finding either way.

**No SmartCity PDF was measured as an artifact.** The generator is client-side, so producing one requires driving the live SPA, and the live surface is the Bastrop island under an absolute no-touch. The SmartCity row is established from the served bundle: the writer's own `putCatalog` source, the absence of the two tag literals in 5,578,225 bytes, and the absence of any call to the two metadata setters. That is a positive determination about what the writer can emit, not an inspection of what it did emit. What I would run: open a department overview modal on a non-production build, click Download PDF Report, and run the same five checks. What I expect: text layer present, structure tree absent, no `/Lang`, no title, and a low single-character-line share, because jsPDF `.text()` writes whole strings.

**NVDA, veraPDF and PAC were not run.** None is installed. All three are named above as owed by the evidence pack rather than by this lane.

## Out of scope, stated rather than unmentioned

`legacy-design-tools` carries a second pdf-lib family at `lib/plan-review-pdf/` and `artifacts/api-server/src/lib/pdfPageRenderer.ts`, `letterRender.ts`, `assembleDeliverable.ts` and `annotationPipeline.ts`. It was not investigated. The basis: the Plan Review the Dashboards shell mounts is the new `plan-review` repo, established by GET on `https://plan-review-app-ten.vercel.app/` returning a `Plan Review` title served with `/sc-kit.css` and `/app.js`, which is the new repo's shape and not an LDT app. No dispatched surface serves the LDT PDF family. If AEC-cortex or the older plan-review deliverable path enters the ACR scope, that family is unexamined and should be dispatched as its own row.

`atx-bulls` also carries a pdf-lib waiver renderer. It is not in the sellable govtech line and was not examined.

Asset Management remains without a repository, as A-080 already records. Nothing in this investigation changes that.

## Verbatim verification artifacts

Raw command output for the load-bearing claims, per the repo convention.

Bundle identity and library token counts, counting rule `grep -oF` case-sensitive over the whole file:

```
$ curl -sS https://smartcityos.io/ | grep -oE '<script[^>]*src="[^"]*"'
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17916263633"
<script type="module" crossorigin src="/assets/index-kGj7uMs4.js"

$ ls -la /p/tmp/bastrop_bundle.js
-rw-r--r-- 1 cente 197609 5578225 Aug 19 09:36 /p/tmp/bastrop_bundle.js

jsPDF              143
jspdf              5
html2canvas        23
autoTable          10
jspdf-autotable    0
pdf-lib            0
```

Tagging capability of the bundled writer, and the absence of any raster call site:

```
'StructTreeRoot': 0
'MarkInfo': 0
'setLanguage': 1
'/Lang': 1
'setDocumentProperties': 2
'html2pdf': 2
'.html(': 0
'API.html': 0
'addImage(': 6
'canvas.toDataURL': 1

vn.version = 4.2.1
```

jsPDF `putCatalog`, read from the bundle at offset 1251551:

```
_s=p.__private__.putCatalog=function(ee){var ve=(ee=ee||{}).rootDictionaryObjId||qr;
switch(qs(),ne("<<"),ne("/Type /Catalog"),ne("/Pages "+ve+" 0 R"),He||(He="fullwidth"),He){
case"fullwidth":ne("/OpenAction [3 0 R /FitH null]");break; ... }
switch(we||(we="continuous"),we){case"continuous":ne("/PageLayout /OneColumn");break; ... }
ps&&ne("/PageMode /"+ps),rn.publish("putCatalog"),ne(">>"),ne("endobj")}
```

The application PDF drawing helpers, read from the bundle at offset 1592607 and after, showing vector text and autoTable rather than an image:

```
function Pu(s,t,n){ ... s.setFontSize(16),s.setTextColor(...i2),s.text(`SmartCity OS - ${t}`,a,20), ... }
function Ur(s,t,n,r){ ... s.setFont("helvetica","bold"), ... s.text(t,a,n), ... }
function Vc(s,t,n){return t(s,{startY:n.startY,head:n.head,body:n.body,theme:"grid", ... })}
function Fm(s,t){ ... s.text("SmartCity OS Dashboard",n,l),s.text(`Page ${a} of ${r}`, ... ) }
function Kh(s,t,n,r){ ... rh(s,{startY:r,head:[t],body:n, ... theme:"grid"}) ... }
async function UYe(s,t,n){const r=new vn({orientation:"portrait",unit:"mm",format:"a4"});
switch(s){case"finance":RYe(r,n);break;case"development":OYe(r,n);break;
case"emergency":FYe(r,n);break;case"operations":$Ye(r,n);break}Fm(r);
const a=`${t.replace(/\s+/g,"_")}_Report_${new Date().toISOString().split("T")[0]}.pdf`;r.save(a)}
```

The simulated export, read from the bundle at offset 1677480:

```
const o=u=>{r({title:`Exporting Report #${n.reportNumber}`,description:`Generating ${u.toUpperCase()} file for ${n.name}...`}),
setTimeout(()=>{r({title:"Export Complete",description:`${n.name}.${u} has been downloaded.`})},1500)},
c=()=>{r({title:"Preparing Print View",description:"Opening print dialog..."})}
```

The site-plan PDF, measured:

```
$ python P:/tmp/VPAT/_inspect_pdf.py
pages: 3
encrypted: False
metadata: {'/Producer': 'pdf-lib (https://github.com/Hopding/pdf-lib)', '/ModDate': 'D:20260819133043Z',
           '/Creator': 'pdf-lib (https://github.com/Hopding/pdf-lib)', '/CreationDate': 'D:20260819133043Z'}
Root keys: ['/Type', '/Pages']
has /StructTreeRoot: False
has /MarkInfo: False
has /Lang: False
has /Outlines: False
has /Metadata: False
--- page 1 ---
text_len: 717
text_preview: 'S\nM\nA\nR\nT\n \nS\nI\nT\nE\n ... 707 JEFFERSON ST\nBASTROP, TX 78602 ... '
```

```
page 1: lines=83  single-char-lines=48  (57.8%)
page 2: lines=171 single-char-lines=108 (63.2%)
page 3: lines=162 single-char-lines=112 (69.1%)
TOTAL: lines=416 single-char=268 (64.4%)
counting rule: pypdf extract_text() newline-split lines whose stripped length == 1
```

The in-house Chromium proof:

```
-- Empressa_Positioning_Onepager.pdf
 producer: Skia/PDF m151 | creator: HeadlessChrome/151.0.0.0 | title: Empressa - We Build Digital Economies
 rootkeys: ['/Type', '/Pages', '/MarkInfo', '/StructTreeRoot', '/ViewerPreferences', '/Lang']
Lang: en
MarkInfo: {'/Type': '/MarkInfo', '/Marked': True}
tag histogram: {'/NonStruct': 50, '/P': 4, '/H2': 3, '/Document': 1, '/H1': 1}
page0 StructParents: 0   text len page0: 2725
ViewerPreferences: {'/Type': '/ViewerPreferences', '/DisplayDocTitle': True}
```

The served product bundles, measured rather than read from the repos:

```
== https://plan-review-app-ten.vercel.app/app.js   http=200 bytes=33987
  jsPDF 0 | html2canvas 0 | pdf-lib 0 | window.print 0 | application/pdf 0 | .pdf 0 | text/csv 0 | download 0
== https://smart-files-app.vercel.app/app.js       http=200 bytes=24929
  jsPDF 0 | html2canvas 0 | pdf-lib 0 | window.print 0 | application/pdf 0 | .pdf 1 | text/csv 0 | download 0
== https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app/app.js  http=200 bytes=44233
  jsPDF 0 | html2canvas 0 | pdf-lib 0 | window.print 0 | application/pdf 0 | .pdf 0 | text/csv 0 | download 0
```

```
$ curl -sS https://smartsite.cloud/assets/index-r7cV3_O3.js   http=200 bytes=1727863
PDF site-plan sheet      1
pe-site-plan-export      3
_site_plan.pdf           1
Not a boundary survey    1
flood-drainage           7
dossier                  50
jsPDF                    0
pdf-lib                  0
html2canvas              0
```

The Dashboards register row that already declares the gap:

```
src/shell-homes.mjs:145:  { table: "layout-inventory", job: "Print / PDF export of a record",
   home: "Action on the record surface that owns the record", disposition: "Not built" },
```
