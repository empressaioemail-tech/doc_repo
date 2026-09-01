---
id: 2026-08-30_p91_measurement_x3_clerk_index
title: "Measurement X3 — what the county clerk actually exposes for the records index (Bastrop, Travis, Williamson)"
date: 2026-08-30
status: measured
plan_row: P-91 v3 WDLL measurement X3
---

# Measurement X3 — county clerk records index, access classes and terms

## Snapshot and method

Repository `P:/doc_repo`, branch `main`, commit `ae89dc31d71936e749ed39ccf5038910ad00b2a1`. Read only lane: no code and no docs changed, nothing staged, nothing committed.

All findings below come from live fetches performed 2026-08-30 against public pages, plus two PDFs published by the counties. No logins were used, no account was created, no paywall was crossed, and no borrowed credential was involved. Where a page loads its content through an authenticated or session bound JavaScript flow I did not complete, the answer is recorded as UNFOUND rather than inferred.

Method note that belongs in the finding rather than in a footnote: three of the portals I read publish a `robots.txt` that disallows automated agents, and my fetches were automated HTTP requests carrying a browser user agent. The `robots.txt` text is quoted verbatim below because it is the only machine readable access term any of these sites publish, and it bears directly on the v3 decision. Reading it and then omitting it would be silent degradation, so it is declared here.

Aggregators exist and are out of scope except to name them: TexasFile, CourthouseDirect, NETR Online, propertychecker, countyoffice, pubrecord, govbackgroundchecks. Every finding below is from a county page, a county published PDF, a county contracted vendor page, or a statute.

## Part 1. Bastrop County Clerk

**System and URL.** The Bastrop County Clerk page at `https://www.bastropcounty.gov/page/co.county_clerk` points to `http://cc.co.bastrop.tx.us`. That host resolves and serves "Bastrop County Clerk Web Access". The platform is named verbatim in the page footer: "Aumentum Recorder - Public Access Web UI, Version 2023.1.2 Copyright 2001 - 2026 Harris Recording Solutions. All Rights Reserved". The vendor product page is linked from the portal itself at `https://www.harrisrecordingsolutions.com/products/aumentum-recorder/`. This is the same product Travis County runs, and it is not GovOS and not Tyler.

**Account requirement.** None for the index. The site gates on a disclaimer accept, after which the header reads "Welcome Visitor. Login | View Basket" and every index section is reachable: Birth, Commissioners Court, Death, Marriage, Real Estate, UCC. A login form exists for registered accounts and a shopping basket exists, so a purchase path exists, but neither is required to search or browse the index.

**Date coverage, verbatim from the Real Estate search page.** "Permanent Index From 01/01/1973 to 08/27/2026 Temporary Index from 08/28/2026 to 08/30/2026 Images from 01/01/1973". Note the two tier index: everything through 08/27/2026 is in the permanent index and the three most recent days sit in a temporary index. The alphabetical party browse pages carry their own scope line, verbatim: "This List only includes Names from the Permanent Index."

**Fields the index search exposes.** Read directly off `/RealEstate/SearchEntry.aspx`: a combined name search with Party Name plus Party Type (Both, Grantor, Grantee); a separate name search with distinct Grantor and Grantee boxes; Date Filed From and To with a preset range picker; Instrument Number From and To; Book; Page; a controlled Document Type list; and a legal description block with Subdivision, Block, Lot, Section, Map ID, and Freeform number.

The Document Type list is a closed vocabulary of roughly 160 values and it carries the whole lien, deed, release, and distress vocabulary the v3 question is about. Present verbatim in that list: DEED, DEED OF TRUST, CONTRACT FOR DEED, SHERIFF DEED, LIEN, MECHANICS LIEN, HOSPITAL LIEN, FEDERAL TAX LIEN, STATE TAX LIEN, AFFIDAVIT LIEN CLAIM, ABSTRACT OF JUDGMENT, RELEASE, PARTIAL RELEASE, RELEASE OF A J, REL FED TAX LIEN, REL STATE TAX LIEN, WITHDRL ABS OF JUDG, WITHDRL FED TX LIEN, LIS PENDENS, BANKRUPTCY, ASSIGNMENT, PARTIAL ASSIGNMENT, REASSIGN OF MORTGAGE, SUBORDINATION, MODIFI DEED OF TRUST, TRANSFER, MEMORANDUM, NOTICE.

