# AP Ads Manager Architecture

## System Type
AP Ads Manager is a standalone Nuxt/Nitro application with a private admin dashboard and public ad-serving endpoints.

## Product Scope
V1 supports real ad serving across multiple properties: property setup, placement setup, advertisers, campaigns, ads, image uploads, scheduling, weighted rotation, impressions, clicks, daily aggregates, reports, and CSV export.

## Stack
- Nuxt 3 and Vue 3 for the admin UI.
- TypeScript across app and server code.
- Nitro server routes for APIs and public routes.
- PostgreSQL for durable storage.
- Docker for local and production packaging.
- Nginx or any reverse proxy in front of the Node server.

## Hosting and Deployment
The app is intended to run behind `https://ads.adrielpartners.com`. Uploaded images are stored locally under `UPLOAD_DIR` and served from `/images/...` or `PUBLIC_IMAGE_BASE_URL`.

## Domain Model
The core entities are users, properties, advertisers, placements, campaigns, ads, ad placement assignments, raw ad events, and daily ad stats.

## Request and Data Flows
- Admin pages call `/api/*` routes.
- Server routes validate input and enforce authentication.
- Routes call service functions.
- Services run business rules and parameterized SQL.
- Public websites load `/serve.js`.
- `serve.js` finds `data-ap-ad-slot` elements, requests `/api/public/ad`, renders the returned creative, observes viewability, and posts impressions.
- Clicks go to `/click/{token}`, are logged, and then redirect to a safe destination URL.

## Auth
V1 uses email/password login. Passwords are hashed with Argon2. Sessions are stored in PostgreSQL and represented by secure HTTP-only cookies. The schema includes a role column so future roles can be added without rewriting the auth foundation.

## Validation
Server boundary validation uses small explicit schemas. Services assume validated inputs and still guard security-sensitive operations such as URL generation, upload safety, and public domain matching.

## Errors
APIs return:

```json
{ "ok": true, "data": {} }
```

or:

```json
{ "ok": false, "error": { "code": "VALIDATION_ERROR", "message": "Human-readable message." } }
```

Internal errors are logged server-side and returned as generic client messages.

## Background Jobs and Aggregation Choice
V1 updates `daily_ad_stats` during impression and click tracking requests with efficient upserts. This is simpler and more reliable than requiring an external scheduler for launch. A rebuild service can be added later if historical repair is needed.

## Integrations
No Ghost, WordPress, Google Ad Manager, billing, or third-party ad tech integrations are included in v1. External sites integrate by placing `data-ap-ad-slot` elements and loading `/serve.js`.

## Design System
The UI uses CSS variables for tokens, primitive Vue components, and admin pages. Light mode ships first and tokens are named to support later theme work.

## Testing Strategy
Vitest covers service-level behavior where mistakes would affect security, serving, tracking, or reporting. UI tests are intentionally light in v1.

## Performance
Public script and ad endpoint responses are small. Ad selection uses indexed lookups and weighted random selection in service code. Images are served as static assets with cache headers.

## Observability
V1 relies on server logs and database records. Structured logs and metrics can be added later.

## Environment Variables
Required: `DATABASE_URL`, `APP_BASE_URL`, `SESSION_SECRET`, `IP_HASH_SECRET`, `UPLOAD_DIR`, `PUBLIC_IMAGE_BASE_URL`, and `NODE_ENV`.

Optional: `TRUSTED_PROXY_HEADERS`, `LOG_LEVEL`, `OWNER_EMAIL`, and `OWNER_PASSWORD`.

## Backups
Back up PostgreSQL and `UPLOAD_DIR` together. Event logs and uploaded creatives are both needed for meaningful historical reporting.

## Deletion Policy
Prefer pausing or archiving business entities in v1. Hard deletes should be limited because reports and event history reference these records.
