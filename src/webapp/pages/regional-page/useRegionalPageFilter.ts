import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";

export type RegionalPageFilterState = {
    regionOptions: Option<Id>[];
    selectedRegion: Id | undefined;
    onRegionChange: (value: Id) => void;
};

export function useRegionalPageFilter(): RegionalPageFilterState {
    const history = useHistory();
    const { regions } = useAppContext();

    const [selectedRegion, setSelectedRegion] = useState<Id | undefined>(undefined);

    const regionOptions: Option<Id>[] = useMemo(() => {
        return regions.map(region => ({ value: region.id, text: region.name }));
    }, [regions]);

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const region = searchParams.get("region");

        return {
            region: region ? region : undefined,
        };
    }, [history.location.search]);

    const onRegionChange = useCallback(
        (value: Id) => {
            const searchParams = new URLSearchParams(history.location.search);
            searchParams.set("region", value);
            setSelectedRegion(value);
            history.push({ search: searchParams.toString() });
        },
        [history]
    );

    useEffect(() => {
        if (filterInParams.region && filterInParams.region !== selectedRegion) {
            onRegionChange(filterInParams.region);
        }
    }, [filterInParams.region, onRegionChange, selectedRegion]);

    return { regionOptions, selectedRegion, onRegionChange };
}
