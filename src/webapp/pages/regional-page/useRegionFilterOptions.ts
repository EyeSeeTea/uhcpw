import { useMemo } from "react";

import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/region/Region";

const REGIONS_ORDER: Id[] = [
    ORG_UNIT_GROUP_IDS.EUROPEAN_REGION,
    ORG_UNIT_GROUP_IDS.EUROPEAN_UNION,
    ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA,
    ORG_UNIT_GROUP_IDS.WESTERN_BALKANS,
];

export function useRegionFilterOptions(): Option<Id>[] {
    const { regions } = useAppContext();

    const regionOptions: Option<Id>[] = useMemo(() => {
        return regions
            .filter(region => region.isInRegionalPage)
            .sort((a, b) => REGIONS_ORDER.indexOf(a.id) - REGIONS_ORDER.indexOf(b.id))
            .map(region => ({ value: region.id, text: region.name }));
    }, [regions]);

    return regionOptions;
}
