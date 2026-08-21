#!/usr/bin/env node
/**
 * HOOK LOADABILITY TEST.
 *
 * WHY THIS EXISTS. On 2026-08-21 the R-04 control census found SEAT-01 dormant.
 * `.cursor/hooks/seat-gate.mjs` was registered in `.claude/settings.json` on BOTH the shell
 * and write matchers, and it imported from `../scripts/enforcement/...`, which from
 * `.cursor/hooks/` resolves to `.cursor/scripts/enforcement/`. The real path is
 * `scripts/enforcement/`. Every invocation threw ERR_MODULE_NOT_FOUND, printed a stack trace,
 * and exited 0. The control had never fired once.
 *
 * That is the failure ENFORCEMENT.md names explicitly: "A hook or CI check that cannot run
 * and silently passes is the defect." It is worse than an absent control, because the
 * operator was told the gate was protecting a seat boundary and made a ruling on that basis.
 *
 * Nothing checked that a registered hook could load. This does. It is deliberately narrow:
 * it does not assert what a hook decides, only that it is capable of deciding at all. A hook
 * that loads and decides wrongly is a different defect with a different test.
 */

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, isAbsolute } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

function registeredHooks() {
  const out = [];
  for (const settings of [".claude/settings.json", ".claude/settings.local.json"]) {
    const p = join(ROOT, settings);
    if (!existsSync(p)) continue;
    let cfg;
    try {
      cfg = JSON.parse(readFileSync(p, "utf8"));
    } catch {
      // A settings file that cannot be parsed cannot be audited. Refuse rather than skip:
      // skipping would report green on an unreadable config, which is this exact defect.
      console.error(`REFUSING: ${settings} did not parse. An unauditable config is not a pass.`);
      process.exit(1);
    }
    for (const groups of Object.values(cfg.hooks ?? {})) {
      for (const g of groups) {
        for (const h of g.hooks ?? []) {
          if (h.command) out.push({ settings, command: h.command });
        }
      }
    }
  }
  return out;
}

// Pull the script path out of a hook command, whichever runner it uses.
function scriptOf(command) {
  const ps = command.match(/-File\s+("[^"]+"|\S+)/i);
  if (ps) return ps[1].replace(/^"|"$/g, "");
  const node = command.match(/\bnode\s+("[^"]+"|\S+\.mjs)/i);
  if (node) return node[1].replace(/^"|"$/g, "");
  return null;
}

const hooks = registeredHooks();
if (hooks.length === 0) {
  console.error("REFUSING: no registered hooks found. Absent is not a pass; if hooks were");
  console.error("removed deliberately, remove this control in the same commit.");
  process.exit(1);
}

// Whether a .ps1 can be parse-checked at all here. Established once, by asking, rather than
// inferred from the platform string.
const HAS_POWERSHELL = (() => {
  const r = spawnSync("powershell", ["-NoProfile", "-Command", "exit 0"], { encoding: "utf8", timeout: 20_000 });
  return !r.error && r.status === 0;
})();

const results = [];
let failed = 0;
let notParsed = 0;

for (const { settings, command } of hooks) {
  const script = scriptOf(command);
  const label = (script ?? command).replace(/^.*[\\/]/, "");

  if (!script) {
    results.push([false, label, "could not parse a script path out of the command"]);
    failed += 1;
    continue;
  }

  // Hook commands are registered with ABSOLUTE paths from the machine that wrote settings
  // (P:/doc_repo/.claude/hooks/...). Those do not exist on a Linux CI runner, so a naive
  // isAbsolute check reported all seven hooks MISSING on the first CI run of this control.
  // That is this control failing by environment, which is the exact class it was built to
  // catch. Re-root any absolute path onto the actual repo root by its repo-relative tail.
  let abs = isAbsolute(script) ? script : join(ROOT, script);
  if (!existsSync(abs)) {
    const m = script.replace(/\\/g, "/").match(/(?:^|\/)((?:\.claude|\.cursor|scripts)\/.+)$/);
    if (m) {
      const rerooted = join(ROOT, m[1]);
      if (existsSync(rerooted)) abs = rerooted;
    }
  }
  if (!existsSync(abs)) {
    results.push([false, label, `registered but file does not exist: ${script}`]);
    failed += 1;
    continue;
  }

  if (abs.endsWith(".mjs")) {
    // Import-only. A module whose imports do not resolve throws here, which is exactly the
    // seat-gate defect. stdin is closed so a hook waiting on input cannot hang the test.
    const r = spawnSync(process.execPath, ["--input-type=module", "-e", `await import(${JSON.stringify("file:///" + abs.replace(/\\/g, "/"))})`], {
      cwd: ROOT,
      encoding: "utf8",
      timeout: 20_000,
      input: "",
    });
    const err = (r.stderr || "") + (r.error ? String(r.error) : "");
    const broken = /ERR_MODULE_NOT_FOUND|Cannot find module|SyntaxError/.test(err);
    results.push([!broken, label, broken ? err.split("\n").find((l) => /Error/.test(l)) ?? "load error" : "loads"]);
    if (broken) failed += 1;
  } else if (!HAS_POWERSHELL) {
    // PowerShell is absent on the Linux CI runner, so a .ps1 cannot be parse-checked there.
    // DO NOT let that read as a pass: unmeasured and passing are different states and this
    // control exists because collapsing them hid a dead hook for weeks. Check what CAN be
    // checked here (registered, present, non-empty) and DECLARE the parse check as not run.
    let bytes = 0;
    try {
      bytes = readFileSync(abs).length;
    } catch {
      bytes = 0;
    }
    const ok = bytes > 0;
    results.push([ok, label, ok ? `present ${bytes}B — PARSE NOT RUN (no powershell on ${process.platform})` : "unreadable or empty"]);
    if (!ok) failed += 1;
    notParsed += 1;
  } else {
    // PowerShell hooks: parse-only, no execution, so nothing is mutated by the test.
    const r = spawnSync(
      "powershell",
      ["-NoProfile", "-Command", `$e=$null;[void][System.Management.Automation.Language.Parser]::ParseFile('${abs.replace(/'/g, "''")}',[ref]$null,[ref]$e); if($e -and $e.Count -gt 0){ Write-Output "PARSE_ERROR"; exit 1 } else { Write-Output "OK" }`],
      { cwd: ROOT, encoding: "utf8", timeout: 30_000 },
    );
    const ok = /OK/.test(r.stdout || "") && r.status === 0;
    results.push([ok, label, ok ? "parses" : "parse error"]);
    if (!ok) failed += 1;
  }
}

console.log("\nhook loadability — every registered hook must be capable of deciding\n");
for (const [ok, label, note] of results) console.log(`  ${ok ? "PASS" : "FAIL"}  ${label.padEnd(30)} ${note}`);
console.log(`\n${hooks.length} registered hooks checked`);
if (notParsed > 0) {
  console.log(`DECLARED LIMIT: ${notParsed} PowerShell hook(s) were checked for presence only.`);
  console.log("PowerShell is unavailable here, so a syntax error in a .ps1 would NOT be caught");
  console.log("by this run. That is a real gap in the coverage, not a pass, and it is stated");
  console.log("rather than absorbed. The Windows run is where the parse check actually fires.");
}
console.log(`RESULT: ${failed === 0 ? "PASS" : `FAIL (${failed})`} — exit ${failed === 0 ? 0 : 1}`);
process.exit(failed === 0 ? 0 : 1);
