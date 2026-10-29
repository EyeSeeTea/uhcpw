import { getYouTubeEmbedUrl } from "../YouTubeVideo";

export const explainerPages = ["resources", "indicatorExplorer", "policyExplorer", "country", "regional"] as const;

export type ExplainerPage = typeof explainerPages[number];

export type ExplainerVideo = Readonly<{ type: "file" }> | Readonly<{ type: "url"; url: string }>;

export type Explainer = Readonly<{
    page: ExplainerPage;
    video: ExplainerVideo;
}>;

export function getExplainerEmbedUrl(videoUrl: string): string {
    return getYouTubeEmbedUrl(videoUrl) ?? videoUrl;
}
