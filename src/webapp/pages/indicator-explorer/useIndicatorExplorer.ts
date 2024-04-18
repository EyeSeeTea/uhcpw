import { useCallback, useEffect, useState } from "react";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { GlobalMessage, IndicatorExplorerState, IndicatorOption } from "./IndicatorExplorerState";

import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { LatestCOVID19 } from "../../../domain/entities/Year";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { IndicatorExplorerSelectCategoryInfo } from "../../../domain/entities/indicator-explorer/IndicatorExplorer";
import { EU27 } from "../../../domain/entities/Country";
import { sortedCategoryNames, sortedCharts } from "../../../data/repositories/indicator-explorer/seed/utils";
import { CountryOption } from "../../components/country-selector/CountrySelector";

export const allYearsItem = { value: "all", text: i18n.t("All years") };
export const yearsItems = generateYears().map(year => ({ value: year.id, text: year.id }));
const allYearsFilters = [allYearsItem, ...yearsItems];

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot } = useAppContext();
    const {
        selected: selectedCountries,
        onSelectedChange: onSelectedCountryChange,
        options: countryOptions,
    } = useMultiCountryOptionsV2({ showEurRegion: true });

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [indicatorFilters, setIndicatorFilters] = useState<IndicatorOption[]>([]);
    const [selectedIndicatorFilter, setSelectedIndicatorFilter] = useState<string | undefined>();
    const [selectCategoryInfo, setSelectCategoryInfo] = useState<IndicatorExplorerSelectCategoryInfo | undefined>(
        undefined
    );

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [visualizations, setVisualizations] = useState<Visualization[]>([]);

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>();

    const [showVisualization, setShowVisualization] = useState(false);

    const [disabledCountries, setDisabledCountries] = useState<string[]>([]);
    const [maxCountrySelection, setMaxCountrySelection] = useState<number | undefined>(undefined);

    const onChangeCategoryFilter = useCallback(
        (value: string | undefined) => {
            const oldVisualization = visualizations.find(visualization => visualization.id === selectedIndicatorFilter);
            const newsVisualization = visualizations.find(visualization => visualization.id === value);
            const isEu27Selected = !!selectedCountries?.find(selectedCountry => selectedCountry === EU27);

            const maybeUpdatedCountrySelection = getUpdatedCountriesSelectionFilter(
                oldVisualization,
                newsVisualization,
                isEu27Selected,
                countryOptions
            );

            if (maybeUpdatedCountrySelection) {
                onSelectedCountryChange(maybeUpdatedCountrySelection);
            }

            const selectedCountriesInFilter = maybeUpdatedCountrySelection ?? selectedCountries;
            const disabledCountries = getDisabledCountriesFilter(
                newsVisualization,
                selectedCountriesInFilter,
                countryOptions
            );
            setDisabledCountries(disabledCountries);

            if (!newsVisualization?.isComparative) {
                setSelectedYearFilter([allYearsItem.value]);
            } else if (newsVisualization?.isComparative) {
                setSelectedYearFilter([LatestCOVID19.id]);
            }

            setMaxCountrySelection(newsVisualization?.maxCountryFilter);
            setSelectedIndicatorFilter(value);
            setShowVisualization(false);
        },
        [countryOptions, onSelectedCountryChange, selectedCountries, selectedIndicatorFilter, visualizations]
    );

    const onChangeYearFilter = useCallback(
        (value: string[] | undefined) => {
            const oldContainsAllYears = selectedYearFilter?.includes(allYearsItem.value);
            const newContainsAllYears = value?.includes(allYearsItem.value);

            if (oldContainsAllYears) {
                setSelectedYearFilter(value?.filter(year => year !== allYearsItem.value));
            } else if (newContainsAllYears) {
                setSelectedYearFilter([allYearsItem.value]);
            } else {
                setSelectedYearFilter(value);
            }

            setShowVisualization(false);
        },
        [selectedYearFilter]
    );

    useEffect(() => {
        setShowVisualization(false);
    }, [selectedCountries]);

    useEffect(() => {
        if (!selectedIndicatorFilter) {
            setDisabledCountries([]);
        }
    }, [selectedIndicatorFilter]);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getVisualizations.execute().run(
            visualizations => {
                setIndicatorFilters(buildIndicatorOptionsAndSortByCategories(visualizations));

                setVisualizations(visualizations);
            },
            () => {
                setIndicatorFilters([]);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    useEffect(() => {
        const categoryOfIndicatorSelectedFilter = indicatorFilters.find(
            indicator => indicator.value === selectedIndicatorFilter
        )?.category;

        if (categoryOfIndicatorSelectedFilter?.startsWith(sortedCategoryNames.comparative)) {
            setYearsFilters([
                { value: LatestCOVID19.id, text: i18n.t("2019 or latest available year before COVID-19") },
            ]);
        } else {
            setYearsFilters(allYearsFilters);
        }
    }, [indicatorFilters, selectedIndicatorFilter]);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getSelectCategoryInfo.execute().run(
            info => {
                setSelectCategoryInfo(info);
            },
            error => {
                setSelectCategoryInfo(undefined);
                setErrorMessage(error);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    const onGet = useCallback(() => {
        const visualization = visualizations.find(visualization => visualization.id === selectedIndicatorFilter);

        if (visualization?.minCountryFilter && (selectedCountries?.length || 0) < visualization.minCountryFilter) {
            setGlobalMessage({
                text: i18n.t(`This indicator needs at least {{count}} countries`, {
                    count: visualization.minCountryFilter,
                }),
                type: "info",
            });
        } else if (
            visualization?.maxCountryFilter &&
            (selectedCountries?.length || 0) > visualization.maxCountryFilter
        ) {
            const { minCountryFilter } = visualization;
            setGlobalMessage({
                text: i18n.t(`This indicator needs to select only {{count}} country`, {
                    count: minCountryFilter,
                }),
                type: "info",
            });
        } else {
            setShowVisualization(true);
        }
    }, [selectedCountries, selectedIndicatorFilter, visualizations]);

    const onCountriesChange = useCallback(
        (countries: string[] | undefined) => {
            const visualization = visualizations.find(visualization => visualization.id === selectedIndicatorFilter);

            if ((countries?.length || 0) === visualization?.maxCountryFilter) {
                const countriesToDisabled = countryOptions.map(op => op.id).filter(id => !countries?.includes(id));
                setDisabledCountries(countriesToDisabled);
            } else {
                setDisabledCountries(visualization && !visualization.hasEur27 ? [EU27] : []);
            }

            onSelectedCountryChange(countries);
        },
        [countryOptions, onSelectedCountryChange, selectedIndicatorFilter, visualizations]
    );

    return {
        filters: {
            country: {
                selected: selectedCountries,
                onSelectedChange: onCountriesChange,
                options: countryOptions,
                disabledCountries,
                maxCountrySelection,
            },
            indicators: {
                options: indicatorFilters,
                selected: selectedIndicatorFilter,
                onSelectedChange: onChangeCategoryFilter,
            },
            year: {
                options: yearFilters,
                selected: selectedYearFilter,
                onSelectedChange: onChangeYearFilter,
                realYearSelected: selectedYearFilter?.includes(allYearsItem.value)
                    ? allYearsFilters.map(year => year.value)
                    : selectedYearFilter,
            },
        },
        onGet,
        showVisualization,
        globalMessage,
        selectCategoryInfo,
        errorMessage,
    };
}

function buildIndicatorOptionsAndSortByCategories(visualizations: Visualization[]): IndicatorOption[] {
    return visualizations
        .map(visualization => ({
            value: visualization.id,
            text: `${visualization.friendlyName.charAt(0).toUpperCase()}${visualization.friendlyName.slice(1)}`,
            category: visualization.categoryName,
        }))
        .sort((optionA, optionB) => {
            const indexCategoryA = Object.values(sortedCategoryNames).indexOf(optionA.category);
            const indexCategoryB = Object.values(sortedCategoryNames).indexOf(optionB.category);
            const indexIndicatorA = sortedCharts.indexOf(optionA.value);
            const indexIndicatorB = sortedCharts.indexOf(optionB.value);

            return indexCategoryA !== indexCategoryB
                ? indexCategoryA - indexCategoryB
                : indexIndicatorA - indexIndicatorB;
        });
}

function getUpdatedCountriesSelectionFilter(
    oldVisualization: Visualization | undefined,
    newsVisualization: Visualization | undefined,
    isEu27Selected: boolean,
    countryOptions: CountryOption[]
): string[] | undefined {
    if (
        (oldVisualization?.isComparative && !newsVisualization?.isComparative) ||
        (!newsVisualization?.isComparative && !newsVisualization?.hasEur27 && isEu27Selected)
    ) {
        return [];
    }

    if (newsVisualization?.isComparative && newsVisualization?.hasEur27) {
        return countryOptions.map(op => op.id);
    }

    if (newsVisualization?.isComparative) {
        return countryOptions.map(op => op.id).filter(id => id !== EU27);
    }
}

function getDisabledCountriesFilter(
    newsVisualization: Visualization | undefined,
    selectedCountriesFilter: string[] | undefined,
    countryOptions: CountryOption[]
): string[] {
    if ((selectedCountriesFilter?.length || 0) === newsVisualization?.maxCountryFilter) {
        const countriesToDisabled = countryOptions
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id));
        return countriesToDisabled;
    }

    if (!newsVisualization?.hasEur27) {
        return [EU27];
    }

    return [];
}