**What the result grid returns.** UNFOUND. The search is an ASP.NET postback with Infragistics client state on each field; my form post returned the search entry page rather than a result grid, so I did not observe the result columns. Two consequences to carry forward rather than paper over. First, whether the index carries a monetary amount or consideration field is unresolved: there is no amount field among the search criteria, which is evidence but not proof of its absence from the returned rows. Second, whether the portal charges for an image download online, as distinct from the counter fee schedule, is likewise unresolved; the presence of a basket and a "Copy Options" dialog says a purchase path exists but not what it costs.

**Fee schedule, verbatim.** The clerk publishes `Fee Sheet.pdf` at `https://www.bastropcounty.gov/upload/page/0096/Fee%20Sheet.pdf`, headed "NEW FEES EFFECTIVE JANUARY 1, 2024" over the name Krista Bartsch, Bastrop County Clerk. The copy section reads in full:

    COPIES:
    $1.00   Per Page Copied
    $5.00   Per Document to Certify
    $5.00   Per Plat Page Copied

There is no published fee for viewing or searching the index, and no line item anywhere on that schedule for bulk data, a subscription, or an extract.

**Terms of use and automated access.** The portal publishes no terms of use page. The disclaimer carries two clauses worth quoting, neither of which mentions automation: "By using this service, in any form, the user agrees to indemnify and hold harmless the County and anyone involved in storing, retrieving, or displaying this information for any damage of any type that may be caused by retrieving this information over the Internet," and "Users should remember that the index is similar to a library card catalogue; it is a guide to the information contained within the documents referenced and should not be relied upon in making any decision or determination regarding the underlying document." It also carries the state law redaction notice: "Per Texas Property Code 11.008(k)(1-2) In accordance with state law, information has been redacted from certain instruments in the database and the online database does not constitute the official repository of real property records and may not reflect the complete or unaltered contents of those records as maintained in the official real property records."

The only machine readable access statement is `https://cc.co.bastrop.tx.us/robots.txt`, which is two lines in full:

    User-agent: *
    Disallow: /

**Bulk or API access.** None offered or mentioned anywhere on the county site or the portal. The generic route is the Public Information Act. The county's public information page at `https://www.bastropcounty.gov/page/co.public_information` states verbatim: "Some requests may have an associated cost in accordance with the charges set by Texas Office of Attorney General and the Texas Administrative Code. You will be advised of the estimated cost prior to fulfillment of the records request." Requests go to the Sheriff's Office Open Records Division, `public.information@co.bastrop.tx.us`, (512) 581-4099.

## Part 2. Is there an official Texas bulk or subscription path for the index itself

**No county clerk specific bulk sale statute was found.** What exists is three distinct mechanisms, and it matters which one a plan leans on.

**Mechanism one, contractual system access under Texas Local Government Code 191.008.** Titled "AUTHORITY TO ESTABLISH COMPUTERIZED ELECTRONIC INFORMATION SYSTEM". Verbatim: "The commissioners court of a county by order may provide for the establishment and operation of a computerized electronic information system through which it may provide on a contractual basis direct access to information that relates to all or some county and precinct records ... The commissioners court may make records available through the system only if the custodian of the records agrees in writing to allow public access under this section to the records." The court may "set a reasonable fee, charged under a contract, for use of the system". This is permissive, it requires a commissioners court order plus the records custodian's written agreement, and none of the three counties in scope publishes such a program.

**Mechanism two, the Public Information Act.** Government Code 552.262(a) requires that "The rules adopted by the attorney general shall be used by each governmental body in determining charges", that charges "may not be excessive and may not exceed the actual cost of producing the information", and permits a non state governmental body to set its own rates up to 25 percent above the attorney general amounts. Government Code 552.231 separately governs requests requiring programming or manipulation of data. The attorney general amounts live in 1 TAC Chapter 70. I could not load the rule text itself (the `txrules.elaws.us` fetch timed out), so the amounts below are quoted from a Texas state agency page that applies those rules, `https://www.ethics.state.tx.us/contact/open-records/fees.php`: paper copies "$.10 per printed page"; "$15 per hour for personnel time to locate, compile, and reproduce information"; "$28.50 per hour for personnel time for programming and/or manipulation of data"; "Overhead charge of 20% of personnel time"; "CD-Rs and CD-RWs at $1.00 per CD". Treat those amounts as of that page rather than as re-read from 1 TAC 70.3.

