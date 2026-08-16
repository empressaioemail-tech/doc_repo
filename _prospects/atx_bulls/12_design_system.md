---
id: atx_bulls_12_design_system
title: ATX Bulls portal design system — tokens and rules
status: active
last_updated: 2026-08-13
applies_to: portfolio
owner: nick
related: [atx_bulls_11_portal_spec, atx_bulls_10_fan_platform_vision]
purpose: The visual system for the fan portal, distilled 2026-08-13 from the team's live site and brand assets (blackout landing, logo marks). Single source for every design pass, including the Claude Design mockup brief and the local build.
---

# Design system

## Tokens

| Token | Value | Use |
|---|---|---|
| bg-base | #0B0B0D | page background (blackout) |
| bg-panel | #141417 | cards, tiles |
| border | #26262B | panel borders, dividers |
| orange | #F4551E | primary actions, accents, "BULLS" wordmark |
| orange-hover | #FF6A2C | hover states |
| white | #FFFFFF | headings, "ATX" wordmark |
| muted | #9AA0A8 | secondary text |

## Type

Headings: Archivo Black, uppercase, tight leading, oversized; two-tone headline pattern (white line, orange line). Labels and micro-copy: Barlow Condensed 600, uppercase, 0.12em letterspacing, orange dash prefix ("— ARENA FOOTBALL CONTENDER" pattern). Body: Barlow.

## Components and flavor

1. Primary button: orange fill, near-black bold uppercase label, one clipped corner (clip-path), trailing arrow glyph. Secondary: transparent with 1px orange border.
2. Divider strip with vertical tick separators ("2027 SEASON | ARENA FOOTBALL | AUSTIN, TEXAS").
3. Vertical side label on desktop ("LOVED HERE · FEARED EVERYWHERE").
4. Ember-glow radial gradients (orange at 6 to 10 percent opacity) behind heroes; faint grid texture permitted.
5. Provenance badges on every stat: GATE-TIMED (orange), VIDEO (white outline), HAND-TIMED (gray), NOT YET TESTED (empty state). Tappable explainers. This badge system is the portal's signature component.
6. Logo: wordmark primary ("ATX" white with orange X, "BULLS" orange, Archivo Black); geometric bull-head mark (white swept horns, orange-outlined head, orange X forehead) small in nav. League member footer line on every page.

## Copy rules (compliance, from doc 01/10)

Banned in all fan-facing copy: invest, investment, ownership, own a piece, shares, profit, value, appreciate, resale, trade, get in early, revenue, payout, earn (for fans), token, NFT, crypto, blockchain, wallet. Approved register: founding, numbered, first, forever, access, priority, status, member, claim, verified, record, part of the story. Team copy in the wild that may be reused: "Lights out. Horns up."

## Artifacts

Live mockup build: `P:\tmp\atx-bulls-portal` (static HTML/CSS/JS), deployed 2026-08-13 to **https://atx-bulls-portal.vercel.app** (Vercel project `atx-bulls-portal`; all eight pages probed 200 on the production alias). Claude Design parallel mockup: in flight, prompt in the 2026-08-13 session record.
