import { EU27 } from "../../../../../../domain/entities/Country";

export const EU27_LABEL = "EU";

export function getEU27Label(countryId: string) {
    return EU27 === countryId ? EU27_LABEL : undefined;
}