**Mechanism three, a discretionary county data sales desk.** Two large Texas counties publish one. Neither is in scope, but they establish that the shape is real and operable. Harris County Clerk, `https://www.cclerk.hctx.net/PublicRecords.aspx`: index data is delivered as "text (.txt) files that are pipe delimited for ease when importing into a variety of programs", images as "TIFF (.tiff) files", in "any custom date range delivered on CD or DVD, or customer provided hard drive", plus "FTP access which provides daily data, purchased monthly, of most of the records in the County Clerk's office", contact Data Sales at 713-274-6390. No prices are published on that page. Tarrant County, `https://www.tarrantcountytx.gov/en/county-clerk/real-estate-records.html`: a "Bulk Data Payments" flow, "Central Library-Bulk Data" in a department dropdown, then "817-884-1069 to complete process". No prices published.

**Bastrop, Travis, and Williamson publish no equivalent.** For all three, official paid bulk access to the index is UNFOUND as a published, priced program.

**One statutory detail with teeth for any per document cost model.** Local Government Code 118.011 (2025 text, Justia) sets noncertified copy fees at "printed on paper, for each page or part of a page $1.00" and gives a cheaper electronic tier of "$1 for each document up to 10 pages" and "$0.10 for each page or part of a page of a document over 10 pages", but that electronic tier is written as applying to "an electronic copy of an electronic document, except for real property records". The cheap electronic tier is explicitly carved away from real property records for noncertified copies. Certified papers under 118.011(3) are "$5.00 for the clerk's certificate" plus "$1.00 per page" printed on paper.

## Part 3. Travis County, for contrast

Travis runs the same Aumentum Recorder 2023.1.2 by Harris Recording Solutions, at `https://www.tccsearch.org/`, reached from the clerk's own page. Access is free and no account is required for the index; the disclaimer is a single accept. Coverage verbatim off the Real Estate search page is "Permanent Index From 01/01/1988 to 08/20/2026 Temporary Index from 08/21/2026 to 08/30/2026 Images from 01/01/1986", which agrees with the county's own table entry of "Recording ... Most Mid 1980's to present". Search fields are the same shape as Bastrop: combined and separate grantor and grantee name search, date filed range, instrument number range, book, page, document type, and a legal description block.

The fee page at `https://countyclerk.traviscountytx.gov/departments/recording/search-copies-of-records/` is the most explicit of the three and answers the image question directly: "Copies of online documents printed using your computer are free. These copies will bear an 'unofficial copy' watermark." Email delivery of an uncertified document is "$1.00 per page", self service photocopies "20 cents per page", microfilm or computer printer copies "25 cents per page", clerk made copies "$1.00 per page", and certified copies carry "a $5.00 per document charge for the certification service plus an additional cost of $1.00 per page". On searching: "Basic record search of electronic data - A search for one name or business is free plus the cost of copies," against "$10.00 per name per ten-year period searched" for microfilm or paper. No bulk or subscription option appears; the county's open data portal page for County Clerk Recording, `https://www.traviscountytx.gov/open-data-portal/recording-cc`, is labelled Expired and offers no dataset.

Two corrections a fresh agent will otherwise inherit from search engines. First, `travis.tx.publicsearch.us` is listed by search engines with a plausible title and it does not resolve: NXDOMAIN against 8.8.8.8 on 2026-08-30, confirmed twice. Second, Travis County Clerk does not appear on the GovOS Cloud Search Texas active sites list, which was updated 2026-08-24. Travis is an Aumentum county, not a GovOS county.

Travis is also the one site of the three that publishes an access signal aimed at AI agents specifically. `https://www.tccsearch.org/robots.txt` carries a Cloudflare managed content signal block whose operative line is "Content-Signal: search=yes,ai-train=no,use=reference", preceded by "As a condition of accessing this website, you agree to abide by the following content signals," and followed by explicit `Disallow: /` entries for named agents including ClaudeBot, GPTBot, CCBot, Amazonbot, Bytespider, Applebot-Extended, Google-Extended, and meta-externalagent, then a final catch all "User-agent: * / Disallow: /". Note precisely what is and is not signalled: `ai-train=no`, `search=yes`, `use=reference`, and no `ai-input` signal at all, which the file's own preamble says means the operator "neither grants nor restricts permission via Content-Signal with respect to the corresponding use."

## Part 4. Williamson County, for contrast

