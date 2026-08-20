#!/usr/bin/env node
/**
 * Proof-by-violation for hostClassForPath.
 * Presence of a path string is not locality. Structure is.
 */
import { hostClassForPath } from './_lib.mjs';

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', msg);
  } else {
    console.log('pass', msg);
  }
}

assert(hostClassForPath('P:/doc_repo') === 'this-host', 'existing local path is this-host');
assert(
  hostClassForPath('P:/this-path-does-not-exist-hy04-hostclass-probe') === 'local-missing',
  'missing local path is local-missing, not stale',
);
assert(
  hostClassForPath('//no-such-host/share/hy04-unc-probe') === 'unc-missing',
  'UNC path is unmeasured (unc-missing), not stale',
);

let threw = false;
try {
  hostClassForPath('');
} catch {
  threw = true;
}
assert(threw, 'empty path refuses rather than emitting a class');

if (failed) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log('host-class.test.mjs: all proofs passed');
process.exit(0);
