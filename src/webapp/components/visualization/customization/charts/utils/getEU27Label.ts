import { ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS, REGION_CODES } from "../../../../../../domain/entities/region/Region";

export function getEU27Label(countryOrRegionId: string) {
    const validIds: readonly string[] = [ORG_UNIT_GROUP_IDS.EUROPEAN_UNION, ORG_UNIT_IDS.EUROPEAN_UNION];

    return validIds.includes(countryOrRegionId) ? REGION_CODES.EUROPEAN_UNION : undefined;
}
