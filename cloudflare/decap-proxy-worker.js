/**
 * Minimal Decap proxy backend that:
 * - validates Cloudflare Access JWT for auth (Google + workspace domain restriction handled there)
 * - proxies read/write to a GitHub repo using a PAT
 *
 * Required env vars:
 * - GITHUB_TOKEN, REPO_OWNER, REPO_NAME (for GitHub API)
 * - CF_ACCESS_TEAM_NAME (your Zero Trust org name, e.g., "getup")
 * - CF_ACCESS_AUD (Application Audience tag from Access app settings)
 */

// Cloudflare Access JWT validation
async function validateAccessJwt(jwt, env) {
  const teamName = env.CF_ACCESS_TEAM_NAME || "getup";
  const expectedAud = env.CF_ACCESS_AUD || "ce38525cd2b19766460ff7548bee32958321c7575f820401a35b41d93708b3d1";
  const CERTS_URL = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`;

  try {
    // Fetch Cloudflare's public keys
    const certsResponse = await fetch(CERTS_URL);
    if (!certsResponse.ok) {
      console.error("Failed to fetch Access certs:", certsResponse.status);
      return null;
    }
    const { keys } = await certsResponse.json();

    // Decode JWT header to get key ID
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));

    // Find matching key
    const key = keys.find(k => k.kid === header.kid);
    if (!key) {
      console.error("No matching key found for kid:", header.kid);
      return null;
    }

    // Import the public key
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      key,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Verify signature
    const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, signature, signedData);
    if (!valid) {
      console.error("JWT signature verification failed");
      return null;
    }

    // Decode and validate payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error("JWT expired");
      return null;
    }

    // Check not-before
    if (payload.nbf && payload.nbf > now) {
      console.error("JWT not yet valid");
      return null;
    }

    // Check audience
    const audList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audList.includes(expectedAud)) {
      console.error("JWT audience mismatch. Expected:", expectedAud, "Got:", payload.aud);
      return null;
    }

    return {
      email: payload.email,
      sub: payload.sub,
      identityNonce: payload.identity_nonce,
    };
  } catch (e) {
    console.error("JWT validation error:", e.message);
    return null;
  }
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cf-Access-Jwt-Assertion",
    };

    // Handle preflight requests (bypass auth for CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Require and validate Cloudflare Access JWT
    const accessJwt = request.headers.get("Cf-Access-Jwt-Assertion");
    if (!accessJwt) {
      return new Response(JSON.stringify({ error: "Unauthorized - Cloudflare Access required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const identity = await validateAccessJwt(accessJwt, env);
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized - Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Log authenticated user for audit trail
    console.log(`Authenticated request from: ${identity.email}, Method: ${request.method}, Path: ${new URL(request.url).pathname}`);

    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const branch = url.searchParams.get("branch") || env.ALLOWED_BRANCH || "main";

    // Handle POST requests for Decap CMS actions (at root path or /api path)
    if (method === "POST" && (url.pathname === "/" || url.pathname === "/api" || !url.pathname.startsWith("/repo/"))) {
      const payload = await request.json();
      const { action, params = {} } = payload;
      const actionBranch = params.branch || branch;

      // Route based on action type
      let ghUrl;

      if (action === "unpublishedEntries") {
        ghUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/pulls?state=open`;
      } else if (action === "unpublishedEntry") {
        if (params.id) {
          // Fetch unpublished entry (PR)
          ghUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/pulls/${params.id}`;
        } else if (params.collection && params.slug) {
          // No PR ID - fetch the published entry directly
          const ghHeaders = {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            "User-Agent": "decap-proxy-worker",
            Accept: "application/vnd.github.v3+json",
          };

          // Map "files" collections (slug -> specific file path)
          const fileCollections = {
            home: {
              header: "content/home/header.json",
              hero: "content/home/hero.json",
              "take-action": "content/home/take-action.json",
              impact: "content/home/impact.json",
              members: "content/home/members.json",
              values: "content/home/values.json",
              footer: "content/home/footer.json",
            },
            about: {
              header: "content/about/header.json",
              who: "content/about/who.json",
              what: "content/about/what.json",
              how: "content/about/how.json",
              donations: "content/about/donations.json",
              transparency: "content/about/transparency.json",
              board: "content/about/board.json",
              faqs: "content/about/faqs.json",
              "work-at-getup": "content/about/work-at-getup.json",
            },
            donate: {
              donate: "content/donate/donate.json",
              crew: "content/donate/crew.json",
              willpower: "content/donate/willpower.json",
            },
            pillars: { pillars: "content/pillars.json" },
            other_pages: {
              "donations-policy": "content/donations-policy.yaml",
              "contact-us": "content/contact-us.json",
              unsubscribe: "content/unsubscribe.json",
              reports: "content/reports.json",
              "privacy-policy": "content/privacy-policy.yaml",
            },
            shared: { "footer-cta": "content/footer-cta.json" },
            site_pages: { pages: "content/site-pages.json" },
            settings: {
              home_page: "content/settings/hero.json",
              campaigns: "content/settings/campaigns.json",
            },
          };

          // Map "folder" collections (slug -> folder/slug.ext)
          const folderCollections = {
            campaigns: { folder: "content/_campaigns", ext: "json" },
            pillars: { folder: "content/_pillars", ext: "json" },
          };

          let filePath;
          if (fileCollections[params.collection]?.[params.slug]) {
            // Files collection - use exact path
            filePath = fileCollections[params.collection][params.slug];
          } else if (folderCollections[params.collection]) {
            // Folder collection - construct path with correct extension
            const { folder, ext } = folderCollections[params.collection];
            filePath = `${folder}/${params.slug}.${ext}`;
          } else {
            // Default fallback
            filePath = `content/_${params.collection}/${params.slug}.json`;
          }

          console.log(`unpublishedEntry: collection=${params.collection}, slug=${params.slug}, path=${filePath}`);

          const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${filePath}?ref=${actionBranch}`;
          const fileRes = await fetch(fileUrl, { headers: ghHeaders });

          if (!fileRes.ok) {
            return new Response(JSON.stringify(null), {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
              }
            });
          }

          const fileData = await fileRes.json();

          return new Response(JSON.stringify({
            file: {
              path: filePath,
              ...fileData
            },
            data: fileData.content ? atob(fileData.content) : "",
            slug: params.slug,
            collection: params.collection,
            isUnpublished: false,
            diffs: [] // Empty diffs array to prevent CMS errors
          }), {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }
      } else if (action === "getEntry") {
        // Fetch published entry by path OR by collection and slug
        const ghHeaders = {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "decap-proxy-worker",
          Accept: "application/vnd.github.v3+json",
        };

        let filePath;

        if (params.path) {
          // Path provided directly
          filePath = params.path;
        } else if (params.collection && params.slug) {
          // Map "files" collections (slug -> specific file path)
          const fileCollections = {
            home: {
              header: "content/home/header.json",
              hero: "content/home/hero.json",
              "take-action": "content/home/take-action.json",
              impact: "content/home/impact.json",
              members: "content/home/members.json",
              values: "content/home/values.json",
              footer: "content/home/footer.json",
            },
            about: {
              header: "content/about/header.json",
              who: "content/about/who.json",
              what: "content/about/what.json",
              how: "content/about/how.json",
              donations: "content/about/donations.json",
              transparency: "content/about/transparency.json",
              board: "content/about/board.json",
              faqs: "content/about/faqs.json",
              "work-at-getup": "content/about/work-at-getup.json",
            },
            donate: {
              donate: "content/donate/donate.json",
              crew: "content/donate/crew.json",
              willpower: "content/donate/willpower.json",
            },
            pillars: { pillars: "content/pillars.json" },
            other_pages: {
              "donations-policy": "content/donations-policy.yaml",
              "contact-us": "content/contact-us.json",
              unsubscribe: "content/unsubscribe.json",
              reports: "content/reports.json",
              "privacy-policy": "content/privacy-policy.yaml",
            },
            shared: { "footer-cta": "content/footer-cta.json" },
            site_pages: { pages: "content/site-pages.json" },
            settings: {
              home_page: "content/settings/hero.json",
              campaigns: "content/settings/campaigns.json",
            },
          };

          // Map "folder" collections (slug -> folder/slug.ext)
          const folderCollections = {
            campaigns: { folder: "content/_campaigns", ext: "json" },
            pillars: { folder: "content/_pillars", ext: "json" },
          };

          if (fileCollections[params.collection]?.[params.slug]) {
            filePath = fileCollections[params.collection][params.slug];
          } else if (folderCollections[params.collection]) {
            const { folder, ext } = folderCollections[params.collection];
            filePath = `${folder}/${params.slug}.${ext}`;
          } else {
            filePath = `content/_${params.collection}/${params.slug}.json`;
          }
        } else {
          return new Response(JSON.stringify({ error: "Missing path or collection/slug" }), {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }

        const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${filePath}?ref=${actionBranch}`;
        const fileRes = await fetch(fileUrl, { headers: ghHeaders });

        if (!fileRes.ok) {
          return new Response(JSON.stringify({ error: "File not found", path: filePath }), {
            status: fileRes.status,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }

        const fileData = await fileRes.json();

        return new Response(JSON.stringify({
          file: {
            path: filePath,
            ...fileData
          },
          data: fileData.content ? atob(fileData.content) : ""
        }), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } else if (action === "getMedia") {
        try {
          const mediaFolder = params.mediaFolder || "static/images";

          const ghHeaders = {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            "User-Agent": "decap-proxy-worker",
            Accept: "application/vnd.github.v3+json",
          };

          // Get directory listing
          const listUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${mediaFolder}?ref=${actionBranch}`;
          const listRes = await fetch(listUrl, { headers: ghHeaders });
          const files = await listRes.json();

          // Fetch full metadata for each file (including encoding)
          const mediaFiles = await Promise.all(
            files
              .filter(file => file.type === "file") // Only include files, not directories
              .map(async (file) => {
                try {
                  const fileRes = await fetch(file.url, { headers: ghHeaders });
                  const fileData = await fileRes.json();

                  // If content is missing or encoding is "none", fetch raw content
                  if (!fileData.content || fileData.encoding === "none") {
                    if (fileData.download_url) {
                      try {
                        const rawRes = await fetch(fileData.download_url);
                        const rawBuffer = await rawRes.arrayBuffer();

                        // Convert to base64
                        const bytes = new Uint8Array(rawBuffer);
                        let binary = '';
                        for (let i = 0; i < bytes.length; i++) {
                          binary += String.fromCharCode(bytes[i]);
                        }
                        const base64Content = btoa(binary);

                        return {
                          ...fileData,
                          encoding: "base64",
                          content: base64Content,
                          id: fileData.sha
                        };
                      } catch (err) {
                        return null;
                      }
                    }
                    return null;
                  }

                  return {
                    ...fileData,
                    id: fileData.sha
                  };
                } catch (err) {
                  return null;
                }
              })
          );

          // Filter out nulls from skipped files
          const validFiles = mediaFiles.filter(f => f !== null);

          return new Response(JSON.stringify(validFiles), {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        } catch (err) {
          console.error("Error in getMedia:", err);
          return new Response(JSON.stringify({ error: "Failed to get media", message: err.message }), {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }
      } else if (action === "entriesByFolder") {
        // List files in a folder and fetch their contents
        const folder = params.folder || "";
        const extension = params.extension || "";

        const ghHeaders = {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "decap-proxy-worker",
          Accept: "application/vnd.github.v3+json",
        };

        // Get directory listing
        const listUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${folder}?ref=${actionBranch}`;
        const listRes = await fetch(listUrl, { headers: ghHeaders });
        const files = await listRes.json();

        // Filter by extension if specified
        const filteredFiles = extension
          ? files.filter(f => f.name.endsWith(`.${extension}`))
          : files;

        // Fetch content for each file
        const entries = await Promise.all(
          filteredFiles.map(async (file) => {
            const contentRes = await fetch(file.url, { headers: ghHeaders });
            const fileData = await contentRes.json();
            return {
              file: {
                path: file.path,
                name: file.name,
                ...fileData
              },
              data: fileData.content ? atob(fileData.content) : ""
            };
          })
        );

        return new Response(JSON.stringify(entries), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } else if (action === "entriesByFiles") {
        // Get specific files by path
        const files = params.files || [];
        console.log(`entriesByFiles: fetching ${files.length} files`, JSON.stringify(files));

        const ghHeaders = {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "decap-proxy-worker",
          Accept: "application/vnd.github.v3+json",
        };

        const entries = await Promise.all(
          files.map(async (file) => {
            try {
              const fileUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${file.path}?ref=${actionBranch}`;
              const fileRes = await fetch(fileUrl, { headers: ghHeaders });

              if (!fileRes.ok) {
                console.error(`Failed to fetch ${file.path}: ${fileRes.status}`);
                return null;
              }

              const fileData = await fileRes.json();
              return {
                file: {
                  path: file.path,
                  label: file.label,
                  ...fileData
                },
                data: fileData.content ? atob(fileData.content) : ""
              };
            } catch (err) {
              console.error(`Error fetching ${file.path}:`, err);
              return null;
            }
          })
        );

        // Filter out failed fetches
        const validEntries = entries.filter(e => e !== null);
        console.log(`entriesByFiles: returning ${validEntries.length} entries`);

        return new Response(JSON.stringify(validEntries), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } else {
        // For unknown actions, log and return empty array
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }

      const ghHeaders = {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "User-Agent": "decap-proxy-worker",
        Accept: "application/vnd.github.v3+json",
      };

      const res = await fetch(ghUrl, { headers: ghHeaders });
      const data = await res.json();

      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // Handle file operations under /repo/
    if (!url.pathname.startsWith("/repo/")) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const path = url.pathname.replace(/^\/repo\//, "");

    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "decap-proxy-worker",
      Accept: "application/vnd.github.v3+json",
    };

    if (method === "GET") {
      // Read file metadata/content
      const ghUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}?ref=${branch}`;
      const res = await fetch(ghUrl, { headers: ghHeaders });

      if (!res.ok) {
        return new Response(await res.text(), {
          status: res.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }

      // Parse and re-serialize to ensure proper JSON formatting
      const data = await res.json();

      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    if (method === "PUT") {
      // Write/update file
      const payload = await request.json();
      const { content, message = `Update ${path}`, sha } = payload;
      if (!content) return new Response("Missing content", { status: 400, headers: corsHeaders });
      const ghUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${path}`;
      const body = JSON.stringify({ message, content, branch, sha });
      const res = await fetch(ghUrl, { method: "PUT", headers: { ...ghHeaders, "Content-Type": "application/json" }, body });

      const data = await res.json();

      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    console.log(`Unhandled request: ${method} ${url.pathname}`);
    return new Response(JSON.stringify({
      error: "Method not allowed",
      method,
      path: url.pathname
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  },
};
