#!/usr/bin/env node
// Resolve hostnames through Cloudflare DNS-over-HTTPS (independent of the fleet host's resolver)
// and classify where each points: GCP (ghs.googlehosted.com), DigitalOcean App Platform
// (*.ondigitalocean.app), Vercel, or a raw IP. Used before and after every DNS cutover.
//
// Usage: node --use-system-ca scripts/infra/gcp-exit/dns.mjs host [host ...]
// Self-tests: app.smartcityos.io must CNAME to dolphin-app (the D-12 record), and a nonsense name
// must return NXDOMAIN. Update the first control if that record ever legitimately changes.
import { selftest, finish } from "./lib.mjs";

const names = process.argv.slice(2);
const q = async (n, t) => (await fetch(`https://cloudflare-dns.com/dns-query?name=${n}&type=${t}`, { headers: { accept: "application/dns-json" } })).json();
const cls = (s) => /googlehosted|ghs\./.test(s) ? "GCP" : /ondigitalocean\.app/.test(s) ? "DO-app" : /vercel-dns|^76\.76\.21\./.test(s) ? "Vercel" : "";
console.log(`# gcp-exit dns | read ${new Date().toISOString()} via cloudflare-dns.com`);
const out = {};
for (const n of names) {
  const [a, c] = await Promise.all([q(n, "A"), q(n, "CNAME")]);
  const ans = [...new Set([...(c.Answer || []), ...(a.Answer || [])].map((x) => x.data))];
  out[n] = ans;
  const st = a.Status === 3 ? "NXDOMAIN" : a.Status === 0 ? "OK" : `rcode${a.Status}`;
  console.log(`${n.padEnd(28)} ${st.padEnd(8)} ${ans.slice(0, 5).join(" ")}  ${[...new Set(ans.map(cls).filter(Boolean))].join(",")}`);
}
const ctl = await q("app.smartcityos.io", "CNAME");
selftest((ctl.Answer || []).some((x) => /dolphin-app/.test(x.data)), "control: app.smartcityos.io CNAMEs to dolphin-app");
selftest((await q("zz-no-such-host-qq.smartcityos.io", "A")).Status === 3, "control: nonsense name is NXDOMAIN");
finish();
