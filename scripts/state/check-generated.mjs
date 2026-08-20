#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCombined } from './generate-combined.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ON_DISK = readFileSync(join(ROOT, '_STATE.md'), 'utf8').replace(/\r\n/g, '\n');
const EXPECTED = renderCombined(ROOT);

function stripGeneratedStamp(text) {
  return text.replace(/Last generated: [^\n]+/, 'Last generated: STAMP');
}

if (stripGeneratedStamp(ON_DISK) !== stripGeneratedStamp(EXPECTED)) {
  console.error(JSON.stringify({
    control: 'STATE-generated',
    status: 'drift',
    message: '_STATE.md does not match generate-combined output. Edit _state/<seat>/STATE.md and regenerate.',
  }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ control: 'STATE-generated', status: 'ok' }));
