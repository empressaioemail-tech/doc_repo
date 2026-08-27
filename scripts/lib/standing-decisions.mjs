// Single extraction of the STANDING DECISIONS block from _STATE.md.
// Used by scripts/dispatch.mjs and scripts/dispatch-preamble.mjs so the hash both
// compute is the hash of the same body. Tested by
// scripts/enforcement/standing-decisions-extract.test.mjs.
//
// History: until 2026-08-26 both scripts inlined
//   /^## STANDING DECISIONS[^\n]*\n([\s\S]*?)(?=^## |\Z)/m
// JavaScript has no \Z; it is an identity escape for the letter Z, so the lookahead
// read "stop at the next '## ' heading OR at the first capital Z". On 2026-08-24 no Z
// appeared before the property seat's state, so the preamble over-ran into "# Seat:
// property" (a single-hash heading the pattern never stopped at). On 2026-08-26 a
// capital Z inside the second bullet truncated the block to six lines, and three
// dispatches were compiled and stamped against that truncated body. Over-broad and
// under-narrow from one defect. This module stops at any heading of one or two
// hashes, at a horizontal rule, or at end of input, and at nothing else.

const SECTION = /^## STANDING DECISIONS[^\n]*\n([\s\S]*?)(?=^#{1,2} |^---[ \t]*$|(?![\s\S]))/m;

/**
 * Returns the body of the STANDING DECISIONS section, leading and trailing whitespace removed,
 * or null when the heading is absent. Never returns a truncated body: the only
 * terminators are a level-1 or level-2 heading, a horizontal rule, or end of input.
 */
export function extractStandingDecisions(stateText) {
  const m = String(stateText).match(SECTION);
  if (!m) return null;
  return m[1].trim();
}

/** The defective pattern, exported only so the test can prove it fails. */
export const LEGACY_PATTERN = /^## STANDING DECISIONS[^\n]*\n([\s\S]*?)(?=^## |\Z)/m;
