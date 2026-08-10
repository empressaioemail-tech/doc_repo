"""
Fill the Vertosoft supplier price-list template with the SmartCity OS price list.

Reads Template.xlsx, writes SmartCityOS_PriceList_Vertosoft_2026-08-10.xlsx.

Implementation note: this does RAW STRING surgery on the sheet XML rather than
parsing with ElementTree. ElementTree rewrites namespace prefixes (mc: -> ns1:
etc.), which breaks the mc:Ignorable attribute Excel relies on and causes Excel
to treat the file as needing repair -- it then discards the sheet content. Cells
within a row must also appear in ascending column order or Excel drops them.
Both bugs produced a file that looked like a blank template.

Pricing basis (operator-set 2026-08-10):
  - Deployment prices are the five numbers already sent to Vertosoft 2026-08-10.
  - Annual subscription = 25% of deployment.
  - Entire Program = full deployment, not a discount off a menu (no sum shown).
  - All figures are MINIMUM VIABLE DEPLOYMENT for the smallest city band.
"""
import re
import zipfile

SRC = "Template.xlsx"
DST = "SmartCityOS_PriceList_Vertosoft_2026-08-10.xlsx"

EFFECTIVE_DATE = "8/10/2026"
PRICING_TYPE = "Commercial Retail Price (MSRP)"

# UNSPSC codes drawn from the template's own "Commonly used" list.
U_PORTAL = "43232312"   # Portal server software
U_DBMS = "43232304"     # Data base management system software
U_META = "43232310"     # Metadata management software
U_PROC = "43231517"     # Procedure management software
U_CLOUD = "43233513"    # Cloud-based data access and sharing software
U_IMPL = "81111508"     # Application implementation services
U_SUPP = "81112201"     # Maintenance or support fees

# part number, description, product type, family, price, unspsc
ROWS = [
    # ---- Deployment (one-time): implementation + first-year license ----
    ("SCOS-DASH-DEP",
     "SmartCity OS Dashboards - deployment and first-year license. Unified city view with a role-based lens per department (city manager, development services, finance, citizen). Includes connection of existing city systems, configuration, training and go-live. Minimum viable deployment.",
     "Subscription", "SmartCity OS", 65000, U_PORTAL),
    ("SCOS-PLAN-DEP",
     "SmartCity OS Plan Review - deployment and first-year license. Submittals pre-reviewed against the city's own adopted code, cited by section, with reviewer adjudication and comment-letter output. Minimum viable deployment.",
     "Subscription", "SmartCity OS", 42000, U_PROC),
    ("SCOS-ASST-DEP",
     "SmartCity OS Asset Management - deployment and first-year license. City physical assets established as durable, access-controlled records with provenance and history, built around the city's existing asset data. Minimum viable deployment; scope set per engagement.",
     "Subscription", "SmartCity OS", 52000, U_DBMS),
    ("SCOS-FILE-DEP",
     "SmartCity OS Smart Files - deployment and first-year license. Single searchable record of city documents and records; a revision is current everywhere it appears and prior versions are retained. Minimum viable deployment.",
     "Subscription", "SmartCity OS", 25000, U_META),
    ("SCOS-PROG-DEP",
     "SmartCity OS Full Program - deployment and first-year license. Complete deployment of Dashboards, Plan Review, Asset Management and Smart Files on one shared record. Minimum viable deployment.",
     "Subscription", "SmartCity OS", 150000, U_CLOUD),

    # ---- Annual subscription (year two and beyond), 25% of deployment ----
    ("SCOS-DASH-ANN",
     "SmartCity OS Dashboards - annual subscription, year two and beyond. Hosting, maintenance, updates, security patches, support, data storage and backup for all deployed dashboards.",
     "Subscription", "SmartCity OS", 16250, U_PORTAL),
    ("SCOS-PLAN-ANN",
     "SmartCity OS Plan Review - annual subscription, year two and beyond. Hosting, maintenance, updates, code-corpus currency, support, data storage and backup.",
     "Subscription", "SmartCity OS", 10500, U_PROC),
    ("SCOS-ASST-ANN",
     "SmartCity OS Asset Management - annual subscription, year two and beyond. Hosting, maintenance, updates, support, data storage and backup for all deployed asset records.",
     "Subscription", "SmartCity OS", 13000, U_DBMS),
    ("SCOS-FILE-ANN",
     "SmartCity OS Smart Files - annual subscription, year two and beyond. Hosting, maintenance, updates, support, data storage and backup.",
     "Subscription", "SmartCity OS", 6250, U_META),
    ("SCOS-PROG-ANN",
     "SmartCity OS Full Program - annual subscription, year two and beyond. Covers all deployed categories on one shared record.",
     "Subscription", "SmartCity OS", 37500, U_CLOUD),

    # ---- Expansion ----
    ("SCOS-DASH-ADD",
     "SmartCity OS additional department dashboard - one-time setup. Department-specific configuration, metrics and views, and department user training on data sources already connected.",
     "Subscription", "SmartCity OS", 12000, U_PORTAL),
    ("SCOS-INTG-ADD",
     "SmartCity OS additional system connection - one-time setup, per system beyond those included in the deployment.",
     "Services", "SmartCity OS", 8500, U_IMPL),

    # ---- Services ----
    ("SCOS-SVC-ONB",
     "SmartCity OS onboarding and implementation services - base engagement. Requirements, data assessment, system connection, configuration, testing, training and go-live support. Scoped per city; base package.",
     "Services", "SmartCity OS", 15000, U_IMPL),
    ("SCOS-SVC-PRO",
     "SmartCity OS professional services - per hour. Additional configuration, asset data build, custom reporting and engagement work beyond the deployed scope.",
     "Services", "SmartCity OS", 250, U_IMPL),
    ("SCOS-SVC-TRN",
     "SmartCity OS training - per additional session beyond those included in deployment. Delivered remotely or on site; travel billed separately.",
     "Services", "SmartCity OS", 2500, U_IMPL),
    ("SCOS-SUP-PRE",
     "SmartCity OS premium support - annual. Extended-hours response and a named support contact, above the standard business-hours support included in the subscription.",
     "Support", "SmartCity OS", 9500, U_SUPP),
]

