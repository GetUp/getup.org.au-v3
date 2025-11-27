#!/usr/bin/env bash
set -euo pipefail

# Publish the built site to Cloudflare Pages.
# Prerequisites:
# - pnpm installed
# - wrangler installed (`pnpm dlx wrangler` is fine)
# - CLOUDFLARE_ACCOUNT_ID exported
# - CF_PAGES_PROJECT exported (project name)

if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" || -z "${CF_PAGES_PROJECT:-}" ]]; then
  echo "Set CLOUDFLARE_ACCOUNT_ID and CF_PAGES_PROJECT env vars first." 1>&2
  exit 1
fi

pnpm install
pnpm run build

# Publish the .svelte-kit/output adapter build (Pages supports static + functions).
pnpm dlx wrangler pages publish build --project-name "${CF_PAGES_PROJECT}" --account-id "${CLOUDFLARE_ACCOUNT_ID}"