Williamson does not generalize from Bastrop, and the way it fails to generalize is the most consequential finding in this measurement.

The county's own Search Records page, `https://www.wilcotx.gov/1611/Search-Records`, links "Official Public Records Search" to `https://williamsoncountytx-web.tylerhost.net/williamsonweb/user/disclaimer`. That is a Tyler Technologies Self-Service portal, footer "Copyright 2014-2024 Tyler Technologies | Version 2024.1.33", carrying the same disclaimer family as the Aumentum counties including the library card catalogue line and the Property Code 11.008(k) redaction notice. After accepting the disclaimer the portal states verbatim: "This web site is available for searching the public records of the county and also for filing a marriage application. Certified copies of Official Public Records documents may be purchased in person at the Williamson County Clerk's office or by mail by sending a check with the correct fee to: Williamson County Clerk, 1848 Texas Trail, Georgetown, TX 78626." The search menu itself loads through a session bound JavaScript call I did not complete, so the deed index coverage dates and the exposed result fields on that portal are UNFOUND.

Separately, `https://williamson.tx.publicsearch.us/` does resolve, is branded "Williamson County, Texas County Clerk" under Nancy E. Rister, and runs the GovOS platform (footer "Powered By" with the Neumo mark). Its department selector reads "Commissioners Court". The GovOS Cloud Search Texas active sites list, updated 2026-08-24, lists that entry as "Williamson County Clerk Commissioners Court Minutes" while listing most other Texas counties with no such qualifier. The Kofile QuickLink site for the same county, `https://kofilequicklinks.com/Williamson/`, is explicit, verbatim: "The documents referenced in these Commissioners Court index books range from county sovereignty through December 30, 1983, or deed volume 1 - 150; document records related to these indexes are available for purchase by clicking on the links within the index books. Records from January 1984 to the current date are recorded and available in the county's land system." Its index book year ranges are 1848-1898, 1898-1927, 1927-1977, 1978-1986, 1986-1989, 1989-1998.

The correction that follows: the widely repeated claim that Williamson offers free search of land records back to 1848 with free images is describing the Commissioners Court minute books on the GovOS and Kofile surfaces, not the deed and lien index. The deed and lien index from January 1984 forward sits in the Tyler land system, and the pre-1984 Kofile surface says its document records "are available for purchase". Any plan that assumed one free 1848 to present land index for Williamson is assuming a surface that does not exist.

Fees, verbatim from the county published "RECORDING FEES EFFECTIVE 1-1-2024" PDF at `https://www.wilcotx.gov/DocumentCenter/View/8554/2024-County-Clerk-Recording-Fees-PDF`, over the name Nancy E. Rister: "Copies Local Gov. Code 118.011(4) $1 per page"; "Certified Copies Local Gov. Code 118.011(3) $1 per page plus Clerk's certification $5"; "Copies of plats (18x24) $5". No bulk or subscription line item appears.

Automated access terms. `https://williamson.tx.publicsearch.us/robots.txt` is three lines in full:

    user-agent: *
    Allow: /$
    Disallow: /

That is: the homepage is allowed and every other path is disallowed. The Tyler host publishes no `robots.txt` at all (404). The GovOS corporate terms at `https://govos.com/terms-of-use/` return a 301 to `https://neumo.com/tou-sla/`, and that document is a customer agreement with the government entity; its prohibited uses clause covers reverse engineering, harmful code, use "beyond the scope of the authorization granted", and use "for purposes of competitive analysis", and it contains no scraping, crawler, robot, harvesting, or data mining clause and does not name the county search sites. The publicsearch application itself has an in app terms and conditions acceptance flow (the JavaScript bundle carries `termsAndConditions` state and an `accept` action), and that text is served only to a signed in user, so its content is UNFOUND.

One capability worth recording from the same bundle because it bears on access class (b): the GovOS platform ships subscriptions, a shopping cart, Stripe customer creation, and a `purchase-timed-access-session` action, and the vendor's own help centre documents "Pay As You Go sessions" of 15 minutes or 1 hour with pricing that differs for registered users versus subscribers. Those are timed or subscribed access to the same web interface. They are not an index as data product. Williamson's specific plan names and prices are UNFOUND without an account.

## Part 5. The three access classes, stated separately

