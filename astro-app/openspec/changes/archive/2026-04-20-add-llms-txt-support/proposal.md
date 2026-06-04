## Why

LLM crawlers and agents increasingly read web sites to answer user questions, but HTML pages are heavy with navigation chrome, scripts, and styling that dilute the actual content. The [llms.txt](https://llmstxt.org/) proposal is an emerging convention that lets a site publish a curated, markdown index of its key content at `/llms.txt`, giving LLMs concise, expert-level entry points. Adding it positions the UHC Watch Astro build as AI-discoverable with minimal surface area.

## What Changes

- Publish a static `/llms.txt` file at the site root following the llmstxt.org format (H1 title, blockquote summary, H2 sections with linked resources).
- Expose a markdown "clean" version of each content page at `<path>.md` (e.g., `/about.md`, `/methods.md`, `/index.md`) containing the page's prose content without HTML chrome. These are the targets linked from `llms.txt`.
- Derive `llms.txt` and the per-page markdown from existing sources (the shared markdown files already powering `/about` and `/methods`, plus a short hand-authored summary for `/`) so content stays in sync without a second source of truth.
- Wire the new files into the Astro build so they ship as plain-text assets with correct `Content-Type` and are reachable without client-side JS.

## Capabilities

### New Capabilities
- `llms-txt`: Publishing an `/llms.txt` index file and per-page markdown companions that conform to the llmstxt.org specification, generated at build time from existing page content.

### Modified Capabilities
<!-- None. Existing page rendering specs (about-page-rendering, methods-page-rendering, seo-meta-tags) are not changing their requirements. -->

## Impact

- **Code**: New Astro route(s) or static file emitter under `src/pages/` (e.g., `llms.txt.ts`, `[page].md.ts`). Build output gains `/llms.txt` and `/<page>.md` files.
- **Content sources**: Reuses the markdown already consumed by `about` and `methods` pages; a short summary block for the home page needs to be authored once and stored alongside the page.
- **Dependencies**: No new runtime dependencies expected. May reuse `marked` already in the tree if any HTML-to-markdown conversion is needed for the home page.
- **SEO / robots**: `llms.txt` is a public file at site root — it must be excluded from any Astro redirect or rewrite logic and should not conflict with existing `robots.txt` or sitemap conventions.
- **Rollback**: Pure addition. Deleting the new page files restores prior behavior; no data migrations or breaking changes.
