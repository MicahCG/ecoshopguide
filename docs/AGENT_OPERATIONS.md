# Performance-driven change and release workflow

This runbook defines how Hermes and the `ecoshopguide-owner` agent turn site, Pinterest, and affiliate performance evidence into safe repository changes.

## Roles

### Hermes

- Owns business context, measurement interpretation, prioritization, and user communication.
- Provides the implementation agent with a self-contained change contract.
- Independently verifies the agent's work.
- Obtains explicit approval for commits, pushes, PRs, merges, production actions, database work, credentials, and platform settings.

### `ecoshopguide-owner`

- Owns code tracing, implementation, local verification, preview readiness, release checklist, and rollback preparation.
- Works only on non-`main` branches.
- Does not deploy or make production/configuration changes without approval.

### `ecoshopguide-catalog-operator`

- Owns read-only sourcing research, candidate scorecards, factual listing drafts, unit-economics models, and merchandising recommendations.
- Follows `docs/CATALOG_OPERATIONS.md` and `config/catalog-governance.json`.
- Cannot buy, publish, price, reorder, change inventory, alter collections or badges, change checkout, connect apps, subscribe webhooks, or deploy without exact approval.

### Independent reviewer

- Uses the separate read-only `ecoshopguide-reviewer` role, invoked by Hermes in a fresh session.
- Reviews the diff without relying on the implementer's assumptions.
- Checks security, logic, analytics validity, affiliate tracking preservation, accessibility, performance, and missing tests.
- Must not be the same agent that implemented the change.

## Change contract

Every performance-driven task begins with this record:

```text
Decision ID:
Evidence window:
Evidence sources:
Affected route or cohort:
Baseline metric:
Primary metric:
Guardrails:
Hypothesis:
Proposed intervention:
Files and events likely affected:
Measurement/maturation window:
Rollback trigger:
Rollback target:
Rollback executor: Hermes
Emergency rollback pre-authorized by this release approval: yes/no
Explicitly out of scope:
```

Do not start implementation if the requested outcome cannot be measured or if the change combines unrelated variables that prevent interpretation.

## Metrics hierarchy

Use the closest valid business outcome available:

1. Affiliate commission contribution and EPC
2. Amazon Tracking-ID ordered items, revenue, returns, and commission
3. Affiliate outbound clicks and click-through rate
4. Newsletter signup or another explicitly approved conversion
5. Engagement and Core Web Vitals as diagnostic metrics

Pinterest click and engagement data cannot be labeled as an Amazon purchase. Amazon aggregate reporting cannot be joined deterministically to an individual site visitor.

## Standard workflow

### 1. Intake and baseline

- Fresh-fetch data from the original source.
- Align date windows and time zones.
- Record sample size and known maturation delays.
- Check whether the metric is available and functioning.
- Return `no_change` if evidence is too weak.

### 2. Repository preparation

```bash
git status --short --branch
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c <type>/<decision-id>-<short-description>
```

Stop if the tree is dirty. Never stash user work automatically.

### 3. Trace before editing

- Locate the route and entrypoint.
- Trace components, data, analytics, APIs, and deployment rewrites.
- Confirm local and Vercel execution paths.
- Check neighboring implementations for the same issue.
- Verify current dependencies in `package.json`.

### 4. Implement narrowly

- One main hypothesis per branch.
- Preserve affiliate destinations, disclosures, and tracking attributes.
- Preserve privacy boundaries and avoid customer-level Amazon attribution claims.
- Keep motion restrained and support reduced motion.
- Optimize mobile behavior first when Pinterest is the traffic source.
- Do not fabricate reviews, stock pressure, discounts, certifications, or claims.

### 5. Verify locally

At minimum:

```bash
git diff --check
npm run check
npm run build
```

Compare TypeScript output with the recorded baseline until the baseline is repaired. Run route-specific tests when they exist. Verify changed pages at mobile and desktop widths. For performance work, compare image bytes, JavaScript bytes, and Core Web Vitals against the current production route.

### 6. Independent review

Provide the reviewer with:

- change contract
- diff
- baseline and new check output
- changed analytics events
- security findings
- preview verification evidence

Blocking findings must be fixed and re-reviewed. Suggestions that are not needed for the hypothesis should be deferred.

### 7. Approval package

Before any push or PR, report:

- exact branch and commit plan
- changed files
- build, check, and test evidence
- unresolved baseline failures
- expected Vercel preview behavior
- production risk
- rollback target

Obtain explicit approval before committing, pushing, or opening a PR. That approval does not authorize merge or production deployment.

### 8. Preview verification

After commit, push, and PR creation have been explicitly approved, and a Vercel preview exists:

- verify the preview commit
- smoke-test changed routes
- test mobile and desktop layouts
- verify affiliate links and disclosures
- verify analytics requests without exposing data
- compare performance with current production
- inspect API status codes and browser-console failures

Do not merge a preview that fails the change contract or guardrails.

### 9. Production release

Merge or production promotion requires a separate explicit approval tied to the reviewed commit. Because current pushes to `main` deploy automatically, merging is a production action. PR approval never implies merge approval.

For an owned-commerce traffic test, the approval package must also satisfy every item in the `Owned-commerce traffic-test launch gate` in `docs/CATALOG_OPERATIONS.md`. The reviewed release reaches `main` through a pull request, never a direct commit.

### 10. Production verification

After an approved release:

- confirm Vercel deployed the intended commit
- verify homepage and changed routes
- verify critical APIs
- inspect browser console and network failures
- verify affiliate destinations and tracking attributes
- verify analytics delivery
- verify mobile behavior
- check the agreed rollback trigger
- observe the release for the duration and owner recorded in the approved release plan

### 11. Rollback

The default rollback target is the previous known-good Vercel deployment. Hermes executes a rollback only when the release approval explicitly pre-authorized that action or the user gives fresh approval after an alert. The implementation owner cannot invoke Vercel or mutate production. After an approved rollback, prepare a git revert in a separate branch. Database or schema changes require an explicit reversible plan before release.

## Current baseline on 2026-08-10

Freshly verify before relying on these observations:

- deployed production commit: `2bf12a0603d56115f358cd078de2e585eb0a687c`
- `npm run build`: passed
- `npm run check`: passed after maintenance and seed scripts were updated to use `requireDb()` and Drizzle returning arrays
- automated tests: none found
- GitHub Actions: none found
- `main` branch protection: not enabled
- production deployment: automatic from `main`
- production database-backed routes appeared unhealthy
- first-party affiliate-click measurement was not wired to existing affiliate link attributes
- homepage images were multi-megabyte PNGs and represented the largest obvious performance opportunity

## Immediate remediation order requiring separate approvals

1. Rotate the database credential exposed in public tracked documentation.
2. Restore the approved database environment configuration in Vercel and verify APIs.
3. Correct `ads.txt`.
4. Optimize homepage images and font loading.
5. Add CI and tests.
6. Instrument affiliate outbound clicks and create a safe analytics read/export path.
7. Replace stale deployment and analytics documentation.

These items are findings, not pre-authorization. Each live or repository change must receive its own approved scope.