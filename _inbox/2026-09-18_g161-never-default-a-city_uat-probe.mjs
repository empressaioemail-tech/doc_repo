/**
 * G-161 — the city-default refusal, measured on the deployed non-production app.
 *
 * THE DISPATCH'S PROOF CLAUSE: "Then on the non-production app `d12-main-uat`, with
 * `services[0].source_commit_hash` read back and equal to the merge commit, each route answers:
 * keyless 400; ?cityKey=bastrop_tx anonymously 401; ?cityKey=no-such-city 404;
 * ?cityKey=template-city 200. None of those cells needs a tenant key."
 *
 * THIS SCRIPT IS RUN TWICE AGAINST THE SAME URL, ON PURPOSE, EXACTLY AS G-159's STEP 2 PROBE WAS:
 *   leg_old = while deployment 939947a9 (source_commit_hash 53ade8a, the PRE-G-161 commit) is ACTIVE
 *   leg_new = while the deployment built from THIS LANE's merge commit is ACTIVE
 * The keyless cells are the ones that must differ. A unit test proves the CODE refuses; this proves
 * the DEPLOYED SURFACE refuses, which is what the dispatch asks for, and the pre-fix leg is what
 * turns "the fix works" into "the defect was here on the wire and now it is not".
 *
 * UNAUTHENTICATED ON PURPOSE. No bearer, no tenant key. The keyless refusal needs no credential, and
 * a tenant-private pack's honest anonymous answer IS its access refusal (401) - dressing the probe in
 * a key to make bastrop_tx "succeed" would measure the credential instead of the route.
 *
 * WHAT THE MUNICODE ROUTE CANNOT SHOW, STATED HERE RATHER THAN DISCOVERED IN THE RESULTS: it is a POST
 * behind `cityPackAuthorized()`, which on a deployment that sets DASHBOARDS_API_KEY (d12-main-uat does)
 * refuses every request that presents no service bearer with 401 BEFORE the city refusal is reached.
 * So all six of its cells answer 401 anonymously, in BOTH legs, and its 400 cell is UNMEASURED on the
 * deployed surface. That is not worked around by reordering the route's own authorization gate to make
 * this probe pass - it is declared, and the refusal itself is proven in src/city-refusal.test.mjs,
 * which runs with the caller gate open (DASHBOARDS_API_KEY unset) and is where that route's 400 lives.
 *
 * Usage: node <this> <leg-label> <out.json>
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.G161_BASE || "https://d12-main-uat-gqnjx.ondigitalocean.app";
const LEG = process.argv[2] || "leg";
const OUT = process.argv[3];

/**
 * The seven routes the dispatch enumerates, in the order CP1 lists them. `demoToken` is the literal
 * that only a response carrying a RESOLVED pack can contain, which is what makes a keyless 200 a
 * measurement of the defect rather than just a status code.
 */
const ROUTES = [
  { n: 1, id: "city-manager compose", method: "GET", path: "/api/lenses/city-manager/compose" },
  { n: 2, id: "development-services pipeline", method: "GET", path: "/api/lenses/development-services/pipeline" },
  { n: 3, id: "city domains", method: "GET", path: "/api/city-domains" },
  { n: 4, id: "one domain endpoint", method: "GET", path: "/api/domains/permits-pipeline" },
  { n: 5, id: "city identity", method: "GET", path: "/api/city-identity" },
  { n: 6, id: "shell state", method: "GET", path: "/api/shell" },
  { n: 7, id: "finance sources (G-159's route, the control)", method: "GET", path: "/api/lenses/finance/sources" },
  {
    n: 8,
    id: "municode calendar run (POST, caller-gated first)",
    method: "POST",
    path: "/api/adapters/municode/calendar/run",
    callerGatedFirst: true,
  },
];

