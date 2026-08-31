# LDT BP-01 branch bundle (2026-08-19)

Thin git bundle of undeclared merged locals in `P:/legacy-design-tools` that had no worktree attached.

Created by `_scratch/_ldt_bp01_bundle.mjs` against origin/main `5688aa3120eb80e92175b58e3aaabb034faaf394`.

## What is in the bundle

`git bundle create … ^origin/main` packs objects not reachable from origin/main. That is 86 refs / 99 unique commits: the 82 squash-or-cherry refs plus the 4 empty-diff refs. Those 86 are what deletion would otherwise discard.

The 66 ancestry-merged refs are not packed. Their tips are already on origin/main. Recreate them from the manifest SHA: `git branch <name> <sha>`.

The JSON manifest lists all 152 names, tip SHAs, merge kinds, and unique-commit counts.

## Restore one squash/cherry ref

Destination must already have `origin/main` (the prerequisite). It must not already contain the unique commits, or the restore does not prove the bundle carried them.

```
git init --bare /tmp/bp01-restore.git
git -C /tmp/bp01-restore.git fetch P:/legacy-design-tools origin/main:refs/heads/main
git -C /tmp/bp01-restore.git fetch P:/doc_repo/_catalog/branch_bundles/ldt-bp01-152-2026-08-19.bundle \
  chore/cloud-run-canary-object-storage-env:refs/heads/restored
git -C /tmp/bp01-restore.git log --format=%H restored
```

Compare that log to `git -C P:/legacy-design-tools log --format=%H chore/cloud-run-canary-object-storage-env`.
