# GetUp.org.au v3

This repository is the modern rebuild of the GetUp.org.au site, replacing the legacy Next.js implementation living at `GetUp/getup.org.au-v2`. The new stack moves us to SvelteKit, simplifies the asset pipeline, and pairs the public site with an authenticated Decap CMS workflow backed by GitHub.

Deeper integration with Campaigns By Me and a unified GetUp/CbM is featured.

## What changed from v2
- Framework swap: Next.js 12 → SvelteKit (Vite-powered) with Tailwind utility classes.
- Content editing: Decap CMS with a Cloudflare Worker proxy for authenticated GitHub reads/writes instead of Netlify/git-gateway.
- Hosting: static build deployed to Cloudflare Pages; Worker handles CMS auth/proxy behind Cloudflare Access.
- Content shape: JSON content under `content/` feeds the components in `src/lib` and pages in `src/routes`.

## Development
```bash
pnpm install
pnpm dev           # runs Decap CMS local server + Vite dev server
pnpm build         # production build
pnpm preview       # serve the production build locally
```

Key entry points:
- `src/routes/+page.svelte` – home page composition.
- `src/lib/components/` – UI building blocks (hero, campaign cards, etc.).
- `public/edit/config.yml` – Decap CMS config that points editors at content files.

## Deployment
- **Site:** run `scripts/pages-publish.sh` to build and publish to Cloudflare Pages (requires `CLOUDFLARE_ACCOUNT_ID` and `CF_PAGES_PROJECT`).
- **Decap proxy:** run `scripts/deploy-decap-proxy-worker.sh` to publish `cloudflare/decap-proxy-worker.js` via Wrangler. Configure Cloudflare Access on the worker route and set secrets for `GITHUB_TOKEN`, `REPO_OWNER`, `REPO_NAME`, and `ALLOWED_BRANCH`.

## Repository
Target GitHub location: `GetUp/getup.org.au-v3`. Initialize the repo here and push to that remote to make this the canonical v3 codebase.
