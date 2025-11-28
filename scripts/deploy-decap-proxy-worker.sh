# DEPRECATED: Use `pnpm deploy:worker` instead.

#!/usr/bin/env bash
# set -euo pipefail

# Deploy the Decap proxy/auth Worker.
# Prerequisites:
# - wrangler installed
# - CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN exported
# - Set secrets once: GITHUB_TOKEN, REPO_OWNER, REPO_NAME, ALLOWED_BRANCH

# if ! command -v wrangler >/dev/null; then
#   echo "wrangler not found; install with: pnpm dlx wrangler" 1>&2
#   exit 1
# fi

# wrangler deploy cloudflare/decap-proxy-worker.js --name getup-v3-decap-proxy-worker --compatibility-date 2025-11-27

# pnpm dlx wrangler --name getup-v3-decap-proxy-worker secret put GITHUB_TOKEN       # paste PAT when prompted
# pnpm dlx wrangler --name getup-v3-decap-proxy-worker secret put REPO_OWNER         # e.g. GetUp
# pnpm dlx wrangler --name getup-v3-decap-proxy-worker secret put REPO_NAME          # e.g. getup.org.au-v3
# pnpm dlx wrangler --name getup-v3-decap-proxy-worker secret put ALLOWED_BRANCH     # e.g. main