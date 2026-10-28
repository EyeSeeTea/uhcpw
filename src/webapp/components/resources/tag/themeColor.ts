// Keyed by the theme option code in lowercase, so a theme gets the same chip color in every resource category.
const themeColorByCode: Readonly<Record<string, string>> = {
    "financial protection": "#0360a7",
    "health financing policy papers": "rgb(0, 138, 215, 0.5)",
    "spending on health": "#002060",
    resilience: "#4fad56",
    "voluntary health insurance": "#ff8d4e",
    "health and economy": "#c42929",
    "good practice briefs": "#2a5d2e",
};

const defaultThemeColor = "#0360a7";

export function getThemeColor(themeCode: string): string {
    return themeColorByCode[themeCode.toLowerCase()] ?? defaultThemeColor;
}
