import fs from "node:fs";

const ids = ["34137", "34169", "34161", "82112", "31254", "31272"];
for (const id of ids) {
  const j = JSON.parse(
    fs.readFileSync(
      `P:/doc_repo/_inbox/_p91_verify_probes/facets_48021-${id}.json`,
      "utf8",
    ),
  );
  const b = j.boundaryEdgeFact;
  console.log("====", j.parcelNodeId);
  console.log("lead.setback", JSON.stringify(b.setback ?? null));
  if (b.edges) {
    const unique = [...new Set(b.edges.map((e) => JSON.stringify(e.setback)))];
    console.log("unique edge setbacks", unique.join(" || "));
    console.log("roles", [...new Set(b.edges.map((e) => e.role))].join(","));
    const first = b.edges[0]?.setback?.basis;
    if (first) {
      console.log(
        "basis cps",
        [...first].map((c) => c.codePointAt(0).toString(16)).join(" "),
      );
      console.log("basis exact", JSON.stringify(first));
    }
    const blob = JSON.stringify(b);
    console.log("feet key present", blob.includes('"feet"'));
  } else {
    console.log("refusal", b.code, JSON.stringify(b.reason));
  }
  console.log(
    "queryPoint",
    JSON.stringify(j.cityLimitsFact?.queryPoint ?? null),
  );
  const all = JSON.stringify(j);
  console.log(
    "retired-token-in-body",
    all.includes("road-class-setback-table"),
  );
  console.log(
    "placeholder-token-in-body",
    all.includes("storage-port-proof"),
  );
}
