import { EU27 } from "../../../../../../domain/entities/Country";

const EU27_LABEL = "EU27";

export function getEU27Label(countryId: string) {
    return EU27 === countryId ? EU27_LABEL : undefined;
}
