# This is static resource website deployed on **Github Page**

Release version: [masaominn.github.io](https://masaominn.github.io/)

## Development

Use Node.js 24 and pnpm 11.16.0, matching the deployment workflow.

- `pnpm install --frozen-lockfile` installs the recorded dependencies.
- `pnpm typecheck` checks types with TypeScript 7.
- `pnpm build` builds the static site into `out/`.
- `pnpm lint` runs ESLint against `src/`.

## Site metrics backend

The homepage uses a separate Cloudflare Worker and D1 database in
`workers/site-metrics`. D1 stores the total homepage visit count and one like per
project, anonymous browser, and Shanghai calendar day.

For local development:

1. Copy `.env.example` to `.env.local`.
2. Run `pnpm metrics:migrate:local` once to create the local D1 tables.
3. Run `pnpm metrics:dev` alongside `pnpm dev`.

Production builds use the deployed site metrics Worker by default. Set
`NEXT_PUBLIC_SITE_METRICS_API_URL` only when a deployment needs to override that
endpoint.

The September 2026 dependency update uses current stable application packages.
ESLint stays on 9.39.5 because the React, import, and accessibility plugins used
by `eslint-config-next` do not yet declare ESLint 10 support. The newer lint
configuration reports existing source issues; upgrading dependencies does not
resolve those findings.

TypeScript uses the official [side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0):
`@typescript/native` aliases TypeScript 7.0.2 and provides `tsc`, while
`typescript` aliases `@typescript/typescript6` for tools such as typescript-eslint
that require the TypeScript 6 compiler API. Keep both aliases until those tools
support the new API.
