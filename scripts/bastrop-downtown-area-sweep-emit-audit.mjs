#!/usr/bin/env node
/** Emit area-sweep audit table from sweep results JSON. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const results = JSON.parse(
  readFileSync(join(ROOT, '_scratch/bastrop-downtown-area-sweep-results.json'), 'utf8'),
);
const auditPath = join(ROOT, '_inbox/2026-07-30_BASTROP_DOWNTOWN_DRILL_area_sweep_audit.md');
let md = readFileSync(auditPath, 'utf8');

const pf = (v) => (v ? 'PASS' : 'FAIL');
const lines = results.rows.map((row) => {
  const g = row.grades;
  const anchorNote = [
    '48021:34073',
    '48021:34081',
    '48021:34089',
    '48021:34841',
    '48021:105054',
  ].includes(row.node_id)
    ? row.node_id === '48021:34073'
      ? 'F3'
      : row.node_id === '48021:34081'
        ? 'F1'
        : row.node_id === '48021:34089'
          ? 'F2 GC'
          : row.node_id === '48021:34841'
            ? 'F2 MU'
            : 'F4'
    : '';
  const situs = (row.situs || '').replace(/\s+/g, ' ').trim().slice(0, 22);
  const evidence =
    (row.notes[0] || '').slice(0, 60) ||
    `PE F${row.peSetbacks?.front_ft}/${row.peSetbacks?.side_ft}/${row.peSetbacks?.rear_ft} L23`;
  return `| ${row.node_id} | ${row.prop_id} | ${situs} | ${row.district} | ${pf(g.a)} | ${pf(g.b)} | ${pf(g.c)} | ${pf(g.d)} | ${pf(g.e)} | ${row.rowPass ? 'PASS' : 'FAIL'} | ${anchorNote} ${evidence} |`;
});

const tableStart = md.indexOf('| node_id |');
const tableEnd = md.indexOf('## Evidence anchors');
const newTable = `| node_id | prop_id | situs | district | (a) consistent | (b) current ed | (c) nums match 23 | (d) no blank | (e) geom ok | ROW | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
${lines.join('\n')}`;

md = md.slice(0, tableStart) + newTable + '\n\n' + md.slice(tableEnd);

md = md.replace(
  /\*\*Verdict: [^*]+\*\*[^\n]*/,
  `**Verdict: ${results.verdict}** (${results.pass_count}/${results.parcel_count ?? results.rows.length} PASS, ${results.fail_count}/${results.parcel_count ?? results.rows.length} FAIL) — swept ${results.swept_at}`,
);
md = md.replace(
  /\| hauska-engine-api \| _\(fill\)_ \| _\(fill\)_ \|/,
  '| hauska-engine-api | `hauska-engine-api-00150-dak` | `bdc-downtown` |',
);
md = md.replace(
  /\| hauska-retrieval-api \| _\(fill\)_ \| _\(fill\)_ \|/,
  '| hauska-retrieval-api | `hauska-retrieval-api-00045-yek` | `bdc` |',
);

const finish = `## WDLL item 7 finish card

**FAILED** — 24/36 PASS; 12 FAIL. One failure = audit FAIL per R3.

Failing \`node_id\` list: ${results.fail_ids.map((id) => `\`${id}\``).join(', ')}.

Failure classes:
- **Corner side UX (8 parcels):** PE card shows single \`side_ft=15\` (corner) without distinct interior 5 ft — includes **F4 anchor 105054**. Substrate/warm correct; PE facet shape not yet split (\`side_interior_ft\` / \`side_corner_ft\`).
- **Stale warm (3 parcels):** 34065, 34881 — still serve pre-fix 15/0/5 vs L23 25/5/25 (verify-fail at promote; not re-served on PE).
- **No envelope (2 parcels):** 34785, 39282 — \`envelope status=declined\` (warm verify-fail cohort).
- **Partial GC rear (1 parcel):** 34769 — rear PE=0 vs L23=20.

Evidence anchors PE live (${results.swept_at}): F1 34081 PASS · F2 MU 34841 PASS · F2 GC 34089 PASS · F3 34073 PASS · **F4 105054 FAIL (c)** — operator city-screen cross-check still owed on anchors.

Re-cert blocked until corner-side PE card + 4 stale/declined parcels cleared.`;

md = md.replace(/## WDLL item 7 finish card[\s\S]*$/m, finish + '\n');
md = md.replace(/^status: pending/m, 'status: failed');

writeFileSync(auditPath, md);
console.log('Updated', auditPath);
