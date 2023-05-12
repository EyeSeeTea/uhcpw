import { useCallback, useEffect, useState } from "react";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { IndicatorExplorerState } from "./IndicatorExplorerState";

import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { visualizationCustomizations } from "./visualizationCustomizations";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../hooks/countries/useMultiCountryOptionsV2";

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [visualization, setVisualization] = useState<Visualization | undefined>();
    const [analytics, setAnalytics] = useState<Analytics | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onGetChart = useCallback(() => {
        if (selectedCategoryFilter) {
            compositionRoot.indicatorExplorer.getVisualization.execute(selectedCategoryFilter).run(
                visualization => {
                    setVisualization(visualization);

                    const customVisualization = visualizationCustomizations[visualization.id];

                    if (visualization && customVisualization && selectedYearFilter && countryFilter.selected) {
                        compositionRoot.indicatorExplorer.getAnalytics
                            .execute(visualization.id, selectedYearFilter, countryFilter.selected)
                            .run(
                                analytics => {
                                    setAnalytics(analytics);
                                },
                                () => {
                                    setAnalytics(undefined);
                                }
                            );
                    } else {
                        setAnalytics(undefined);
                    }
                },
                () => {
                    setVisualization(undefined);
                }
            );
        } else {
            setVisualization(undefined);
        }
    }, [compositionRoot.indicatorExplorer, selectedCategoryFilter, selectedYearFilter, countryFilter.selected]);

    const onChangeYearFilter = useCallback((value: string[] | undefined) => {
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
        setYearsFilters(generateYears().map(year => ({ value: year.id, text: year.id })));
    }, [compositionRoot.indicatorExplorer]);

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
        visualization,
        analytics,
        onGetChart,
    };
}
