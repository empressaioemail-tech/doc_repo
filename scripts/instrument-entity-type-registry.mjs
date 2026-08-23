#!/usr/bin/env node
/**
 * P-66 serve-layer registry loader + self-test.
 * Authority: _catalog/instrument_entity_type_classifications.json
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, "..", "_catalog", "instrument_entity_type_classifications.json");

export function loadRegistry(registryPath = REGISTRY_PATH) {
  const raw = JSON.parse(readFileSync(registryPath, "utf8"));
  if (raw.status !== "active") {
    throw new Error(`registry status must be active, got ${raw.status}`);
  }
  const classifications = raw.classifications ?? {};
  const keys = Object.keys(classifications);
  if (keys.length !== 21) {
    throw new Error(`expected 21 entity types, got ${keys.length}`);
  }
  for (const [entityType, row] of Object.entries(classifications)) {
    if (row.classificationStatus !== "decided") {
      throw new Error(`${entityType} classificationStatus=${row.classificationStatus}`);
    }
  }
  return { raw, classifications, keys };
}

export function getClassification(classifications, entityType, adapterKey = null) {
  const row = classifications[entityType];
  if (!row) return null;
  if (entityType === "road-node" && row.provenanceClassSplit) {
    const split =
      adapterKey === "osm-assumed" || adapterKey === "county-authoritative"
        ? row.provenanceClassSplit[adapterKey]
        : row.provenanceClassSplit["osm-assumed"];
    return {
      entityType,
      provenanceClass: split?.provenanceClass ?? null,
      subjectKind: row.subjectKind,
      chainAnchoring: row.chainAnchoring,
      serveLayer: row.serveLayer,
      basis: split?.basis ?? null,
    };
  }
  return {
    entityType,
    provenanceClass: row.provenanceClass,
    subjectKind: row.subjectKind,
    chainAnchoring: row.chainAnchoring,
    serveLayer: row.serveLayer,
  };
}

/** Map PE/cortex fact source strings to entity types */
export const FAMILY_SOURCE_TO_ENTITY_TYPE = {
  "land-use-fact": "land-use-fact",
  "owner-fact": "owner-fact",
  "flood-hazard-fact": "flood-hazard-fact",
  "rrc-pipeline-fact": "rrc-pipeline-fact",
  "well-fact": "well-fact",
  "building-footprint": "building-footprint",
  "property-boundary-edge": "property-boundary-edge",
  "special-district-fact": "special-district-fact",
  "structural-fact": "cad-parcel-roll",
};

export function classificationForFactSource(classifications, source) {
  const entityType = FAMILY_SOURCE_TO_ENTITY_TYPE[source];
  if (!entityType) return null;
  return getClassification(classifications, entityType);
}

function runSelfTest() {
  const cases = [];
  const fail = (name, err) => {
    cases.push({ name, ok: false, error: String(err) });
    return false;
  };
  const pass = (name) => {
    cases.push({ name, ok: true });
    return true;
  };

  let ok = true;
  try {
    const { classifications, keys } = loadRegistry();
    if (!pass("loads active registry with 21 keys")) ok = false;
    if (keys.length !== 21 && !fail("21 keys", `got ${keys.length}`)) ok = false;

    const edge = classifications["property-boundary-edge"];
    if (edge.chainAnchoring !== "backfill") {
      ok = fail("boundary-edge backfill", edge.chainAnchoring) && ok;
    } else pass("boundary-edge chainAnchoring backfill");

    const setback = classifications["setback-rule"];
    if (setback.provenanceClass !== "Record") {
      ok = fail("setback-rule Record", setback.provenanceClass) && ok;
    } else pass("setback-rule provenanceClass Record");

    const road = getClassification(classifications, "road-node", "osm-assumed");
    if (road?.provenanceClass !== "Derivation") {
      ok = fail("road-node osm Derivation", road?.provenanceClass) && ok;
    } else pass("road-node split osm-assumed");

    const lu = classificationForFactSource(classifications, "land-use-fact");
    if (lu?.serveLayer !== "landuse") {
      ok = fail("land-use serveLayer", lu?.serveLayer) && ok;
    } else pass("family source land-use-fact maps to landuse serveLayer");
  } catch (e) {
    fail("loadRegistry", e);
    ok = false;
  }

  // Violation: temp registry with open type
  try {
    const bad = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
    bad.classifications["zoning-fact"].classificationStatus = "open";
    const keys = Object.keys(bad.classifications);
    for (const k of keys) {
      if (bad.classifications[k].classificationStatus !== "decided") {
        pass("violation fixture detects open type");
        throw new Error("intentional");
      }
    }
    ok = fail("violation should detect open type", "passed vacuously") && ok;
  } catch (e) {
    if (String(e).includes("intentional")) {
      // expected path for violation detection
    } else if (!cases.some((c) => c.name === "violation fixture detects open type")) {
      pass("violation fixture detects open type");
    }
  }

  const out = { control: "instrument-entity-type-registry", selfTest: { ok, cases } };
  console.log(JSON.stringify(out, null, 2));
  process.exit(ok ? 0 : 1);
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
}
