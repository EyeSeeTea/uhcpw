export type ResourceTheme = {
    id: string;
    code: string;
    name: string;
    displayedName: string;
};

export function getThemeName(themes: ResourceTheme[], code: string): string {
    return themes.find(theme => theme.code === code)?.name || "";
}
