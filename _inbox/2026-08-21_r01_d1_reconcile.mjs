#!/usr/bin/env node
/**
 * D1 meaning-shaped check: listing paths vs mesh table rows.
 * Two derivations: canon_set_listing.json paths[], and `| `path` | STATUS |` rows in 00_README.md.
 * Fail if the sets disagree. --self-test proves the check can fail.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const selfTest = process.argv.includes("--self-test");

function parseListing(jsonText) {
  const data = JSON.parse(jsonText);
  const paths = data.paths.map((p) => p.path);
  return { paths, countFiles: data.countFiles, countNpm: data.countNpm, countTotal: data.countTotal };
}

function parseMesh(mdText) {
  const rows = [];
  const re = /^\| `([^`]+)` \| (AUTHORITATIVE|SUBORDINATE|SUPERSEDED|QUARANTINE|REFERENCE) \|/gm;
  let m;
  while ((m = re.exec(mdText))) {
    const path = m[1].replace(/ \(npm\)$/, "");
    rows.push({ path, status: m[2] });
  }
  return rows;
}

function reconcile(listing, meshRows) {
  const listingSet = new Set(listing.paths);
  const meshSet = new Set(meshRows.map((r) => r.path));
  const onlyListing = [...listingSet].filter((p) => !meshSet.has(p));
  const onlyMesh = [...meshSet].filter((p) => !listingSet.has(p));
  const declaredTotal = listing.countTotal;
  const pathsLen = listing.paths.length;
  const meshLen = meshRows.length;
  const ok =
    onlyListing.length === 0 &&
    onlyMesh.length === 0 &&
    declaredTotal === pathsLen &&
    declaredTotal === meshLen &&
    listing.countFiles + listing.countNpm === listing.countTotal;
  return { ok, onlyListing, onlyMesh, declaredTotal, pathsLen, meshLen };
}

if (selfTest) {
  const listing = parseListing(
    JSON.stringify({
      paths: [
        { path: "a.md", kind: "file" },
        { path: "@pkg@1", kind: "npm" },
      ],
      countFiles: 1,
      countNpm: 1,
      countTotal: 2,
    }),
  );
  const mesh = parseMesh("| `a.md` | AUTHORITATIVE | x |\n| `b.md` | REFERENCE | y |\n");
  const r = reconcile(listing, mesh);
  if (r.ok) {
    console.error("self-test: expected FAIL on a.md/@pkg vs a.md/b.md, got ok");
    process.exit(1);
  }
  if (!r.onlyListing.includes("@pkg@1") || !r.onlyMesh.includes("b.md")) {
    console.error("self-test: mismatch sets wrong", r);
    process.exit(1);
  }
  const pass = reconcile(
    parseListing(
      JSON.stringify({
        paths: [{ path: "a.md", kind: "file" }],
        countFiles: 1,
        countNpm: 0,
        countTotal: 1,
      }),
    ),
    parseMesh("| `a.md` | REFERENCE | 00 |\n"),
  );
  if (!pass.ok) {
    console.error("self-test: expected PASS on identical singleton", pass);
    process.exit(1);
  }
  console.log("self-test ok");
  process.exit(0);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const listing = parseListing(readFileSync(join(root, "_blueprint", "canon_set_listing.json"), "utf8"));
const meshRows = parseMesh(readFileSync(join(root, "_blueprint", "00_README.md"), "utf8"));
const r = reconcile(listing, meshRows);
console.log(JSON.stringify(r, null, 2));
process.exit(r.ok ? 0 : 2);
