#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook: warn when a command reads the CONVENIENT artifact where
 * an authoritative one exists. Never blocks. See
 * scripts/enforcement/authoritative-read.mjs for the rules and their instances.
 *
 * Fails OPEN by design: a hook that cannot run must not stop work. It prints that
 * it could not run so the failure is visible rather than silent.
 */
import { evaluate, render } from "../../scripts/enforcement/authoritative-read.mjs";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const command =
      payload?.tool_input?.command ??
      payload?.toolInput?.command ??
      payload?.command ??
      "";
    const hits = evaluate(command);
    if (hits.length > 0) {
      // stderr so it reaches the transcript as feedback without altering the tool call
      process.stderr.write(render(hits));
    }
  } catch (err) {
    process.stderr.write(
      `AUTHORITATIVE-READ hook could not run: ${err?.message ?? err}. ` +
        `Not blocking. This line exists so a dead control is visible.\n`,
    );
  }
  process.exit(0);
});
