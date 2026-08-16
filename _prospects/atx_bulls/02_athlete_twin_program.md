---
id: atx_bulls_02_athlete_twin_program
title: Athlete twin program — Smart Athlete A1 at ATX Bulls
status: draft
last_updated: 2026-08-13
applies_to: portfolio
owner: nick
related: [atx_bulls_00_program_overview, 65_sensors/00_overview, 80_adrs/adr_017_atom_access_control]
purpose: Records what was delivered and agreed in principle on athlete twinning, and what the season pilot consists of. The protocol content lives in the delivered A1 document; this doc is the engagement record.
---

# Athlete twin program

## State

Delivered 2026-08-13: Smart Athlete A1 season tracking protocol (PDF, `P:\tmp\Smart_Athlete_A1_Season_Tracking.pdf`), handed to Cody in person. Agreed in principle before that meeting: recorded agility testing of athletes and verified twins of them. Preseason training begins late August 2026, which sets the baseline-testing window.

## What the pilot is

Full roster, one season. Four cadences per the A1 protocol: intake once (anthropometrics, identity verification, injury-history intake with assessed-or-not discipline, movement screen, consent enrollment), the A1 battery three times (preseason, midseason, postseason), a continuous layer (session RPE load, daily wellness, body weight, participation status, derived workload watch), and per-event capture (game stats, typed injury events, test-session video as evidence attached to every battery rep).

Measurement rules, which are the product: nothing silently missing (measured, not-measured-yet, or athlete-declined), every number carries how it was measured (gate-timed over hand-timed over self-reported), evidence travels with the number, protocol frozen for the season.

## Ownership and consent design

Team pays for testing; athlete owns the body. The record is shared between team and athlete (tenant-shared in our access model), with the athlete's consent governing any disclosure beyond the organization. Consent is collected per data class (performance, video, wellness and injury) at intake, signed by the athlete on their own phone. Athletes receive their own verified record. If athlete data is ever queried by external parties (scouts, sponsors), per-reference accrual to the athlete is the designed model.

Texas has a biometric statute (CUBI) requiring notice and consent for commercial capture of biometric identifiers; video plus measurement of identified athletes plausibly touches it. Flagged 2026-08-13, not yet verified in scope by counsel. Consent paperwork must be proper before capture begins. Performance data is collected by coaching staff outside the clinical channel; diagnoses stay with medical staff, keeping the pilot out of HIPAA terrain.

## Why this workstream feeds the others

Verified athlete data is fan product inventory (workstream 1: verified stat cards, testing-day content for founding members), it is the first production run of the human-twin concept in the portfolio, and it establishes the capture-to-twin pipeline that the stadium twin (workstream 4) will reuse at building scale.

## Open items

1. Confirm the battery with the team's strength staff before baseline (protocol freezes at first administration).
2. Confirm whether the team owns IMU wearable units (activates the optional continuous tier).
3. Consent instrument drafting and CUBI scope check (counsel).
4. Testing-day logistics: timing gates procurement, station layout, phone-and-tripod capture kit per station.
