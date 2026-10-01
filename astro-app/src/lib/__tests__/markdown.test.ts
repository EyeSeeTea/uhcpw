import { describe, it, expect } from "vitest";
import { renderMarkdown } from "../markdown";

describe("renderMarkdown", () => {
    it("renders paragraphs", () => {
        const html = renderMarkdown("Hello world");
        expect(html).toContain("<p>Hello world</p>");
    });

    it("renders unordered lists", () => {
        const html = renderMarkdown("- item one\n- item two");
        expect(html).toContain("<ul>");
        expect(html).toContain("<li>item one</li>");
        expect(html).toContain("<li>item two</li>");
    });

    it("renders links", () => {
        const html = renderMarkdown("[example](https://example.com)");
        expect(html).toContain('<a href="https://example.com">example</a>');
    });

    it("renders links opening in a new tab when externalLinks is enabled", () => {
        const html = renderMarkdown("[example](https://example.com)", { externalLinks: true });
        expect(html).toContain('<a href="https://example.com" target="_blank" rel="noreferrer">example</a>');
    });

    it("adds the embed URL to YouTube links when externalLinks is enabled", () => {
        const html = renderMarkdown("[video](https://www.youtube.com/watch?v=YEApPgSC3X8)", { externalLinks: true });
        expect(html).toContain(
            '<a href="https://www.youtube.com/watch?v=YEApPgSC3X8" target="_blank" rel="noreferrer" data-youtube-embed="https://www.youtube.com/embed/YEApPgSC3X8">video</a>'
        );
    });

    it("renders bold and italic", () => {
        const html = renderMarkdown("**bold** and *italic*");
        expect(html).toContain("<strong>bold</strong>");
        expect(html).toContain("<em>italic</em>");
    });

    it("handles empty string", () => {
        const html = renderMarkdown("");
        expect(html).toBe("");
    });
});
