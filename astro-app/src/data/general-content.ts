import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { normalizeUrl } from "@/lib/url";

const FALLBACK_ABBREVIATIONS_URL = "https://cmyn.short.gy/abbreviations";
const FALLBACK_GLOSSARY_URL = "https://cmyn.short.gy/glossary";

export interface ResolvedUrls {
    readonly abbreviationsUrl: string | undefined;
    readonly glossaryUrl: string | undefined;
}

export function resolveGeneralContentUrls(
    generalContent: GeneralContent | undefined
): ResolvedUrls {
    return {
        abbreviationsUrl: normalizeUrl(
            generalContent?.abbreviations.url ?? FALLBACK_ABBREVIATIONS_URL
        ),
        glossaryUrl: normalizeUrl(
            generalContent?.glossary.url ?? FALLBACK_GLOSSARY_URL
        ),
    };
}