**(a) Free public index viewing.** Present in all three counties, with no account and no published fee. Bastrop and Travis are the strong cases: a structured index search over grantor, grantee, document type, filing date, instrument number, book and page, and legal description, plus an alphabetical party name browse that walks the whole permanent index. Bastrop covers 01/01/1973 forward, Travis 01/01/1988 forward with images from 01/01/1986. Williamson's equivalent for deeds and liens is behind a session bound Tyler menu and its coverage is unmeasured here; its free 1848 surface is Commissioners Court minutes, not the land index. What class (a) does not carry anywhere: a published amount or consideration field, a documented API, and any statement permitting automated retrieval. Every one of the three sites that publishes a `robots.txt` disallows general crawling of everything except, in Williamson's case, the bare homepage.

**(b) Official paid bulk or subscription index access.** Not offered by Bastrop, Travis, or Williamson as a published, priced program. Three routes exist in principle: a Local Government Code 191.008 contract requiring a commissioners court order and the custodian's written agreement; a Public Information Act request priced under the attorney general rules at roughly $15 per hour of personnel time, $28.50 per hour of programming time, plus 20 percent overhead and media; and, on GovOS counties only, timed access or subscription to the same human web interface rather than to data. Harris and Tarrant prove a county data sales desk is a lawful and operable shape in Texas, and neither publishes prices.

**(c) Document images, the purchase path.** Travis is free online with an "unofficial copy" watermark, $1.00 per page for clerk or email delivery, and $5.00 per document plus $1.00 per page certified. Bastrop is $1.00 per page copied and $5.00 per document to certify at the counter; its online image cost is UNFOUND. Williamson is $1 per page plus $5 certification, with the portal directing certified purchases to in person or mail. Statutorily, the cheap electronic tier in Local Government Code 118.011(4) is written "except for real property records", so the one dollar per ten pages electronic price does not reach the records in question for noncertified copies.

**What the terms of use actually say about automated access.** No county page and no vendor page in scope contains a human readable clause prohibiting scraping, crawling, or automated retrieval. What exists instead is machine readable: `Disallow: /` for all agents at Bastrop; `Disallow: /` for all agents plus named AI agent blocks and `Content-Signal: search=yes,ai-train=no,use=reference` at Travis; and `Allow: /$` with `Disallow: /` at Williamson's GovOS host. The GovOS and Neumo customer agreement has no scraping clause. The in app terms on the GovOS surface are behind sign in and unread. That is the complete evidentiary picture: class (a) is free and unfeed but is uniformly signalled closed to automation, and class (b) does not exist as a published product in any of the three counties.

## Verification. Every URL fetched this session

