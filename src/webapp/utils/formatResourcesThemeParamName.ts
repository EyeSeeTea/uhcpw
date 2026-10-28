import { ResourceTheme } from "../../domain/entities/resources/ResourceTheme";

export function formatResourcesThemeParamName(name: string): string {
    const withoutCode = name.replace(/\s*\([^)]*\)\s*$/, "").trim();

    return withoutCode
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

// Compares with the param each theme produces, because the code in parentheses cannot be rebuilt from the param
// (e.g. "Good practice briefs (Brief)" becomes "GoodPracticeBriefs").
export function findThemeFromParam(themes: ReadonlyArray<ResourceTheme>, param: string): ResourceTheme | undefined {
    return themes.find(
        theme => formatResourcesThemeParamName(theme.displayedName).toLowerCase() === param.toLowerCase()
    );
}

export function getParamFromThemes(themes: ReadonlyArray<ResourceTheme>, themeName: string): string | undefined {
    const foundThemeDisplayed = themes.find(
        theme => theme.name.toLowerCase() === themeName.toLowerCase()
    )?.displayedName;
    return foundThemeDisplayed ? formatResourcesThemeParamName(foundThemeDisplayed) : undefined;
}
