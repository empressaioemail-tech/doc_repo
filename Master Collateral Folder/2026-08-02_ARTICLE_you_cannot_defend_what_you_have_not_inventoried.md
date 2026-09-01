---
id: 2026-08-02_article_control_system_no_record_of_itself
title: ARTICLE — The one part of your city with no record of itself
date: 2026-08-02
status: draft (operator review before publication)
owner: nick
applies_to: smartcity
audience: city managers, public works directors, city IT, municipal channel
related: [_smartcity_masters/32_smartcity_asset_management, _smartcity_masters/35_smartcity_positioning_framework, _inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask, 42_stub_thesis_national_twin_substrate]
purpose: Thought-leadership article responding to the July 2026 Minnesota water-system attacks and the FBI/EPA seven-state warning. Argues the control system should be twinned like every other city asset, with an intelligence layer reading across it. External altitude, city audience. First candidate post if the blog goes ahead.
sources_verified: 2026-08-02 (CISA AA26-097A; The Hacker News 2026-07-29; Tenable advisory analysis; Engadget 2026-08-01; NBC News)
---

# The one part of your city with no record of itself

## What happened

Over two days in late July, someone reached into the control systems of more than thirty Minnesota water and wastewater utilities.

They were not subtle about it. According to CISA's advisory AA26-097A, published July 30, the attackers found programmable logic controllers exposed directly to the public internet, changed their passwords, and altered their IP settings, locking the people who run those systems out of their own equipment. They modified controller project files, changing the ladder logic that tells a pump when to run and a valve when to close. In some cases they disabled safety shutdowns and alarms while the operator screens kept showing normal.

The results were physical. Braham's water treatment plant went offline and residents were asked to cut back on water use. Plymouth lost cellular communications to its water towers and lift stations and fell back to running things by hand. South St. Paul and Maple Plain kept service up after their automated controls were compromised. Some systems saw pressure loss and flooding. The FBI later noted that pressure loss is not a nuisance problem: when pressure drops, untreated groundwater can enter the pipes.

On August 1, the FBI and EPA issued a joint public service announcement. Utilities in at least seven states had reported the same class of intrusion. CISA's guidance named controllers from Rockwell Automation, Schneider Electric, and Siemens, and pointed at a Rockwell authentication bypass, CVE-2021-22681, that has no patch and will not get one.

If you run a small utility, the uncomfortable part of that last sentence is that no amount of diligence about patching would have helped.

## The detail worth stopping on

Read the attack again and notice which part actually did the damage.

Getting in was the internet exposure, and that is a network problem with a known fix. But what turned an intrusion into flooded streets was the second step: they changed the logic, and the screens kept showing normal. The system reported that everything was fine because the thing that reports is the thing they had already changed.

That is the whole problem in one sentence. **A control system is the only part of a city that is asked to be the sole witness to its own condition.**

Every other municipal asset has some independent account of itself. A road has a maintenance history. A building has permits and inspections. A vehicle has a service record. If someone tells you a truck was serviced last month, you can check that against something other than the truck.

The pump station cannot be checked against anything. Its configuration lives on the controller. Its logic lives on the controller. Whether it is behaving normally is a judgment made from what the controller reports, on a screen the controller feeds. When that single source is compromised, a city does not merely lose control of the equipment. It loses the ability to know what the equipment is doing, and it loses it silently.

This is why the Minnesota response was slow in a way that surprised people. Minnesota IT Services said in the days after that the nature and extent of the impact varied by system and the investigation was still determining how many had experienced operational disruptions. Days in, with federal help on site, the basic scope question was open. Not because nobody was working, but because reconstructing what a controller was before requires a record of what it was before, and that record did not exist anywhere except on the controller.

## The advice that followed, and what it assumes

The guidance was sound and consistent. Get controllers off the public internet. Put a secure gateway with multifactor authentication in front of anything that needs remote access. Segment operational networks from office networks. Set the physical mode switches to Run so logic cannot be changed remotely. Back up controller logic and configurations offline and test that you can restore them. Watch for project files changing outside a maintenance window.

