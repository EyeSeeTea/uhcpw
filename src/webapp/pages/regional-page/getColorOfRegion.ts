import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_GROUP_IDS, REGION_CODES } from "../../../domain/entities/region/Region";
import { ColorWeight, regionColors } from "../../components/visualization/customization/palettes/countryPalette";

export function getColorOfRegionByRegionId(regionId: Id, weight: ColorWeight = "base"): string {
    switch (regionId) {
        case ORG_UNIT_GROUP_IDS.WESTERN_BALKANS:
            return regionColors.WESTERN_BALKANS[weight];
        case ORG_UNIT_GROUP_IDS.EUROPEAN_UNION:
            return regionColors.EUROPEAN_UNION[weight];
        case ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA:
            return regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA[weight];
        case ORG_UNIT_GROUP_IDS.EUROPEAN_REGION:
            return regionColors.EUROPEAN_REGION[weight];
        case ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES:
            return regionColors.EU_CANDIDATE_COUNTRIES[weight];
        default:
            return regionColors.EUROPEAN_UNION[weight];
    }
}

export function getColorOfRegionByRegionCode(regionCode: string, weight: ColorWeight = "base"): string {
    switch (regionCode) {
        case REGION_CODES.WESTERN_BALKANS:
            return regionColors.WESTERN_BALKANS[weight];
        case REGION_CODES.EUROPEAN_UNION:
            return regionColors.EUROPEAN_UNION[weight];
        case REGION_CODES.EASTERN_EUROPE_AND_CENTRAL_ASIA:
            return regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA[weight];
        case REGION_CODES.EUROPEAN_REGION:
            return regionColors.EUROPEAN_REGION[weight];
        case REGION_CODES.EU_CANDIDATE_COUNTRIES:
            return regionColors.EU_CANDIDATE_COUNTRIES[weight];
        default:
            return regionColors.EUROPEAN_UNION[weight];
    }
}
