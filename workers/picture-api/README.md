# Cloudflare Worker deployment

This Worker serves the whole static Next.js export from `out/` and handles the
picture API under `/api/picture/*`. Album metadata is stored in Cloudflare D1;
image files are stored in private Cloudflare R2.

## Cloudflare resources

Create these resources before deploying:

```powershell
pnpm dlx wrangler d1 create masao-picture-db
pnpm dlx wrangler r2 bucket create masao-picture-images
```

Copy the D1 `database_id` returned by Cloudflare into `wrangler.toml`.

Set Worker secrets without committing their values:

```powershell
pnpm dlx wrangler secret put PRIVATE_ALBUM_KEY -c workers/picture-api/wrangler.toml
pnpm dlx wrangler secret put ADMIN_ALBUM_KEY -c workers/picture-api/wrangler.toml
pnpm dlx wrangler secret put UNLOCK_TOKEN_SECRET -c workers/picture-api/wrangler.toml
```

For local development, copy `.dev.vars.example` to `.dev.vars` and fill the
same keys locally. The real private album key value must stay out of the repo.

## Migrate and run

```powershell
pnpm run worker:d1:migrate:local
pnpm run worker:dev
```

Run Wrangler from the Worker directory, or use the npm scripts above. This lets
Wrangler load `workers/picture-api/.dev.vars` for local development.

Remote deploy flow:

```powershell
pnpm run worker:d1:migrate:remote
pnpm run worker:deploy
```

The frontend defaults to same-origin `/api/picture`, so no
`NEXT_PUBLIC_PICTURE_API_BASE_URL` is required for the Worker deployment. Set
that env var only when running the Next dev server against a separate Worker
URL.

## GitHub Actions

The workflow deploys this Worker directly. Configure these GitHub Actions
secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The Worker secrets below must still be configured in Cloudflare with
`wrangler secret put`; GitHub does not need to know their values.

## API

- `GET /api/picture/albums`
- `POST /api/picture/albums` with `x-admin-key`
- `DELETE /api/picture/albums/:id` with `x-admin-key`
- `GET /api/picture/albums/:id/images`
- `POST /api/picture/albums/:id/images` with `x-admin-key` and multipart `file`
- `POST /api/picture/albums/:id/unlock`
- `GET /api/picture/images/:id/blob`
- `DELETE /api/picture/images/:id` with `x-admin-key`
