import { getYouTubeEmbedUrl } from "../YouTubeVideo";

export type ExplainerPage = "resources" | "indicatorExplorer" | "policyExplorer" | "country" | "regional";

export type ExplainerVideo = Readonly<{ type: "file" }> | Readonly<{ type: "url"; url: string }>;

export type Explainer = Readonly<{
    page: ExplainerPage;
    video: ExplainerVideo;
}>;

export function getExplainerEmbedUrl(videoUrl: string): string {
    return getYouTubeEmbedUrl(videoUrl) ?? videoUrl;
}