START_ROW = 10


def xesc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def main():
    zin = zipfile.ZipFile(SRC)
    sheet = zin.read("xl/worksheets/sheet3.xml").decode("utf-8")
    shared = zin.read("xl/sharedStrings.xml").decode("utf-8")

    # ---------- shared strings: append ours, keep the rest byte-identical ----------
    existing = re.findall(r"<si>(.*?)</si>", shared, re.S)
    plain = []
    for si in existing:
        plain.append("".join(re.findall(r"<t[^>]*>(.*?)</t>", si, re.S)))

    additions = []

    def sid(text):
        if text in plain:
            return plain.index(text)
        plain.append(text)
        additions.append(
            '<si><t xml:space="preserve">%s</t></si>' % xesc(text))
        return len(plain) - 1

    idx = {}
    for part, desc, ptype, fam, price, unspsc in ROWS:
        for s in (part, desc, ptype, fam, unspsc, "USA", "Yes", "No", "N/A"):
            if s not in idx:
                idx[s] = sid(s)
    for s in (PRICING_TYPE, EFFECTIVE_DATE):
        if s not in idx:
            idx[s] = sid(s)

    if additions:
        shared = shared.replace("</sst>", "".join(additions) + "</sst>")
    shared = re.sub(r'count="\d+" uniqueCount="\d+"',
                    'count="%d" uniqueCount="%d"' % (len(plain), len(plain)),
                    shared, count=1)

    # ---------- sheet: replace rows START_ROW..START_ROW+len(ROWS)-1 ----------
    # Cells MUST be emitted in ascending column order or Excel drops the row.
    def build_row(n, rec):
        part, desc, ptype, fam, price, unspsc = rec
        cells = [
            ("B", "s", idx[part]),
            ("C", "s", idx[desc]),
            ("D", "s", idx[ptype]),
            ("E", "s", idx[fam]),
            ("F", "n", price),
            ("G", "s", idx["N/A"]),
            ("H", "s", idx["USA"]),
            ("I", "s", idx["Yes"]),
            ("J", "s", idx["Yes"]),
            ("K", "s", idx[unspsc]),
            ("L", "s", idx["No"]),
            ("M", "s", idx["N/A"]),
            ("N", "s", idx["N/A"]),
        ]
        out = ['<row r="%d" spans="1:14">' % n]
        for colL, typ, val in cells:
            if typ == "s":
                out.append('<c r="%s%d" t="s"><v>%d</v></c>' % (colL, n, val))
            else:
                out.append('<c r="%s%d"><v>%s</v></c>' % (colL, n, val))
        out.append("</row>")
        return "".join(out)

    for i, rec in enumerate(ROWS):
        n = START_ROW + i
        new = build_row(n, rec)
        pat = re.compile(r'<row r="%d"[^>]*>.*?</row>' % n, re.S)
        if pat.search(sheet):
            sheet = pat.sub(new, sheet, count=1)
        else:
            raise SystemExit("row %d not found in template" % n)

    # header: pricing type and effective date live in the merged banner area
    for cellref, value in (("F2", PRICING_TYPE), ("I2", EFFECTIVE_DATE)):
        pat = re.compile(r'<c r="%s"[^>]*?(?:/>|>.*?</c>)' % cellref, re.S)
        rep = '<c r="%s" t="s"><v>%d</v></c>' % (cellref, idx[value])
        if pat.search(sheet):
            sheet = pat.sub(rep, sheet, count=1)

    # ---------- rewrite ----------
    zout = zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        if item.filename == "xl/calcChain.xml":
            continue
        data = zin.read(item.filename)
        if item.filename == "xl/worksheets/sheet3.xml":
            data = sheet.encode("utf-8")
        elif item.filename == "xl/sharedStrings.xml":
            data = shared.encode("utf-8")
        zout.writestr(item, data)
    zout.close()
    zin.close()
    print("wrote %s with %d line items (rows %d-%d)"
          % (DST, len(ROWS), START_ROW, START_ROW + len(ROWS) - 1))


if __name__ == "__main__":
    main()
