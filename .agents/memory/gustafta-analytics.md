---
name: Gustafta Analytics decisions
description: Final cross-product analytics scope, dashboard model, roadmap, and privacy boundaries.
---

## Final decisions

- Analytics is a cross-product Gustafta capability named **Gustafta Analytics &
  Usage Measurement**, positioned as “Turning Data into Intelligence, Insights
  into Action.”
- The user finalized **C-C-B-B**: comprehensive analytics scope; hybrid
  open-source/managed/custom technology; executive plus product/functional
  dashboards; comprehensive AI analytics.
- The six official domains are user, product, AI, marketing, business, and
  operations analytics. AI measurement includes usage, quality, performance,
  cost, and business impact.
- Start with one founder-led BI platform with pages/tabs and role-based access;
  split views only as organizational needs grow.
- The phased roadmap is P0 basic tracking/user/portal analytics; P1
  product/AI/CRM analytics and admin analytics integration; P2 business
  intelligence/revenue analytics; P3 advanced and predictive analytics.
- PostgreSQL or BigQuery, PostHog, GA4, Metabase, n8n/API, OpenTelemetry/custom
  evaluation, and Sentry are candidates, not selected or deployed vendors.
- Separate operational and analytics data. Use minimization, consent,
  pseudonymization, role-based access, audit, retention, and encryption. Do not
  send raw AI/consultation conversations, credentials, passwords, or private
  documents to general analytics.
- Numerical goals and example dashboard values are not real until measured
  baselines exist.

**Why:** the user submitted a founder decision document that explicitly finalized
these choices. The strategy is not evidence that tracking, data warehouses, or
vendor integrations are running.

**How to apply:** preserve the P0/P1 distinction from Part 10.X: basic portal and
user measurement can begin at P0, while the admin/analytics dashboard integration
remains P1. Keep vendors and numerical targets open until privacy, cost,
baseline, and operating readiness are verified.
