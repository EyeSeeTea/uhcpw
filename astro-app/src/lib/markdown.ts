import { Marked, marked, type Tokens } from "marked";
import { getYouTubeEmbedUrl } from "@shared/domain/entities/YouTubeVideo";

marked.setOptions({
    async: false,
    gfm: true,
});

const externalLinkMarked = new Marked({ async: false, gfm: true });

externalLinkMarked.use({
    renderer: {
        link({ href, text }: Tokens.Link): string {
            const embedUrl = getYouTubeEmbedUrl(href);
            const embedAttribute = embedUrl ? ` data-youtube-embed="${embedUrl}"` : "";
            return `<a href="${href}" target="_blank" rel="noreferrer"${embedAttribute}>${text}</a>`;
        },
    },
});

type RenderMarkdownOptions = Readonly<{ externalLinks?: boolean }>;

export function renderMarkdown(md: string, options: RenderMarkdownOptions = {}): string {
    const parser = options.externalLinks ? externalLinkMarked : marked;
    return parser.parse(md) as string;
}
