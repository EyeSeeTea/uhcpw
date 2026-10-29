export type GlossaryEntry = { term: string; definition: string };

export type AbbreviationCategory = { code: string; name: string };
export type AbbreviationEntry = { abbreviation: string; meaning: string; category: string };
export type Abbreviations = { categories: AbbreviationCategory[]; entries: AbbreviationEntry[] };
