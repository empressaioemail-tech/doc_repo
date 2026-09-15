# MISSION — G-123 Development services lens: the four record tabs and the shared pattern

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Snapshot first

Repo: `smartcity-dashboards` (`empressaioemail-tech/smartcity-dashboards`). The local checkout at
`/p/smartcity-dashboards` was **43 commits behind origin/main** on 2026-09-14. Fetch and work
from current `origin/main`. Declare repository, branch and commit SHA in your first output line.
Work on your own branch in your own worktree.

Deployed today: `smartcity-dashboards-00062-ful` @100%, tag `g117-full-catalog`.

## What this row is

**This lens is the pattern.** Fourteen of fifteen v2 destinations inherit what you build here.
Getting Development services right is worth more than getting any single tab right, so where a
choice is between "correct for this tab" and "correct for every lens", take the second.

Approved design: `https://claude.ai/code/artifact/1ed0733e-e10c-4ec6-948e-66d2b24e562e`
Design source and reasoning: `_design/smartcity-dev-services/` (README first).
Read both before starting.

## SCOPE — five tabs, and two that are NOT yours

IN: **Pipeline, Inspections, Work orders, Code enforcement, Licences**, plus the shared lens
pattern below.

OUT, and do not start either:
- **Place** (G-124) is HELD by the operator, who is reworking the map approach.
- **Plan review** (separate scope, operator ruling 2026-09-14) — it appears in the tab strip as
  a named future tab and nothing more.
- **Flood study** (G-125) — same: named in the strip, not built.

A tab named in the strip but not built renders the honest not-built state with its basis. It
does not render a blank.

## The shared pattern — build this once, use it on every tab

**Three tiers, not two walls of numbers.** v1 stacks six lens tiles on top of five tab metrics,
so eleven numbers arrive before any content does.

1. **Attention row** — the six filtered entry points. Primary treatment. Each carries the lens
   and filter it opens and NAVIGATES there with that filter applied. **Acceptance is the click,
   not the number.** An unread source shows the existing "Not read" word value, never a zero.
2. **Tab strip** — each tab carries its own count inline. This is v1's own pattern at the pill
   level, promoted to the tab level, not an invention.
3. **Tab metric strip** — compact, secondary, no cards. Tab-specific figures live here.

**ONE table treatment for every operational list.** v1 uses a real table on Code enforcement and
stacked rich rows everywhere else. The table is the most scannable view in the whole v1 app and
the rich rows are walls of text. The table wins; every tab inherits it.

**ONE load component.** Inspector load, Manager load and Officer load are the same shape — work
distributed across people. Build one component and pass it a roster. Do not build three panels.

**View modes replace the stray button.** `List / Map / Performance` as a segmented control in
the panel header. v1's "Service Performance" becomes a view mode; it stops being a button that
exists on one tab for historical reasons.

**Pagination** at the foot of the table: previous, position, total.

## THE PII RULE — read this before you write a row renderer

v1's free-text description fields carry **citizen names and personal phone numbers**, verbatim
from the capture:

```
203 MOSSBERG LN - CONF. PAID, RECONNECT - DEBORAH MOORE, PH#737-762-6252
CONTACT LISA BOE - CONTACT#: 504-401-1765
LOW PRESSURE - CONTACT: REBECCA GARNER-LOZOYA - CONTACT#: 916-620-8091
```

Business licence applications carry citizen-authored free text including grievances and payment
histories. Code enforcement rows carry officer names and complaint addresses.

**The free-text description is not a list column on any tab.** Lists carry structured fields:
id, type, address, department or assignee, status, date. The description belongs on the record,
not in a scannable list.

Two things follow that you must not blur. This design decision reduces the exposure; **it is not
a control.** If you find a path that renders the description into a list, a search result, an
export, or any anonymous-reachable response, **report it — do not quietly fix it and move on.**
And none of this data may reach a public parcel rail or any unauthenticated surface, on any code
path, under any cityKey.

## Per-tab column specs, from the v1 capture

Statuses and type vocabularies are the vendor's own values. Do not remap them onto an invented
taxonomy — that is this product's standing stance and `property-map.mjs` states it explicitly.

**Pipeline** (v1 "All Projects", 12,683)
Columns: `Permit # · Type · Address · Applicant · Status · Submitted`
Filters: All / Active / Requested / Expired / Expiring / Pending docs / On hold
Metric strip: all, active, requested, expired, expiring, pending docs, on hold

**Inspections** (949)
Columns: `Inspection # · Type · Address · Inspector · Result · Scheduled`
Metric strip: due this week, overdue, completed this week, pass rate (30d), average days to
complete (30d)
Load: Inspector load. Filters: search, all types, sort.

**Work orders** (16,723)
Columns: `WO # · Type · Address · Department · Status · Opened`
Metric strip: active, requested, suspended, on hold, archived
Load: Manager load. View modes: List / Map / Performance. Pagination. Export.

**Code enforcement** (1,502)
Columns: `Case # · Type · Address · Status · Step · Officer · Reported`
Metric strip: total, active, scheduled, resolved, closed
Load: Officer load. Filters: all statuses, all types, all officers, reset.
Note `Step` is the workflow position and is load-bearing for staff — keep it.

**Licences** (72)
Columns: `Licence # · Subject · Type · Address · Issued · Expires · Status`
Metric strip: total licences, expiring soon, licence types
Types: General, Food service, Food vendor, Golf cart, Alcohol, Mobile home park, Recreational

## Constraints that are not negotiable

`shell.css` may declare no colour and no token. `web/sc-kit.css` is byte-identical across three
repos and must not be touched. The type ramp is pinned by selector with a 12px floor. No new CSS
class without a rule. If the design appears to need a colour that does not exist, STOP and report
— that is a product-line decision across three repos, not a Dashboards PR.

Every honest-empty state keeps its `.basis` line. Removing one to tidy a layout is a substantive
change, not a cosmetic one.

No invented freshness. Tests assert no "last sync", "last read" or "last updated" appears.

**Regression-check every tab against the EMPTY pack**, not only `bastrop_tx`. A design that only
looks right when populated is wrong for this product: every city after Bastrop starts empty.
Develop against `template-city`; do not develop against `fixture-city`.

Do not hardcode a city name into markup.

## A dependency you should know about

Every real record on this lens is a live read of `smartcity-api` (v1) through
`/api/platform/*`. The city reported a v1 regression on 2026-09-14, tracked as OPS-17 G-122 and
being worked separately. If your reads start failing, check G-122 before assuming you broke
something.

## Close

Open a PR, deploy a tagged canary with `--no-traffic`, smoke it, then shift traffic — verified by
reading the traffic JSON **by field name**, never a positional `value()` formatter.

Write your close to `_inbox/2026-09-14_g123_dev_services_close.json`. State the deployed revision
and digest, the four CSS gates' results, what you checked against the EMPTY pack specifically,
and — explicitly — every code path you found that could render a free-text description into a
list, a search result, an export or an anonymous response, whether or not you changed it.
