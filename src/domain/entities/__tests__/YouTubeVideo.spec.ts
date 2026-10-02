import { getYouTubeEmbedUrl } from "../YouTubeVideo";

const embedUrl = "https://www.youtube.com/embed/71S7ekOSSzU";

describe("getYouTubeEmbedUrl", () => {
    describe("for YouTube links", () => {
        it.each([
            "https://www.youtube.com/watch?v=71S7ekOSSzU",
            "https://www.youtube.com/watch?v=71S7ekOSSzU&t=4s",
            "https://m.youtube.com/watch?v=71S7ekOSSzU",
            "https://youtu.be/71S7ekOSSzU",
            "https://www.youtube.com/embed/71S7ekOSSzU",
        ])("returns the embed URL for %s", link => {
            expect(getYouTubeEmbedUrl(link)).toBe(embedUrl);
        });
    });

    describe("for other links", () => {
        it.each(["https://example.com/watch?v=71S7ekOSSzU", "https://www.youtube.com/watch", "not a url", ""])(
            "returns undefined for %s",
            link => {
                expect(getYouTubeEmbedUrl(link)).toBeUndefined();
            }
        );
    });
});
