# f04-console-proxy

OPEN (2026-08-27T22:25Z): F-04 operator login + server-side proxy. Dispatch `_dispatches/2026-08-27_f04-console-proxy_dispatch.md`. WDLL `_inbox/2026-08-27_f04_console_login_proxy_WDLL.md`.

GROUND-TRUTH (2026-08-27T22:20Z): hook seat integration on P:/doc_repo main 5d51697. Dispatch owner property. hauska-map-factory seat/property-factory cae9eab; four files marked modified with empty diff (line endings). Primary hauska-factory seat/property is dirty salvage; not a write target. origin/main factory-control is 99b2cb3 and already has GET /queues and /gates; POST still hardcodes actor "api".

DEAD-END: do not build factory-control in P:/seat-worktrees/property/hauska-factory. Dirty, other-lane salvage.

LESSON: Phase A left VITE_FACTORY_CONTROL_API in the client. After key rotation the console is honest-401. The proxy must be the only caller; the client must not name factory-control.

OPEN: Google/Microsoft redirect URI for https://smart-site-factory.vercel.app/api/auth/{provider}/callback must be registered on the existing OIDC clients. FACTORY_OPERATOR_ALLOWLIST must be set on the Vercel project.

GROUND-TRUTH (2026-08-27T22:31:25Z): console dpl_Dn2Sx3ZgcR9MaXqfW9XAzSHcJzZG aliased to smart-site-factory.vercel.app. factory-control-00006-raz @100% image sha256:9e5a3406. Unauth browser is sign-in only. Unauth /api/proxy/* 401. Signed-in GET /runs 20. start 3241ba27 operator google:f04-probe. PRs factory #13 MERGED bc2166f, map #252 MERGED f1ac168.

LESSON: vercel env pull of PE production sensitive vars (GOOGLE_OIDC_CLIENT_ID) returns "". Paste from the Vercel dashboard, do not pull.

DEAD-END: do not build factory-control in P:/seat-worktrees/property/hauska-factory. Dirty salvage.

OPEN: paste GOOGLE_OIDC_* and OIDC_STATE_SECRET onto smart-site-factory; add Google redirect URI. Then the operator can use the Google button instead of a minted session.
