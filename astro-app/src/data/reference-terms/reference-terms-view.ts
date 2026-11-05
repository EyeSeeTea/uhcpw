import type { Abbreviations } from "@shared/domain/entities/ReferenceTerms";

export function glossaryInitial(term: string): string {
    return term
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .charAt(0)
        .toUpperCase();
}

export function referenceId(value: string): string {
    return (
        value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "entry"
    );
}

export function uniqueReferenceIds(values: readonly string[], prefix = "entry"): ReadonlyArray<string> {
    const used = new Set<string>();
    const nextSuffix = new Map<string, number>();

    return values.map(value => {
        const base = `${prefix}-${referenceId(value)}`;
        let suffix = nextSuffix.get(base) ?? 1;
        let id = suffix === 1 ? base : `${base}-${suffix}`;
        while (used.has(id)) {
            suffix += 1;
            id = `${base}-${suffix}`;
        }
        used.add(id);
        nextSuffix.set(base, suffix + 1);
        return id;
    });
}

export function buildAbbreviationGroups({ entries, categories }: Abbreviations) {
    const grouped = categories
        .map(category => ({
            ...category,
            entries: entries
                .filter(entry => entry.category === category.code)
                .sort((a, b) => a.abbreviation.localeCompare(b.abbreviation)),
        }))
        .filter(group => group.entries.length > 0);
    const categoryIds = uniqueReferenceIds(
        grouped.map(group => group.name),
        "category"
    );
    const orderedEntries = grouped.flatMap(group => group.entries);
    const entryIds = uniqueReferenceIds(orderedEntries.map(entry => entry.abbreviation));
    const entriesWithIds = orderedEntries.map((entry, index) => ({ ...entry, id: entryIds[index] }));

    return grouped.map((group, index) => ({
        ...group,
        id: categoryIds[index],
        entries: entriesWithIds.filter(entry => entry.category === group.code),
    }));
}
