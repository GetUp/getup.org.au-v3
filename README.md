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
- `static/config.yml` – Decap CMS config that points editors at content files.

## Architecture: Decap CMS Authentication

The CMS uses a secure architecture with Cloudflare Access and a private Worker:

```
Browser → getup-static-v3.gu.tools/edit → Cloudflare Access (Google login)
                                                    ↓
Browser → getup-static-v3.gu.tools/api/* → Pages Function → [Service Binding] → Worker → GitHub API
                                           (same origin)     (internal only)
```

### Components

1. **Cloudflare Access Application: `GetUp-V3`**
   - Protects `/api` and `/edit` paths on `getup-static-v3.gu.tools`
   - Uses Google Workspace identity provider (restricted to org domain)
   - Issues JWT tokens validated by the worker

2. **Pages Function** (`functions/api/[[path]].js`)
   - Proxies `/api/*` requests to the worker via service binding
   - Forwards the `Cf-Access-Jwt-Assertion` header for authentication
   - Eliminates CORS issues by keeping requests same-origin

3. **Decap Proxy Worker** (`cloudflare/decap-proxy-worker.js`)
   - Not publicly accessible (no workers.dev URL, no custom domain)
   - Only reachable via the Pages Function service binding
   - Validates Cloudflare Access JWTs (signature, expiry, audience)
   - Proxies authenticated requests to GitHub API using a PAT

### Service Binding Configuration

Configured in `wrangler.toml` under `[pages]`:
```toml
[[pages.services]]
binding = "DECAP_WORKER"
service = "getup-v3-decap-proxy-worker"
```
This connects the Pages Function to the private worker without needing a public URL.

### Worker Environment Variables

Set in `wrangler.toml` or Cloudflare dashboard:
- `GITHUB_TOKEN` – GitHub PAT with repo access (set as secret)
- `REPO_OWNER` – GitHub org/user (e.g., `GetUp`)
- `REPO_NAME` – Repository name (e.g., `getup.org.au-v3`)
- `ALLOWED_BRANCH` – Branch for content operations (default: `main`)
- `CF_ACCESS_TEAM_NAME` – Zero Trust org name (e.g., `getup`)
- `CF_ACCESS_AUD` – Access Application audience tag

## Deployment

All deploy commands read configuration from `wrangler.toml`.

```bash
pnpm deploy:worker   # Deploy the Decap proxy worker
pnpm deploy:pages    # Build and deploy to Cloudflare Pages
pnpm deploy          # Deploy both (worker first, then pages)
```

First-time setup only: `wrangler secret put GITHUB_TOKEN` (GitHub PAT with repo access)

## Repository
Target GitHub location: `GetUp/getup.org.au-v3`. Initialize the repo here and push to that remote to make this the canonical v3 codebase.
