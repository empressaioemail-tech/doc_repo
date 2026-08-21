# Dispatch mission inputs

Mission bodies consumed by `scripts/dispatch.mjs --mission-file`. They are INPUTS. The
compiler wraps them with the canon preamble, the agent contract, and a validated PLAN-ROW,
and writes the finished dispatch to `_dispatches/`.

They live here rather than under `_dispatches/` for a specific reason found 2026-08-21.
`.claude/hooks/dispatch-template-gate.ps1` globs `_dispatches/` and requires a
CANON-PREAMBLE marker on anything written there. A mission has no marker by definition,
because the compiler is what adds it. The gate could not distinguish an input from an output
and refused a legitimate write.

TWO FINDINGS FOR THE R-04 CONTROL REGISTER, filed rather than worked around:

1. OVER-SCOPE. dispatch-template-gate treats every file under `_dispatches/` as a dispatch.
   A control whose scope is broader than its claim teaches the fleet to reach for the bypass
   flag, which ENFORCEMENT.md ranks as worse than a narrow control.

2. BYPASS. The gate is registered on the Write tool. Five mission files reached
   `_dispatches/` on 2026-08-21 via `cp` in Bash and were never inspected. The same shape as
   the canon gate firing only on the Agent tool. A control scoped to one tool is bypassed by
   every other tool that reaches the same state.

Relocating is not evasion: a mission input is not a dispatch and does not belong in the
dispatch directory. The findings stand and are the register's to resolve.
