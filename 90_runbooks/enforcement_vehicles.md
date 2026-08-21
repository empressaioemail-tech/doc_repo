# Enforcement rules, Claude Code vehicle

The property agent identified that enforcement.mdc reaches Cursor seats only. Claude Code loads CLAUDE.md and does not read .mdc, which means every lane run through Claude Code this week would have been unreached. That is gate question one failing for the doctrine's own vehicle, and gate question four, scope narrower than claim, in the same artifact.

## The fix, single source with two loaders

Do not maintain two copies. Two copies of a rules file is the provenance as copy defect applied to doctrine, and they will diverge.

Structure per repo:

1. `ENFORCEMENT.md` at repo root. This is the canonical text. It is the only file edited.
2. `CLAUDE.md` contains the line `@ENFORCEMENT.md` so Claude Code imports it at session start.
3. `.cursor/rules/enforcement.mdc` contains the Cursor frontmatter followed by the body of `ENFORCEMENT.md`.

Because the .mdc requires a physical body rather than an import, it is a copy, and a copy is only safe when a check enforces agreement.

## C-00, the vehicle consistency check

**Derivation class: internal consistency only (ruled 2026-08-19).** One agent edits both files and the check passes. Two copies, one party. This document predated the independently-derived rule that disproves calling it meaning shaped. Build it anyway: drift, transcription errors, and partial writes between the two files are real and it catches them.

- Executor: `scripts/enforcement/c-00-vehicle-sync.mjs` comparing `.cursor/rules/enforcement.mdc` body (below frontmatter) against `ENFORCEMENT.md`
- Trigger: every push
- Fails: non zero exit on any difference
- Bypasses: a harness that reads neither file

## C-00b, the runtime doctrine-reach probe (separate control)

The meaning shaped version of vehicle coverage. The fleet inventory classifies seats as reached, partial, or not reached by reading configuration files, which is a presence shaped inference about the exact property in question. A probe asserting what an agent actually received at session start settles it empirically: runtime against repo, two parties, and the second party is the agent rather than the author.

- Executor: probe harness (design: `_inbox/2026-08-19_systems_c00b_runtime_probe_design.md`)
- Trigger: session start sample plus scheduled fleet sweep
- Fails: expected doctrine absent from received instruction set
- Bypasses: unprobed harnesses (must be enumerated, not assumed absent)

Systems seat owns fleet coverage measurement. See build order `90_runbooks/90_enforcement_build_order.md`.

## CLAUDE.md content

```
@ENFORCEMENT.md
```

That single line, plus whatever repo specific content already exists. Do not paste the rules text into CLAUDE.md, because that creates a third copy.

## Reporting requirement

The close for the doctrine landing states, per repo: which vehicle files exist, which harnesses are known to load them, and which harnesses in the fleet are not covered by either. The honest answer today is that coverage is partial, and stating the uncovered set is more useful than claiming the fleet is reached. C-00b is the instrument that makes that honest answer empirical rather than inferred.
