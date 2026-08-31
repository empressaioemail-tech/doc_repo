# HY-01 / hygiene state-change logs

Each state changing hygiene verb writes one JSON file here before it mutates, then finalizes the same file after.

A count in a report is not this record. The file names the refs, the timestamp, the invocation (argv), and the result: `pending`, `deleted`, `refused`, or `aborted`.

If the pending write fails, HY-01 deletes nothing (exit 4).
