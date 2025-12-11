export function formatCountryOrRegionParamName(name: string): string {
    if (!name) return "";

    const trimmed = name.trim();
    const normalized = trimmed.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    if (/^Eastern\s+Europe\s*&\s*Central\s+Asia(?:\s*\([^)]*\))?$/i.test(normalized)) {
        return "EasternEuropeAndCentralAsia";
    }

    const bihSubregionsMatch = normalized.match(/^BIH\s*\(the\s+([^)]+)\)$/i);
    if (bihSubregionsMatch && bihSubregionsMatch[1]) {
        const subregion = bihSubregionsMatch[1]
            .trim()
            .replace(/\s+/g, "")
            .replace(/[^a-zA-Z0-9]/g, "");
        return `BIH-${subregion}`;
    }

    const withoutParentheses = normalized.replace(/\s*\([^)]*\)\s*/g, "");
    return withoutParentheses.replace(/\s+/g, "").replace(/[^a-zA-Z0-9&]/g, "");
}

export function parseCountryOrRegionParamToName(param: string, isRegion?: boolean): string {
    if (!param) return "";

    const bihSubregionsMatch = param.match(/^BIH-([A-Za-z0-9]+)$/);
    if (bihSubregionsMatch && bihSubregionsMatch[1]) {
        const sub = bihSubregionsMatch[1];
        const subPretty = prettifyToken(sub);
        return `BIH (the ${subPretty})`;
    }

    if (isRegion) {
        if (/^EasternEuropeAndCentralAsia$/i.test(param)) {
            return "Eastern Europe & Central Asia";
        }

        return prettifyToken(param);
    }

    return prettifyToken(param);
}

export function normalizeRegionName(name: string): string {
    return name
        .replace(/\s*\([^)]*\)\s*/g, "")
        .replace(/\s+/g, "")
        .replace(/&/g, "and") // Optional: normalize & to "and"
        .toLowerCase();
}

function prettifyToken(token: string): string {
    if (!token) return "";

    return (
        token
            ?.replace(/and/g, " and ")
            .replace(/of/g, " of ")
            .replace(/(?!^)([A-Z])/g, " $1")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w+\b/g, w => w.charAt(0).toUpperCase() + w.slice(1))
            .replace(/\b(And|Of|The)\b/g, w => w.toLowerCase()) || ""
    );
}
