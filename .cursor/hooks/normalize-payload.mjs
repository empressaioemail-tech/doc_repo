#!/usr/bin/env node
/**
 * CURSOR PAYLOAD NORMALIZER. The one place a Cursor hook payload is translated into the
 * Claude Code payload shape the existing gates already parse.
 *
 * WHY THIS EXISTS. `.claude/settings.json` registers eleven gates. `.cursor/hooks.json`
 * registered one. Copying the Claude registrations across unchanged would have produced a
 * fresh crop of gates that load, run, decide nothing, and report success, because the
 * payload shapes differ in three places that each cause a fail-open exit:
 *
 *   1. beforeShellExecution carries the command at TOP LEVEL as `command`. The PowerShell
 *      gates read `tool_input.command` (or the array form), so `Get-ToolCommandAndCwd`
 *      returns null and every one of them calls Exit-Open. Verified 2026-09-18 by running
 *      the real helper against a captured payload.
 *   2. The sub-agent launch tool is named `Task`, not `Agent`. canon-gate.ps1 and
 *      dispatch-template-gate.ps1 both gate first on `$toolName -notin @('Agent','Write')`
 *      and exit open, so a Cursor sub-agent launch skips both.
 *   3. beforeReadFile sends no `tool_name` at all, so canon-divergence-run.ps1's
 *      `tool_name -ne 'Read'` guard exits open.
 *
 * The payloads this is written against are RECORDS, not schemas: they were captured from the
 * live harness on 2026-09-18 and are checked in verbatim at
 * `_catalog/fixtures/cursor-hook-payloads.json`.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO. It does not synthesize `agent_id` or `agent_type`.
 * Cursor sends `subagent_type`, which names the agent being LAUNCHED, while fan-depth-gate's
 * `inSubAgent` flag means "a sub-agent is launching another sub-agent". Those are different
 * questions. Mapping one onto the other would silently convert every depth-1 launch into a
 * depth-2 refusal. The Cursor limitation that results (a nested launch is caught at close
 * time, not at launch) is declared in the tooling register instead of papered over here.
 */

/** `/p:/doc_repo` -> `P:/doc_repo`. Note seat-register.mjs normalizePath does not handle the
 *  leading-slash-plus-colon form and would produce `p::/doc_repo`, so this is not a duplicate
 *  of it. */
export function normalizePath(p) {
  if (!p) return '';
  let s = String(p).trim().replace(/\\/g, '/');
  if (/^\/[A-Za-z]:\//.test(s)) s = s.slice(1);
  if (/^[A-Za-z]:/.test(s)) s = s[0].toUpperCase() + s.slice(1);
  if (s.length > 3 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim() !== '') return v;
  }
  return '';
}

/** Cursor sends `cwd` as an empty string, and sends `workspace_roots` alongside it. The
 *  workspace root is a second, independently derived source for the same fact, which is why
 *  it is used rather than falling straight through to the hook process cwd. The process cwd
 *  remains the last resort because a hook run outside any workspace still has one. */
function deriveCwd(payload) {
  const roots = Array.isArray(payload?.workspace_roots) ? payload.workspace_roots : [];
  return normalizePath(
    firstNonEmpty(
      payload?.cwd,
      roots[0],
      payload?.tool_input?.working_directory,
      payload?.tool_input?.cwd,
      process.cwd(),
    ),
  );
}

