import { Id } from "../../../domain/entities/Ref";
import { regionColors } from "../../components/visualization/customization/palettes/countryPalette";

export function getColorOfRegion(regionId: Id): string {
    switch (regionId) {
        case "A1BdaIwDheX": // WESTERN_BALKANS
            return regionColors.WESTERN_BALKANS;
        case "dqMsarWCWk6": // EUROPEAN_UNION
            return regionColors.EUROPEAN_UNION;
        case "FMCN2ZG9AEj": // EASTERN_EUROPE_AND_CENTRAL_ASIA
            return regionColors.EASTERN_EUROPE_AND_CENTRAL_ASIA;
        case "aN3rzQZhM4i": // EUROPEAN_REGION
            return regionColors.EUROPEAN_REGION;
        default:
            return regionColors.EUROPEAN_UNION;
    }
}
