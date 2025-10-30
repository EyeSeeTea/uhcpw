import { useMemo } from "react";

import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";

export function useRegionFilterOptions(): Option<Id>[] {
    const { regions } = useAppContext();

    const regionOptions: Option<Id>[] = useMemo(() => {
        return regions
            .filter(region => region.isInRegionalPage)
            .map(region => ({ value: region.id, text: region.name }));
    }, [regions]);

    return regionOptions;
}
