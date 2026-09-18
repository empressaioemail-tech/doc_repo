/**
 * G-159 STEP 1 live proof harness — NOT COMMITTED. Delete after running.
 *
 * Boots the real express routes from server/routes/platform-finance.ts and hits
 * them over real HTTP, with and without the bearer token, against the REAL
 * vendor. Proves the two directions the dispatch names:
 *
 *   answers with the key   -> 200, and the numbers are Bastrop's
 *   refuses without it     -> 401 with no token, 401 with a wrong token,
 *                             503 with no key configured at all
 *
 * DATABASE_URL is a dummy on purpose: the BNP routes never touch the database,
 * so the pool is never dialled. The permit-revenue route DOES query, so it is
 * expected to fail at the database leg here and is reported as such — its gate
 * is proven live, its query is proven by unit test, and the gap is named.
 */
import express from "express";
import { registerPlatformInternalFinanceRoutes } from "../server/routes/platform-finance";

const PORT = 45991;
const BASE = `http://127.0.0.1:${PORT}`;
const KEY = process.env.PLATFORM_INTERNAL_API_KEY!;

const TARGETS = [
  "/api/platform/opengov/budgets",
  "/api/platform/opengov/budgets/130231/amounts-summary",
  "/api/platform/opengov/chart-of-accounts",
  "/api/platform/finance/permit-revenue/summary?fy=2027",
  "/api/platform/finance/permit-revenue/summary?fy=2026",
];

async function hit(path: string, bearer?: string) {
  const headers: Record<string, string> = {};
  if (bearer) headers["Authorization"] = `Bearer ${bearer}`;
  const res = await fetch(`${BASE}${path}`, { headers });
  let body: any = null;
  const text = await res.text();
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 200);
  }
  return { status: res.status, body };
}

const app = express();
registerPlatformInternalFinanceRoutes(app);

const server = app.listen(PORT, "127.0.0.1", async () => {
  const results: any[] = [];

  // ---- direction 1: answers with the key ----
  for (const path of TARGETS) {
    const r = await hit(path, KEY);
    results.push({
      direction: "with-key",
      path,
      status: r.status,
      ok: r.body?.ok ?? null,
      error: r.body?.error ?? null,
      payload:
        path.includes("permit-revenue")
          ? r.body
          : path.endsWith("/budgets")
          ? {
              total: r.body?.total,
              productionCount: r.body?.productionCount,
              names: r.body?.budgets?.map((b: any) => b.name),
              entityId: r.body?.entityId,
            }
          : path.endsWith("/amounts-summary")
          ? {
              expenses: r.body?.expenses,
              revenues: r.body?.revenues,
              derived: r.body?.derived,
              actuals: r.body?.actuals?.state,
            }
          : {
              total: r.body?.total,
              charts: r.body?.charts?.map((c: any) => ({
                name: c.name,
                segments: c.segments.map((s: any) => s.label),
              })),
            },
    });
  }

  // ---- direction 2a: refuses with no token ----
  for (const path of TARGETS) {
    const r = await hit(path);
    results.push({ direction: "no-token", path, status: r.status, error: r.body?.error ?? null });
  }

  // ---- direction 2b: refuses with a wrong token ----
  for (const path of TARGETS) {
    const r = await hit(path, "definitely-not-the-key");
    results.push({ direction: "wrong-token", path, status: r.status, error: r.body?.error ?? null });
  }

  // ---- direction 2c: refuses when no key is configured at all ----
  delete process.env.PLATFORM_INTERNAL_API_KEY;
  for (const path of TARGETS) {
    const r = await hit(path, KEY);
    results.push({ direction: "no-key-configured", path, status: r.status, error: r.body?.error ?? null });
  }

  console.log(JSON.stringify({ results }, null, 2));
  server.close();
  process.exit(0);
});
