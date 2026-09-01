#!/usr/bin/env node
/**
 * Extract STANDING DECISIONS from _STATE.md and write _catalog/DISPATCH_PREAMBLE.md
 * with a hash-pinned CANON-PREAMBLE marker for M3 enforcement.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { extractStandingDecisions } from './lib/standing-decisions.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const statePath = join(root, '_STATE.md');
const outPath = join(root, '_catalog', 'DISPATCH_PREAMBLE.md');

const state = readFileSync(statePath, 'utf8');
const body = extractStandingDecisions(state);
if (body === null) {
  console.error('STANDING DECISIONS section not found in _STATE.md');
  process.exit(1);
}
const hash = createHash('sha256').update(body, 'utf8').digest('hex').slice(0, 8);
const today = new Date().toISOString().slice(0, 10);

const preamble = `<!-- CANON-PREAMBLE v${hash} generated ${today} from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v${hash}

${body}
`;

writeFileSync(outPath, preamble, 'utf8');
console.log(`Wrote ${outPath} (CANON-PREAMBLE v${hash})`);
