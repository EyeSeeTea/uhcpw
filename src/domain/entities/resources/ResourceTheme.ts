export type ResourceTheme = Readonly<{
    id: string;
    code: string;
    name: string;
    displayedName: string;
}>;

export function getResourceThemes(
    themes: ReadonlyArray<ResourceTheme>,
    codes: ReadonlyArray<string>
): ReadonlyArray<ResourceTheme> {
    return codes.flatMap(code => themes.filter(theme => theme.code === code));
}
