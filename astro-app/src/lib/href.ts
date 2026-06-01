/**
 * Prefixes an internal path with Astro's configured `base`.
 *
 * Pass paths that start with `/` (e.g. `"/about"`); `"/"` returns the base URL
 * itself with a trailing slash. `import.meta.env.BASE_URL` is normalized to a
 * trailing slash regardless of how `base` was declared in astro.config.
 *
 * Use this for hand-authored links and `public/` asset references in templates.
 * Vite-processed imports (e.g. `import img from "./img.png"`) are auto-prefixed
 * by Astro and do not need this helper.
 */
export const href = (path: string): string => {
    // Absolute URLs (http:, https:, protocol-relative, data:, blob:, mailto:) are
    // passed through unchanged so the helper is safe to apply uniformly.
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path;
    const raw = import.meta.env.BASE_URL || "/";
    const base = raw.endsWith("/") ? raw : raw + "/";
    return base + path.replace(/^\//, "");
};

/**
 * True when the given path (already possibly base-prefixed) matches the current
 * page, tolerating trailing-slash differences. Use with `Astro.url.pathname`.
 */
export const isActivePath = (currentPathname: string, targetPath: string): boolean => {
    const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
    return normalize(currentPathname) === normalize(targetPath);
};
