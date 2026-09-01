import { readFileSync, writeFileSync } from "node:fs";

const matrix = JSON.parse(
  readFileSync(
    "P:/doc_repo/_inbox/2026-08-08_SWEEP_county_source_matrix.json",
    "utf8",
  ),
);
const sweep = JSON.parse(
  readFileSync(
    "P:/doc_repo/_inbox/2026-08-09_MULTI_SHP_sweep_raw.json",
    "utf8",
  ),
);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function listShp(url, bytes) {
  const tail = Math.min(262144, bytes);
  const start = bytes - tail;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Range: `bytes=${start}-${bytes - 1}`,
    },
  });
  if (!(res.status === 206 || res.status === 200)) {
    throw new Error(`HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (
      buf[i] === 0x50 &&
      buf[i + 1] === 0x4b &&
      buf[i + 2] === 0x05 &&
      buf[i + 3] === 0x06
    ) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("no EOCD in tail");
  const totalEntries = buf.readUInt16LE(eocd + 10);
  const cdSize = buf.readUInt32LE(eocd + 12);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const zip64 =
    cdOffset === 0xffffffff || cdSize === 0xffffffff || totalEntries === 0xffff;
  const cdRes = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Range: `bytes=${cdOffset}-${cdOffset + cdSize - 1}`,
    },
  });
  const cdBuf = Buffer.from(await cdRes.arrayBuffer());
  const shps = [];
  let p = 0;
  while (p + 46 <= cdBuf.length) {
    if (
      cdBuf[p] !== 0x50 ||
      cdBuf[p + 1] !== 0x4b ||
      cdBuf[p + 2] !== 0x01 ||
      cdBuf[p + 3] !== 0x02
    ) {
      break;
    }
    const nameLen = cdBuf.readUInt16LE(p + 28);
    const extraLen = cdBuf.readUInt16LE(p + 30);
    const commentLen = cdBuf.readUInt16LE(p + 32);
    const name = cdBuf.slice(p + 46, p + 46 + nameLen).toString("utf8");
    if (/\.shp$/i.test(name)) shps.push(name);
    p += 46 + nameLen + extraLen + commentLen;
  }
  return { shp_count: shps.length, shps, zip64, totalEntries, cdOffset, cdSize };
}

const samples = ["48021", "48453", "48209", "48029", "48201"];
const results = [];
for (const fips of samples) {
  const m = matrix.counties.find((c) => c.fips === fips);
  const claimed = sweep.counties.find((c) => c.fips === fips);
  const live = await listShp(m.url, m.bytes);
  results.push({
    fips,
    name: m.name,
    claimed_shp_count: claimed.shp_count,
    live_shp_count: live.shp_count,
    live_shps: live.shps,
    zip64: live.zip64,
    match: claimed.shp_count === live.shp_count,
  });
}
const out = { observed_at_utc: new Date().toISOString(), results };
writeFileSync(
  "P:/doc_repo/_inbox/multishp_harris_logs/sweep_spotcheck.json",
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
