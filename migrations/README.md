# D1 Migrations

Migration files are ordered, forward-only SQLite changes applied by Wrangler. Do not edit a migration after it has been applied to a shared Preview or Production database; add a new numbered migration instead.

Run the local schema migration with:

```bash
npm run db:migrate:local
```

Local D1 data is persisted in `.wrangler/state` and is intentionally ignored by Git. The Production binding in `wrangler.json` points to the Cloudflare D1 database `puzzlepuzzle-prod-db`.

For a remote database, use `npx wrangler d1 migrations apply DB --remote`. Do not run the development-only `scripts/seed-local.sql` against Production; apply approved store content separately.