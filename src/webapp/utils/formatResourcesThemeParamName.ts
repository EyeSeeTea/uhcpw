import { ResourceTheme } from "../../domain/entities/resources/ResourceTheme";

export function formatResourcesThemeParamName(name: string): string {
    const withoutCode = name.replace(/\s*\([^)]*\)\s*$/, "").trim();

    return withoutCode
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

export function parseThemeParamToName(param: string): string {
    const words = param
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .filter(Boolean);

    const formattedName =
        words[0] +
        (words.length > 1
            ? " " +
              words
                  .slice(1)
                  .map(w => w.toLowerCase())
                  .join(" ")
            : "");

    if (words.length <= 1) return formattedName;

    const code = words
        .map(w => w[0])
        .join("")
        .toUpperCase();
    return `${formattedName} (${code})`;
}

export function findThemeFromParam(themes: ResourceTheme[], param: string): ResourceTheme | undefined {
    return themes.find(theme => theme.displayedName.toLowerCase() === parseThemeParamToName(param).toLowerCase());
}

export function getParamFromThemes(themes: ResourceTheme[], themeName: string): string | undefined {
    const foundThemeDisplayed = themes.find(
        theme => theme.name.toLowerCase() === themeName.toLowerCase()
    )?.displayedName;
    return foundThemeDisplayed ? formatResourcesThemeParamName(foundThemeDisplayed) : undefined;
}
