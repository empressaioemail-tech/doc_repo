/**
 * Verify check.mjs by violating it on the REAL boards, not on a fixture.
 *
 *   node violate.mjs
 *
 * Each plant below changes one real artboard in memory (nothing is written to
 * disk), runs checkBoards(), and requires that the named rule fires. A plant
 * that does not change its board is itself a failure: an aim that misses
 * proves nothing about the check (five planner plants were mis-aimed on
 * 2026-09-16 before this convention existed). The unplanted boards must be
 * clean, or no plant result means anything.
 *
 * Exit 0 only when every plant changed its board and every rule fired.
 */
import { checkBoards, loadBoards, loadSource, RULES } from './check.mjs';

const S = loadSource();
const real = loadBoards();

const baseline = checkBoards(real, S);
if (baseline.findings.length) {
  console.error('REFUSED: the real boards are not clean, so a plant proves nothing.');
  for (const f of baseline.findings) console.error('  ' + f.rule + ' ' + f.board + ': ' + f.detail);
  process.exit(2);
}

const once = (from, to) => (h) => {
  const i = h.indexOf(from);
  return i < 0 ? h : h.slice(0, i) + to + h.slice(i + from.length);
};

const PLANTS = [
  ['R1', 'Review.dc.html', 'a citation element renders the wrong edition',
    once('(bastrop_tx-bdc-2026-adopted)</span>', '(bastrop_tx-bdc-2019-adopted)</span>')],
  ['R1', 'Main.dc.html', 'a plain-text citation drops the book title',
    once('under City of Bastrop Building Block B3 Section', 'under Bastrop Development Code Section')],
  ['R2', 'Summary.dc.html', 'a section that does not exist, cited six times in the reasoner draft',
    once('All five against', 'Also see Section 14-02-005. All five against')],
  ['R2', 'Findings.dc.html', 'an IRC section the product never emits',
    once('No citation (R302.1', 'No citation (R999.9')],
  ['R3', 'Setup.dc.html', 'an absence word outside the four kinds',
    once('data-absence="unchecked"', 'data-absence="unknown"')],
  ['R4', 'Findings.dc.html', 'a tile count that no longer ties to its rows',
    once('data-count-group="clear" data-count="4"', 'data-count-group="clear" data-count="5"')],
  ['R4', 'Revised.dc.html', 'a change count that no longer ties',
    once('data-count-change="resolved" data-count="1"', 'data-count-change="resolved" data-count="2"')],
  ['R4', 'Verify.dc.html', 'a checklist total that disagrees with the preview',
    once('data-checklist-total="9"', 'data-checklist-total="8"')],
  ['R5', 'Findings.dc.html', 'an AI reading on a sheet that is not in the set',
    once('data-sheet="A-101"', 'data-sheet="A-301"')],
  ['R5', 'Revised.dc.html', 'readings shown with the software disclosure removed',
    (h) => h.replaceAll('read from your drawings by software and has not been checked by a person', 'read from your drawings')],
  ['R6', 'Findings.dc.html', 'approval language outside a declared negation',
    once('Move the house back', 'This complies once you move the house back')],
  ['R6', 'Verify.dc.html', 'a negation marker removed, so the approval word becomes a claim',
    (h) => h.replaceAll('<!--neg-->', '').replaceAll('<!--/neg-->', '')],
  ['R7', 'Review.dc.html', 'a reviewer named instead of a role',
    once('Confirmed by the Development services reviewer', 'Confirmed by M. Leavis')],
  ['R8', 'Main.dc.html', 'the retired product name',
    once('Plan precheck</span>', 'CitizenConnect</span>')],
  ['R9', 'Submit.dc.html', 'the FIXTURE badge removed',
    once('data-fixture="1"', 'data-x="1"')],
  ['R10', 'Submit.dc.html', 'an open count that disagrees with the findings document',
    once('data-open-count="1"', 'data-open-count="0"')],
  ['R10', 'Submit.dc.html', 'the apply-anyway action removed',
    once('data-action="submit-anyway"', 'data-action="submit"')],
  ['R11', 'Summary.dc.html', 'a confidence figure on the applicant document',
    once('1 suggestion is still open.', '1 suggestion is still open at 92% confidence.')],
  ['R12', 'Findings.dc.html', 'the applicant shown a product determination',
    once('data-tag="SUGGESTION"', 'data-tag="Fail"')],
  ['R12', 'Review.dc.html', 'a staff determination the product does not have',
    once('data-tag="Pass"', 'data-tag="Likely"')],
  ['R13', 'Review.dc.html', 'an engagement stage dropped from the decision control',
    once('data-stage="Denied"', 'data-stage="Withdrawn"')],
];

let bad = 0;
const fired = new Set();
for (const [rule, file, what, mutate] of PLANTS) {
  const after = mutate(real[file]);
  if (after === real[file]) {
    console.error(`MISS   ${rule.padEnd(4)} ${file.padEnd(18)} the plant did not change the board: ${what}`);
    bad += 1;
    continue;
  }
  const r = checkBoards({ ...real, [file]: after }, S);
  const hit = r.findings.filter((f) => f.rule === rule);
  if (hit.length) {
    fired.add(rule);
    console.log(`FIRED  ${rule.padEnd(4)} ${file.padEnd(18)} ${what}\n         -> ${hit[0].detail}`);
  } else {
    console.error(`SILENT ${rule.padEnd(4)} ${file.padEnd(18)} ${what}`);
    bad += 1;
  }
}
const unproven = RULES.filter((r) => !fired.has(r));
if (unproven.length) { console.error('rules never proven by a plant: ' + unproven.join(', ')); bad += 1; }
console.log(`${PLANTS.length} plants on the real boards, ${PLANTS.length - bad} fired as aimed, rules proven ${fired.size}/${RULES.length}`);
process.exit(bad ? 1 : 0);
