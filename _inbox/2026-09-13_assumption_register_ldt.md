---
title: Assumption register, legacy-design-tools ingest and bake write paths
lane: PREBAKE-LDT
plan_row: P-181
status: active
created: 2026-09-13
last_updated: 2026-09-13
---

# Assumption register: legacy-design-tools ingest and bake

## Snapshot

    repo:             legacy-design-tools
    ref read:         origin/main
    sha:              31d181c2f9ee1d2fe998eea86a1db1d43dfca230
                      (merge of PR #674, 2026-09-13 14:11:07 -0500)
    matches dispatch: yes (dispatch said 31d181c2)
    local checkout:   10069854f5aa840cc94e6eadbd625c61d3e48010 (STALE, never read)
    method:           `git show origin/main:<path>` only. No network, no database,
                      no checkout, no branch, no commit.
    doc_repo:         P:/doc_repo at 9eef6a6c4a5c5c7e6baa363800257482b9a8a70d

Files opened in full or in the cited sections:

    lib/cad-ingest/src/txgio/shapefile-discover.ts   (all 100 lines)
    lib/cad-ingest/src/txgio/parse.ts                (all 625 lines)
    lib/cad-ingest/src/txgio/geo.ts                  (all 304 lines)
    lib/cad-ingest/src/txgio/reproject.ts            (all 172 lines)
    lib/cad-ingest/src/txgio/cli.ts                  (140-210, 310-520)
    lib/cad-ingest/src/txgio/ingest.ts               (1-120)
    lib/cad-ingest/src/txgio/landuse.ts              (all 208 lines)
    lib/cad-ingest/src/txgio/landuse-cli.ts          (236-305, plus a targeted grep)
    lib/cad-ingest/src/txgio/zoning-stamp.ts         (all 233 lines)
    lib/cad-ingest/src/txgio/zoning-layers.ts        (1-90, 355-420, 515-615)
    lib/cad-ingest/src/txgio/zoning-service.ts       (185-267, plus a targeted grep)
    lib/cad-ingest/src/txgio/counties.ts             (104-120)
    lib/cad-ingest/src/zip.ts                        (all 130 lines)
    lib/cad-ingest/src/download.ts                   (all 123 lines)
    lib/cad-ingest/src/normalize.ts                  (all 105 lines)
    lib/cad-ingest/src/p78Merge.ts                   (all 211 lines)
    lib/cad-ingest/src/vintage.ts                    (all 192 lines)
    lib/cad-ingest/src/ingest.ts                     (all 143 lines)
    lib/cad-ingest/src/types.ts                      (1-120)
    lib/cad-ingest/src/csv.ts                        (all 116 lines)
    lib/cad-ingest/src/sources.ts                    (30-130, plus a targeted grep)
    lib/cad-ingest/src/pacs/layout.ts                (all 121 lines)
    lib/cad-ingest/src/pacs/parser.ts                (all 346 lines)
    lib/cad-ingest/src/orion/parser.ts               (1-110)
    lib/cad-ingest/src/vendors/tad-propertydata/parser.ts   (1-70, plus a grep)
    lib/cad-ingest/src/vendors/dcad-certified/parser.ts     (1-60)
    artifacts/api-server/src/lib/nodeFacetBakeTier1.ts      (all 123 lines)
    artifacts/api-server/src/lib/nodeFacetTier1Assemble.ts  (280-300, 340-352, 390-425)
    artifacts/api-server/src/lib/nodeFacetTier1ParcelJoin.ts (1-140)
    artifacts/api-server/src/lib/verdictLayerServe.ts       (70-120)
    artifacts/api-server/src/nodeFacetBakeTier1Cli.ts       (line 501, via grep)
    P:/doc_repo/_catalog/tx_cad_source_registry.json        (read via node)

Rows are ordered by failure mode: silent-wrong-value and silent-truncation first, then
silent-skip, then guards that cannot fire, then the already-safe fail-closed rows. The
four assumptions the planner pre-verified (multi-shapefile discovery,
`assertTexasWgs84Bbox`, `isNullPlaceholderFeature`, `assertDeclineCeiling`) are
unchanged at this SHA and appear at the bottom as LDT-32 through LDT-35.

---

## SILENT-WRONG-VALUE and SILENT-TRUNCATION

### ID: LDT-01
BELIEF: A parcel that fails the centroid point-in-polygon test can have its zoning
district recovered from its boundary vertices, and the first zoning polygon any vertex
lands in is that parcel's district.

WHERE: `lib/cad-ingest/src/txgio/zoning-stamp.ts:218-231` in `stampParcelZoning`

    // Centroid missed - sweep ring vertices (partial-geometry / flag-lot class:
    for (const coord of ring) { ...
      const hit = zoningCodeAtPoint(index, coord[0]!, coord[1]!);
      if (hit) return hit; }

FAILURE MODE: silent-wrong-value

GUARDED: none. The module header at lines 20 to 24 describes a "first-vertex fallback"
and promises "never a guessed district"; the code sweeps every distinct vertex of the
largest ring in ring order and returns the first hit. Zoning district boundaries in
Texas cities overwhelmingly follow parcel lines and street centrelines, so a parcel on
a district boundary has vertices inside the NEIGHBOURING district. Nothing records that
a stamp came from a vertex rather than from the centroid, so the stored
`txgio_parcel.zoning_district` is indistinguishable from a centroid match, and the
buildable-envelope route maps it straight onto a setback table.

KNOWN VIOLATORS: none measured. Structurally this fires on every boundary parcel whose
centroid missed, which is the flag-lot and partial-geometry class the comment itself
names as the motivating case.

PRE-BAKE DETECTABLE: yes. Fetch the city layer once, and for each sampled parcel count
the DISTINCT codes across its ring vertices. Any parcel with more than one distinct
vertex code is a parcel this path will stamp arbitrarily. The sharper form, per parcel:
`<layerUrl>/query?geometry=<lng>,<lat>&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=<codeField>&f=json`
run once on the centroid and once per vertex; a centroid with zero hits and vertices
with two or more distinct codes is the exposure. The count of such parcels is the
pre-bake number.

CONFIDENCE: read-at-source

### ID: LDT-02
BELIEF: ArcGIS `resultOffset` paging with no `orderByFields` returns each feature
exactly once, and a page shorter than requested with no `exceededTransferLimit` means
the layer is exhausted.

WHERE: `lib/cad-ingest/src/txgio/zoning-service.ts:231-264` in `fetchZoningFeatures`

    `&resultOffset=${offset}&resultRecordCount=${want}` +
    `&returnGeometry=true&outSR=4326&f=json`;
    ...
    const morePages = page.exceededTransferLimit === true || feats.length >= want;
    if (!morePages) return out;

FAILURE MODE: silent-truncation

GUARDED: partial. `resolveZoningPageSize` (lines 194 to 210) caps the page size at the
layer's `maxRecordCount`, and the adaptive shrink at 259 to 261 handles one known host
quirk. Neither addresses ordering. There is no `orderByFields` in the query, so result
stability rests entirely on each service's undocumented default order, and there is NO
cross-check of the fetched total against the layer's own count. A short page from a rate
limiter, a transient partial failure, or an unstable order ends the fetch early; the
zoning index is then short, every parcel the missing polygons would have covered stamps
NULL, and that NULL reads downstream as "unzoned" rather than as "we did not fetch it".
Same function, second defect: `resolveZoningPageSize` swallows a metadata fetch failure
in a bare `catch {}` at 206 to 208 and falls back to the default page size, which is the
exact condition the function exists to prevent, and the degradation is not declared in
the run output.

KNOWN VIOLATORS: none measured. The comment block at 249 to 256 records that Austin, San
Antonio and Killeen have each already broken a DIFFERENT paging assumption on this same
code, which is evidence the remaining assumption is load bearing rather than theoretical.

PRE-BAKE DETECTABLE: yes, and this is the cheapest high-value probe in the register.
Request `<layerUrl>/query?where=<layerWhere or 1=1>&returnCountOnly=true&f=json` and
compare `count` against the length `fetchZoningFeatures` returns. Equality is the whole
check. Then add `&orderByFields=<the layer's OID field from <layerUrl>?f=json>` and
re-fetch; a different result set proves the ordering assumption false for that host.

CONFIDENCE: read-at-source

### ID: LDT-03
BELIEF: Every PACS "Appraisal Export Layout 8.0.x" drop a Texas CAD publishes places
each field at the byte offsets taken from the 8.0.26 and 8.0.33 workbooks, because later
layout versions only APPEND fields.

WHERE: `lib/cad-ingest/src/pacs/layout.ts:13-21` (the claim) and `:29-64` (the offsets),
enforced only by `lib/cad-ingest/src/pacs/parser.ts:219-225`

    if (line.length < APPRAISAL_INFO_MIN_LEN) { recordSkip(...); return null; }

FAILURE MODE: silent-wrong-value

GUARDED: partial, and the guard is presence-shaped. `APPRAISAL_INFO_MIN_LEN = 5408`
(layout.ts:105) asserts only that a record is LONG ENOUGH to reach the deepest field
read. It cannot separate layout 8.0.20 from 8.0.33; both clear 5408 comfortably, since
8.0.26 records are 9067 characters. No layout version is read from the file, no county
declares its layout version anywhere in `sources.ts`, and there is no record-length
equality check. `propId` at [1,12] and `propValYr` at [18,22] sit at the front of the
record and survive most shifts, so a wrong-layout county still keys its rows correctly
while carrying values cut from the wrong columns.

KNOWN VIOLATORS: none known. Offsets were cross-checked against exactly two workbooks
(Caldwell 8.0.26, Travis 8.0.33) and verified against real Caldwell 2026 data. PACS is
the dominant Texas CAD system, so the population this generalises to is large and almost
entirely unsampled.

PRE-BAKE DETECTABLE: yes, with two independent derivations, which is what makes it
meaning-shaped rather than presence-shaped. (1) The CAD publishes its layout workbook
next to the drop; read the version from the filename or the document and refuse any
version outside the cross-checked band. (2) Without the workbook, take the modal record
length of the drop's APPRAISAL_INFO file and compare against the known lengths per
version (9067 for 8.0.26, 9922 for 8.0.33, 9659 for Caldwell's live 8.0.0.33 export); a
length matching no known version is the refusal. Then corroborate at DEPTH, since the
front-of-record fields pass under a shift: cut `assessedVal` [1946,1960] and assert
every value parses as a numeric with no alphabetic characters. A shifted layout puts
text into a numeric span.

CONFIDENCE: read-at-source

### ID: LDT-04
BELIEF: Character position 5342 of a PACS APPRAISAL_INFO record is the ECO exemption
flag and 5408 is CHODO, in every county's export.

WHERE: `lib/cad-ingest/src/pacs/parser.ts:237-239`, with the positions at
`lib/cad-ingest/src/pacs/layout.ts:71-97`

    const exemptions = EXEMPTION_FLAGS.filter(
      (f) => line.charAt(f.pos - 1).toUpperCase() === "T",
    ).map((f) => f.code);

FAILURE MODE: silent-wrong-value

GUARDED: none. This is a sub-case of LDT-03 with its own signature, and it is worse than
the others because the test is a SINGLE CHARACTER equal to "T". On any layout where 5342
is not the ECO flag, any field holding a T at that byte, a status code, a text field
beginning with T, a "TRUE" string, fabricates an exemption on the row. The layout.ts
comment at 68 to 69 calls ECO and CHODO "the two later-appended flags", which by its own
logic means an older export has a different field there. `line.charAt()` past the end of
the string returns "" and never throws, so nothing is loud. Exemption codes drive
homestead and disabled-veteran reasoning downstream.

KNOWN VIOLATORS: none known.

PRE-BAKE DETECTABLE: yes. Over a sample of the county's own drop, tabulate the distinct
characters appearing at each of the 25 flag positions. A genuine T/F flag column has an
observed domain of exactly {T, F} plus blank. A position whose observed domain contains
anything else is not a flag column in that export, and every code derived from it is
fabricated. Refuse the county, not the row.

CONFIDENCE: read-at-source

### ID: LDT-05
BELIEF: A PACS acreage field with no explicit decimal point carries four implied
decimals.

WHERE: `lib/cad-ingest/src/normalize.ts:53-61` in `impliedAcresOrNull`

    const n = t.includes(".") ? Number(t) : Number(t) / 10_000;
    if (!Number.isFinite(n)) return null;
    if (n === 0) return null;
    return n.toFixed(4);

FAILURE MODE: silent-wrong-value

GUARDED: none. There is no plausibility band on the RESULT. A county writing an integer
acreage, "5" meaning five acres, stores 0.0005 acres. A county on a different implied
scale is off by a power of ten. The sibling `explicitAcresOrNull` at `:64-70` applies the
opposite rule for a different vendor's field, so the repo carries two acreage conventions
with no cross-check between them and no shared sanity band.

KNOWN VIOLATORS: none known. The four-implied-decimals rule is asserted from Caldwell.

PRE-BAKE DETECTABLE: yes, and independently derivable, which makes it strong. Cut
[2772,2791] over the county's own APPRAISAL_INFO sample, apply the rule, and compare the
resulting acreage against the SAME parcels' `LEGAL_AREA` or `GIS_AREA` from that
county's StratMap DBF, joined on `Prop_ID`. Two publishers, two derivations; a
systematic factor of 10,000 between them is the defect. Where no StratMap file exists,
the weaker single-source check: the median parcel in any Texas county falls roughly
between 0.05 and 50 acres, so a county whose median implied acreage is below 0.001 has
the wrong scale.

CONFIDENCE: read-at-source

### ID: LDT-06
BELIEF: Every TxGIO/StratMap county DBF is UTF-8.

WHERE: `lib/cad-ingest/src/txgio/cli.ts:167-168` and
`lib/cad-ingest/src/txgio/parse.ts:59-60`

    // The TxGIO shapefiles ship a UTF-8 .cpg; pass the encoding through.
    const source = await shapefile.open(shpFile, dbfFile, { encoding: "utf8" });

    export const TXGIO_ENTRY_FILTER = (name: string): boolean =>
      /\.(shp|dbf|prj)$/i.test(name);

FAILURE MODE: silent-wrong-value

GUARDED: none, and the guard the comment implies does not exist. The comment says the
`.cpg` is passed through. It is not. `TXGIO_ENTRY_FILTER` extracts only `.shp`, `.dbf`
and `.prj`, so the `.cpg` sidecar is never written to the work directory and could not
be honoured by any library even if one wanted to; the encoding is a hardcoded literal. A
county whose DBF is CP1252 or ISO-8859-1, the ESRI default for older exports, decodes
non-ASCII bytes as replacement characters or mojibake in `OWNER_NAME`, `SITUS_ADDR`,
`SITUS_CITY` and `LEGAL_DESC`. Texas parcel data is dense with Spanish surnames and
street names, so the affected row count inside an affected county is not small. Nothing
counts replacement characters.

KNOWN VIOLATORS: none known. The UTF-8 claim was verified against Hays and Comal only
(the DBF header note at parse.ts:6-8).

PRE-BAKE DETECTABLE: yes. Read the `.cpg` entry out of the county's StratMap zip before
extraction; it names the code page in one line. Where no `.cpg` exists, scan the `.dbf`
for bytes in 0x80 to 0xFF and test whether the sequences are valid UTF-8. A file holding
high bytes that are not valid UTF-8 is single-byte encoded and this ingest will corrupt
it.

CONFIDENCE: read-at-source

### ID: LDT-07
BELIEF: Every StratMap county DBF spells its attribute fields exactly `Prop_ID`,
`GEO_ID`, `OWNER_NAME`, `SITUS_ADDR`, `SITUS_CITY`, `SITUS_STAT`, `SITUS_ZIP`,
`STAT_LAND_`, `TAX_YEAR`, `GIS_AREA`, `GIS_AREA_U`, `LEGAL_DESC`, `MAIL_ADDR`.

WHERE: `lib/cad-ingest/src/txgio/parse.ts:459-460` and `:614-620`, and the same keys at
`lib/cad-ingest/src/txgio/landuse.ts:139` and `:171-194`

    const propId = (str(p.Prop_ID) ?? "").trim();
    const geoId = (str(p.GEO_ID) ?? "").trim();

FAILURE MODE: silent-wrong-value on the geometry path, silent-skip on the attribute path

GUARDED: none. Property access is exact-case. `Prop_ID` is the only mixed-case name in
the set, and DBF header case is at the exporter's discretion, with many ESRI tools
upper-casing every field name. Under a `PROP_ID` header, `p.Prop_ID` is `undefined`,
`str()` returns null, and two things follow. On the geometry path
`isNullPlaceholderFeature` returns true for EVERY feature, which widens the
out-of-envelope decline exception to the whole county, and every loaded `txgio_parcel`
row carries `prop_id` null, which silently destroys the point-to-prop_id join the store
exists to serve. Nothing counts null `prop_id`. On the attribute path
`normalizeStratMapLandUse` skips every row for "no Prop_ID", which LDT-20 shows is not
ceilinged.

KNOWN VIOLATORS: none known. Headers were verified against Hays, Comal and Bexar.

PRE-BAKE DETECTABLE: yes, trivially, before a single row is written. Read the DBF header
block, the field descriptor array of 32 bytes per field starting at byte 32, and assert
the exact-case presence of each of the thirteen names above. Any missing name is a
refusal, not a null. The probe costs one read of the first few hundred bytes of the
`.dbf` and would close the whole class.

CONFIDENCE: read-at-source for the code; inferred for the violator, since no county
header outside the three sampled was read here (no network in this lane).

### ID: LDT-08
BELIEF: When two loads write the same `(county_fips, prop_id, tax_year)` row, the later
writer is the better authority for every attribute except `year_built` and
`living_area_sqft`.

WHERE: `lib/cad-ingest/src/ingest.ts:89-126` in `upsertCadProperties`

    ownerName: sql`COALESCE(excluded.owner_name, ${cadProperty.ownerName})`,
    landValue: sql`COALESCE(excluded.land_value, ${cadProperty.landValue})`,
    marketValue: sql`COALESCE(excluded.market_value, ${cadProperty.marketValue})`,
    yearBuilt: sql`CASE ... WHEN excluded.source_vintage LIKE 'tier:cad-export;%' ...`
    sourceVintage: sql`excluded.source_vintage`,

FAILURE MODE: silent-wrong-value

GUARDED: partial, and the guard covers two of fourteen fields. `COALESCE(excluded,
existing)` is last-writer-wins whenever the incoming value is non-null. The StratMap
land-use loader emits non-null `landValue`, `improvementValue`, `marketValue`,
`ownerName`, `situsAddress`, `legalDescription`, `landAcres` and `propertyUseCode`
(`txgio/landuse.ts:171-194`), so re-running a StratMap land-use pass over a county
already loaded from a real CAD export OVERWRITES those eight fields with the StratMap
roll's own, generally older, numbers. The CAMA-wins rule at `:111-124` protects only
`year_built` and `living_area_sqft`. Every comment defending this merge, at
p78Merge.ts:164-171 and ingest.ts:102-108, argues the NULL direction, that "a
geometry-only apply cannot blank a crosswalk", which is true. None addresses the
non-null direction, which is the one that loses data.
Second mechanism considered and rejected: that the two loaders never touch the same
county. They do by design, since the StratMap land-use pass exists precisely to give
value coverage to counties whose CAD roll is not yet loaded, and nothing prevents the
CAD load landing afterwards or the StratMap pass being re-run after it.
Compounding: `sourceVintage` is overwritten wholesale at `:126` while the attributes
merge field by field, so a merged row carries ONE vintage stamp describing a mixture of
two vintages. The provenance on the row is not true of the row.

KNOWN VIOLATORS: none measured.

PRE-BAKE DETECTABLE: no. This is an ordering property of our own write path, not
something the source can reveal. Store-side probe: for a county carrying both a CAD
export and a StratMap land-use load, compare `cad_property.market_value` against the CAD
drop's own market value for a sample of `prop_id` and read `source_vintage`;
disagreement with a StratMap vintage stamp is the signature.

CONFIDENCE: read-at-source

### ID: LDT-09
BELIEF: The operator passes the correct roll year on the command line for a Tyler Orion
export.

WHERE: `lib/cad-ingest/src/orion/parser.ts:20-22`

    *  - tax_year is NOT in the rows; the export drop is named for its
    *    roll year, so the caller must pass `taxYear` (CLI `--tax-year`).

FAILURE MODE: silent-wrong-value

GUARDED: none. `tax_year` is one third of the `cad_property` primary key. A wrong
`--tax-year` writes the whole county under a key no reader looks for, because readers
filter to the declared vintage (LDT-24). The county then reads as EMPTY rather than as
wrong, and `resolveDeclaredCadVintage` has no way to notice. Nothing cross-checks the
flag against anything in the file or in the drop name.

KNOWN VIOLATORS: none known. Applies to Hays 48209 and Williamson 48491, the two declared
Orion counties (`sources.ts:83-104`).

PRE-BAKE DETECTABLE: yes. The Hays drop is named "PROPERTY DATA EXPORT FILES AS OF
<date>" and the WCAD Socrata views carry a dataset `rowsUpdatedAt`. Derive the year from
the drop and refuse when it disagrees with `--tax-year`. A second derivation with no
operator in it: where the Orion property file carries an appraisal-year or
current-year column, assert the flag equals the modal in-row value.

CONFIDENCE: read-at-source

### ID: LDT-10
BELIEF: A column name absent from a CSV or pipe-delimited header means the publisher does
not carry that value.

WHERE: `lib/cad-ingest/src/csv.ts:110-115` in `HeaderIndex.get` and the identical
`lib/cad-ingest/src/vendors/tad-propertydata/parser.ts:60-64` in `PipeHeaderIndex.get`

    /** Value of column `name` in `row`, or "" when absent. */
    get(row: CsvRow, name: string): string {
      const i = this.byName.get(name.toLowerCase().replace(/\s+/g, ""));
      if (i === undefined || i >= row.length) return "";

FAILURE MODE: silent-skip, presenting as a county-wide honest null

GUARDED: none. A column RENAME by the publisher, the single most common form of drift in
a CAD open-data export, is indistinguishable from a blank cell. The Orion parser's own
header at `orion/parser.ts:39-42` describes this behaviour as a feature, "honestly
null", which conflates two of the three states ENFORCEMENT separates:
absent-because-the-publisher-does-not-carry-it, and absent-because-nobody-looked. There
is no required-column declaration and no fail-closed check anywhere. `has()` exists on
`HeaderIndex` but is used only for file classification, never as a gate.

KNOWN VIOLATORS: none known. Affects Orion (Hays, Williamson), TAD (Tarrant) and DCAD
(Dallas), which is every non-PACS, non-StratMap path in the repo.

PRE-BAKE DETECTABLE: yes. Declare, per vendor shape, the set of columns the parser reads,
and assert every one is present in the header before the first row is parsed. The header
is the first line of the file, so the probe costs one read. Absence then becomes a
refusal naming the missing column rather than a null.

CONFIDENCE: read-at-source

### ID: LDT-11
BELIEF: No field in a TAD pipe-delimited export contains a pipe, and every data row has
the same number of fields as the header.

WHERE: `lib/cad-ingest/src/vendors/tad-propertydata/parser.ts:46`, with the only
length handling at `:62`

    yield line.split("|");
    ...
    if (i === undefined || i >= row.length) return "";

FAILURE MODE: silent-wrong-value

GUARDED: none. `split("|")` has no quote handling, unlike the sibling `csv.ts` reader,
which is a full RFC-4180 state machine. An embedded pipe in a legal description or an
owner name shifts every column after it for that row, and the row still parses. A row
with FEWER fields than the header silently yields "" for the tail columns. There is no
field-arity check anywhere in the file.

KNOWN VIOLATORS: none known.

PRE-BAKE DETECTABLE: yes, cheaply. Over the drop, count rows whose
`line.split("|").length` differs from the header's. Any non-zero count is the exposure,
and each such row is currently loaded with shifted values.

CONFIDENCE: read-at-source

### ID: LDT-12
BELIEF: The Tarrant residential slice is an acceptable default for the county.

WHERE: `lib/cad-ingest/src/sources.ts:106-112`

    // Tarrant / TAD - open-fetch residential slice (~50MB).
    // Full county (~97MB): PropertyData(Delimited).ZIP - announce before load.
    "48439": { mode: "open-fetch-zip",
      url: "https://www.tad.org/content/data-download/PropertyData(Delimited)_R.ZIP",

FAILURE MODE: silent-truncation, at source selection rather than in a parser

GUARDED: none in code. The default automated path for Tarrant fetches a residential
slice; commercial parcels are absent by construction and nothing in the run output says
so. The parser's own header at `vendors/tad-propertydata/parser.ts:12-14` records that
"Silent drops of C were the L21 Tarrant load defect", meaning this same class of absence
has already bitten once at a different layer.

KNOWN VIOLATORS: Tarrant 48439, by construction.

PRE-BAKE DETECTABLE: yes. A HEAD request on both `PropertyData(Delimited).ZIP` and
`_R.ZIP` gives the size ratio before any download. More directly, count distinct
`Account_Num` in the fetched slice against TAD's own published parcel count.

CONFIDENCE: read-at-source

### ID: LDT-13
BELIEF: The Dallas certified drop lives at one fixed, date-stamped URL.

WHERE: `lib/cad-ingest/src/sources.ts:77-79` and `:114-119`

    export const DCAD_CERTIFIED_OPEN_FETCH_URL =
      "https://www.dallascad.org/ViewPDFs.aspx?type=3&id=...DCAD2026_CERTIFIED_07232026.zip";

FAILURE MODE: silent-wrong-value, with a loud variant

GUARDED: none. The filename encodes a single publication date. When DCAD publishes the
next certified roll this URL either 404s, which is loud since `download.ts:114` throws on
a non-ok response, or, if the handler answers a stale id with a 200 HTML error page,
writes that page to disk as a `.zip` and fails later in yauzl. Either way Dallas is
pinned to one drop with no freshness signal, and `download.ts` verifies neither
`Content-Length` nor a checksum, so byte completeness is unasserted on every path that
uses it.

KNOWN VIOLATORS: Dallas 48113, by construction.

PRE-BAKE DETECTABLE: yes. Scrape the DCAD data-products listing for the newest
`DCAD<year>_CERTIFIED_<mmddyyyy>.zip` and compare against the constant; a mismatch is the
staleness signal. Assert the response `Content-Type` is a zip and that the received body
length equals `Content-Length`.

CONFIDENCE: read-at-source

### ID: LDT-14
BELIEF: Zip entry basenames are unique within an archive.

WHERE: `lib/cad-ingest/src/zip.ts:89`

    const dest = join(destDir, basename(entry.fileName));

FAILURE MODE: silent-wrong-value, with a silent-duplication variant

GUARDED: none. Every extracted entry is flattened to its basename into one work
directory. An archive carrying `shp/parcels.dbf` and, say, `gdb/parcels.dbf` writes the
second over the first with no warning, and the returned path list then holds the same
path twice. Under `--multi-shp=concat` two identical paths are two layers, so the SAME
file is streamed twice and the county is doubled under a continuous `feature_index`.
Without the flag, the duplicate trips the N greater than 1 refusal in
`selectShapefileLayers`, which is safe but reports a misleading reason.

KNOWN VIOLATORS: none known. The TxGIO archives are documented as carrying a `shp/`
directory, so a second directory in the same archive is the exposure.

PRE-BAKE DETECTABLE: yes. List the zip's entries and count duplicate basenames among
those matching `TXGIO_ENTRY_FILTER`, before extraction. Non-zero is the refusal.

CONFIDENCE: read-at-source

### ID: LDT-15
BELIEF: Zoning layers do not overlap, so the first polygon containing a point is the
parcel's district.

WHERE: `lib/cad-ingest/src/txgio/zoning-stamp.ts:177-201` in `zoningCodeAtPoint`

    * ... First containing polygon wins (zoning layers do not overlap; on the
    * rare shared boundary the first is as correct as any).
    for (const poly of index) { ... if (pointInGeometry(...)) return { code: poly.code, ... }; }

FAILURE MODE: silent-wrong-value

GUARDED: none. "First" means first in the order the ArcGIS pages happened to return,
which LDT-02 shows is itself unordered. Overlay districts (planned unit developments,
historic overlays, corridor overlays) are routinely published in the same feature layer
as base districts by Texas cities, and where they are, a parcel under an overlay stamps
whichever of the two the fetch returned first.

KNOWN VIOLATORS: none measured.

PRE-BAKE DETECTABLE: yes. For a sample of parcel centroids call the layer's own query
with `spatialRel=esriSpatialRelIntersects&returnCountOnly=true`; any count above 1 is an
overlap this stamp resolves arbitrarily. Aggregate over a few hundred points to get the
city's overlap rate before stamping it.

CONFIDENCE: read-at-source

### ID: LDT-16
BELIEF: A city's zoning `codeField` holds the district string itself, unless the registry
declares a `codeDomainMap`.

WHERE: `lib/cad-ingest/src/txgio/zoning-layers.ts:82-90`

    * OPTIONAL. Map ArcGIS coded-domain integer (or other raw) values to the
    * district string that must be stamped. ... When present, only mapped values
    * stamp; unmapped raw codes become NULL

FAILURE MODE: silent-wrong-value

GUARDED: partial, and only in the direction a human already noticed. When a
`codeDomainMap` IS declared the behaviour is fail-closed and unmapped values become null.
When it is ABSENT the raw field value is stamped verbatim, so a city whose `codeField`
is an ArcGIS coded-value domain and which nobody hand-inspected stamps the domain
INTEGER into `txgio_parcel.zoning_district`. That value matches no setback row, so the
envelope silently falls to the conservative default while the parcel carries a zoning
district that reads as real. Bastrop's `ZoneTypeClass` is exactly this shape and was
caught by hand (`zoning-layers.ts:288` and `:303`); nothing detects the next one.

KNOWN VIOLATORS: none outstanding. Bastrop was the instance and it is mapped.

PRE-BAKE DETECTABLE: yes, from the layer's own metadata with no sampling. Request
`<layerUrl>?f=json`, find `codeField` in `fields[]`, and read its `domain`. A
`domain.type` of `codedValue` with no `codeDomainMap` in the registry is a refusal. The
same response also hands you the map, since `domain.codedValues[]` is the exact code to
name table.

CONFIDENCE: read-at-source

### ID: LDT-17
BELIEF: If `txgio_parcel` holds any row for a county, it holds that county.

WHERE: `artifacts/api-server/src/lib/nodeFacetTier1ParcelJoin.ts:122-137` in
`resolveParcelTableForCounty`

    for (const table of PARCEL_TABLES) {
      ... `SELECT 1 AS one FROM ${table} WHERE county_fips = $1 LIMIT 1`
      if (r.rows.length === 0) continue;
      return { table, ...cols };

FAILURE MODE: silent-truncation

GUARDED: none. Production wins over staging on the strength of ONE row. A county whose
full load landed in `txgio_parcel_staging` while a partial or older load left a handful
of rows in `txgio_parcel` bakes from the partial table, and reports success on however
many parcels it found. The docstring records that a whole-county DISTINCT count was
deliberately replaced by this existence probe for performance; that is a sound
performance call which silently changed the correctness contract.

KNOWN VIOLATORS: none measured.

PRE-BAKE DETECTABLE: no, not from the source; this is an assumption about our own store.
Store-side probe, which should gate every bake: `SELECT count(*) FROM txgio_parcel WHERE
county_fips=$1` and the same on `txgio_parcel_staging`, and refuse when prod is non-zero
and materially smaller than staging.

CONFIDENCE: read-at-source

### ID: LDT-18
BELIEF: A situs address assembled from whichever fragments are non-blank is an address.

WHERE: `lib/cad-ingest/src/normalize.ts:73-81` in `joinParts`, called at
`lib/cad-ingest/src/pacs/parser.ts:278-284`

    situsAddress: joinParts(
      cut(line, APPRAISAL_INFO.situsNum), cut(line, APPRAISAL_INFO.situsStreetPrefix),
      cut(line, APPRAISAL_INFO.situsStreet), ... ),

FAILURE MODE: silent-wrong-value, expressed as an inflated coverage figure

GUARDED: none. `joinParts` filters out blanks and joins the rest, so a row carrying only
`situsNum` produces the string "1234", a street-less address that every populated-count
downstream reads as a populated situs. It returns null only when ALL fragments are blank.
This is the mechanism behind the already-recorded finding that a situs populated rate
counts sentinels.

KNOWN VIOLATORS: none newly measured here.

PRE-BAKE DETECTABLE: yes. Over the county's own drop, count rows where the `situsStreet`
span [1050,1099] is blank and `situsNum` [4460,4474] is not. That count is the number of
rows that will be stored as populated and are not addresses.

CONFIDENCE: read-at-source

### ID: LDT-19
BELIEF: A StratMap value field of 0 means "not carried", and a PACS `market_value` blank
can be answered by `appraised_val`.

WHERE: `lib/cad-ingest/src/txgio/landuse.ts:63-67` in `dollars`, and
`lib/cad-ingest/src/pacs/parser.ts:251-253` and `:296-298`

    if (!Number.isFinite(n) || n <= 0) return null;    // dollars()
    const marketValue = wholeNumberOrNull(cut(line, APPRAISAL_INFO.marketValue))
      ?? wholeNumberOrNull(cut(line, APPRAISAL_INFO.appraisedVal));
    propertyUseCode: textOrNull(cut(line, APPRAISAL_INFO.imprvStateCd))
      ?? textOrNull(cut(line, APPRAISAL_INFO.landStateCd)),

FAILURE MODE: silent-wrong-value, of the undeclared-degradation kind

GUARDED: none, and the issue is not the substitution but that it is undeclared. Three
collapses ride on the row with no marker: a genuine zero value becomes an absence, which
ENFORCEMENT separates from unmeasured; a market value may in fact be an appraised value;
and a property use code may be an improvement state code or a land state code, two
different vocabularies, indistinguishable once stored. A reader of `cad_property` cannot
tell which happened.

KNOWN VIOLATORS: not applicable; this fires on every county on these paths.

PRE-BAKE DETECTABLE: partially. The RATE is measurable from the source before baking.
Count rows where `marketValue` [4214,4227] is blank and `appraisedVal` [1916,1930] is
not, and rows where `imprvStateCd` [2732,2741] is blank and `landStateCd` [2742,2751] is
not. That gives the fraction of the county whose stored value is a substitution. The fix
is a provenance column, not a probe.

CONFIDENCE: read-at-source

---

## SILENT-SKIP

### ID: LDT-20
BELIEF: A StratMap land-use run that parses at least one row parsed enough rows.

WHERE: `lib/cad-ingest/src/txgio/landuse-cli.ts:292-300`

    log(`rows skipped:     ${counters.rowsSkipped} (no Prop_ID / no TAX_YEAR)`);
    ...
    if (counters.rowsParsed === 0) {
      fail("zero rows parsed - wrong file or schema drift; nothing ingested");
    }

FAILURE MODE: silent-skip

GUARDED: partial, and the gate is proven able to fire only at exactly zero. The geometry
path over the SAME archive carries three ceilings, `TXGIO_MAX_DECLINED_ABSOLUTE` of 10,
`TXGIO_MAX_DECLINED_FRACTION` of 0.001 and `TXGIO_MAX_GEOMETRY_ABSENT_FRACTION` of 0.05
(parse.ts:232-289). The attribute path over the same DBF has none. A county that skips
99.9 percent of its rows and parses ten exits 0 and reports success. This asymmetry is
the largest structural gap this register found: one file, read twice, ceilinged on one
pass and ungoverned on the other.
Also on line 292, the printed label names two of the three skip paths. The third,
`NOT_A_PARCEL_PROP_ID_REASON` (landuse.ts:98 and :144-151), is not in the label, so a run
whose skips are all of that kind prints a reason that is not the reason. `types.ts:59`
records that a wrong printed skip label is a defect this repo has already fixed once, on
the geometry path.

KNOWN VIOLATORS: none measured.

PRE-BAKE DETECTABLE: partially. The skip predicates (LDT-07, LDT-21) are testable from
the DBF header and a row sample before the run. The missing ceiling is a code change, not
a probe: port `assertDeclineCeiling`'s shape, an absolute term plus a fraction term with
a minimum sample, onto `rowsSkipped`.

CONFIDENCE: read-at-source

### ID: LDT-21
BELIEF: Every real Texas CAD account number is either all digits or an R followed by
digits.

WHERE: `lib/cad-ingest/src/txgio/landuse.ts:113-115`

    export function isParcelShapedPropId(propId: string): boolean {
      return /^\d+$/.test(propId) || /^[Rr]\d+$/.test(propId);
    }

FAILURE MODE: silent-skip, potentially of an entire county

GUARDED: none beyond the zero-row gate in LDT-20. The docstring is explicit that this is
"a SHAPE check, not a checksum", derived from the bare-numeric norm plus Williamson's
R-account convention, and introduced to catch one Williamson feature whose `Prop_ID` read
"PRIVATE ROAD". Texas CAD account conventions are not uniform: dashed geographic ids,
P-prefixed personal-property accounts, U- and M-prefixed accounts and mixed alphanumeric
ids all exist. A county on any of those has 100 percent of its land-use rows skipped, and
only `rowsParsed === 0` would catch it, which is exactly the case a county with even ten
conforming rows escapes.

KNOWN VIOLATORS: none known. `sources.ts` declares no per-county account shape, so
nothing corroborates this predicate per county.

PRE-BAKE DETECTABLE: yes. Over the county's DBF, compute the fraction of `Prop_ID` values
matching the predicate. A fraction below roughly 0.99 is the refusal; a fraction near
zero means the county's account convention is not in the predicate, and the predicate
must then be widened by declaration rather than by guess.

CONFIDENCE: read-at-source

### ID: LDT-22
BELIEF: `GIS_AREA_U` carries one of three unit vocabularies (acres, square feet,
hectares), and a county whose unit is unrecognised is a per-row refusal rather than a
county-level fact.

WHERE: `lib/cad-ingest/src/p78Merge.ts:42-61` in `landAcresFromGis`

    if (unitRaw.length === 0) { return { refuse: true, reason: REFUSE_GIS_AREA_REASON }; }
    if (ACRES_UNITS.has(unit)) ... if (SQFT_UNITS.has(unit)) ... if (HA_UNITS.has(unit)) ...
    return { refuse: true, reason: REFUSE_GIS_AREA_REASON };

FAILURE MODE: silent-skip

GUARDED: fail-closed per row, ungoverned per county. The row-level behaviour is correct
and refuses rather than inventing. What is missing is any REFUSAL-RATE reporting or
ceiling. The land-use CLI summary (landuse-cli.ts:283-297) prints rows read, parsed,
coded, upserted, skipped and duplicated, and says NOTHING about land acres. McLennan's
drop refused all 114,255 rows and the run reported success; that is recorded at
p78Merge.ts:64-83 as history, and the instrument that would have caught it still does not
exist. The unit sets are also narrow in a way that is invisible: `SQ.FT` is a member,
`SQ. FT.` is not.

KNOWN VIOLATORS: McLennan 48309, all rows, per the comment at p78Merge.ts:66-70.

PRE-BAKE DETECTABLE: yes, in one line. Read the distinct values of `GIS_AREA_U` from the
county's DBF and compare the set against the union of `ACRES_UNITS`, `SQFT_UNITS` and
`HA_UNITS`. Any value outside, or a wholly blank column, is the county-level fact, known
before a row is written.

CONFIDENCE: read-at-source

### ID: LDT-23
BELIEF: The two acreage phrasings measured in McLennan's `LEGAL_DESC` mean the same thing
in every other county's `LEGAL_DESC`.

WHERE: `lib/cad-ingest/src/p78Merge.ts:84-99` in `landAcresFromLegalDescription`, applied
unconditionally at `lib/cad-ingest/src/txgio/landuse.ts:184-193`

    const totalMatch = text.match(/\bTotal\s+(\d+(?:\.\d+)?)\s*Ac\b/i);
    const acresMatch = totalMatch ? null : text.match(/\bAcres\s+(\d+(?:\.\d+)?)\b/i);

FAILURE MODE: silent-wrong-value

GUARDED: partial. The fallback runs only when `landAcresFromGis` refused or returned
null, so a county with usable `GIS_AREA_U` is untouched, and that scoping is real. But
there is NO county gate: a regex derived from one county's free-text convention is
applied to all 254. A county whose `LEGAL_DESC` carries a SUBDIVISION acreage rather than
a parcel acreage, "SMITH FARMS ACRES 640" on every lot, assigns 640 acres to every lot,
silently, and only in counties whose GIS area already failed, which are exactly the
counties with no second source to contradict it.

KNOWN VIOLATORS: none known outside McLennan, where it is correct by construction.

PRE-BAKE DETECTABLE: yes. Run the two regexes over a sample of the county's own
`LEGAL_DESC` values and compare the extracted acreage against `LEGAL_AREA` and
`LGL_AREA_U` from the SAME DBF row where those are populated. Two derivations from one
publisher is weaker than two publishers, but it catches the subdivision-total case, whose
signature is one extracted value repeating across many distinct parcels. Flag any county
where a single extracted acreage repeats across more than a few percent of rows.

CONFIDENCE: read-at-source

### ID: LDT-24
BELIEF: A county's declared CAD vintage is in a fifteen-entry map compiled into the
source.

WHERE: `lib/cad-ingest/src/vintage.ts:46-64` (`DECLARED_CAD_VINTAGES`), read at `:81-88`
(`tryResolveDeclaredCadVintage`) and `:96-106` (`resolveDeclaredCadVintage`)

    export const DECLARED_CAD_VINTAGES: Readonly<...> = Object.freeze({
      "48021": { taxYear: 2025, tier: "cad-export" }, ... });   // 15 entries

FAILURE MODE: silent-skip on serve paths; loud-throw on write paths

GUARDED: partial, and the two halves diverge. Writers call `resolveDeclaredCadVintage`,
which throws for an undeclared county; that is fail-closed and correct. Serve paths call
`tryResolveDeclaredCadVintage`, which returns null, and the contract at `:77-80` says
callers "MUST treat null as read nothing (honest empty)". So a newly baked county whose
vintage was never hand-added serves EMPTY CAD facts, successfully, forever, with no error
anywhere. Every new county bake therefore needs a source-code edit, in a different
repository from the catalog that governs it.
The authority is `_catalog/tx_cad_source_registry.json`, which lives in doc_repo, is
referenced only in comments (`vintage.ts:14-17`, `routing.ts:4` and `:26`,
`verdictLayerServe.ts:81`), and is read by NO code in legacy-design-tools. Three separate
hand-typed mirrors of it exist in this repo: `DECLARED_CAD_VINTAGES`, `routing.ts:26`
(Dallas and Tarrant) and `BULK_PRIMARY_COUNTY_FIPS` at `verdictLayerServe.ts:82`, the
last carrying its own as-of date of 2026-08-22. There is no divergence test;
`__tests__/vintage.test.ts` asserts two individual values.
MEASURED AT THIS SNAPSHOT, reported because a no-gain result is still data: the 15
entries of `DECLARED_CAD_VINTAGES` and the 15 of the registry's
`declared_reader_vintages.by_fips` agree exactly, 0 divergences, and the registry's own
13 per-row `current_tax_year` mirrors also agree, 0 divergences. Counting rule: compare
`taxYear` and `tier` per FIPS across the union of both key sets; a FIPS present in one
and absent in the other counts as a divergence. The mirrors are correct today and nothing
keeps them correct.

KNOWN VIOLATORS: the 239 counties not in the map.

PRE-BAKE DETECTABLE: yes, and this is the cheapest control in the register. A test that
reads `_catalog/tx_cad_source_registry.json` and asserts equality against
`DECLARED_CAD_VINTAGES` turns a cross-repo hand-sync into a failing build. The registry
is a data file; the divergence test IS the control, per DEV_PROCESS 2.4.

CONFIDENCE: read-at-source

### ID: LDT-25
BELIEF: A living-area segment is identified either by a county's declared type-code
vocabulary or by a description beginning "MAIN AREA".

WHERE: `lib/cad-ingest/src/pacs/parser.ts:132-139` in `isLivingAreaSegment`

    if (expectedTypeCds?.some((v) => v.toUpperCase() === typeCd)) return true;
    return typeDesc.startsWith("MAIN AREA");

FAILURE MODE: silent-wrong-value on the fallback, silent-skip on the declared path

GUARDED: partial. The casing is in fact symmetric at this SHA, since the caller
uppercases the file's value at `:162` and this function uppercases the expected value; I
checked that specifically and it is not a defect. Two residual hazards are. First, the
declared vocabulary is compared by exact string equality after uppercasing, so a declared
`"1ST"` does not match a zero-padded `"01ST"` or any other spelling variant, and the miss
is silent per segment. Second, `startsWith("MAIN AREA")` matches any description
BEGINNING with that string, so a segment described "MAIN AREA GARAGE" counts as living
area and inflates the rolled-up square footage.

KNOWN VIOLATORS: none known. Travis 48453 declares `["1ST","2ND","3RD"]`
(`sources.ts:174`); Bastrop and Caldwell declare nothing and rely on the prefix.

PRE-BAKE DETECTABLE: yes. Tabulate the distinct `(typeCd, typeDesc)` pairs with counts
from the county's improvement-detail file before the load, which is exactly what
`ImprovementVocabularyMismatchError` prints AFTER a total miss, and review the set. Any
description starting "MAIN AREA" that is not living area, and any high-count code absent
from the declaration, is visible in that one table.

CONFIDENCE: read-at-source

### ID: LDT-26
BELIEF: A parcel with no zoning stamp is in a jurisdiction with no zoning.

WHERE: `lib/cad-ingest/src/txgio/zoning-layers.ts:112` (`ZONING_LAYERS`, 23 registry
entries covering 22 distinct `cityKey` values) and `:533-540` (`wiredZoningCityKeys`),
with the honest-null contract stated at `:29-33`

    * A parcel centroid that falls in no zoning polygon (outside the city, or an
    * un-zoned area) is left NULL - honest fallback, never a guessed district.

FAILURE MODE: silent-skip, presenting as a substantive fact

GUARDED: none, and the state space is missing a value. Three different situations produce
the identical NULL: the parcel is genuinely in unzoned unincorporated Texas, which is
legitimate and common; the parcel is inside a city that has zoning but is not in this
registry; and the parcel is inside a wired city whose fetch truncated (LDT-02).
`zoning_district IS NULL` cannot separate them, so no gap analysis over that column can
find the second class, which is the largest one. This is the register's clearest instance
of the rule that a missing column is invisible while an unaccounted cell is countable:
the column needs an unaccounted state distinct from absent-verified.

KNOWN VIOLATORS: every Texas city not among the 22 wired.

PRE-BAKE DETECTABLE: yes, against a source already held. `_catalog` carries the city
roster with county links; for a county being baked, enumerate its cities, check each
against `ZONING_LAYERS`, and emit the unwired list as a named absence in the bake output.
Separately, one `<cityServer>/rest/services?f=json` probe per unwired city answers whether
a zoning layer exists to wire.

CONFIDENCE: read-at-source

---

## GUARDS THAT CANNOT FIRE

### ID: LDT-27
BELIEF the code states: `computeTier1Envelope` computes an envelope.

WHERE: `artifacts/api-server/src/lib/nodeFacetBakeTier1.ts:92-122`

    if (!input.zoningCode || !input.zoningCode.trim()) {
      return { ...base, status: "declined", declineReason: NO_ZONING_STAMP_REASON, ... };
    }
    return { ...base, status: "declined", declineReason: "atom_path_pending", ... };

FAILURE MODE: not a failure; a structurally vacuous write path

GUARDED: not applicable. This is the known instance the dispatch named, and it is
unchanged at this SHA. Both branches return `status: "declined"`; the function runs,
returns a well-formed object, passes every test, and cannot produce a value. Two further
observations are not in the existing record. First, `Tier1EnvelopeFacet` at `:64-86`
declares `status: "ok" | "no-buildable-area" | "declined"` plus thirteen optional fields
(`setbacks`, `parcelAreaSqFt`, `buildableAreaSqFt`, `buildableAreaPct`,
`maxLotCoveragePct`, `maxHeightFt`, `maxFootprintSqFt`, `citationUrl`, `edgeSignal`,
`geojson` among them) that NO writer in this repo sets, so every consumer carries handling
for states nothing can reach; a discriminated union with one inhabited member would make
that a compile-time fact. Second, the single production call site is paired with
`facetCoverage.envelope = false` hardcoded at `nodeFacetTier1Assemble.ts:420`, so the
vacuity is consistently declared at that layer, which is the correct handling of a
deliberately retired path.

CALL SITES: one production (`nodeFacetTier1Assemble.ts:403`), six test
(`nodeFacetBakeTier1.test.ts:367, 524, 537, 550, 577, 595`).

PRE-BAKE DETECTABLE: not applicable.

CONFIDENCE: read-at-source

### ID: LDT-28
BELIEF the code states: the stamped zoning jurisdiction is validated against the registry.

WHERE: `lib/cad-ingest/src/txgio/zoning-layers.ts:573-575` in `resolveZoningJurisdiction`

    if (stamped && ZONING_LAYERS[stamped]) return stamped;
    if (stamped) return stamped; // unknown-but-stamped key still wins over guess

FAILURE MODE: dead code presenting as a validation

GUARDED: not applicable. Both branches return the same value for the same input, so the
`ZONING_LAYERS[stamped]` lookup cannot change the outcome for ANY input. This is a live
sibling of the `computeTier1Envelope` shape, found by looking for it: a registry check
that reads as validation, costs a lookup, and constrains nothing. The trailing comment
explains why the second branch exists and in doing so makes the first one inert. Either
the registry check should gate, with an unknown key refusing or falling through to the
situs path, or the first branch should go. As written a reader is told a validation
happens that does not.

KNOWN VIOLATORS: not applicable.

PRE-BAKE DETECTABLE: not applicable. Found by reading the write path, which is the only
way this class is ever found.

CONFIDENCE: read-at-source

### ID: LDT-29
BELIEF the code states: `facetCoverage.baseFacts` reports whether base facts landed.

WHERE: `artifacts/api-server/src/lib/nodeFacetTier1Assemble.ts:413-421`, with `apn`
supplied at `artifacts/api-server/src/nodeFacetBakeTier1Cli.ts:501`

    const facetCoverage = {
      baseFacts: baseFacts.apn != null || baseFacts.situsAddress != null,
    ...
    apn: str(row.prop_id),

FAILURE MODE: a coverage indicator that cannot report false

GUARDED: not applicable. `apn` is the parcel's `prop_id`, the key the bake selected the
row by, so it is non-null by construction for every row the bake reaches. The disjunction
is therefore trivially true for every parcel of every county, and a county with zero situs
coverage and an empty CAD roll reports 100 percent `baseFacts` coverage. This is a gating
indicator that has never been proven able to fire, per DEV_PROCESS 2.2, and it reports
health on precisely the counties that have none.

KNOWN VIOLATORS: not applicable; fires on every county.

PRE-BAKE DETECTABLE: not applicable; this is an instrument defect rather than an input
assumption. The fix is to drop `apn` from the disjunction, since it measures the join key
rather than any fact.

CONFIDENCE: read-at-source

### ID: LDT-30
BELIEF the code states: `isWebMercatorPosition` catches a degree pair fed in by mistake.

WHERE: `lib/cad-ingest/src/txgio/reproject.ts:93-107`

    * (a degree pair fed in by mistake converts to a point a few metres from
    * null island and would then fail the Texas envelope - this catches it
    * earlier and with a better message).
    function isWebMercatorPosition(x: number, y: number): boolean {
      return Number.isFinite(x) && Number.isFinite(y) &&
        Math.abs(x) <= WEB_MERCATOR_MAX_M && Math.abs(y) <= WEB_MERCATOR_MAX_M;

FAILURE MODE: the guard cannot fire for its documented purpose

GUARDED: not applicable. A Texas degree pair, roughly (-97.7, 30.2), is finite and far
below the 20,037,508 metre bound, so it passes. The check catches only coordinates
OUTSIDE the Web Mercator extent, a different and much rarer case. The behaviour the
comment promises, catching the mistake "earlier and with a better message", does not
happen; the degree pair converts to a point near null island and is caught downstream by
`assertTexasWgs84Bbox` with a projection-error message. The system still fails closed, so
the consequence is a misleading diagnostic rather than a bad row. The finding is that an
auditor counting guards will credit this one with a case it does not cover. A check that
would fire: reject when `|x| < 180 && |y| < 90`, the range where a value is far more
plausibly degrees than metres.

KNOWN VIOLATORS: not applicable.

PRE-BAKE DETECTABLE: not applicable.

CONFIDENCE: read-at-source

### ID: LDT-31
BELIEF the code states: `columnExists` answers whether the table being read has a column.

WHERE: `artifacts/api-server/src/lib/nodeFacetTier1ParcelJoin.ts:76-99`

    return r.rows[0]?.r != null;                        // tableExists, via to_regclass
    ...
    `SELECT count(*) AS n FROM information_schema.columns
       WHERE table_name = $1 AND column_name = $2`      // columnExists

FAILURE MODE: two resolution mechanisms for one question

GUARDED: none. `tableExists` resolves the name through `to_regclass`, which honours the
connection's `search_path`. `columnExists` queries `information_schema.columns` with NO
`table_schema` predicate, so it counts the column in EVERY schema of the database. In a
database holding a test schema, a staging schema, or any second copy of `txgio_parcel`,
the two functions can be answering about different tables. The asymmetry favours a false
TRUE for `hasZoning`, which produces a SQL error naming a missing column, so the immediate
failure is loud rather than silent. The finding is the divergence itself, one rule with
two implementations per DEV_PROCESS 2.4, on a database whose own test harness
(`withTestSchema`) deliberately creates extra schemas.

KNOWN VIOLATORS: none measured.

PRE-BAKE DETECTABLE: no; a store-internal property. The fix is `AND table_schema =
current_schema()`, or deriving both answers from `to_regclass` plus `pg_attribute` so one
mechanism answers both halves.

CONFIDENCE: read-at-source

---

## FAIL-CLOSED, REPORTED SO NOBODY RE-FIXES THEM

### ID: LDT-32
`selectShapefileLayers` (`txgio/shapefile-discover.ts:66-93`) discovers every `.shp`,
throws on zero, and throws on more than one unless `--multi-shp=concat`. GUARDED:
fail-closed, unchanged at this SHA. Caveat, not a defect: `discoverAllShapefiles:50-52`
throws when a `.dbf` sibling is missing but treats the `.prj` as optional, which is
deliberate and is the case `assertTexasWgs84Bbox` backstops.

### ID: LDT-33
`assertTexasWgs84Bbox` (`txgio/parse.ts:185-210`) applies the Texas degree envelope plus
the `TXGIO_MAX_FEATURE_CELLS` of 4096 per-feature cell ceiling. GUARDED: fail-closed,
unchanged. One input assumption inside it is worth naming because it is loud but
county-halting: a single parcel record whose bbox spans more than roughly 1.28 by 1.28
degrees throws and aborts the entire county. Ordinary ranch parcels stay well under this,
but a linear right-of-way parcel, a railroad or pipeline corridor carried as ONE `Prop_ID`
with a multipart geometry running the length of a county, can exceed it. PRE-BAKE
DETECTABLE: yes, from the `.shp` file's own per-record bounding boxes, which the format
stores for every multipart record; scan them and count any whose extent exceeds the
ceiling before the run.

### ID: LDT-34
`isNullPlaceholderFeature` (`txgio/parse.ts:455-465`), applied only on the
out-of-envelope branch at `:583-602`, declines only on the CONJUNCTION of impossible
coordinates and no identity; an out-of-envelope feature with a real `Prop_ID` still
throws. GUARDED: fail-closed, unchanged. Note its dependency on LDT-07: under a
case-different DBF header this predicate returns true for every feature.

### ID: LDT-35
`assertDeclineCeiling` (`txgio/parse.ts:327-370`, called per declination at
`txgio/cli.ts:187-189`) and `assertFinalDeclineCeiling` (`:383-414`, called at
`cli.ts:200` from inside the generator so it propagates into the transaction and rolls the
load back). GUARDED: fail-closed, unchanged, and correctly split mid-stream versus
end-of-stream by class.

### ID: LDT-36
PACS files are read with `encoding: "latin1"` (`pacs/parser.ts:77-82`), deliberately, so
that one byte is one JavaScript character and the fixed-width offsets in `layout.ts` stay
aligned. This is correct, and it is why LDT-03's failure mode is a layout shift rather
than a per-row shift. Checked and cleared. Residual and minor: bytes 0x80 to 0x9F in a
CP1252 file (smart quotes, dashes) decode to C1 control characters under latin1, so those
characters are wrong in `owner_name` and `legal_description`, though field positions hold.

### ID: LDT-37
`ImprovementVocabularyMismatchError` (`pacs/parser.ts:106-130`, thrown at `:192-198`)
refuses loudly when an improvement-detail file matches zero living-area segments, naming
the segment types actually seen. GUARDED: fail-closed. Its limit is that it fires only at
EXACTLY zero, the same shape as LDT-20's `rowsParsed === 0`: a county matching one percent
of its true living-area segments passes.

### ID: LDT-38
Mixed-CRS refusal across multi-shapefile parts (`txgio/cli.ts:450-456`) fails the run when
the parts declare different `.prj` kinds rather than concatenating degrees with metres.
GUARDED: fail-closed. The adjacent branch at `:457-465`, which reprojects on the strength
of `--reproject=3857` alone when no `.prj` exists, declares itself loudly in the log and
is then checked by the envelope assertion on the converted coordinates.

---

## COULD NOT ESTABLISH

1. `mergeBakedBaseFacts` does not exist in legacy-design-tools at this SHA.
   `git grep -in "mergeBaked\|BakedBaseFacts" origin/main` returns no hits, exit 0 with no
   output. The dispatch named it as a Tier-1 bake symbol to read. It is either in another
   repo (cortex-api and hauska-engine are the candidates, given the recorded tier2-flood
   finding), or renamed, or retired. I did not look outside this repo, which is out of
   scope for a lane scoped to `repo: legacy-design-tools`.

2. `brokeragePlaceBuildableEnvelope` was located by filename only
   (`artifacts/api-server/src/__tests__/brokeragePlaceBuildableEnvelope.test.ts`,
   `lib/buildableEnvelope/parcelDrawEnvelopeModel.ts`,
   `composeBuildableEnvelopeDerivation.ts`) and NOT opened. The polygon-draw path sits
   under an active operator ruling (envelope drawn, figure refused, 2026-09-11) and
   deserves its own read. Nothing in this register speaks to it.

3. Whether a DBF header outside Hays, Comal and Bexar spells `Prop_ID` in that exact case
   is unknown. LDT-07 is read-at-source on the code and inferred on the violator. No
   network was permitted in this lane, so no county archive header was read.

4. Whether the `shapefile` npm package would honour a `.cpg` is unresolved:
   `node_modules/shapefile` is not present in the local checkout and no network was
   permitted. The question is moot for LDT-06 because `TXGIO_ENTRY_FILTER` never extracts
   the `.cpg`, so no library could read it.

5. Whether `upsertCadProperties`'s SQL merge is covered by a divergence test against the
   JS reference `applyPathAMerge` is unresolved. `p78Merge.ts:3` states the requirement,
   "SQL in upsertCadProperties must match applyPathAMerge semantics". I read both
   implementations and found them semantically equivalent at this SHA, but I did not open
   `__tests__/p78-merge.test.ts` to determine whether anything enforces it.

6. Whether the Orion CLI fails closed when `classifyOrionHeader` returns `"unknown"` for
   the property file is unresolved. I read the classifier (`orion/parser.ts:80-86`) and
   not its caller.

7. The vendor-routing denominator is partly established. `CAD_BULK_SOURCES`
   (`sources.ts:81-120`) holds FOUR counties: 48491 Williamson (open-fetch Socrata), 48209
   Hays (manual-download), 48439 Tarrant (open-fetch-zip, residential slice), 48113 Dallas
   (open-fetch-zip). `TXGIO_ABSENT_FROM_STRATMAP` (`txgio/counties.ts:104-106`) holds one,
   48129. I did not enumerate `routing.ts`'s own map. The planning implication stands
   either way: for the large majority of the 254 counties there is no declared CAD roll
   source at all, so the only ingest path is the StratMap geometry and land-use pair, and
   every assumption in LDT-06, LDT-07, LDT-19, LDT-20, LDT-21, LDT-22 and LDT-23 applies
   to it.

8. Two hypotheses were checked and REJECTED, recorded so nobody spends time on them.
   (a) A UTF-8 byte-order mark in a CSV header breaking `HeaderIndex`. It does not:
   `String.prototype.trim` removes U+FEFF per the ES WhiteSpace production, verified by
   execution, `'\uFEFFPropertyID'.trim() === 'PropertyID'` is true, and `csv.ts:101` calls
   `.trim()` on every header cell. (b) A duplicate `elgin-tx` key in `ZONING_LAYERS`
   silently dropping a config. It does not: the two entries are keyed `"elgin-tx"` and
   `"elgin-tx-travis"` (`zoning-layers.ts:363` and `:407`) and share a `cityKey` value
   deliberately, documented at `:384-405`. Note the consequence that
   `resolveZoningLayer("elgin-tx")` returns only the Bastrop-side config; whether any
   consumer needs both was not traced.

9. This register is a READ of write paths. Nothing in it was verified by running an
   instrument against a county, because the lane was scoped read-only with no network and
   no database. Every PRE-BAKE DETECTABLE entry is a probe DESIGN, not a probe that has
   been shown to fire. Per DEV_PROCESS 2.2, none should be trusted until it has been run
   against a known violation.

## What is out of scope, stated rather than left unmentioned

The permits, boundary, address and NFHL ingest subtrees
(`lib/cad-ingest/src/{permits,boundary,address,nfhl}/`) were not read. The Tier-2 bake
(`nodeFacetBakeTier2*`) was not read. The conformant-v1 bake
(`nodeFacetBakeTier1Conformant.ts`, over 1,600 lines) was opened only at three cited lines
via grep. `publishedIdentifierBackfill.ts`, `williamsonAgValuation.ts`,
`vintage-crosswalk.ts` and `vintage-fallback.ts` were not read. Each is a plausible home
for further rows of every class above.
