import { Maybe } from "../../types/utils";

const youTubeHosts = ["youtube.com", "www.youtube.com", "m.youtube.com"];

export function getYouTubeEmbedUrl(link: string): Maybe<string> {
    const videoId = getYouTubeVideoId(link);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
}

function getYouTubeVideoId(link: string): Maybe<string> {
    const url = parseUrl(link);
    if (!url) return undefined;

    if (url.hostname === "youtu.be") return url.pathname.slice(1) || undefined;
    if (!youTubeHosts.includes(url.hostname)) return undefined;
    if (url.pathname === "/watch") return url.searchParams.get("v") || undefined;
    if (url.pathname.startsWith("/embed/")) return url.pathname.slice("/embed/".length) || undefined;
    return undefined;
}

function parseUrl(link: string): Maybe<URL> {
    try {
        return new URL(link);
    } catch {
        return undefined;
    }
}
