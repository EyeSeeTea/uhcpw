export function formatCountryOrRegionParamName(name: string): string {
    if (!name) return "";

    const trimmed = name.trim();

    if (/^Eastern\s+Europe\s*&\s*Central\s+Asia$/i.test(trimmed)) {
        return "EasternEurope&CentralAsia";
    }

    const bihSubregionsMatch = trimmed.match(/^BIH\s*\(the\s+([^)]+)\)$/i);
    if (bihSubregionsMatch && bihSubregionsMatch[1]) {
        const subregion = bihSubregionsMatch[1]
            .trim()
            .replace(/\s+/g, "")
            .replace(/[^a-zA-Z0-9]/g, "");
        return `BIH-${subregion}`;
    }

    const formatted = trimmed.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
    return formatted;
}

export function parseCountryOrRegionParamToName(param: string): string {
    if (!param) return "";

    if (param.includes("&")) {
        return param
            .split("&")
            .map(part => prettifyToken(part))
            .join(" & ");
    }

    const bihSubregionsMatch = param.match(/^BIH-([A-Za-z0-9]+)$/);
    if (bihSubregionsMatch && bihSubregionsMatch[1]) {
        const sub = bihSubregionsMatch[1];
        const subPretty = prettifyToken(sub);
        return `BIH (the ${subPretty})`;
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
