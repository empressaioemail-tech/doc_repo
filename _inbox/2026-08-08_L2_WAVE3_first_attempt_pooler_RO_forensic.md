# Wave 3 first-attempt forensic excerpt (planner session capture before resume overwrite)

Captured by Wave 3 execution planner from apply1 logs immediately after first halt, BEFORE resume overwrote `*_apply1.log`. Source: live `Get-Content` of `_inbox/2026-08-08_L2_WAVE3_48387_apply1.log` (and siblings) during diagnosis turn.

Verbatim error (common to 48387,48267,48165,48297,48137,48219,48489):

```
cause: error: cannot execute DELETE in a read-only transaction
...
code: '25006',
...
routine: 'PreventCommandIfReadOnly'
```

DATABASE_URL fingerprint at first attempt (planner shell):
`ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech/neondb`

Resume fingerprint:
`ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech/neondb`

Presidio 48377 PASS on first attempt (insert 39553) before siblings hit read-only DELETE.