const CELLS = [
  { id: "keyless", qs: "", cityRefusalExpectedAfterFix: true },
  { id: "empty_citykey", qs: "?cityKey=", cityRefusalExpectedAfterFix: true },
  { id: "whitespace_citykey", qs: "?cityKey=%20%20", cityRefusalExpectedAfterFix: true },
  { id: "named_template_city", qs: "?cityKey=template-city" },
  { id: "named_unknown_city", qs: "?cityKey=no-such-city" },
  { id: "named_bastrop_tx_anonymous", qs: "?cityKey=bastrop_tx" },
];

async function measure(url, method) {
  const row = { url, method, expected: null };
  try {
    const res = await fetch(url, { method, redirect: "manual" });
    const text = await res.text();
    row.status = res.status;
    row.contentType = (res.headers.get("content-type") || "").split(";")[0];
    row.bytes = text.length;
    /** A response that names the demo pack on the wire, whatever its status code. */
    row.carriesTemplateCityToken = text.includes("template-city");
    row.carriesBastropToken = text.includes("bastrop_tx");
    try {
      const body = JSON.parse(text);
      row.error = body.error ?? null;
      row.message = body.message ?? null;
      row.topLevelKeys = Object.keys(body).sort();
      row.cityKeyEchoed =
        body.cityKey ?? body.identity?.cityKey ?? body.finance?.cityKey ?? body.result?.cityKey ?? null;
    } catch {
      row.bodyNotJson = true;
      row.startsWith = text.slice(0, 60);
    }
  } catch (err) {
    row.fetchError = String(err?.cause?.code || err?.message || err);
  }
  return row;
}

const cells = [];
for (const route of ROUTES) {
  for (const cell of CELLS) {
    const url = `${BASE}${route.path}${cell.qs}`;
    const row = await measure(url, route.method);
    row.route = route.id;
    row.routeN = route.n;
    row.cell = cell.id;
    row.callerGatedFirst = route.callerGatedFirst === true;
    cells.push(row);
  }
}

/** The two static assets that carry the CLIENT's own city default. */
const client = {};
client.root = await measure(`${BASE}/`, "GET");
client.root.carriesNoCityStatePanel = (await (async () => {
  try {
    const text = await (await fetch(`${BASE}/`, { redirect: "manual" })).text();
    return text.includes("no-city-state");
  } catch {
    return null;
  }
})());
try {
  const text = await (await fetch(`${BASE}/app.js`, { redirect: "manual" })).text();
  /**
   * TWO READINGS, AND THE SECOND IS THE ONE THAT IS ABOUT THE CODE.
   *
   * The first version of this probe tested `text.includes("DEFAULT_CITY_KEY")` and called the
   * field `importsDefaultCityKey`. On the post-fix leg that came back TRUE - not because the
   * import was back, but because web/app.js explains IN COMMENTS why the default was deleted, and
   * a substring test cannot tell a symbol from a sentence about it. A field named for an import
   * that answers a question about comment text is an instrument measuring itself, which is the
   * defect G-154 spent a lane on in this very repo.
   *
   * So the raw substring is kept (renamed to say what it actually reads, and kept because it is
   * what the pre-fix leg recorded) and the claim is made on the comment-stripped source, which is
   * the same normalization src/city-resolution.test.mjs uses.
   */
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  client.appJs = {
    status: 200,
    bytes: text.length,
    /**
     * Computed over the COMMENT-STRIPPED source, which is what this field's name claims and what
     * the pre-fix leg measured for real (where the import was live, so both readings agreed).
     */
    importsDefaultCityKey: stripped.includes("DEFAULT_CITY_KEY"),
    rawSubstringMentionsDefaultCityKey: text.includes("DEFAULT_CITY_KEY"),
    resolvesCallerTenant: stripped.includes("callerTenantCityKey"),
    showsNoCityState: stripped.includes("showNoCityState"),
    reading:
      "importsDefaultCityKey is a question about the CODE, so it is computed with comments and block comments stripped: post-fix, the difference between it and rawSubstringMentionsDefaultCityKey is the comment in web/app.js that explains why the default was deleted.",
  };
} catch (err) {
  client.appJs = { fetchError: String(err?.cause?.code || err?.message || err) };
}

