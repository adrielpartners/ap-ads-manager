# AP Ads Manager Decisions

## Early Decisions
- Build a standalone app, not a WordPress plugin.
- Support multiple properties in v1.
- Store uploaded images locally in v1.
- Do not allow SVG uploads.
- Use owner-only auth in v1 with a roles-ready model.
- Store raw events plus daily aggregates.
- Route clicks through AP Ads Manager before redirecting.
- Use property-level default UTMs with ad-level overrides.
- Defer billing and advertiser self-serve portals.
- Defer PDF reports.
- Update daily aggregates inline during tracking requests for v1 simplicity.
