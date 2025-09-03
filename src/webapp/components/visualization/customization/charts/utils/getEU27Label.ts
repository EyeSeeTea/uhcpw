import { ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS, REGION_CODES } from "../../../../../../domain/entities/region/Region";

export function getEU27Label(countryId: string) {
    return [ORG_UNIT_GROUP_IDS.EUROPEAN_UNION, ORG_UNIT_IDS.EUROPEAN_UNION].includes(countryId)
        ? REGION_CODES.EUROPEAN_UNION
        : undefined;
}
