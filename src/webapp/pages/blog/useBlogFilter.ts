import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { Option } from "../../components/dropdown/Option";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { OptionsMultiFilterState } from "../../common/state/state";

export type BlogFiltersState = {
    search: {
        term: string;
        onTermChange: (value: string) => void;
    };
    year: OptionsMultiFilterState;
};

export function useBlogFilters({ yearsFilter }: { yearsFilter?: string[] }): BlogFiltersState {
    const history = useHistory();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [yearOptions, setYearOptions] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    useEffect(() => {
        if (yearsFilter) {
            setSelectedYearFilter(yearsFilter);
        }
    }, [yearsFilter]);

    useEffect(() => {
        setYearOptions(generateYears(new Date().getFullYear()).map(year => ({ value: year.id, text: year.id })));
    }, []);

    const onSearchTermChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const onChangeYearFilter = useCallback(
        (value: string[] | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value && value.length > 0) {
                queryParameters.set("years", value?.join(","));
            } else {
                queryParameters.delete("years");
            }

            setSelectedYearFilter(value);
            history.push({ search: queryParameters.toString() });
        },
        [history, location.search]
    );

    return {
        search: {
            term: searchTerm,
            onTermChange: onSearchTermChange,
        },
        year: {
            options: yearOptions,
            selected: selectedYearFilter,
            onSelectedChange: onChangeYearFilter,
        },
    };
}
