import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { getServerCompositionRoot } from "@/infra/composition-root.server";
import { runFuture } from "@/infra/future-bridge";
import { normalizeUrl } from "@/lib/url";
import { renderMarkdown } from "@/lib/markdown";
import { buildCache } from "@/lib/build-cache";

export const getGeneralContent = buildCache((): Promise<GeneralContent> =>
    runFuture(getServerCompositionRoot().general.getContent.execute(), "generalContent.get"),
);

const FALLBACK_ABBREVIATIONS_URL = "https://cmyn.short.gy/abbreviations";
const FALLBACK_GLOSSARY_URL = "https://cmyn.short.gy/glossary";

export interface ResolvedUrls {
    readonly abbreviationsUrl: string;
    readonly glossaryUrl: string;
}

export interface RegionalDisclaimer {
    readonly disclaimerHtml: string;
    readonly buttonText: string | undefined;
    readonly buttonUrl: string | undefined;
}

export function resolveGeneralContentUrls(
    generalContent: Pick<GeneralContent, "abbreviations" | "glossary"> | undefined,
): ResolvedUrls {
    return {
        abbreviationsUrl:
            normalizeUrl(generalContent?.abbreviations.url) ?? FALLBACK_ABBREVIATIONS_URL,
        glossaryUrl: normalizeUrl(generalContent?.glossary.url) ?? FALLBACK_GLOSSARY_URL,
    };
}

// Resolves the regional-overview mobile disclaimer popup content. Uses the
// shared `marked`-based renderer (`@/lib/markdown`) so output matches other
// CMS-driven prose in the Astro app. Returns undefined when the entity is
// missing or the disclaimer body is empty so callers can fall back to a plain
// link to /regional-overview.
export function resolveRegionalDisclaimer(
    generalContent: GeneralContent | undefined,
): RegionalDisclaimer | undefined {
    const popup = generalContent?.regionalPageMobilePopUp;
    if (!popup || !popup.disclaimer.trim()) return undefined;

    const trimmedButtonText = popup.buttonText?.trim();
    const normalizedButtonUrl = normalizeUrl(popup.url);

    return {
        disclaimerHtml: renderMarkdown(popup.disclaimer),
        buttonText: trimmedButtonText ? trimmedButtonText : undefined,
        buttonUrl: normalizedButtonUrl,
    };
}
