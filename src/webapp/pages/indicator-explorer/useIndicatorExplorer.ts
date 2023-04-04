import { useCallback, useEffect, useState } from "react";
import { Visualization } from "../../../domain/entities/Visualization";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { useMultiCountryOptions } from "../../hooks/countries/useMultiCountryOptions";
import { IndicatorExplorerState } from "./IndicatorExplorerState";

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const { countryOptions, selectedCountry, onCountryChange } = useMultiCountryOptions();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [visualization, setVisualization] = useState<Visualization | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    const onChangeCategoryFilter = useCallback(
        (value: string | undefined) => {
            setSelectedCategoryFilter(value);

            if (value) {
                compositionRoot.indicatorExplorer.getVisualization.execute(value).run(
                    visualization => {
                        setVisualization(visualization);
                    },
                    () => {
                        setVisualization(undefined);
                    }
                );
            } else {
                setVisualization(undefined);
            }
        },
        [compositionRoot.indicatorExplorer]
    );

    const onChangeYearFilter = useCallback((value: string | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getVisualizations.execute().run(
            visualizations => {
                setCategoryFilters(
                    visualizations.map(visualization => ({ value: visualization.id, text: visualization.name }))
                );
            },
            () => {
                setCategoryFilters([]);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getYears.execute().run(
            years => {
                setYearsFilters(years.map(year => ({ value: year.id, text: year.id })));
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

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
        visualization,
    };
}
