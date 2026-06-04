/** Remove duplicate slashes in URL paths (preserves ://) */
export function normalizeUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;
    return url.replace(/([^:])\/\/+/g, "$1/");
}
