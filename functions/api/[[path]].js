/**
 * Pages Function that proxies /api/* requests to the Decap proxy worker via Service Binding.
 * This allows same-origin requests from the CMS, avoiding CORS issues entirely.
 * The worker is not publicly accessible - only reachable via this binding.
 *
 * Service binding configured in wrangler.toml:
 *   [[pages.services]]
 *   binding = "DECAP_WORKER"
 *   service = "getup-v3-decap-proxy-worker"
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Check that service binding is configured
  if (!env.DECAP_WORKER) {
    return new Response(JSON.stringify({
      error: "Service binding not configured",
      hint: "Add DECAP_WORKER service binding in Pages dashboard"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);

  // Build the target URL - strip /api prefix
  const path = url.pathname.replace(/^\/api/, "") || "/";
  const targetUrl = new URL(path + url.search, "https://worker.internal");

  // Forward the request to the worker via service binding
  const headers = new Headers(request.headers);

  // Forward Access JWT if present (worker validates it)
  const accessJwt = request.headers.get("Cf-Access-Jwt-Assertion");
  if (accessJwt) {
    headers.set("Cf-Access-Jwt-Assertion", accessJwt);
  }

  const proxyRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
  });

  try {
    // Direct service binding call - no public network, no Access interception
    const response = await env.DECAP_WORKER.fetch(proxyRequest);

    // Return the response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Proxy error", message: error.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
