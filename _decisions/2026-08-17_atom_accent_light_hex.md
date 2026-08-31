---
decision_id: 2026-08-17_atom_accent_light_hex
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _decisions/2026-08-17_smartcity_visual_law,
    30b_smartcity_design_system,
    _inbox/2026-08-17_claude_design_prompt_3_compass,
  ]
---

# Decision

`--sc-atom` is reserved for openable recorded evidence. Dark is `#4CC9C0` (SmartSite family value). Light is `#177F78` so the chip meets contrast. The reservation is the meaning, not the literal dark hex in both themes. If atom and accent collide in build, move `--sc-accent` dark, not `--sc-atom`.

## Context

Claude Design measured `#4CC9C0` at about 2.0:1 on white. Leaving the dark hex on light theme would fail readable text. Alternatives: icon-only chips with no colored text (worse), or a different hue (breaks the SmartSite family promise). Light sibling in the same hue family at about 5.2:1 is the least damage.

## Structural commitment check

- Sell reasoning, not data: the chip must stay readable or the promise is decoration.
- Dual interface: this is Empressa chrome. SmartSite keeps its own dark-first chip; the meaning ports, the light hex is kit-only.

## Reasoning

A reserved color that fails contrast teaches the user nothing. Form-separation (accent never a chip; atom chip always carries a 10px mono DID) is the second guard. Hue-shifting the atom value would fork SmartSite. Hue-shifting the accent, if needed later, does not.

## Reversal criteria

Reverse the light hex only if a measured contrast audit shows `#177F78` fails on `--sc-surface` or if operator insists on the literal `#4CC9C0` in both themes and accepts icon-only chips. Reverse "move accent, not atom" only if a shipped screen proves form-separation is not enough and operator accepts a new atom hue.

## Dependencies

Amends visual law: amber remains the only chrome exception (environment badge). Teal-as-atom is not chrome. G-67 kit copy carries both theme values.

## Counterparties

Internal: operator, Claude Design, Lane B, Lane A, Lane C.
