import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

type Value = string | string[] | undefined | null;

export function useUpdateSearchParam(unorderedArrays = true) {
    const history = useHistory();
    const location = useLocation();

    const updateParams = useCallback(
        (updates: Record<string, Value>) => {
            const searchParams = new URLSearchParams(location.search);
            const oldSearch = searchParams.toString();
            const updateKeys = Object.keys(updates);

            const basePairs = [...searchParams.entries()].filter(([key]) => !updateKeys.includes(key));

            const newPairs = Object.entries(updates)
                .map<[string, string]>(([key, value]) => [key, serialize(value, unorderedArrays)])
                .filter(([, value]) => value !== "");

            const nextSearch = new URLSearchParams([...basePairs, ...newPairs]).toString();

            if (nextSearch === oldSearch) return;

            history.replace({ ...location, search: nextSearch });
        },
        [history, location, unorderedArrays]
    );

    const updateParam = useCallback((key: string, value: Value) => updateParams({ [key]: value }), [updateParams]);

    return { updateSearchParam: updateParam, updateSearchParams: updateParams };
}

const serialize = (value: Value, unorderedArrays: boolean): string => {
    if (value == null) return "";
    if (Array.isArray(value)) {
        const arr = unorderedArrays ? [...value].sort() : value;
        return arr.join(",");
    }
    return value;
};
