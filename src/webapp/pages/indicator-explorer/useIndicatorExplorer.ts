import { useCallback, useEffect, useState } from "react";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { IndicatorExplorerState } from "./IndicatorExplorerState";

import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [visualization, setVisualization] = useState<Visualization | undefined>();
    const [analytics, setAnalytics] = useState<Analytics | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [legendSets, setLegendSets] = useState<LegendSet[]>([]);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onGetChart = useCallback(() => {
        if (selectedCategoryFilter) {
            compositionRoot.indicatorExplorer.getVisualization.execute(selectedCategoryFilter).run(
                visualization => {
                    setVisualization(visualization);

                    //const customVisualization = visualizationCustomizations[visualization.id];

                    if (visualization && selectedYearFilter && countryFilter.selected) {
                        compositionRoot.indicatorExplorer.getAnalytics
                            .execute(visualization.id, selectedYearFilter, countryFilter.selected)
                            .run(
                                analytics => {
                                    setAnalytics(analytics);

                                    const legendSetIds = getLegendSetIds(visualization, analytics);

                                    compositionRoot.indicatorExplorer.getLegendSets.execute(legendSetIds).run(
                                        legendSets => {
                                            setLegendSets(legendSets);
                                        },
                                        () => {
                                            setLegendSets([]);
                                        }
                                    );
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
        legendSets,
        onGetChart,
    };
}

function getLegendSetIds(visualization: Visualization, analytics: Analytics) {
    // parse responses to extract dx ids from metaData
    // multiple responses are only for YOY which does not support legends or custom icon
    // safe to use only the 1st
    // dx dimensions might not be present, the empty array covers that case
    const dxIds = analytics.metaData.dimensions.dx || [];

    const legendSetIds = [];

    switch (visualization.legend?.strategy) {
        case "FIXED":
            if (visualization.legend?.set?.id) {
                legendSetIds.push(visualization.legend.set.id);
            }
            break;
        case "BY_DATA_ITEM": {
            dxIds.forEach(dxId => {
                const legendSetId = analytics.metaData.items[dxId]?.legendSet;

                if (legendSetId) {
                    legendSetIds.push(legendSetId);
                }
            });

            break;
        }
    }

    return legendSetIds;
}
