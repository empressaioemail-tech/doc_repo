#!/usr/bin/env node
/**
 * Self-tests for deploy-violation-probes.mjs predicate logic.
 * Proves each gate grader fails on bad fixtures and passes on good (both directions).
 *
 * Run: node --test scripts/govtech/deploy-violation-probes.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FIXTURES,
  gradeDeploy7,
  gradeDeploy39,
  gradeDeploy75,
  gradeDeploy361,
  gradeGate,
  evaluateExpectation,
  DEPLOY7_PROBE_SECTION,
} from "./deploy-violation-probes.mjs";

describe("deploy-7 code-lookup refuse (defect #6)", () => {
  it("passes on refuse fixture (post-fix)", () => {
    const g = gradeDeploy7(FIXTURES.deploy7Good);
    assert.equal(g.pass, true, g.failures.join("; "));
  });

  it("fails on neighbour fallback fixture (pre-fix)", () => {
    const g = gradeDeploy7(FIXTURES.deploy7Bad);
    assert.equal(g.pass, false);
    assert.ok(g.failures.some((f) => f.includes("fallback") || f.includes("R302.1")));
  });

  it("--expect fail succeeds when violation present", () => {
    const g = gradeDeploy7(FIXTURES.deploy7Bad);
    const e = evaluateExpectation(g, "fail");
    assert.equal(e.ok, true);
  });

  it("--expect pass fails when violation present", () => {
    const g = gradeDeploy7(FIXTURES.deploy7Bad);
    const e = evaluateExpectation(g, "pass");
    assert.equal(e.ok, false);
  });
});

describe("deploy-39 tenancy compose (defects #1 #2)", () => {
  it("passes when anonymous sees only public-free atoms", () => {
    const g = gradeDeploy39(FIXTURES.deploy39Good);
    assert.equal(g.pass, true, g.failures.join("; "));
  });

  it("fails when tenant-private and absent policy leak", () => {
    const g = gradeDeploy39(FIXTURES.deploy39Bad);
    assert.equal(g.pass, false);
    assert.ok(g.failures.length >= 2);
  });

  it("gradeGate routes deploy-39", () => {
    assert.equal(gradeGate("deploy-39", FIXTURES.deploy39Bad).pass, false);
  });
});

describe("deploy-75 meter bypass (S4-2)", () => {
  it("passes when empty provenance refuses accrual", () => {
    const g = gradeDeploy75(FIXTURES.deploy75Good);
    assert.equal(g.pass, true, g.failures.join("; "));
  });

  it("fails when accrual counted with empty provenance", () => {
    const g = gradeDeploy75(FIXTURES.deploy75Bad);
    assert.equal(g.pass, false);
    assert.ok(g.failures.some((f) => f.includes("provenance")));
  });
});

describe("deploy-361 writer accessPolicy (defect #5)", () => {
  it("passes when write refuses missing accessPolicy", () => {
    const g = gradeDeploy361(FIXTURES.deploy361Good);
    assert.equal(g.pass, true, g.failures.join("; "));
  });

  it("fails when write defaults to public-free", () => {
    const g = gradeDeploy361(FIXTURES.deploy361Bad);
    assert.equal(g.pass, false);
    assert.ok(g.failures.some((f) => f.includes("public-free")));
  });
});

describe("predicate is not vacuous", () => {
  it("deploy-7 good and bad disagree", () => {
    assert.notEqual(
      gradeDeploy7(FIXTURES.deploy7Good).pass,
      gradeDeploy7(FIXTURES.deploy7Bad).pass,
    );
  });

  it("unknown section constant is stable", () => {
    assert.equal(FIXTURES.deploy7Bad.requestedSection, DEPLOY7_PROBE_SECTION);
  });
});
