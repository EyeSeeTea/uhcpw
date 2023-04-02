import { useCallback, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useMultiCountryOptions } from "../../hooks/countries/useMultiCountryOptions";
import { PolicyExplorerData, PolicyExplorerState } from "./PolicyExplorerState";

export function usePolicyExplorer(): PolicyExplorerState {
    const { countryOptions, selectedCountry, onCountryChange } = useMultiCountryOptions();

    const [categoryFilters] = useState<Option[]>(categoriesFilters);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters] = useState<Option[]>(years);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    const [data, setData] = useState<PolicyExplorerData>(initialData);

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
            selectedCountryFilter: selectedCountry,
            onChangeCountryFilter: onCountryChange,
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

const years = [
    { value: "2023", text: "2023" },
    { value: "2022", text: "2022" },
    { value: "2021", text: "2021" },
    { value: "2020", text: "2020" },
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
