import { useMediaQuery, useTheme } from "@material-ui/core";
import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { PolicyExplorerFiltersState } from "../../../pages/policy-explorer/PolicyExplorerState";

type PolicyExplorerFiltersParams = {
    filters: PolicyExplorerFiltersState;
};

type State = {
    onCategoryChange: (value: Record<string, string[]> | undefined) => void;
    onCountryChange: (value: string[] | undefined) => void;
    onYearsChange: (value: string[] | undefined) => void;
    isMobile: boolean;
};

export const usePolicyExplorerFilters = ({ filters }: PolicyExplorerFiltersParams): State => {
    const history = useHistory();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const onCategoryChange = useCallback(
        (value: Record<string, string[]> | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value) {
                queryParameters.set("category", JSON.stringify(value));
            } else if (!value) {
                queryParameters.delete("category");
            }
            filters.category.onSelectedChange(value);
            history.push({ search: queryParameters.toString() });
        },
        [filters.category, history, location.search]
    );

    const onCountryChange = useCallback(
        (value: string[] | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value && value.length > 0) {
                queryParameters.set("country", value?.join(","));
            } else {
                queryParameters.delete("country");
            }

            filters.country.onSelectedChange(value);
            history.push({ search: queryParameters.toString() });
        },
        [filters.country, history, location.search]
    );

    const onYearsChange = useCallback(
        (value: string[] | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value && value.length > 0) {
                queryParameters.set("years", value?.join(","));
            } else {
                queryParameters.delete("years");
            }

            filters.year.onSelectedChange(value);
            history.push({ search: queryParameters.toString() });
        },
        [filters.year, history, location.search]
    );

    return {
        onCategoryChange,
        onCountryChange,
        onYearsChange,
        isMobile,
    };
};
