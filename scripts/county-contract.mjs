#!/usr/bin/env node
/**
 * county-contract.mjs — instantiate, write and report county contract records.
 *
 * The contract (_catalog/county_contract_v0.json) declares the COLUMNS.
 * This tool instantiates a RECORD per county with every column present and
 * every cell `unaccounted`, per _decisions/2026-09-01_every_parcel_starts_with_a_full_record.md
 * applied one level up: acquisition changes a cell's STATE, never its EXISTENCE.
 *
 * IT DOES NOT AUTO-EXTRACT FROM LANE CLOSES. That was the original plan and it
 * was abandoned on measurement: of 639 parseable close JSONs in _inbox, only 57
 * carry a FIPS-keyed object at all, under at least 24 different parent keys
 * (byCounty 6, perCounty 4, queueVerifiedPreWrite 28, keep 25, and 20 one-offs).
 * The closes were never written to a schema, so harvesting them is archaeology,
 * not derivation. An extractor over that corpus would return a plausible answer,
 * which ENFORCEMENT.md names as the failure mode to design against. Cells are
 * therefore written explicitly, each carrying the instrument that produced it,
 * and the record distinguishes a written cell from an unaccounted one.
 *
 * Commands:
 *   --instantiate         create/refresh records; existing written cells are preserved
 *   --report              unaccounted tallies per county, per group, per scope
 *   --self-test           prove the cell writer refuses in BOTH directions
 *
 * Cell write rules (fail closed):
 *   - any state other than `unaccounted` REQUIRES instrument, scope and measuredAt
 *   - `absent-verified` REQUIRES a non-empty scope (an absence with no scope is the
 *     fabricated-zero shape)
 *   - `not-applicable` REQUIRES a `ruling` pointer to a decision record
 *   - an unrecognised state is REFUSED, never admitted as a value. This is the
 *     classifyRequiredLeaf defect (2026-09-09 blocker 5) refused at the source.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTRACT = join(ROOT, '_catalog', 'county_contract_v0.json');
const RECORDS_DIR = join(ROOT, '_catalog', 'county_records');
const ROSTER = join(ROOT, '_catalog', 'texas_roster_v1.json');

const COUNTIES = {
  '48021': 'Bastrop',
  '48055': 'Caldwell',
  '48209': 'Hays',
  '48309': 'McLennan',
  '48453': 'Travis',
  '48491': 'Williamson',
};

const NL = String.fromCharCode(10);
const LEGAL_STATES = ['unaccounted', 'value', 'absent-verified', 'not-applicable', 'refused'];

// ---------------------------------------------------------------- cell writer

export class CellRefused extends Error {}

export function makeCell(input) {
  const { state } = input ?? {};
  if (!LEGAL_STATES.includes(state)) {
    throw new CellRefused(
      `unrecognised state ${JSON.stringify(state)}; legal states are ${LEGAL_STATES.join(', ')}. ` +
        'An uninterpretable state is refused, never admitted as a populated value.'
    );
  }
  if (state === 'unaccounted') return { state: 'unaccounted' };

  for (const f of ['instrument', 'scope', 'measuredAt']) {
    if (!input[f] || String(input[f]).trim() === '') {
      throw new CellRefused(
        `state ${state} requires a non-empty ${f}. A state with no ${f} is unaccounted ` +
          'regardless of what it says.'
      );
    }
  }
  if (state === 'not-applicable' && !input.ruling) {
    throw new CellRefused(
      'not-applicable requires a `ruling` pointer to a decision record. A ruling nobody can ' +
        'read is an assertion.'
    );
  }
  const cell = {
    state,
    instrument: input.instrument,
    scope: input.scope,
    measuredAt: input.measuredAt,
  };
  if ('value' in input) cell.value = input.value;
  if (input.ruling) cell.ruling = input.ruling;
  if (input.source) cell.source = input.source;
  return cell;
}

// ------------------------------------------------------------------ roster

function citiesFor(fips) {
  if (!existsSync(ROSTER)) return { cities: [], rosterRead: false };
  const raw = JSON.parse(readFileSync(ROSTER, 'utf8'));
  const rows = Array.isArray(raw) ? raw : raw.cities || raw.rows || [];
  return {
    rosterRead: true,
    cities: rows
      .filter((r) => String(r.parent_county_fips) === fips && r.record_type === 'city')
      .map((r) => ({ name: r.name, geoid: r.geoid, row: r })),
  };
}

// ------------------------------------------------------------- instantiate

function instantiate() {
  const contract = JSON.parse(readFileSync(CONTRACT, 'utf8'));
  const cols = contract.columns;
  const byScope = (s) => cols.filter((c) => c.scope === s);

  mkdirSync(RECORDS_DIR, { recursive: true });
  const summary = [];

  for (const [fips, name] of Object.entries(COUNTIES)) {
    const file = join(RECORDS_DIR, `${fips}.json`);
    const prior = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
    const keep = (path) => {
      const cell = prior && path.split('.').reduce((o, k) => (o ? o[k] : undefined), prior);
      return cell && cell.state && cell.state !== 'unaccounted' ? cell : { state: 'unaccounted' };
    };

    const { cities, rosterRead } = citiesFor(fips);

    const rec = {
      countyFips: fips,
      countyName: name,
      contractVersion: contract.version,
      instantiatedAt: prior?.instantiatedAt ?? new Date().toISOString(),
      refreshedAt: new Date().toISOString(),
      _note:
        'Generated by scripts/county-contract.mjs. Cells are written explicitly with their ' +
        'instrument; nothing here is auto-extracted from lane closes. See the header of that ' +
        'script for why.',
      county: {},
      cities: {},
      rails: {},
      railRoster: {
        state: 'unaccounted',
        _why:
          'DELIBERATE. There is no authoritative rail roster in doc_repo; the list lives in ' +
          'hauska-engine PROPERTY_ENTITY_TYPES, legacy-design-tools countyRailDimension.ts and ' +
          'the live county-ledger endpoint. Instantiating rail-scope cells against a guessed ' +
          'list would fabricate the denominator, which is the defect this contract exists to ' +
          'prevent. Rail scope stays uninstantiated until the roster is read from source.',
        blockedColumns: byScope('rail').map((c) => c.id),
      },
    };

    for (const c of byScope('county')) rec.county[c.id] = keep(`county.${c.id}`);

    for (const city of cities) {
      rec.cities[city.name] = {};
      for (const c of byScope('city')) {
        rec.cities[city.name][c.id] = keep(`cities.${city.name}.${c.id}`);
      }
    }

    writeFileSync(file, JSON.stringify(rec, null, 2) + '\n', 'utf8');
    summary.push({
      fips,
      name,
      countyCells: byScope('county').length,
      cities: cities.length,
      cityCells: cities.length * byScope('city').length,
      rosterRead,
    });
  }
  return { summary, contract };
}

// ----------------------------------------------------------------- report

function report() {
  const contract = JSON.parse(readFileSync(CONTRACT, 'utf8'));
  const groupOf = Object.fromEntries(contract.columns.map((c) => [c.id, c.group]));
  if (!existsSync(RECORDS_DIR)) {
    console.log('no records; run --instantiate first');
    return;
  }
  const files = readdirSync(RECORDS_DIR).filter((f) => f.endsWith('.json'));
  let gTot = 0;
  let gUnacc = 0;
  const byGroup = {};
  const rows = [];

  for (const f of files) {
    const rec = JSON.parse(readFileSync(join(RECORDS_DIR, f), 'utf8'));
    let tot = 0;
    let unacc = 0;
    const bump = (id, cell) => {
      tot++;
      const g = groupOf[id] ?? 'unknown';
      byGroup[g] ??= { total: 0, unaccounted: 0 };
      byGroup[g].total++;
      if (cell.state === 'unaccounted') {
        unacc++;
        byGroup[g].unaccounted++;
      }
    };
    for (const [id, cell] of Object.entries(rec.county)) bump(id, cell);
    for (const city of Object.values(rec.cities)) {
      for (const [id, cell] of Object.entries(city)) bump(id, cell);
    }
    rows.push({ county: rec.countyName, fips: rec.countyFips, total: tot, unaccounted: unacc });
    gTot += tot;
    gUnacc += unacc;
  }

  console.log('\nCOUNTY CONTRACT — instantiated cell states');
  console.log(`contract ${contract.version}   records ${files.length}\n`);
  console.log('county          fips     cells   unaccounted   written');
  for (const r of rows.sort((a, b) => a.county.localeCompare(b.county))) {
    console.log(
      `${r.county.padEnd(14)}  ${r.fips}   ${String(r.total).padStart(5)}   ${String(
        r.unaccounted
      ).padStart(11)}   ${String(r.total - r.unaccounted).padStart(7)}`
    );
  }
  console.log(
    `${'TOTAL'.padEnd(14)}         ${String(gTot).padStart(5)}   ${String(gUnacc).padStart(
      11
    )}   ${String(gTot - gUnacc).padStart(7)}`
  );

  console.log('\nby column group');
  for (const [g, v] of Object.entries(byGroup).sort((a, b) => b[1].unaccounted - a[1].unaccounted)) {
    console.log(
      `  ${g.padEnd(16)} ${String(v.total).padStart(5)} cells  ${String(v.unaccounted).padStart(
        5
      )} unaccounted`
    );
  }

  const railCols = contract.columns.filter((c) => c.scope === 'rail').length;
  console.log(
    `\nRAIL SCOPE UNINSTANTIATED: ${railCols} columns x 6 counties x (rail roster unaccounted).`
  );
  console.log(
    '  The rail roster is not readable from doc_repo. Instantiating against a guessed list'
  );
  console.log('  would fabricate the denominator. Read it from source before instantiating.\n');
}

// -------------------------------------------------------------- self-test

function selfTest() {
  const cases = [
    {
      name: 'POSITIVE: a fully specified value cell is accepted',
      run: () =>
        makeCell({
          state: 'value',
          value: 1,
          instrument: 'x',
          scope: 'y',
          measuredAt: '2026-09-10',
        }),
      expect: 'accept',
    },
    {
      name: 'POSITIVE: unaccounted needs nothing',
      run: () => makeCell({ state: 'unaccounted' }),
      expect: 'accept',
    },
    {
      name: 'NEGATIVE: an unrecognised state is refused, not admitted',
      run: () => makeCell({ state: 'populated' }),
      expect: 'refuse',
    },
    {
      name: 'NEGATIVE: a value with no instrument is refused',
      run: () => makeCell({ state: 'value', value: 1, scope: 'y', measuredAt: '2026-09-10' }),
      expect: 'refuse',
    },
    {
      name: 'NEGATIVE: absent-verified with an empty scope is refused',
      run: () =>
        makeCell({ state: 'absent-verified', instrument: 'x', scope: '  ', measuredAt: '2026-09-10' }),
      expect: 'refuse',
    },
    {
      name: 'NEGATIVE: not-applicable with no ruling pointer is refused',
      run: () =>
        makeCell({ state: 'not-applicable', instrument: 'x', scope: 'y', measuredAt: '2026-09-10' }),
      expect: 'refuse',
    },
    {
      name: 'NEGATIVE (non-vacuity): undefined state is refused, so the check is not trivially true',
      run: () => makeCell({}),
      expect: 'refuse',
    },
  ];

  let failures = 0;
  for (const c of cases) {
    let got;
    try {
      c.run();
      got = 'accept';
    } catch (e) {
      got = e instanceof CellRefused ? 'refuse' : `threw ${e.constructor.name}`;
    }
    const ok = got === c.expect;
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}  (expected ${c.expect}, got ${got})`);
  }
  console.log(`\nfailures=${failures}`);
  return failures;
}

// ---------------------------------------------------------------- apply seed

function applySeed(seedFile) {
  const seed = JSON.parse(readFileSync(join(ROOT, '_catalog', seedFile), 'utf8'));
  const contract = JSON.parse(readFileSync(CONTRACT, 'utf8'));
  const colScope = Object.fromEntries(contract.columns.map((c) => [c.id, c.scope]));
  let written = 0;
  let refused = 0;

  const recs = {};
  const load = (fips) => (recs[fips] ??= JSON.parse(readFileSync(join(RECORDS_DIR, fips + '.json'), 'utf8')));

  for (const entry of seed.cells) {
    for (const col of entry.columns) {
      if (colScope[col] !== 'county') {
        console.log(`REFUSED  ${col}: seed targets county scope but the contract declares ${colScope[col] ?? 'NO SUCH COLUMN'}`);
        refused++;
        continue;
      }
      for (const fips of entry.counties) {
        const rec = load(fips);
        const value = entry.valuePerCounty ? entry.valuePerCounty[fips] : entry.value;
        try {
          rec.county[col] = makeCell({
            state: entry.state,
            value,
            instrument: entry.instrument,
            scope: entry.scope,
            measuredAt: entry.measuredAt,
            ruling: entry.ruling,
            source: entry.source,
          });
          written++;
        } catch (e) {
          console.log(`REFUSED  ${fips} ${col}: ${e.message}`);
          refused++;
        }
      }
    }
  }

  for (const d of seed.derivations ?? []) {
    if (colScope[d.column] !== 'city') {
      console.log(`REFUSED  derivation ${d.column}: not a city-scope column`);
      refused++;
      continue;
    }
    for (const fips of Object.keys(COUNTIES)) {
      const rec = load(fips);
      const { cities } = citiesFor(fips);
      for (const city of cities) {
        const url = city.row?.zoning_layer?.source_url;
        if (!url) continue;
        try {
          rec.cities[city.name][d.column] = makeCell({
            state: 'value',
            value: url,
            instrument: d.instrument,
            scope: `${city.name}, ${COUNTIES[fips]} County; roster zoning_layer.source_url`,
            measuredAt: d.measuredAt,
          });
          written++;
        } catch (e) {
          console.log(`REFUSED  ${fips} ${city.name} ${d.column}: ${e.message}`);
          refused++;
        }
      }
    }
  }

  for (const [fips, rec] of Object.entries(recs)) {
    rec.refreshedAt = new Date().toISOString();
    writeFileSync(join(RECORDS_DIR, fips + '.json'), JSON.stringify(rec, null, 2) + NL, 'utf8');
  }
  console.log(`seed ${seed.seedId}: written ${written}, refused ${refused}`);
  return refused;
}

// ------------------------------------------------------------------- main

const arg = process.argv[2];
if (arg === '--self-test') {
  process.exit(selfTest() === 0 ? 0 : 1);
} else if (arg === '--instantiate') {
  const { summary } = instantiate();
  for (const s of summary) {
    console.log(
      `${s.name.padEnd(12)} ${s.fips}  county-cells ${s.countyCells}  cities ${String(
        s.cities
      ).padStart(2)}  city-cells ${String(s.cityCells).padStart(3)}  roster ${
        s.rosterRead ? 'read' : 'MISSING'
      }`
    );
  }
} else if (arg === '--apply-seed') {
  const f = process.argv[3];
  if (!f) { console.error('usage: --apply-seed <seedfile.json>'); process.exit(2); }
  process.exit(applySeed(f) === 0 ? 0 : 1);
} else if (arg === '--report') {
  report();
} else {
  console.log('usage: county-contract.mjs [--instantiate|--report|--self-test]');
  process.exit(2);
}
