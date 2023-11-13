import { useCallback, useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { IndicatorExplorerState } from "./IndicatorExplorerState";

import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { LatestCOVID19 } from "../../../domain/entities/Year";

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();
    const { selected: selectedCountries } = countryFilter;

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [showVisualization, setShowVisualization] = useState(false);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
        setShowVisualization(false);
    }, []);

    const onChangeYearFilter = useCallback((value: string[] | undefined) => {
        setSelectedYearFilter(value);
        setShowVisualization(false);
    }, []);

    useEffect(() => {
        setShowVisualization(false);
    }, [selectedCountries]);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getVisualizations.execute().run(
            visualizations => {
                setCategoryFilters(
                    visualizations.map(visualization => ({ value: visualization.id, text: visualization.categoryName }))
                );
            },
            () => {
                setCategoryFilters([]);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    useEffect(() => {
        const categoryFilter = categoryFilters.find(cat => cat.value === selectedCategoryFilter)?.text;

        if (categoryFilter?.startsWith("Comparative")) {
            setYearsFilters([
                { value: LatestCOVID19.id, text: i18n.t("2019 or latest available year before COVID-19") },
            ]);
            setSelectedYearFilter([LatestCOVID19.id]);
        } else {
            setYearsFilters(generateYears().map(year => ({ value: year.id, text: year.id })));
        }
    }, [categoryFilters, selectedCategoryFilter]);

    const onGet = useCallback(() => {
        setShowVisualization(true);
    }, []);

    return {
        filters: {
            country: countryFilter,
            category: {
                options: categoryFilters,
                selected: selectedCategoryFilter,
                onSelectedChange: onChangeCategoryFilter,
            },
            year: {
                options: yearFilters,
                selected: selectedYearFilter,
                onSelectedChange: onChangeYearFilter,
            },
        },
        onGet,
        showVisualization,
    };
}
