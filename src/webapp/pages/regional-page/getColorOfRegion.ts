import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_GROUP_IDS, REGION_CODES } from "../../../domain/entities/region/Region";
import { regionColors } from "../../components/visualization/customization/palettes/countryPalette";

export function getColorOfRegionByRegionId(regionId: Id): string {
    switch (regionId) {
        case ORG_UNIT_GROUP_IDS.WESTERN_BALKANS:
            return regionColors.WESTERN_BALKANS;
        case ORG_UNIT_GROUP_IDS.EUROPEAN_UNION:
            return regionColors.EUROPEAN_UNION;
        case ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA:
            return regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA;
        case ORG_UNIT_GROUP_IDS.EUROPEAN_REGION:
            return regionColors.EUROPEAN_REGION;
        default:
            return regionColors.EUROPEAN_UNION;
    }
}

export function getColorOfRegionByRegionCode(regionCode: string): string {
    switch (regionCode) {
        case REGION_CODES.WESTERN_BALKANS:
            return regionColors.WESTERN_BALKANS;
        case REGION_CODES.EUROPEAN_UNION:
            return regionColors.EUROPEAN_UNION;
        case REGION_CODES.EASTERN_EUROPE_AND_CENTRAL_ASIA:
            return regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA;
        case REGION_CODES.EUROPEAN_REGION:
            return regionColors.EUROPEAN_REGION;
        default:
            return regionColors.EUROPEAN_UNION;
    }
}
