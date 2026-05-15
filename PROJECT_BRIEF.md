# AP Ads Manager Project Brief

## Purpose
AP Ads Manager is a lightweight, self-hosted ad server and management dashboard for Adriel Partners. It lets the owner manage display ads across owned or client properties and serve them through a small public JavaScript snippet.

## Audience
The v1 audience is the Adriel Partners owner/operator. Later versions may add admins, clients, and read-only viewers.

## System Type
Standalone web application with a public ad-serving surface and a private owner dashboard.

## Stack
Nuxt 3, Vue 3, TypeScript, Nitro server routes, PostgreSQL, Docker, and Nginx-compatible reverse proxy deployment.

## Hosting Model
Self-hosted on infrastructure controlled by Adriel Partners. The intended public host is `https://ads.adrielpartners.com`.

## V1 Features
- Owner login with a roles-ready user model.
- Multi-property management.
- Advertisers, placements, campaigns, ads, and placement assignments.
- Local image uploads with generated filenames.
- UTM inheritance and ad-level overrides.
- Public `serve.js` ad rendering.
- Weighted active ad rotation by property and placement.
- Viewable impression tracking.
- Click tracking with safe redirects.
- Raw events plus daily aggregate reporting.
- Dashboard, entity reports, and CSV export.

## V1 Non-Goals
Billing, advertiser self-serve, client dashboards, PDF reports, Google Ad Manager integration, RTB, audience targeting, geotargeting, frequency capping, newsletter injection, Ghost API integration, WordPress plugin, and permissions UI beyond owner login.

## Risks
- Public tracking endpoints need careful validation and rate limiting as traffic grows.
- Local image storage is simple but requires disciplined backups.
- Reporting accuracy depends on reliable client-side viewability events.
- Cross-site script loading must stay small, resilient, and privacy-conscious.
