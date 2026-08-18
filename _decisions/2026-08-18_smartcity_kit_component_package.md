---
decision_id: 2026-08-18_smartcity_kit_component_package
date: 2026-08-18
owner: nick
status: active
related_canonical:
  [
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    _decisions/2026-08-17_smartcity_product_line_design_system,
    _decisions/2026-08-17_ux_implementation_sequence,
    _inbox/2026-08-17_g73_shell_design_review,
    _inbox/2026-08-17_g75_shell_mounts_motion,
  ]
---

# Decision

The SmartCity kit may ship a component package alongside the CSS file, for the sole purpose of making the system consumable by a design agent. The package is a typed wrapper that renders existing kit classes and nothing else. `sc-kit.css` remains the single source of truth for the design; the components declare no token, no color, no radius, no duration, and no type step.

This amends `30b_smartcity_design_system.md` section 4, which reads "one file, no build step, no package to version, no second source of truth."

# Context

Seven product surfaces 30c specifies are still undrawn: the Plan Review queue and console (F1 through F7), the Smart Files browser, Bring files, the share dialog, the asset record, and five department lenses. Each was going to be hand-built the way the Dashboards shell was.

Claude Design builds working UI from a customer's own components. Given a synced kit, it produces on-brand screens made of real parts that map onto shippable code. Given no kit, it invents its own components and every screen is off-system. The sync converts a compiled component library; it cannot consume a CSS class vocabulary, and the SmartCity kit today is exactly that with zero JS components.

So the choice is not "package or no package." It is "package, or draw seven surfaces by hand and re-derive the class vocabulary each time."

# Structural commitment check

- Sell reasoning, not data: unaffected. This is presentation tooling.
- Tenant sovereignty: unaffected. The package carries no city content.
- Cost per jurisdiction: helped. Surfaces drawn once as components are reused by every city pack rather than rebuilt.
- Dual interface: unaffected. Dashboards remains UI-first with an MCP retrofit tracked.

# Reasoning

Section 4's concern is a second source of truth for the design, and it names the failure it was written against: a repo that edits a token value has forked the system. A wrapper that renders `class="panel"` and owns no styling cannot fork the system, because there is nothing in it to fork. The constraint that keeps this true is mechanical rather than cultural, so it is written as a gate below.

The alternative readings were both worse. Leaving the kit CSS-only means the design agent is unavailable for exactly the work that remains, which is most of the product. Rewriting the kit as a styled component library would genuinely create the second source of truth section 4 forbids.

The wrapper is also the cheaper artifact to keep honest. A component that only composes classes fails loudly when a class is renamed, which makes drift visible instead of silent.

# The gate

The package is conformant only while all of these hold, and a test enforces each:

1. The package declares no `--sc-` token of its own. It may carry the canonical token block, and if it does that block is byte-identical to `30b_smartcity_design_system.md` section 4.1; every other token declaration is a fork.
2. No component file contains a hex color, an `rgb()` value, or a hardcoded px radius or duration.
3. Every class a component emits exists in `sc-kit.css` or the product stylesheet.
4. The package adds no CSS rule of its own, with one bounded exception: it may ship `@font-face` rules, and only those, for families the canonical token block already names in `--sc-font-*`. It ships the kit and renders its classes; a stylesheet that styles a component is the second source of truth this decision exists to prevent.

**Amended again 2026-08-18, during the first design sync.** The kit's CSS names Inter and IBM Plex Mono and shipped neither, because item 4 forbade the `@font-face` rule that would carry them. The product gets away with it by loading them from a font host in its own HTML; nothing built from the package does, so every such design renders in a fallback font and the type ramp is lost silently. A font file is not a design decision being forked — the families are already declared in the canonical token block, and shipping them fulfils that declaration rather than competing with it. The exception is bounded so it cannot widen: only `@font-face`, only families `--sc-font-*` already names, and a test asserts both. Third wording correction in as many days; the pattern is that a gate written as an absolute keeps forbidding the compliant case, and each time the fix is to name the boundary rather than loosen the rule.

A package that fails any of these has forked the system and is a defect, not a variant.

**Amended 2026-08-18, same day, before implementation.** As first written, item 1 forbade any `--sc-` token declaration while item 4 required the canonical token block to be byte-identical or absent. A package that ships `sc-kit.css` satisfies 4 and fails 1, so the gate was unsatisfiable for the only shape the package can usefully take. Item 1 now forbids *inventing* a token rather than *carrying* the canonical one, and item 4 covers the rule the old pair left unguarded: the package styles nothing. Same intent, stated so it can actually pass. This is the second clause in two days whose wording forbade the compliant case (see the `Bastrop` refusal-guard finding in `_inbox/2026-08-18_g76_g79_fixture_city_and_type.md`); a gate is only a gate if the correct implementation can satisfy it.

# Scope

Named target is a kit package consumable by design sync. Housing, package name, and registry are an implementation card, not this decision. This decision does not authorise a component rewrite of any shipped surface: Dashboards, Plan Review and Smart Files keep their current markup until a card says otherwise.

# Reversal criteria

Reverse if the package acquires styling of its own, if a product repo starts importing components instead of copying the CSS file, or if the design agent's output stops mapping onto shippable markup. Reverse also if design sync turns out not to consume the package, since the package has no other justification. On reversal the CSS file stands alone again and section 4 is restored unamended.

# Dependencies

Depends on 30b section 4.1 kit extract. Unblocks the design sync of the SmartCity kit and the design work on the undrawn 30c surfaces. Does not depend on the fixture pack decision and does not block it.

# Counterparties

Internal: operator, planner, Lane B. No city, no vendor, no external counterparty.
