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
