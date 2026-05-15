# AP Ads Manager Project Rules

## Architecture
- Use the flow: UI/Page -> Server Route -> Service Layer -> Database.
- Keep server routes thin.
- Put business rules in service modules.
- Keep database access inside services or explicit database modules owned by services.
- Use explicit naming and avoid clever abstractions.

## Security
- Validate all external input at the server boundary.
- Use parameterized SQL.
- Return consistent API envelopes.
- Do not expose stack traces, SQL details, secrets, or internal tokens to clients.
- Admin routes require authentication.
- Public routes only return data needed to render or track ads.
- Never store raw passwords.
- Do not store raw IP addresses; hash them with `IP_HASH_SECRET`.
- Validate upload MIME type and extension.
- Do not allow SVG uploads in v1.
- Only redirect to `http:` or `https:` URLs.

## Frontend
- Use token-driven CSS variables.
- Build with primitive components, feature components, and pages.
- Keep the admin UI minimal, efficient, and polished.
- Do not use Tailwind as the default styling approach.

## Data
- Use PostgreSQL migrations.
- Prefer clear indexes for lookup and reporting paths.
- Store raw events and daily aggregates.
- Preserve multi-property support in v1.

## Testing
Prioritize tests for UTM generation, ad eligibility and weighted rotation, redirect safety, upload validation, impression validation, daily aggregates, and auth service behavior.
