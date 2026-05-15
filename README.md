# AP Ads Manager

Lightweight self-hosted ad management and serving for Adriel Partners.

## Quick Start
1. Copy `.env.example` to `.env` and set strong secrets.
2. Start PostgreSQL with Docker Compose or provide `DATABASE_URL`.
3. Install dependencies with `npm install`.
4. Run migrations with `npm run migrate`.
5. Create the owner account with `npm run seed:owner`.
6. Start development with `npm run dev`.

## Public Snippet
```html
<div data-ap-ad-slot="homepage-top"></div>
<script src="https://ads.adrielpartners.com/serve.js"></script>
```

Optionally set `data-ap-property="property-slug"` on a slot when a domain maps to more than one property.

## Project Shape
- `app/` contains the Nuxt admin UI.
- `server/api/` contains thin route handlers.
- `server/services/` contains business rules and database access.
- `migrations/` contains PostgreSQL migrations.
- `public/serve.js` is the cross-site public ad script.

## Deployment
Build with Docker or `npm run build`, run the Nitro output behind Nginx, and persist both PostgreSQL and `uploads/images`.
