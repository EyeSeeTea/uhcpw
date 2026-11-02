export type GlossaryEntry = Readonly<{ term: string; definition: string }>;
export type GlossaryEntries = ReadonlyArray<GlossaryEntry>;

export type AbbreviationCategory = Readonly<{ code: string; name: string }>;
export type AbbreviationEntry = Readonly<{ abbreviation: string; meaning: string; category: string }>;
export type Abbreviations = Readonly<{
    categories: ReadonlyArray<AbbreviationCategory>;
    entries: ReadonlyArray<AbbreviationEntry>;
}>;
