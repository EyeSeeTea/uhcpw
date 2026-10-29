import { Future, FutureData } from "../../../domain/entities/Future";
import {
    AbbreviationCategory,
    AbbreviationEntry,
    Abbreviations,
    GlossaryEntry,
} from "../../../domain/entities/ReferenceTerms";
import { ReferenceTermsRepository } from "../../../domain/repositories/ReferenceTermsRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const programs = { glossary: "pC7kN2qV5yG", abbreviations: "pA5gJ8mR3vD" } as const;
const glossaryDataElements = {
    term: "dD9mP2sW6yA",
    definition: "dE3qT5vX8zB",
} as const;
const abbreviationDataElements = {
    abbreviation: "dB4fH8kN1pS",
    meaning: "dC7jL3nR5tV",
    category: "dA6cE2gJ9mQ",
} as const;
const abbreviationCategoryOptionSetId = "pB7mQ3xL8dR";
const optionSetFields = { options: { code: true, displayName: true, sortOrder: true } } as const;
const fields = { event: true, dataValues: { dataElement: true, value: true } } as const;
type OptionSet = MetadataPick<{ optionSets: { fields: typeof optionSetFields } }>["optionSets"][number];
type Event = { event: string; dataValues: Array<{ dataElement: string; value: string }> };

function requiredValue(event: Event, element: string): string | undefined {
    const value = event.dataValues.find(item => item.dataElement === element)?.value;
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class ReferenceTermsD2Repository implements ReferenceTermsRepository {
    constructor(private api: D2Api) {}

    getGlossary(): FutureData<GlossaryEntry[]> {
        return apiToFuture(this.api.events.get({ fields, skipPaging: true, program: programs.glossary })).flatMap(
            response => Future.sequential(response.events.map(mapGlossaryEntry))
        );
    }

    getAbbreviations(): FutureData<Abbreviations> {
        return Future.join2(
            apiToFuture(this.api.events.get({ fields, skipPaging: true, program: programs.abbreviations })),
            apiToFuture(
                this.api.models.optionSets.get({
                    fields: optionSetFields,
                    filter: { id: { eq: abbreviationCategoryOptionSetId } },
                })
            )
        ).flatMap(([response, metadata]) => {
            return mapCategories(metadata.objects[0]).flatMap(categories =>
                mapAbbreviations(response.events, categories).map(entries => ({ categories, entries }))
            );
        });
    }
}

function mapCategories(optionSet: OptionSet | undefined): FutureData<AbbreviationCategory[]> {
    if (!optionSet || !Array.isArray(optionSet.options)) {
        return Future.error("Abbreviation category option set not found or invalid");
    }
    const options = optionSet.options;
    if (
        options.some(
            option => !option.code?.trim() || !option.displayName?.trim() || !Number.isFinite(option.sortOrder)
        )
    ) {
        return Future.error("Invalid abbreviation category option");
    }
    const categories = [...options]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(option => ({ code: option.code, name: option.displayName }));
    if (new Set(categories.map(category => category.code)).size !== categories.length) {
        return Future.error("Duplicate abbreviation category code");
    }
    return Future.success(categories);
}

function mapGlossaryEntry(event: Event): FutureData<GlossaryEntry> {
    const term = requiredValue(event, glossaryDataElements.term);
    const definition = requiredValue(event, glossaryDataElements.definition);
    return term && definition
        ? Future.success({ term, definition })
        : Future.error(`Invalid glossary event ${event.event}`);
}

function mapAbbreviations(events: Event[], categories: AbbreviationCategory[]): FutureData<AbbreviationEntry[]> {
    const codes = new Set(categories.map(category => category.code));
    return Future.sequential(
        events.map(event => {
            const abbreviation = requiredValue(event, abbreviationDataElements.abbreviation);
            const meaning = requiredValue(event, abbreviationDataElements.meaning);
            const category = requiredValue(event, abbreviationDataElements.category);
            return abbreviation && meaning && category && codes.has(category)
                ? Future.success({ abbreviation, meaning, category })
                : Future.error(`Invalid abbreviation event ${event.event}`);
        })
    );
}
