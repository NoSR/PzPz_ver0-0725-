# D1 Migrations

Migration files are ordered, forward-only SQLite changes applied by Wrangler. Do not edit a migration after it has been applied to a shared Preview or Production database; add a new numbered migration instead.

Run the local schema migration with:

```bash
npm run db:migrate:local
```

Local D1 data is persisted in `.wrangler/state` and is intentionally ignored by Git. Preview and Production database bindings will be added only after their D1 databases are created in Cloudflare.

The D1 ID in `wrangler.json` is a local-development placeholder. Replace it with real, environment-specific Cloudflare D1 IDs before deploying Pages Functions remotely.