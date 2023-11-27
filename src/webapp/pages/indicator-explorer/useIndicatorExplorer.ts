import { useCallback, useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { GlobalMessage, IndicatorExplorerState } from "./IndicatorExplorerState";

import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { LatestCOVID19 } from "../../../domain/entities/Year";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();
    const {
        selected: selectedCountries,
        onSelectedChange: onSelectedCountryChange,
        options: countryOptions,
    } = countryFilter;

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [visualizations, setVisualizations] = useState<Visualization[]>([]);

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>();

    const [showVisualization, setShowVisualization] = useState(false);

    const onChangeCategoryFilter = useCallback(
        (value: string | undefined) => {
            const oldVisualization = visualizations.find(visualization => visualization.id === selectedCategoryFilter);
            const newsVisualization = visualizations.find(visualization => visualization.id === value);

            if (oldVisualization?.isComparative && !newsVisualization?.isComparative) {
                onSelectedCountryChange([]);
            } else if (newsVisualization?.isComparative) {
                onSelectedCountryChange(countryOptions.map(op => op.id));
            }

            setSelectedCategoryFilter(value);
            setShowVisualization(false);
        },
        [countryOptions, onSelectedCountryChange, selectedCategoryFilter, visualizations]
    );

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
                    visualizations.map(visualization => ({
                        value: visualization.id,
                        text: `${visualization.categoryName}: ${visualization.friendlyName}`,
                    }))
                );

                setVisualizations(visualizations);
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
        const visualization = visualizations.find(visualization => visualization.id === selectedCategoryFilter);

        if (visualization?.minCountryFilter && (selectedCountries?.length || 0) < visualization.minCountryFilter) {
            setGlobalMessage({
                text: i18n.t(`This category:indicator need select almost {{count}} countries`, {
                    count: visualization?.minCountryFilter,
                }),
                type: "info",
            });
        } else if (
            visualization?.maxCountryFilter &&
            (selectedCountries?.length || 0) > visualization.maxCountryFilter
        ) {
            setGlobalMessage({
                text: i18n.t(`This category:indicator need select only {{count}} country`, {
                    count: visualization?.minCountryFilter,
                }),
                type: "info",
            });
        } else {
            setShowVisualization(true);
        }
    }, [selectedCountries, selectedCategoryFilter, visualizations]);

    const onCountriesChange = useCallback(
        (countries: string[] | undefined) => {
            const visualization = visualizations.find(visualization => visualization.id === selectedCategoryFilter);

            if (visualization?.maxCountryFilter && (countries?.length || 0) > visualization.maxCountryFilter) {
                return;
            }

            onSelectedCountryChange(countries);
        },
        [onSelectedCountryChange, selectedCategoryFilter, visualizations]
    );

    return {
        filters: {
            country: { ...countryFilter, onSelectedChange: onCountriesChange, options: countryOptions },
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
        globalMessage,
    };
}
