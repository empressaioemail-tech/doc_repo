/* Seed the combined design canvas page from this folder's build output.

     node build.mjs
     node seed-canvas.mjs [--shell <seeded page>] [--out <file>]

   The published canvas (https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY) is ONE
   self-contained HTML file: the canvas editor code plus a JSON block,
   <script type="application/json" id="appifact-doc">, holding
   { title, content: { files }, comments }, where `files` maps each artboard's
   .dc.html name to its source and "canvas.json" to the layout.

   This script takes the editor from an existing seeded page (the SHELL) and
   replaces only that JSON block with what build.mjs wrote here. Everything
   outside the block is carried over byte for byte, and the script refuses if
   it is not. Comments already on the shell's document are kept.

   The shell defaults to ./all-smartcity-designs.html (the last seed, gitignored).
   If that is gone, download the live page to disk with the Artifact tool
   (read, path "index.html") and pass it as --shell: the host wraps the served
   page in its own skeleton, and that wrapper is removed here.

   Rebuilt 2026-09-17. The .gitignore at _design/ named a seed-canvas.mjs that was
   never committed, so the last canvas could not be regenerated from the repo. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const shellPath = path.resolve(arg('shell', path.join(HERE, 'all-smartcity-designs.html')));
const outPath = path.resolve(arg('out', path.join(HERE, 'all-smartcity-designs.html')));
const TAG = '<script type="application/json" id="appifact-doc">';

function refuse(msg) { console.error('REFUSED: ' + msg); process.exit(2); }

let shell = fs.readFileSync(shellPath, 'utf8');
// A page downloaded from the host carries the host skeleton around the published file.
const inner = shell.indexOf('<!doctype html>\n<html lang="en">');
if (inner > 0) {
  const tail = '\n\n</body></html>';
  shell = shell.slice(inner, shell.endsWith(tail) ? shell.length - tail.length : shell.length);
  if (!shell.endsWith('\n')) shell += '\n';
}
const a = shell.indexOf(TAG);
if (a < 0) refuse('no appifact-doc block in the shell ' + shellPath);
const b = shell.indexOf('</script>', a);
const oldDoc = JSON.parse(shell.slice(a + TAG.length, b));
if (!oldDoc.content || !oldDoc.content.files) refuse('the shell document has no content.files');

const canvas = JSON.parse(fs.readFileSync(path.join(HERE, 'canvas.json'), 'utf8'));
const files = {};
for (const ab of canvas.artboards) {
  const p = path.join(HERE, ab.file);
  if (!fs.existsSync(p)) refuse('canvas.json names ' + ab.file + ', which build.mjs did not write');
  files[ab.file] = fs.readFileSync(p, 'utf8');
}
files['canvas.json'] = JSON.stringify(canvas);
// Same key order as earlier seeds: plain code-unit sort, which puts canvas.json last.
const sorted = Object.fromEntries(Object.keys(files).sort().map((k) => [k, files[k]]));
if (!files['Main.dc.html']) refuse('no entry artboard Main.dc.html');

const doc = { title: oldDoc.title, content: { files: sorted }, comments: oldDoc.comments ?? [] };
// "<" is escaped so no artboard source can close the script element early.
// Built from character codes so no editor or shell can collapse the escape into the
// character it names (that happened twice while writing this line).
const BS = String.fromCharCode(92);
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const json = JSON.stringify(doc)
  .split('<').join(BS + 'u003c')
  .split(LS).join(BS + 'u2028')
  .split(PS).join(BS + 'u2029');
if (json.includes('</')) refuse('the document JSON still contains a closing tag');
const out = shell.slice(0, a + TAG.length) + '\n' + json + '\n' + shell.slice(b);

// Verify what is about to be written, from the written form, before writing it.
const a2 = out.indexOf(TAG);
const b2 = out.indexOf('</script>', a2);
const back = JSON.parse(out.slice(a2 + TAG.length, b2));
if (out.slice(0, a2) !== shell.slice(0, a)) refuse('the editor before the document block changed');
if (out.slice(b2) !== shell.slice(b)) refuse('the editor after the document block changed');
const names = Object.keys(back.content.files);
if (names.length !== canvas.artboards.length + 1) refuse(`document holds ${names.length} files, expected ${canvas.artboards.length + 1}`);
for (const n of names) if (back.content.files[n] !== files[n]) refuse('file ' + n + ' did not survive the round trip');

fs.writeFileSync(outPath, out);
const before = Object.keys(oldDoc.content.files).length - 1;
console.log(`seeded ${outPath}`);
console.log(`  title "${back.title}", ${canvas.artboards.length} artboards (shell had ${before}), comments kept ${back.comments.length}, ${(out.length / 1048576).toFixed(2)} MB`);
