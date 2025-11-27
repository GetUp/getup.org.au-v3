/**
 * Minimal Decap proxy backend that:
 * - trusts Cloudflare Access for auth (Google + workspace domain restriction handled there)
 * - proxies read/write to a GitHub repo using a PAT
 *
 * Configure Cloudflare Access on the Worker route with a Google identity provider
 * and a workspace domain rule (email ends with your domain). Decap should use the
 * "proxy" backend pointed at this Worker URL.
 */

export default {
  async fetch(request, env) {
    // Require Access assertion (Access policy enforces Google + domain)
    const accessJwt = request.headers.get("Cf-Access-Jwt-Assertion");
    if (!accessJwt) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith("/repo/")) {
      return new Response("Not found", { status: 404 });
    }

    const path = url.pathname.replace(/^\/repo\//, "");
    const method = request.method.toUpperCase();
    const branch = url.searchParams.get("branch") || env.ALLOWED_BRANCH || "main";

    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "decap-proxy-worker",
      Accept: "application/vnd.github.v3+json",
    };

    if (method === "GET") {
      // Read file metadata/content
      const ghUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${branch}`;
      const res = await fetch(ghUrl, { headers: ghHeaders });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": res.headers.get("content-type") || "application/json" } });
    }

    if (method === "PUT") {
      // Write/update file
      const payload = await request.json();
      const { content, message = `Update ${path}`, sha } = payload;
      if (!content) return new Response("Missing content", { status: 400 });
      const ghUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}`;
      const body = JSON.stringify({ message, content, branch, sha });
      const res = await fetch(ghUrl, { method: "PUT", headers: { ...ghHeaders, "Content-Type": "application/json" }, body });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": res.headers.get("content-type") || "application/json" } });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