| URL | Result |
| --- | --- |
| https://www.bastropcounty.gov/page/co.county_clerk | ok |
| https://cc.co.bastrop.tx.us/ | ok |
| https://cc.co.bastrop.tx.us/ (disclaimer accept POST) | ok |
| https://cc.co.bastrop.tx.us/RealEstate/SearchEntry.aspx | ok |
| https://cc.co.bastrop.tx.us/RealEstate/ListOfGrantors.aspx | ok |
| https://cc.co.bastrop.tx.us/RealEstate/SearchResults.aspx | ok (empty, no prior result set) |
| https://cc.co.bastrop.tx.us/localization/faq.aspx | ok |
| https://cc.co.bastrop.tx.us/users/basket.aspx | ok (empty basket) |
| https://cc.co.bastrop.tx.us/robots.txt | ok |
| https://cc.co.bastrop.tx.us/localization/help.aspx | failed (session state error) |
| https://cc.co.bastrop.tx.us/localization/firsttimeuser.aspx | failed (session state error) |
| https://cc.co.bastrop.tx.us/Users/UserDetails.aspx | failed (timeout) |
| https://www.bastropcounty.gov/upload/page/0096/Fee%20Sheet.pdf | ok |
| https://www.bastropcounty.gov/page/co.public_information | ok |
| https://www.co.bastrop.tx.us/page/co.public_information | redirect 301 to bastropcounty.gov, followed |
| https://www.deeds.com/recorder/texas/bastrop/ | ok (third party, corroboration only) |
| https://www.tccsearch.org/ | ok |
| https://www.tccsearch.org/ (disclaimer accept POST) | ok |
| https://www.tccsearch.org/RealEstate/SearchEntry.aspx | ok |
| https://www.tccsearch.org/robots.txt | ok |
| https://countyclerk.traviscountytx.gov/departments/recording/search-copies-of-records/ | ok |
| https://countyclerk.traviscountytx.gov/departments/recording/real-property/ | ok |
| https://www.traviscountytx.gov/open-data-portal/recording-cc | ok (page labelled Expired) |
| https://www.traviscountytx.gov/departments/public-information-records | ok |
| https://travis.tx.publicsearch.us/ | failed (NXDOMAIN, confirmed against 8.8.8.8) |
| https://www.wilcotx.gov/1611/Search-Records | ok |
| https://www.wilcotx.gov/countyclerk | ok |
| https://www.wilcotx.gov/1613/Fees | ok (fees live in linked PDFs) |
| https://www.wilcotx.gov/DocumentCenter/View/8554/2024-County-Clerk-Recording-Fees-PDF | ok |
| https://williamsoncountytx-web.tylerhost.net/williamsonweb/ | ok |
| https://williamsoncountytx-web.tylerhost.net/williamsonweb/user/disclaimer | ok |
| https://williamsoncountytx-web.tylerhost.net/williamsonweb/ (post accept) | ok |
| https://williamsoncountytx-web.tylerhost.net/williamsonweb/search/searchTypes | ok (redirected to home, menu not loaded) |
| https://williamsoncountytx-web.tylerhost.net/robots.txt | failed (404) |
| https://williamson.tx.publicsearch.us/ | ok |
| https://williamson.tx.publicsearch.us/robots.txt | ok |
| https://williamson.tx.publicsearch.us/client.b770c58c8a1e24b544a0.js | ok |
| https://williamson.tx.publicsearch.us/Search.69251fc9ccbd26f9a212.js | ok |
| https://williamson.tx.publicsearch.us/terms-and-conditions | failed (404) |
| https://williamson.tx.publicsearch.us/plans | failed (404) |
| https://williamson.tx.publicsearch.us/subscriptions | failed (404) |
| https://kofilequicklinks.com/Williamson/ | ok |
| https://kofilehelp.zendesk.com/hc/en-us/articles/4416674036375-Texas | ok |
| https://kofilehelp.zendesk.com/hc/en-us/sections/4416665864343-GovOS-Cloud-Search-Active-Sites | failed (403) |
| https://govos.com/terms-of-use/ | redirect 301 to neumo.com/tou-sla/ |
| https://neumo.com/tou-sla/ | ok |
| https://support.wcad.org/portal/en/kb/articles/williamson-county-clerk | ok (third party) |
| https://www.cclerk.hctx.net/PublicRecords.aspx | ok |
| https://www.tarrantcountytx.gov/en/county-clerk/real-estate-records.html | ok |
| https://law.justia.com/codes/texas/local-government-code/title-4/subtitle-b/chapter-118/subchapter-b/section-118-011/ | ok |
| https://law.justia.com/codes/texas/local-government-code/title-6/subtitle-b/chapter-191/section-191-008/ | ok |
| https://law.justia.com/codes/texas/local-government-code/title-6/subtitle-b/chapter-191/ | failed (JS challenge) |
| https://texas.public.law/statutes/tex._gov%27t_code_section_552.262 | ok |
| https://texas.public.law/statutes/tex._local_gov%27t_code_section_195.006 | ok (not on point) |
| https://texas.public.law/statutes/tex._local_gov%27t_code_section_118.014 | ok (amounts cross referenced only) |
| https://texas.public.law/statutes/tex._local_gov%27t_code_section_118.0145 | ok (amounts cross referenced only) |
| https://statutes.capitol.texas.gov/Docs/LG/htm/LG.118.htm | failed (served site shell, no statute text) |
| https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm | failed (served site shell) |
| https://statutes.capitol.texas.gov/Docs/LG/pdf/LG.118.pdf | failed (HTML shell, not a PDF) |
| http://txrules.elaws.us/rule/title1_chapter70_sec.70.3 | failed (timeout) |
| https://www.ethics.state.tx.us/contact/open-records/fees.php | ok |

## Open items a follow up would need to close

Bastrop result grid columns and whether an amount or consideration field is returned, which needs a completed ASP.NET postback against the Aumentum search. Bastrop online image download cost, which needs a basket transaction observed to the price quote step. Williamson deed index coverage dates and exposed result fields on the Tyler self service portal, which needs the session bound menu to load. The in app terms and conditions text on the GovOS publicsearch surface, which is served only after sign in. Whether any of the three counties would grant a Local Government Code 191.008 contract or price a Public Information Act extract of the index, which is a phone call to each clerk, not a fetch.
