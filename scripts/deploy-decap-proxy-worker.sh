#!/usr/bin/env bash
set -euo pipefail

# Deploy the Decap proxy/auth Worker.
# Prerequisites:
# - wrangler installed
# - CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN exported
# - Set secrets once: GITHUB_TOKEN, REPO_OWNER, REPO_NAME, ALLOWED_BRANCH

if ! command -v wrangler >/dev/null; then
  echo "wrangler not found; install with: pnpm dlx wrangler" 1>&2
  exit 1
fi

wrangler publish cloudflare/decap-proxy-worker.js
