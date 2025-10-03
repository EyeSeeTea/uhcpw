import { MetadataPick } from "../../../../types/d2-api";
import _ from "lodash";
import { Maybe } from "../../../../types/utils";

export class DataElementSubstitutor<TSection extends D2Section> {
    private readonly substitutedIdsByCode: Record<string, Maybe<string>>;
    constructor(sections: TSection[], code_code_substitution: Record<string, string>) {
        const dataElementsByCode = _(sections)
            .flatMap(section => section.dataElements)
            .keyBy(dataElement => dataElement.code)
            .value();
        this.substitutedIdsByCode = _(code_code_substitution)
            .entries()
            .map(([key, dataElementCode]): [string, Maybe<string>] => {
                const dataElement = dataElementsByCode[key];
                const substitutedDataElement = dataElementsByCode[dataElementCode];
                return [key, (substitutedDataElement || dataElement)?.id];
            })
            .fromPairs()
            .value();
    }
    substituteSource<TDataElement extends D2DataElement>(dataElements: TDataElement[]): TDataElement[] {
        return dataElements.map(de => {
            const substitutedId = this.substitutedIdsByCode[de.code];
            return {
                ...de,
                id: substitutedId || de.id,
            };
        });
    }
}

const dataElementsFields = {
    id: true,
    code: true,
} as const;

const sectionsField = { id: true, dataElements: dataElementsFields } as const;

type D2Section = MetadataPick<{
    sections: { fields: typeof sectionsField };
}>["sections"][number];
type D2DataElement = D2Section["dataElements"][number];