export function parseRaw(raw) {
  if (!raw || !String(raw).trim()) return {};
  // A UTF-8 BOM survives JSON.parse in some shells and turns the first key into a broken one.
  const text = String(raw).replace(/^\uFEFF/, '');
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * @returns {{ ok: boolean, shape: string, payload: object|null, notes: string[] }}
 *   `ok: false` means the payload could not be understood. Callers fail open and say so,
 *   which is the discipline every gate in this repo already follows.
 */
export function normalizePayload(rawOrObject) {
  const notes = [];
  const parsed = typeof rawOrObject === 'string' ? parseRaw(rawOrObject) : rawOrObject;

  if (parsed === null || parsed === undefined) {
    return { ok: false, shape: 'unparseable', payload: null, notes: ['stdin was not valid JSON'] };
  }

  // Claude Code array form: [7] is the tool name, [9] is the tool input. Passed through with
  // a cwd grafted on only when the array does not already carry one.
  if (Array.isArray(parsed)) {
    if (parsed.length < 10) {
      return { ok: false, shape: 'array-short', payload: null, notes: [`array payload had ${parsed.length} elements, expected at least 10`] };
    }
    const payload = parsed.slice();
    payload.cwd = firstNonEmpty(payload.cwd, process.cwd());
    return { ok: true, shape: 'claude-array', payload, notes };
  }

  if (typeof parsed !== 'object') {
    return { ok: false, shape: 'scalar', payload: null, notes: ['stdin was not a JSON object'] };
  }

  const cwd = deriveCwd(parsed);
  const event = parsed.hook_event_name || '';
  const toolName = parsed.tool_name || '';
  const ti = parsed.tool_input && typeof parsed.tool_input === 'object' ? parsed.tool_input : {};

  const base = { cwd, hook_event_name: event, _cursor_shape: '' };

  // 1. Shell. Identified by the event, or by a bare top-level `command` with no tool_name so a
  //    harness that renames the event still resolves.
  if (event === 'beforeShellExecution' || (!toolName && typeof parsed.command === 'string')) {
    if (typeof parsed.command !== 'string' || parsed.command.trim() === '') {
      return { ok: false, shape: 'cursor-shell-empty', payload: null, notes: ['beforeShellExecution carried no command'] };
    }
    return {
      ok: true,
      shape: 'cursor-shell',
      notes,
      payload: {
        ...base,
        _cursor_shape: 'cursor-shell',
        tool_name: 'Bash',
        tool_input: { command: parsed.command, working_directory: cwd },
      },
    };
  }

  // 2. Read. Cursor's beforeReadFile sends file_path and no tool_name.
  if (event === 'beforeReadFile') {
    const filePath = firstNonEmpty(parsed.file_path, ti.file_path, ti.path);
    if (!filePath) {
      return { ok: false, shape: 'cursor-read-pathless', payload: null, notes: ['beforeReadFile carried no file_path'] };
    }
    return {
      ok: true,
      shape: 'cursor-read',
      notes,
      payload: {
        ...base,
        _cursor_shape: 'cursor-read',
        tool_name: 'Read',
        tool_input: { path: filePath, file_path: filePath },
      },
    };
  }

  // 3. Sub-agent launch. Renamed Task -> Agent so the two gates that check for 'Agent' see it.
  if (toolName === 'Task') {
    return {
      ok: true,
      shape: 'cursor-task',
      notes,
      payload: {
        ...base,
        _cursor_shape: 'cursor-task',
        tool_name: 'Agent',
        tool_input: {
          description: ti.description,
          prompt: ti.prompt,
          model: ti.model,
          run_in_background: ti.run_in_background,
          // Carried through unchanged and unused by the gates, so a future gate can read the
          // launched agent's type without this module having to invent a meaning for it.
          subagent_type: ti.subagent_type,
        },
      },
    };
  }

  // 4. Any other tool. `content` is singular on Cursor and `contents` is what the gates read,
  //    so both are present rather than one being mapped and the other lost.
  if (toolName) {
    const toolInput = { ...ti };
    if (toolInput.contents === undefined && toolInput.content !== undefined) {
      toolInput.contents = toolInput.content;
    }
    if (toolInput.file_path === undefined && toolInput.path !== undefined) {
      toolInput.file_path = toolInput.path;
    }
    return {
      ok: true,
      shape: 'cursor-tool',
      notes,
      payload: { ...parsed, ...base, _cursor_shape: 'cursor-tool', tool_name: toolName, tool_input: toolInput },
    };
  }

  return { ok: false, shape: 'unrecognized', payload: null, notes: ['no tool_name, command, or known event on the payload'] };
}
