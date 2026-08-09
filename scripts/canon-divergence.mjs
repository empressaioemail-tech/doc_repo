#!/usr/bin/env node
/**
 * M2 — Canon-vs-reality divergence detector.
 *
 * Compares machine-checkable postures in _catalog/repo_intents_checks.json
 * against measured git activity in local clones on P:\.
 *
 * FAIL OPEN: parse errors, missing clones, git failures → SKIPPED rows,
 * exit 0. A detector that breaks work gets disabled.
 *
 * Alarm surface: _catalog/canon_divergence.md (markdown file first; not CC).
 *
 * Usage:
 *   node scripts/canon-divergence.mjs
 *   node scripts/canon-divergence.mjs --no-fetch
 *   node scripts/canon-divergence.mjs --since 2026-07-04 --until 2026-08-09 \
 *     --checks _catalog/repo_intents_checks.2026-07-04.json --no-fetch --no-stamp \
 *     --out _inbox/2026-08-08_M2_historical_replay.md
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_CHECKS = join(root, '_catalog', 'repo_intents_checks.json');
const DEFAULT_OUT = join(root, '_catalog', 'canon_divergence.md');
const ACTIVE_DORMANT_DAYS = 60;
const FEAT_RE = /^feat(\(|:|\s|$)/i;

function parseArgs(argv) {
  const out = {
    checks: DEFAULT_CHECKS,
    out: DEFAULT_OUT,
    since: null,
    until: null,
    fetch: true,
    stamp: true,
    stdout: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--checks') out.checks = resolve(argv[++i]);
    else if (a === '--out') out.out = resolve(argv[++i]);
    else if (a === '--since') out.since = argv[++i];
    else if (a === '--until') out.until = argv[++i];
    else if (a === '--no-fetch') out.fetch = false;
    else if (a === '--no-stamp') out.stamp = false;
    else if (a === '--stdout') out.stdout = true;
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node scripts/canon-divergence.mjs [options]
  --checks <path>   checks JSON (default _catalog/repo_intents_checks.json)
  --out <path>      alarm markdown (default _catalog/canon_divergence.md)
  --since <date>    git --since (default: per-check last_verified)
  --until <date>    git --until (default: now)
  --no-fetch        skip git fetch
  --no-stamp        do not rewrite last_verified on OK active rows
  --stdout          also print report to stdout`);
      process.exit(0);
    }
  }
  return out;
}

function todayISO(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function daysBetween(fromISO, toISO) {
  const a = Date.parse(fromISO + 'T00:00:00Z');
  const b = Date.parse(toISO + 'T00:00:00Z');
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.floor((b - a) / 86400000);
}

function isAcked(ackUntil, asOf) {
  if (!ackUntil) return false;
  return String(ackUntil) >= String(asOf);
}

function git(cwd, args, { allowFail = true } = {}) {
  try {
    const buf = execFileSync('git', ['-C', cwd, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 120000,
    });
    return { ok: true, out: buf.trimEnd() };
  } catch (err) {
    if (!allowFail) throw err;
    const stderr = err && err.stderr ? String(err.stderr).trim() : String(err.message || err);
    return { ok: false, out: '', err: stderr.slice(0, 400) };
  }
}

function listCommits(clone, { since, until, paths }) {
  const args = ['log', '--format=%h|%ad|%s', '--date=short'];
  if (since) args.push(`--since=${since}`);
  if (until) args.push(`--until=${until}`);
  if (paths && paths.length) {
    args.push('--', ...paths);
  }
  const res = git(clone, args);
  if (!res.ok) return { ok: false, commits: [], err: res.err };
  if (!res.out) return { ok: true, commits: [] };
  const commits = res.out
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [hash, date, ...rest] = line.split('|');
      return { hash, date, subject: rest.join('|') };
    });
  return { ok: true, commits };
}

function classifyCommits(commits, severePathsTouched) {
  let featCount = 0;
  let severePathCount = 0;
  for (const c of commits) {
    if (FEAT_RE.test(c.subject)) featCount++;
  }
  severePathCount = severePathsTouched;
  return { featCount, severePathCount };
}

function countSeverePathCommits(clone, { since, until, severePaths }) {
  if (!severePaths || !severePaths.length) return 0;
  const res = listCommits(clone, { since, until, paths: severePaths });
  if (!res.ok) return 0;
  return res.commits.length;
}

function verdictFor({ posture, commitCount, featCount, severePathCount }) {
  const p = String(posture || '').toLowerCase();
  if (p === 'no-touch') {
    if (commitCount > 0) return 'DIVERGENT-SEVERE';
    return 'OK';
  }
  if (p === 'retiring' || p === 'zero-new-work') {
    if (commitCount === 0) return 'OK';
    if (featCount > 0 || severePathCount > 0) return 'DIVERGENT-SEVERE';
    return 'DIVERGENT';
  }
  if (p === 'active' || p === 'factory') {
    // dormancy handled by caller with window length
    return 'OK';
  }
  // Unknown posture: unmonitored, not an alarm
  return 'UNMONITORED';
}

function loadChecks(path) {
  try {
    if (!existsSync(path)) {
      return { ok: false, err: `checks file missing: ${path}` };
    }
    const raw = readFileSync(path, 'utf8');
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.repos)) {
      return { ok: false, err: 'checks JSON missing repos[]' };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, err: String(err.message || err) };
  }
}

function reportStatus(divergent, skipped, escalated) {
  if (divergent.length) return 'ALARM';
  if (skipped.length || escalated.length) return 'DEGRADED';
  return 'clear';
}

function renderReport({
  args,
  asOf,
  rows,
  unmonitored,
  unmonitoredRepos,
  meta,
  runtimeMs,
  escalated,
}) {
  const divergent = rows.filter((r) => r.verdict.startsWith('DIVERGENT'));
  const acked = rows.filter((r) => r.verdict === 'ACKNOWLEDGED');
  const skipped = rows.filter((r) => r.verdict === 'SKIPPED' || r.verdict === 'ERROR');
  const ok = rows.filter((r) => r.verdict === 'OK');
  const status = reportStatus(divergent, skipped, escalated);

  const lines = [];
  lines.push('---');
  lines.push('id: canon_divergence');
  lines.push('title: Canon-vs-reality divergence report (M2)');
  lines.push(`status: ${status}`);
  lines.push(`last_updated: ${asOf}`);
  lines.push('generated_by: scripts/canon-divergence.mjs');
  lines.push(`checks: ${args.checks.replace(/\\/g, '/')}`);
  lines.push('---');
  lines.push('');
  lines.push('# Canon divergence (M2)');
  lines.push('');
  lines.push(
    `Generated ${asOf}. Runtime ${runtimeMs} ms. Window: since=${args.since || 'per-row last_verified'} until=${args.until || 'now'}. Fetch=${args.fetch ? 'yes' : 'no'}.`,
  );
  lines.push('');
  lines.push(
    `**Summary:** ${divergent.length} divergent · ${acked.length} acknowledged · ${ok.length} ok · ${skipped.length} skipped · ${unmonitoredRepos.length} repos unmonitored · ${unmonitored} empty-posture rows.`,
  );
  lines.push('');
  lines.push(
    'Alarm surface: this file. `_STATE.md` GOVERNANCE links here. Not Command Center — the watcher must not carry a five-service deploy dependency.',
  );
  lines.push('');
  lines.push(
    'Cadence: `.claude/hooks/canon-divergence-run.ps1` on Read of `_STATE.md` (stale-report refresh, fail-open). Manual: `node scripts/canon-divergence.mjs`.',
  );
  lines.push('');

  if (escalated.length) {
    lines.push('## ESCALATED (divergent >30d, unacknowledged)');
    lines.push('');
    lines.push('Governance process is broken for these rows — posture not updated and no `acknowledged_until`.');
    lines.push('');
    for (const r of escalated) {
      lines.push(`- **${r.checkId}** (${r.repo}): first seen ${r.firstSeen || r.since}, age ≥30d, verdict ${r.verdict}`);
    }
    lines.push('');
  }

  if (divergent.length) {
    lines.push('## DIVERGENT');
    lines.push('');
    lines.push('| Check | Repo | Posture | Commits | Feat | Severe-path | Since | Verdict | Note |');
    lines.push('|---|---|---|---:|---:|---:|---|---|---|');
    for (const r of divergent) {
      lines.push(
        `| ${r.checkId} | ${r.repo} | ${r.posture} | ${r.commitCount} | ${r.featCount} | ${r.severePathCount} | ${r.since} | ${r.verdict} | ${escapeCell(r.note)} |`,
      );
    }
    lines.push('');
    lines.push('### Evidence (top commits)');
    lines.push('');
    for (const r of divergent) {
      lines.push(`#### ${r.checkId} (${r.repo})`);
      lines.push('');
      if (!r.sample.length) {
        lines.push('_no commit samples_');
      } else {
        for (const c of r.sample) {
          lines.push(`- \`${c.hash}\` ${c.date} ${c.subject}`);
        }
      }
      lines.push('');
    }
  } else {
    lines.push('## DIVERGENT');
    lines.push('');
    lines.push('_none_');
    lines.push('');
  }

  if (acked.length) {
    lines.push('## ACKNOWLEDGED (suppressed until expiry)');
    lines.push('');
    lines.push('| Check | Repo | Acknowledged until | Would-be verdict | Commits |');
    lines.push('|---|---|---|---|---:|');
    for (const r of acked) {
      lines.push(
        `| ${r.checkId} | ${r.repo} | ${r.acknowledgedUntil} | ${r.wouldBe} | ${r.commitCount} |`,
      );
    }
    lines.push('');
  }

  lines.push('## OK');
  lines.push('');
  if (!ok.length) {
    lines.push('_none_');
  } else {
    lines.push('| Check | Repo | Posture | Commits | Last verified |');
    lines.push('|---|---|---|---:|---|');
    for (const r of ok) {
      lines.push(`| ${r.checkId} | ${r.repo} | ${r.posture} | ${r.commitCount} | ${r.lastVerified} |`);
    }
  }
  lines.push('');

  if (skipped.length) {
    lines.push('## SKIPPED / ERROR (fail-open)');
    lines.push('');
    lines.push('| Check | Repo | Verdict | Detail |');
    lines.push('|---|---|---|---|');
    for (const r of skipped) {
      lines.push(`| ${r.checkId} | ${r.repo} | ${r.verdict} | ${escapeCell(r.note)} |`);
    }
    lines.push('');
  }

  if (unmonitoredRepos.length) {
    lines.push('## UNMONITORED (in portfolio_repos, absent from repos[])');
    lines.push('');
    for (const id of unmonitoredRepos) lines.push(`- ${id}`);
    lines.push('');
  }

  lines.push('## Meta');
  lines.push('');
  lines.push(`- checks_schema: ${meta.schema_version ?? 'unknown'}`);
  lines.push(`- as_of_intent: ${meta.as_of || 'live'}`);
  lines.push(`- unmonitored_empty_posture: ${unmonitored}`);
  lines.push(`- unmonitored_absent_repos: ${unmonitoredRepos.length}`);
  lines.push(`- per_repo_last_verified: yes (repo_intents_checks.json, not doc-level last_updated)`);
  lines.push('');
  lines.push(
    'To acknowledge without changing posture: set `acknowledged_until: YYYY-MM-DD` on the check or repo row. Never a permanent mute. A row red >30d with no ack appears under ESCALATED.',
  );
  lines.push('');
  return lines.join('\n');
}

function escapeCell(s) {
  return String(s || '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function expandRepoRows(repo) {
  // Repo-level posture is checked unless explicitly disabled (multi-clock monorepos
  // should prefer path clocks; whole-repo retiring is overbroad for clock-3 carve-outs).
  const rows = [];
  const repoLevel = repo.repo_level_check !== false;
  if (repoLevel) {
    let note = repo.note || '';
    if (repo.overbroad_repo_level) {
      note =
        (note ? note + ' ' : '') +
        'OVERBROAD: whole-repo retiring/zero-new-work alarms on any commit, including clock-3 maintenance the decision may have expected. Prefer path-scoped clocks for the load-bearing signal.';
    }
    rows.push({
      checkId: `${repo.id}::repo`,
      posture: repo.posture,
      paths: null,
      severePaths: repo.severe_paths || ['migrations', 'lib/db/drizzle'],
      lastVerified: repo.last_verified,
      acknowledgedUntil: repo.acknowledged_until || null,
      decision: repo.decision || '',
      note,
      firstSeen: repo.first_seen || null,
    });
  }
  for (const c of repo.checks || []) {
    rows.push({
      checkId: c.id,
      posture: c.posture,
      paths: c.paths || null,
      severePaths: c.severe_paths || repo.severe_paths || ['migrations', 'lib/db/drizzle'],
      lastVerified: c.last_verified || repo.last_verified,
      acknowledgedUntil: c.acknowledged_until || repo.acknowledged_until || null,
      decision: c.decision || repo.decision || '',
      note: c.note || '',
      firstSeen: c.first_seen || null,
    });
  }
  return rows;
}

function main() {
  const started = Date.now();
  const args = parseArgs(process.argv.slice(2));
  const asOf = args.until ? String(args.until).slice(0, 10) : todayISO();

  const loaded = loadChecks(args.checks);
  if (!loaded.ok) {
    const report = [
      '---',
      'id: canon_divergence',
      'title: Canon-vs-reality divergence report (M2)',
      'status: SKIPPED',
      `last_updated: ${asOf}`,
      '---',
      '',
      '# Canon divergence (M2)',
      '',
      `SKIPPED (fail-open): ${loaded.err}`,
      '',
    ].join('\n');
    try {
      mkdirSync(dirname(args.out), { recursive: true });
      writeFileSync(args.out, report, 'utf8');
    } catch {
      // fail open
    }
    if (args.stdout) process.stdout.write(report);
    console.error(`[m2] fail-open: ${loaded.err}`);
    process.exit(0);
  }

  const meta = loaded.data;
  const resultRows = [];
  let unmonitored = 0;
  const stampTargets = []; // { repoId, checkId|null, date }

  for (const repo of meta.repos) {
    const clone = repo.clone;
    if (!clone || !existsSync(clone)) {
      resultRows.push({
        checkId: `${repo.id}::repo`,
        repo: repo.id,
        posture: repo.posture,
        commitCount: 0,
        featCount: 0,
        severePathCount: 0,
        since: repo.last_verified || '?',
        lastVerified: repo.last_verified || '?',
        verdict: 'SKIPPED',
        note: `clone missing: ${clone}`,
        sample: [],
        acknowledgedUntil: null,
        wouldBe: null,
      });
      continue;
    }

    if (args.fetch) {
      // Prefer origin; ignore failure (offline / auth). Measurement still uses local.
      git(clone, ['fetch', '--quiet', 'origin']);
    }

    const checks = expandRepoRows(repo);
    if (!repo.checks || repo.checks.length === 0) {
      // repo-level only — still monitored via posture. Count as unmonitored only
      // when posture has no measurable predicate.
      if (!repo.posture) unmonitored++;
    }

    for (const check of checks) {
      const since = args.since || check.lastVerified;
      if (!since) {
        resultRows.push({
          checkId: check.checkId,
          repo: repo.id,
          posture: check.posture,
          commitCount: 0,
          featCount: 0,
          severePathCount: 0,
          since: '?',
          lastVerified: '?',
          verdict: 'SKIPPED',
          note: 'no last_verified and no --since',
          sample: [],
          acknowledgedUntil: check.acknowledgedUntil,
          wouldBe: null,
        });
        continue;
      }

      const listed = listCommits(clone, {
        since,
        until: args.until,
        paths: check.paths,
      });
      if (!listed.ok) {
        resultRows.push({
          checkId: check.checkId,
          repo: repo.id,
          posture: check.posture,
          commitCount: 0,
          featCount: 0,
          severePathCount: 0,
          since,
          lastVerified: check.lastVerified || '?',
          verdict: 'ERROR',
          note: listed.err || 'git log failed',
          sample: [],
          acknowledgedUntil: check.acknowledgedUntil,
          wouldBe: null,
        });
        continue;
      }

      // severe_paths (migrations/) apply at repo-level posture only.
      // Path-scoped clocks escalate on ^feat within their own paths, not on
      // unrelated migration commits elsewhere in the monorepo.
      const severePathCount = check.paths
        ? 0
        : countSeverePathCommits(clone, {
            since,
            until: args.until,
            severePaths: check.severePaths,
          });
      const { featCount } = classifyCommits(listed.commits, severePathCount);
      let verdict = verdictFor({
        posture: check.posture,
        commitCount: listed.commits.length,
        featCount,
        severePathCount,
      });

      let note = check.note || '';

      // Active/factory dormancy: zero commits across ACTIVE_DORMANT_DAYS.
      // Skip when caller forced a shorter --since window (historical replay).
      const p = String(check.posture || '').toLowerCase();
      if ((p === 'active' || p === 'factory') && check.checkId.endsWith('::repo')) {
        const windowStart = todayISO(
          new Date(Date.parse(asOf + 'T00:00:00Z') - ACTIVE_DORMANT_DAYS * 86400000),
        );
        const span = daysBetween(since, asOf);
        if (span === null || span >= ACTIVE_DORMANT_DAYS) {
          const dorm = listCommits(clone, {
            since: windowStart,
            until: args.until,
            paths: null,
          });
          if (dorm.ok && dorm.commits.length === 0) {
            verdict = 'DIVERGENT';
            note = `active/factory repo dormant: 0 commits in ${ACTIVE_DORMANT_DAYS} days.`;
          }
        }
      }

      if (verdict.startsWith('DIVERGENT') && !note.includes('dormant')) {
        note =
          (note ? note + ' ' : '') +
          `${listed.commits.length} commit(s) since ${since} against posture '${check.posture}'.` +
          (check.decision ? ` See ${check.decision}.` : '');
      } else if (verdict.startsWith('DIVERGENT') && note.includes('dormant')) {
        // keep dormancy note
      }

      let finalVerdict = verdict;
      let wouldBe = null;
      if (verdict.startsWith('DIVERGENT') && isAcked(check.acknowledgedUntil, asOf)) {
        wouldBe = verdict;
        finalVerdict = 'ACKNOWLEDGED';
        note = `acknowledged_until ${check.acknowledgedUntil}; would be ${wouldBe}. ${note}`;
      }

      if (
        args.stamp &&
        finalVerdict === 'OK' &&
        (p === 'active' || p === 'factory') &&
        check.checkId.endsWith('::repo') &&
        listed.commits.length > 0
      ) {
        stampTargets.push({ repoId: repo.id, date: asOf });
      }

      // For zero-new-work OK with zero commits, also eligible to stamp check last_verified
      if (
        args.stamp &&
        finalVerdict === 'OK' &&
        (p === 'zero-new-work' || p === 'no-touch' || p === 'retiring') &&
        listed.commits.length === 0
      ) {
        stampTargets.push({
          repoId: repo.id,
          checkId: check.checkId === `${repo.id}::repo` ? null : check.checkId,
          date: asOf,
        });
      }

      // Persist first_seen for escalation clock when newly divergent
      if (finalVerdict.startsWith('DIVERGENT') && !check.firstSeen && args.stamp) {
        stampTargets.push({
          repoId: repo.id,
          checkId: check.checkId === `${repo.id}::repo` ? null : check.checkId,
          date: asOf,
          field: 'first_seen',
        });
      }

      resultRows.push({
        checkId: check.checkId,
        repo: repo.id,
        posture: check.posture,
        commitCount: listed.commits.length,
        featCount,
        severePathCount,
        since,
        lastVerified: check.lastVerified || since,
        verdict: finalVerdict,
        note,
        sample: listed.commits.slice(0, 12),
        acknowledgedUntil: check.acknowledgedUntil,
        wouldBe,
        firstSeen: check.firstSeen || (finalVerdict.startsWith('DIVERGENT') ? since : null),
      });
    }
  }

  // Empty posture inside checks JSON
  for (const repo of meta.repos) {
    if (!repo.posture) unmonitored++;
    for (const c of repo.checks || []) {
      if (!c.posture) unmonitored++;
    }
  }

  // Portfolio repos named but absent from repos[] are unmonitored (coverage signal)
  const present = new Set((meta.repos || []).map((r) => r.id));
  const portfolio = Array.isArray(meta.portfolio_repos) ? meta.portfolio_repos : [];
  const unmonitoredRepos = portfolio.filter((id) => !present.has(id));

  // Escalate divergent rows whose first_seen/since is >30 days ago and unacked
  const escalated = resultRows.filter((r) => {
    if (!r.verdict.startsWith('DIVERGENT')) return false;
    const origin = r.firstSeen || r.since;
    const age = daysBetween(origin, asOf);
    return age !== null && age > 30;
  });

  const runtimeMs = Date.now() - started;
  const report = renderReport({
    args,
    asOf,
    rows: resultRows,
    unmonitored,
    unmonitoredRepos,
    meta,
    runtimeMs,
    escalated,
  });

  try {
    mkdirSync(dirname(args.out), { recursive: true });
    writeFileSync(args.out, report, 'utf8');
  } catch (err) {
    console.error(`[m2] fail-open write: ${err.message || err}`);
  }

  // Optional stamp of last_verified on OK rows (live runs only; historical uses --no-stamp)
  if (args.stamp && stampTargets.length && args.checks === resolve(DEFAULT_CHECKS)) {
    try {
      stampLastVerified(args.checks, stampTargets);
    } catch (err) {
      console.error(`[m2] fail-open stamp: ${err.message || err}`);
    }
  }

  if (args.stdout) process.stdout.write(report);

  const divCount = resultRows.filter((r) => r.verdict.startsWith('DIVERGENT')).length;
  console.error(
    `[m2] wrote ${args.out} — status=${reportStatus(resultRows.filter((r) => r.verdict.startsWith('DIVERGENT')), resultRows.filter((r) => r.verdict === 'SKIPPED' || r.verdict === 'ERROR'), escalated)} · ${divCount} divergent · ${resultRows.length} rows · ${runtimeMs} ms`,
  );
  process.exit(0);
}

function stampLastVerified(checksPath, targets) {
  const data = JSON.parse(readFileSync(checksPath, 'utf8'));
  for (const t of targets) {
    const repo = data.repos.find((r) => r.id === t.repoId);
    if (!repo) continue;
    const field = t.field || 'last_verified';
    if (!t.checkId) {
      if (field === 'first_seen' && repo.first_seen) continue;
      repo[field] = t.date;
    } else {
      const c = (repo.checks || []).find((x) => x.id === t.checkId);
      if (!c) continue;
      if (field === 'first_seen' && c.first_seen) continue;
      c[field] = t.date;
    }
  }
  writeFileSync(checksPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function writeFatalSkipped(err) {
  const asOf = todayISO();
  const out = DEFAULT_OUT;
  const report = [
    '---',
    'id: canon_divergence',
    'title: Canon-vs-reality divergence report (M2)',
    'status: DEGRADED',
    `last_updated: ${asOf}`,
    'generated_by: scripts/canon-divergence.mjs',
    '---',
    '',
    '# Canon divergence (M2)',
    '',
    `DEGRADED (fail-open fatal): ${String(err && err.message ? err.message : err).slice(0, 500)}`,
    '',
    'Detector crashed before completing. Prior clear status must not be trusted until a successful run.',
    '',
  ].join('\n');
  try {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, report, 'utf8');
  } catch {
    // fail open
  }
}

try {
  main();
} catch (err) {
  // Absolute fail-open: never break a calling loop; do not leave a stale clear report.
  console.error(`[m2] fatal fail-open: ${err && err.stack ? err.stack : err}`);
  writeFatalSkipped(err);
  process.exit(0);
}
