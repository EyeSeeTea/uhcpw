export function formatCountryOrRegionParamName(name: string): string {
    if (!name) return "";

    const trimmed = name.trim();

    if (/^Eastern\s+Europe\s*&\s*Central\s+Asia(?:\s*\([^)]*\))?$/i.test(trimmed)) {
        return "EasternEuropeAndCentralAsiaEECA";
    }

    const bihSubregionsMatch = trimmed.match(/^BIH\s*\(the\s+([^)]+)\)$/i);
    if (bihSubregionsMatch && bihSubregionsMatch[1]) {
        const subregion = bihSubregionsMatch[1]
            .trim()
            .replace(/\s+/g, "")
            .replace(/[^a-zA-Z0-9]/g, "");
        return `BIH-${subregion}`;
    }

    return trimmed.replace(/\s+/g, "").replace(/[^a-zA-Z0-9&]/g, "");
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
        const codeMatch = param.match(/^(.+?)([A-Z]{2,4})$/);
        if (!codeMatch) {
            return prettifyToken(param);
        }

        const [, base, code] = codeMatch;

        if (!base) {
            return prettifyToken(param);
        }

        if (/^EasternEuropeAndCentralAsia$/i.test(base)) {
            return `Eastern Europe & Central Asia (${code})`;
        }

        const name = prettifyToken(base);
        return `${name} (${code})`;
    }

    return prettifyToken(param);
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