That last one deserves a second look, because it is the most important item on the list and the one most cities cannot do.

Watching for a project file to change outside a maintenance window requires three things a small utility usually does not have: a record of every controller and its current project file, a record of what that file was before, and a definition of what a maintenance window is that a system can check against. Without all three, you are not monitoring for unauthorized changes. You are hoping someone notices.

The same is true up and down the list. Removing internet-exposed controllers assumes you know which ones are exposed, including the one on a cellular modem a contractor installed in 2019 and nobody wrote down. Restoring from backup assumes backups tied to specific devices with dates attached. Every mitigation is an action against a known inventory, and the inventory is the part nobody sold the city.

## Twin the control system

Here is the move, and it is not a security move.

A city's control system should be a record like everything else the city owns. Not a black box that reports on itself, but an asset in the same structure as the water mains it operates, the roads those mains run under, and the parcels they serve.

Concretely, that means the lift station is a place in the record. The controller in it is a record: make, model, firmware, where it sits on the network, whether it is reachable from outside, who installed it and when. Its logic is a record, versioned, so the version running now and the version running last month are both retrievable. Its readings are records that accumulate on the station rather than refreshing and vanishing. Every one of those carries where it came from, when it was established, and every change since, with who made the change and when.

Do that and the sole-witness problem goes away. The controller stops being the only account of itself, because there is now an independent record of what it is supposed to be, held outside it, that its actual state can be compared against. That is what the rest of your city already has and what your most critical equipment does not.

It also makes CISA's list executable rather than aspirational. Which controllers face the internet becomes a query. What this project file looked like before becomes a lookup. What changed outside a maintenance window becomes a comparison a system can run instead of a thing a person might notice.

## The intelligence layer

The record is what makes the next part possible, and the next part is where this stops being bookkeeping.

An asset with a continuous history has a normal. A pump that has run for two years in the record has a behavioral signature: how long it typically runs, at what pressure, in what sequence with the pumps around it, under what weather. That is not a number a gauge can give you. It only exists if the readings were kept.

Once a normal exists, deviation from it is detectable, and the system can say so. Not because it is watching for attackers, but because it knows what this station does and this is not it. A pump cycling in a pattern it has never used. A tower level moving in a way the inflow does not explain. A controller whose running logic no longer matches the version of record. A device that started talking to something it has never talked to before. These are all just deviations from an established baseline, and a city gets told.

That is worth being precise about, because it cuts both ways. This is the same capability that catches a bearing starting to fail three weeks before it does, and it is worth having for that reason alone. Most days it is a maintenance tool. The day it matters, it is the thing that noticed the screens were lying.

And because the control system sits in the same structure as everything else the city holds, the question can cross domains. Which properties lose service if this station goes down, and are any of them in the flood zone. That is a query when the assets share a record, and a week of phone calls when they do not.

## What we are not saying

We are not a security product, and this is not one.

The gateway work, the segmentation, the multifactor authentication in CISA's advisory still has to be done by people who do that for a living, and nothing here replaces it. Our layer reads. It does not write to your control system, it does not operate your equipment, and it does not sit in the path of anything that does. That boundary is deliberate, it is permanent, and any vendor offering you something looser about your control systems is offering you a risk you should decline.

This is also a custom build, not a module that gets switched on. Every city's equipment, control system, network posture, and appetite for connecting any of it is different. What we build is scoped with your operations staff in the room, and where the read-only boundary sits gets agreed there before anything is connected. What does not change from city to city is the structure the records land in.

Cities are already asking for this. The reason is not the news. It is that public works has known for years that the most consequential equipment in the city is the least documented, and that the person who understands the lift station controls is three years from retirement.

## The part worth keeping

Water systems will get attacked again. The controller that let this happen has no patch, the same equipment sits in thousands of small utilities, and the economics favor the attacker.

What a city controls is whether its most critical equipment is the only witness to its own condition. That is a choice, not a fact of life, and it is a choice most cities have never been offered because the software sold to them renders what the controller says rather than keeping a record of what it is.

