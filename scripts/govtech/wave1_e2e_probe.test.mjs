import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateSteps } from "./wave1_e2e_probe.mjs";

describe("wave1_e2e_probe", () => {
  it("evaluateSteps returns five steps", () => {
    const steps = evaluateSteps([
      { id: "a", wdll: 15, depends: [1], label: "x", verify: () => true },
      { id: "b", wdll: 15, depends: [2], label: "y", verify: () => false },
    ]);
    assert.equal(steps.length, 2);
    assert.equal(steps[0].pass, true);
    assert.equal(steps[1].pass, false);
  });
});
