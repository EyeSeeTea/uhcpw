// Retain the CRA proxy's session-cookie bootstrap for non-API DHIS2 endpoints.
/**
 * @param {Readonly<Record<string, string | undefined>>} env
 * @returns {Promise<Record<string, import("vite").ProxyOptions>>}
 */
export async function getDhis2Proxy(env) {
    const target = env.REACT_APP_DHIS2_BASE_URL;
    if (!target) throw new Error("Set REACT_APP_DHIS2_BASE_URL to the DHIS2 URL");
    const url = new URL(target);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid DHIS2 URL protocol");

    const auth = env.REACT_APP_DHIS2_AUTH;
    const cookie = auth
        ? await fetch(`${target.replace(/\/$/, "")}/api/me.json`, {
              headers: { Authorization: `Basic ${Buffer.from(auth).toString("base64")}` },
          })
              .then(response =>
                  response.headers
                      .getSetCookie()
                      .map(value => value.split(";")[0])
                      .join("; ")
              )
              .catch(() => {
                  console.warn("DHIS2 session bootstrap failed; proxy requests can still use Basic Auth");
                  return "";
              })
        : "";

    return {
        "/dhis2": {
            target,
            auth,
            changeOrigin: true,
            rewrite: path => path.replace(/^\/dhis2(?=\/|$)/, ""),
            configure: proxy => {
                proxy.on("proxyReq", request => {
                    if (cookie) request.setHeader("cookie", cookie);
                });
            },
        },
    };
}
