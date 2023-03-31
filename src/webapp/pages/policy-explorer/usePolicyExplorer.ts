import { useCallback, useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { useCountryOptions } from "../../hooks/countries/useCountryOptions";
import { PolicyExplorerData, PolicyExplorerState } from "./PolicyExplorerState";

export function usePolicyExplorer(): PolicyExplorerState {
    const { compositionRoot } = useAppContext();
    const countryOptions = useCountryOptions();
    const [selectedCountryFilter, setSelectedCountryFilter] = useState<string[] | undefined>();

    const [categoryFilters] = useState<Option[]>(categoriesFilters);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    const [data, setData] = useState<PolicyExplorerData>(initialData);

    useEffect(() => {
        compositionRoot.policyExplorer.getYears.execute().run(
            years => {
                setYearsFilters(years.map(year => ({ value: year.id, text: year.id })));
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.policyExplorer]);

    const onChangeCountryFilter = useCallback((values: string[] | undefined) => {
        setSelectedCountryFilter(values);
    }, []);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onChangeYearFilter = useCallback((value: string | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    const onSwitchRowColumn = useCallback(() => {
        if (data.columns.toString() === initialData.columns.toString()) {
            const newRows = data.columns.map((column, index) => {
                const row = data.rows[0];

                const cell = row ? row[index] || "" : "";

                return [column, cell];
            });

            const newData = {
                columns: ["Description", "Value"],
                rows: newRows,
            };

            setData(newData);
        } else {
            setData(initialData);
        }
    }, [data]);

    return {
        filters: {
            countryFilters: countryOptions,
            selectedCountryFilter,
            onChangeCountryFilter,
            categoryFilters,
            selectedCategoryFilter,
            onChangeCategoryFilter,
            yearFilters,
            selectedYearFilter,
            onChangeYearFilter,
        },
        data,
        onSwitchRowColumn,
    };
}

const categoriesFilters = [
    { value: "1", text: "Category 1" },
    { value: "2", text: "Category 2" },
];

const initialData = {
    columns: [
        "Country",
        "Year",
        "Basis for entitlement to publicity financed health services",
        "Share of the population covered (%)",
        "Institution(s) monitoring population coverage",
        "Characteristics of non-covered or 'uninsured' people",
        "Publicly financed health to which non-covered in 'uninsured' people are",
    ],
    rows: [
        [
            "Spain",
            "2022",
            "Entitlement is based on residence. In 2018 residence was re-established as the basis for entitlement to health services covered by the National Health System (NHS) and delivered by providers owned or contracted by the NHS at regional level. Asylum seekers and foreigners legally reunited with relatives in Spain are entitled to the same benefits as residents. Undocumented migrants are also entitled to the same benefits as residents after being in Spain for 90 days or through a report from social services.",
            "",
            "",
            "Undocumented migrants in Spain for less than 90 days.",
            "",
        ],
    ],
};
