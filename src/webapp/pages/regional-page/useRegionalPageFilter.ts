import { useCallback, useState } from "react";

import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";
import { useRegionFilterOptions } from "./useRegionFilterOptions";

export type RegionalPageFilterState = {
    regionOptions: Option<Id>[];
    selectedRegion: Id | undefined;
    onRegionChange: (value: Id) => void;
};

export function useRegionalPageFilter(): RegionalPageFilterState {
    const regionOptions = useRegionFilterOptions();

    const [selectedRegion, setSelectedRegion] = useState<Id | undefined>(undefined);

    const onRegionChange = useCallback(
        (value: Id) => {
            setSelectedRegion(value);
        },
        [setSelectedRegion]
    );

    return { regionOptions, selectedRegion, onRegionChange };
}
