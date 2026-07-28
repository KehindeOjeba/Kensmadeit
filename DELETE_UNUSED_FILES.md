# Suggested cleanup list

These items look like they can be removed or archived to reduce project clutter.

## Safe to delete now
- playwright-report/ — generated Playwright HTML report output
- test-results/ — generated Playwright test artifacts
- e2e/ — end-to-end tests only; keep only if you still want Playwright coverage
- playwright.config.ts — used only by Playwright E2E tests

## Likely safe to delete if you no longer need planning/docs history
- BUILD_SUMMARY.md
- CHECKLIST.md
- DEVELOPMENT.md
- PROMPT.md
- QUICKSTART.md
- SPRINT2_SUMMARY.md

## Verify before deleting
- proxy.ts — no app imports were found during workspace search
- auth.ts — keep; it is used by app/api/auth/[...nextauth]/route.ts

## Keep unless you truly want to remove project documentation
- README.md
