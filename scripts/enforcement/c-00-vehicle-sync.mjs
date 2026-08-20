#!/usr/bin/env node
/**
 * C-00 Vehicle file sync — internal consistency only.
 * Compares ENFORCEMENT.md (canonical) to .cursor/rules/enforcement.mdc body.
 * Derivation class: one party edits both; catches drift/transcription/partial writes.
 * Not meaning shaped doctrine-reach coverage (see C-00b).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CANON = join(ROOT, 'ENFORCEMENT.md');
const MDC = join(ROOT, '.cursor/rules/enforcement.mdc');

function normalize(text) {
  return text.replace(/\r\n/g, '\n').trimEnd();
}

function mdcBody(raw) {
  const match = raw.match(/^---[\s\S]*?---\s*\n([\s\S]*)$/);
  if (!match) {
    console.error('C-00: enforcement.mdc missing frontmatter delimiter');
    process.exit(1);
  }
  return normalize(match[1]);
}

function main() {
  if (!existsSync(CANON) || !existsSync(MDC)) {
    console.error('C-00: missing ENFORCEMENT.md or .cursor/rules/enforcement.mdc');
    process.exit(1);
  }
  const canon = normalize(readFileSync(CANON, 'utf8'));
  const mdc = mdcBody(readFileSync(MDC, 'utf8'));

  if (canon === mdc) {
    console.log(JSON.stringify({
      control: 'C-00-vehicle-sync',
      derivationClass: 'internal-consistency',
      status: 'ok',
      canon: 'ENFORCEMENT.md',
      copy: '.cursor/rules/enforcement.mdc',
    }, null, 2));
    process.exit(0);
  }

  // First differing line for actionable output
  const canonLines = canon.split('\n');
  const mdcLines = mdc.split('\n');
  const max = Math.max(canonLines.length, mdcLines.length);
  let firstDiff = null;
  for (let i = 0; i < max; i++) {
    if (canonLines[i] !== mdcLines[i]) {
      firstDiff = {
        line: i + 1,
        canon: canonLines[i] ?? '(EOF)',
        mdc: mdcLines[i] ?? '(EOF)',
      };
      break;
    }
  }

  console.error(JSON.stringify({
    control: 'C-00-vehicle-sync',
    derivationClass: 'internal-consistency',
    status: 'drift',
    message: 'ENFORCEMENT.md and enforcement.mdc body differ',
    firstDiff,
    canonLines: canonLines.length,
    mdcLines: mdcLines.length,
  }, null, 2));
  process.exit(1);
}

main();
