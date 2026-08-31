---
decision_id: 2026-08-31_next_action_rail_activation_engine
date: 2026-08-31
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - 90_operations/QUEUE_parked_work_index.md
  - _decisions/2026-08-24_stripe_annual_pricing_and_live_activation.md
  - _decisions/2026-08-31_claude_sync_card_and_connected_signal.md
---

## Decision

The Settings right rail stops explaining the panel's design and becomes a **next-action rail**: one state-derived step that moves the account forward. Built as a mountable component, capability-first in tone, instrumented from the first commit.

Four operator rulings, 2026-08-31.

One, the rail is **action, not information**. The alternative considered and rejected was a state summary ("what is true for you right now"); the operator ruled it should encourage movement in the funnel.

Two, **capability first**. The action names what you get, never a price or a plan. Money appears only where the action genuinely is a purchase, and the number lives in the checkout rather than the rail, preserving the standing rule that a plan is never priced in two places.

Three, **a mountable component, not a Settings feature**. Settings is a low-traffic surface and a funnel engine that only fires there moves almost nothing. Settings is the prototype mount, not the destination.

Four, **instrumented in this build**. Shown and acted events per action id, from day one.

## Context

The rail currently carries per-tab prose explaining the panel's own honesty discipline, plus a footer explaining that a field with no traced source says "Not read". That is a designer's note occupying a quarter of the modal on every tab.

There is a real trap in simply deleting it. The panel is full of "Not read" and "Not built" rows; the Plan tab alone shows three of each. The footer is what makes those rows read as honest rather than broken. So removing the copy without addressing the rows makes the product look worse, not cleaner. The rows are a bug list, not a design feature.

Readable account state, verified 2026-08-31: `accessTier`, `subscriptionTier`, `entitlementSource` and `freeMessagesUsed`/`freeMessagesLimit` already reach the client; `pe_ai_connections` gives whether Claude is connected; saved properties and the team roster have reads. NOT readable: an account-wide list of active property unlocks with expiry. `peEntitlement.ts:167` filters unlocks by `parcelNodeId`, one parcel at a time.

## Structural commitment check

Sell reasoning, not data: unchanged, the rail sells no facts about a property.

Confidence is earned: the rail must never assert an account state it did not read. An action shown on guessed state is the same defect class as an unearned confidence number.

Cost per jurisdiction: not touched.

Dual interface: the ladder is product state, not an MCP surface. No connector change.

Brand: Empressa / Smart Site.

## Reasoning

**One action, never a list.** Five suggestions is a nag; one is a recommendation. The rail carries a working control rather than a link to somewhere that then explains the thing.

**The rail must be able to go quiet, and that is the acceptance test.** An account with nothing to do gets an empty rail. A next-action surface that always finds something to sell is an ad slot, and the panel already declares that nothing in it is a control that does nothing. A reachable empty state is what makes the non-empty state trustworthy. If the ladder cannot return zero, it is wrong.

**Tab-scoped, quiet when done.** The user is already in a context. A global next-best-action proposing an unlock renewal while the user is on the Team tab is jarring. Each tab proposes its own step and stays empty when it has none, rather than reaching for a fallback.

**Why capability-first is not merely polite.** This product's entire differentiation is that it refuses to overclaim: tools refuse rather than degrade, absences are labelled, the connector card will not advertise a not-ready tool. A Settings rail that leads with upgrade pressure contradicts the surface it sits on and costs more trust than it earns conversion.

**Why the annual switch is the strongest lever.** It is expansion revenue with no capability to build, the amounts are already ruled, and the annual Stripe price ids are already configured. Under capability-first the rail names the benefit ("two months free on annual") and the checkout carries the number.

**Why instrumentation is not deferrable.** The locked GTM plan names activation instrumentation as the blocker for affiliate optimization: without it the affiliate programme cannot tell a good audience from a bad one. A next-action ladder must compute activation state to decide what to show, so the event is nearly free once the ladder exists. Shipping an unmeasured funnel mechanism is the pattern this operation keeps having to dig out of.

## Ladder v1

Account: Claude not connected, offer Connect. Connections: same when not connected; when connected, the tab shows capability rather than an action. Plan: free with free messages nearly exhausted, offer the property unlock; paid monthly on Solo or Studio, offer annual. Team: Team tier with unused seats, offer invite; any other tier, quiet.

The highest-intent action in the whole set is an expiring unlock ("your unlock on this property lapses in four days"). It requires the account-wide unlock read that does not exist, which is therefore in scope rather than deferred, because a ladder without it is missing its best rung.

## Reversal criteria

Reverse to an information rail if the acted-event rate does not clear a bar the operator sets after the first cohort. The instrumentation exists precisely so this is decidable by evidence rather than by taste.

Revisit capability-first if measured conversion is materially worse than a conversion-first variant AND the trust cost can be shown to be nil. Do not revisit on impression counts alone.

Reconsider the Settings mount if the component proves out; the intended destination is wherever the traffic is, and Settings staying its only home would mean the component argument was not honoured.

## Dependencies

Sequenced AFTER the SettingsModal line-weight lane (`fix/pe-settings-line-weight`), which is editing the same file. Two lanes on one file is a merge fight.

Needs a server-side activation event store scoped to the PE user; `gtm_events` is install-scoped for the browser extension and is the wrong spine. Needs the account-wide unlock-with-expiry read.