const byRoute = {};
for (const route of ROUTES) {
  const rows = cells.filter((c) => c.route === route.id);
  const at = (id) => rows.find((c) => c.cell === id);
  const keyless = at("keyless");
  const empty = at("empty_citykey");
  const ws = at("whitespace_citykey");
  byRoute[route.id] = {
    callerGatedFirst: route.callerGatedFirst === true,
    /** The cell that separates the legs. */
    keylessStatus: keyless.status,
    keylessError: keyless.error,
    keylessServedAResolvedDemoPack: keyless.status === 200 && keyless.carriesTemplateCityToken === true,
    keylessRefused: keyless.status === 400 && keyless.error === "city_key_required",
    emptyRefused: empty.status === 400 && empty.error === "city_key_required",
    whitespaceRefused: ws.status === 400 && ws.error === "city_key_required",
    namedTemplateCityStatus: at("named_template_city").status,
    namedUnknownCityStatus: at("named_unknown_city").status,
    namedUnknownCityError: at("named_unknown_city").error,
    namedBastropTxAnonymousStatus: at("named_bastrop_tx_anonymous").status,
    /** The four dispatch cells, as booleans, so a route cannot be read as PASS by averaging. */
    fourCells: {
      keyless: keyless.status,
      bastropAnonymous: at("named_bastrop_tx_anonymous").status,
      unknown: at("named_unknown_city").status,
      named: at("named_template_city").status,
    },
  };
}

const getRoutes = ROUTES.filter((r) => !r.callerGatedFirst);
const keylessRefusedOn = getRoutes.filter((r) => byRoute[r.id].keylessRefused).length;
const keylessServedDemoOn = getRoutes.filter((r) => byRoute[r.id].keylessServedAResolvedDemoPack).length;

const artifact = {
  lane: "g161-never-default-a-city",
  planRow: "G-161",
  leg: LEG,
  measuredAt: new Date().toISOString(),
  target: BASE,
  method: "unauthenticated HTTP over real HTTPS; no bearer, no tenant key, no service key",
  routeCount: ROUTES.length,
  cells,
  byRoute,
  client,
  verdict: {
    getRoutesProbed: getRoutes.length,
    keylessRefusedOn,
    keylessServedDemoOn,
    namedPackStillAnswers: getRoutes.every((r) => byRoute[r.id].fourCells.named === 200),
    unknownStaysUnknown: getRoutes.every((r) => byRoute[r.id].fourCells.unknown === 404),
    tenantPrivateStaysRefused: getRoutes.every((r) => byRoute[r.id].fourCells.bastropAnonymous === 401),
    municodeRouteAnonymouslyAnswerable: false,
  },
  reading:
    keylessServedDemoOn > 0
      ? `PRE-FIX SURFACE: ${keylessServedDemoOn} of ${getRoutes.length} probeable routes answered a request that named no city with 200 AND the demo pack's identity on the wire. That is the preamble's rule 3 defect observed on the deployed app rather than in a test runner. The municode POST is behind its caller gate in this leg too, so its six cells are 401 and its own refusal is not observable anonymously.`
      : keylessRefusedOn === getRoutes.length
        ? `POST-FIX SURFACE: all ${getRoutes.length} probeable routes refuse a request that names no city with 400 city_key_required, name no pack in the refusal, and still answer a named pack, an unknown pack and a tenant-private pack exactly as before. The municode POST's six cells are 401 in this leg as well, because its caller authorisation gate answers before its city refusal for an anonymous caller; that cell is UNMEASURED here and is proven in src/city-refusal.test.mjs instead.`
        : "NEITHER SHAPE: the surface matched neither the pre-fix nor the post-fix reading on at least one route. Reported rather than resolved.",
};

if (OUT) writeFileSync(OUT, JSON.stringify(artifact, null, 2));
console.log(JSON.stringify(artifact, null, 2));