Your roads have a history. Your buildings have a history. Your trucks have a history. The pump keeping water pressure in your town has a screen.

---

*SmartCity OS is live with the City of Bastrop, Texas, where city leadership runs the city on it day to day. If you want to see what a connected asset record looks like in a real deployment, we will walk you through it.*

---

## Editorial notes — not for publication

**The reframe.** Earlier draft argued inventory-hygiene: cities could not answer basic questions, and a good asset record fixes that. Operator correction 2026-08-02: the real offering is a twin of the control system plus an intelligence layer over it, so the article should be about that. This draft leads with the sole-witness argument, which is the strongest honest version — a control system is the only city asset with no independent account of itself, and twinning it is what fixes that.

**Naming, settled 2026-08-02.** No new product name. "Smart SCADA" was considered and rejected: the smart-* family names twinned places and things a city holds (smart site, smart files, smart reports), while SCADA is a vendor software category, so "Smart SCADA" reads as our competing SCADA product and puts a control word in a brand name. The station is the smart site; the controller, its logic, and its readings are layers on it. Internal vocabulary is "SCADA twin," consistent with doc 42 DEEPEN mode. Externally the article never says smart site, twin, or SCADA-as-a-product — it says "your control system, with a record of itself."

**Intelligence boundary, settled 2026-08-02.** Read-only plus anomaly alerting. The layer holds configuration, logic versions, and readings; establishes a baseline; surfaces deviation; and tells the city. No write path to control, stated explicitly in the article and framed as permanent. The read-only boundary is itself a credibility asset with operations staff, who correctly distrust anything that claims to touch their equipment.

**Sources, verified 2026-08-02.** CISA advisory AA26-097A (2026-07-30; mitigations and affected vendors via Tenable's analysis, since cisa.gov blocked direct fetch). The Hacker News 2026-07-29 for Minnesota operational detail: dates 07-26/27, 30+ systems, Braham offline, Plymouth cellular failure, South St. Paul and Maple Plain, the Minnesota IT Services quote. Engadget 2026-08-01 for the FBI/EPA PSA, seven states, flooding and pressure loss, the FBI's untreated-groundwater point. NBC News for the original seven-state framing. CVE-2021-22681 unpatchable per Tenable.

The disabled-alarms-while-screens-showed-normal detail is from the advisory analysis and is load-bearing for the whole article — it is what makes the sole-witness argument concrete rather than theoretical. Verify it survives any future correction to the reporting before publishing.

Attribution to Iranian-affiliated CyberAv3ngers is reported and named in the advisory. **Deliberately omitted.** It adds nothing to a city-facing argument, ages badly if it shifts, and pulls the piece toward geopolitics. If a security-audience version is wanted later, it belongs there.

**Claims discipline.** No cycle-time, savings, or ROI figures. No competitor named. No claim the system secures, defends, protects, controls, or operates anything — stated in the negative explicitly. No IoT or live-sensor product tier claimed; described as a custom build per the 2026-08-02 Bastrop record. No delivery date. No named vendor claimed as a connected feed. No Bastrop asset counts, since no city-owned assets are ingested yet; the Bastrop reference is limited to the approved live-deployment claim in doc 32's register. No "smart site," "digital twin," or substrate vocabulary anywhere in the body.

"Cities are already asking for this" rests on the Bastrop ask recorded at `_inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask.md`. If that is ever withdrawn or misremembered, the sentence comes out.

**One thing to check before publishing.** The article implies we can hold controller logic versions and readings for a city. That is what the structure does and what the custom build would deliver, but confirm with engineering that nothing about the way project files or historian data would be ingested changes the description before this goes public.

**On the blog.** The repeatable shape: a real infrastructure story, the operational detail the coverage skipped, and the record underneath it. It works repeatedly because the recordkeeping gap is genuinely upstream of most municipal failures and never requires claiming capability we do not have. Other candidates in the same mold: a bridge or culvert failure with a maintenance-history angle, a FEMA map update stranding a city's flood assumptions, a records-retention or public-information-request failure, and any story where a retirement takes institutional knowledge out of a city.
