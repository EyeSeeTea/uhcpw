import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { GlobalMessage, IndicatorExplorerState, IndicatorOption } from "./IndicatorExplorerState";

import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { LatestAvailable, LatestCOVID19, Year } from "../../../domain/entities/Year";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import {
    BosniaAndHerzegovina,
    Country,
    EU27,
    FederationOfBosniaAndHerzegovina,
    RepublikaSrpska,
} from "../../../domain/entities/Country";
import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import {
    sortedCategoryNames,
    sortedCharts,
    sortedSubcategoryNames,
} from "../../../data/repositories/indicator-explorer/seed/utils";
import { TreeOption } from "../../components/tree-selector/TreeSelector";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { AnalyticsEvent } from "../../../domain/entities/AnalyticsEvent";

export const allYearsItem = { id: "all", name: i18n.t("All years"), parents: [] };
const allYearsFiltersUpToLastYear: TreeOption[] = generateYears().map(year => ({
    id: year.id,
    name: year.id,
    parents: [allYearsItem],
}));
const allYearsFiltersUpTo2YearsAgo: TreeOption[] = generateYears(new Date().getFullYear() - 2).map(year => ({
    id: year.id,
    name: year.id,
    parents: [allYearsItem],
}));

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot, countriesAndRegions } = useAppContext();
    const {
        selected: selectedCountries,
        onSelectedChange: onSelectedCountryChange,
        options: countryOptions,
    } = useMultiCountryOptionsV2({ showEurRegion: true, showSubRegions: true });
    const { sendEvent } = useAnalytics();

    const [indicatorFilters, setIndicatorFilters] = useState<IndicatorOption[]>([]);
    const [selectedIndicatorFilter, setSelectedIndicatorFilter] = useState<string | undefined>();
    const [pageContent, setPageContent] = useState<IndicatorExplorerContent | undefined>(undefined);

    const [yearFilters, setYearsFilters] = useState<TreeOption[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [visualizations, setVisualizations] = useState<Visualization[]>([]);

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>();

    const [showVisualization, setShowVisualization] = useState(false);

    const [disabledCountries, setDisabledCountries] = useState<string[]>([]);
    const [maxCountrySelection, setMaxCountrySelection] = useState<number | undefined>(undefined);
    const [isOnlyEu27Comparison, setIsOnlyEu27Comparison] = useState(false);
    const [isYearSingleSelection, setIsYearSingleSelection] = useState(false);
    const [disabledYears, setDisabledYears] = useState<string[]>([]);
    const [hideBosniaAndHerzegovinaRegions, setHideBosniaAndHerzegovinaRegions] = useState(false);

    const showNonComparativeMessageIfRequired = useCallback(
        (oldVisualization: Visualization | undefined, newsVisualization: Visualization | undefined) => {
            const isOldComparativeAndNewNotComparative =
                oldVisualization?.isComparative && !newsVisualization?.isComparative;

            if (
                isOldComparativeAndNewNotComparative &&
                newsVisualization?.maxCountryFilter &&
                newsVisualization?.maxCountryFilter >= 1
            ) {
                setGlobalMessage({
                    text: i18n.t(`You can only select {{count}} countries at a time with this indicator`, {
                        count: newsVisualization.maxCountryFilter,
                    }),
                    type: "info",
                });
            }

            const isNewSingleCountrySelection = newsVisualization?.maxCountryFilter === 1;
            const isOldMultipleCountrySelection =
                !oldVisualization?.maxCountryFilter ||
                (oldVisualization?.maxCountryFilter || 0) > 1 ||
                oldVisualization?.isComparative;
            const isMoreThanOneCountrySelected = selectedCountries?.length && selectedCountries.length > 1;

            if (isOldMultipleCountrySelection && isNewSingleCountrySelection && isMoreThanOneCountrySelected) {
                setGlobalMessage({
                    text: i18n.t(`You can only select one country at a time with this indicator`),
                    type: "info",
                });
            }
        },
        [selectedCountries?.length]
    );

    const onChangeCategoryFilter = useCallback(
        (value: string | undefined) => {
            const oldVisualization = visualizations.find(visualization => visualization.id === selectedIndicatorFilter);
            const newsVisualization = visualizations.find(visualization => visualization.id === value);

            const maybeUpdatedCountrySelection = getUpdatedCountriesSelectionFilter(
                oldVisualization,
                newsVisualization,
                selectedCountries,
                countriesAndRegions
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

            const selectedYearsInFilter = getSelectedYearsInFilter(newsVisualization);
            setSelectedYearFilter(selectedYearsInFilter);

            // Reset countries filter depending on maxCountryFilter
            if (
                selectedCountries &&
                newsVisualization?.maxCountryFilter &&
                selectedCountries?.length > newsVisualization?.maxCountryFilter
            ) {
                onSelectedCountryChange([]);
            }

            showNonComparativeMessageIfRequired(oldVisualization, newsVisualization);

            setMaxCountrySelection(newsVisualization?.maxCountryFilter);
            setIsOnlyEu27Comparison(!!newsVisualization?.isOnlyEu27Comparison);
            setSelectedIndicatorFilter(value);
            setShowVisualization(false);
            setIsYearSingleSelection(!!newsVisualization?.isYearSingleSelection);
            setHideBosniaAndHerzegovinaRegions(!!newsVisualization?.hideBosniaAndHerzegovinaRegions);
            setDisabledYears([]);
        },
        [
            countriesAndRegions,
            countryOptions,
            onSelectedCountryChange,
            selectedCountries,
            selectedIndicatorFilter,
            showNonComparativeMessageIfRequired,
            visualizations,
        ]
    );

    const onChangeYearFilter = useCallback(
        (value: string[] | undefined) => {
            setSelectedYearFilter(value);

            setShowVisualization(false);

            if (isYearSingleSelection) {
                const disabled =
                    value && value.length ? yearFilters.map(year => year.id).filter(id => !value.includes(id)) : [];
                setDisabledYears(disabled);
            }
        },
        [isYearSingleSelection, yearFilters]
    );

    useEffect(() => {
        setShowVisualization(false);
    }, [selectedCountries]);

    useEffect(() => {
        if (!selectedIndicatorFilter) {
            setDisabledCountries([]);
            setDisabledYears([]);
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
        const selectedVisualization = visualizations.find(
            visualization => visualization.id === selectedIndicatorFilter
        );

        const yearOptionsInFilter = getYearOptionsInFilter(
            selectedVisualization?.allowedYears,
            isYearSingleSelection,
            selectedVisualization?.yearsFilterUpTo2YearsAgo
        );

        setYearsFilters(yearOptionsInFilter);

        const disabledYears =
            isYearSingleSelection && selectedYearFilter && selectedYearFilter.length
                ? yearOptionsInFilter.map(year => year.id).filter(id => !selectedYearFilter.includes(id))
                : [];
        setDisabledYears(disabledYears);
    }, [isYearSingleSelection, selectedIndicatorFilter, selectedYearFilter, visualizations]);

    useEffect(() => {
        compositionRoot.indicatorExplorer.getPageContent.execute().run(
            result => {
                setPageContent(result);
            },
            error => {
                setPageContent(undefined);
                setGlobalMessage({
                    text: error,
                    type: "error",
                });
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    const sendAnalyticsEvents = useCallback(() => {
        const indicator = indicatorFilters.find(indicator => indicator.value === selectedIndicatorFilter)?.text;
        if (!indicator || !selectedCountries || !selectedYearFilter) return;

        const allCountriesSelected = selectedCountries?.length === countriesAndRegions.length;

        const renamedLastAvailableYear = selectedYearFilter.map(year =>
            year === LatestAvailable.id ? "Latest available year" : year
        );

        const allYearsSelected = renamedLastAvailableYear.some(year => year === allYearsItem.id);

        sendEvent({
            name: "indicator_explorer_summary",
            indicator: indicator,
            allCountriesSelected: allCountriesSelected,
            allYearsSelected: allYearsSelected,
            yearsSelected: renamedLastAvailableYear,
            eu27average: selectedCountries.some(country => country === EU27),
            numberOfCountries: selectedCountries.length,
        });

        const selectedCountriesNames = selectedCountries
            .map(countryId => countriesAndRegions.find(country => country.id === countryId)?.name)
            .filter((x): x is string => Boolean(x));

        const bulkEvents = generateBulkAnalyticsEvents({
            indicator: indicator,
            allCountriesSelected,
            countries: selectedCountriesNames,
            years: renamedLastAvailableYear,
            allYearsSelected,
        });

        /* GA4 has no way support for sending events in bulk, but maybe this "technology" info might suggest that should live only in "data" */
        bulkEvents.forEach(event => sendEvent(event));
    }, [
        indicatorFilters,
        selectedIndicatorFilter,
        selectedCountries,
        selectedYearFilter,
        countriesAndRegions,
        sendEvent,
    ]);

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
            sendAnalyticsEvents();
        }
    }, [selectedCountries, selectedIndicatorFilter, visualizations, sendAnalyticsEvents]);

    const onCountriesChange = useCallback(
        (countries: string[] | undefined) => {
            const visualization = visualizations.find(visualization => visualization.id === selectedIndicatorFilter);
            const totalCountriesSelected = countries?.length || 0;

            if (totalCountriesSelected === visualization?.maxCountryFilter) {
                setDisabledCountries(getCountriesNotSelected(countryOptions, countries));
            } else if (
                isOnlyEu27Comparison &&
                totalCountriesSelected + 1 === visualization?.maxCountryFilter &&
                !countries?.includes(EU27)
            ) {
                setDisabledCountries(getCountriesNotSelected(countryOptions, countries).filter(id => id !== EU27));
            } else {
                setDisabledCountries(visualization && !visualization.hasEur27 ? [EU27] : []);
            }

            onSelectedCountryChange(countries);
        },
        [countryOptions, isOnlyEu27Comparison, onSelectedCountryChange, selectedIndicatorFilter, visualizations]
    );

    return {
        filters: {
            country: {
                selected: selectedCountries,
                onSelectedChange: onCountriesChange,
                options: countryOptions,
                disabledCountries,
                maxCountrySelection,
                showSubRegions: !hideBosniaAndHerzegovinaRegions,
                selectedItemsToShowWhenAllSelected: [EU27],
                isOnlyEu27Comparison: isOnlyEu27Comparison,
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
                disabledYears: disabledYears,
                isSingleSelection: isYearSingleSelection,
            },
        },
        onGet,
        showVisualization,
        globalMessage,
        pageContent,
    };
}

function getCountriesNotSelected(countryOptions: TreeOption[], countries: string[] | undefined): string[] {
    const countriesToDisabled = countryOptions.map(op => op.id).filter(id => !countries?.includes(id));

    const subregionsToDisabled = countryOptions
        .flatMap(countryOption => (countryOption.children ? countryOption.children : []))
        .map(op => op.id)
        .filter(id => !countries?.includes(id));

    return [...countriesToDisabled, ...subregionsToDisabled];
}

function buildIndicatorOptionsAndSortByCategories(visualizations: Visualization[]): IndicatorOption[] {
    return visualizations
        .map(visualization => ({
            value: visualization.id,
            text: `${visualization.friendlyName.charAt(0).toUpperCase()}${visualization.friendlyName.slice(1)}`,
            category: visualization.categoryName,
            subcategory: visualization.subcategoryName || "",
        }))
        .sort((optionA, optionB) => {
            const indexCategoryA = Object.values(sortedCategoryNames).indexOf(optionA.category);
            const indexCategoryB = Object.values(sortedCategoryNames).indexOf(optionB.category);
            const indexSubcategoryA = Object.values(sortedSubcategoryNames).indexOf(optionA.subcategory);
            const indexSubcategoryB = Object.values(sortedSubcategoryNames).indexOf(optionB.subcategory);
            const indexIndicatorA = sortedCharts.indexOf(optionA.value);
            const indexIndicatorB = sortedCharts.indexOf(optionB.value);

            return indexCategoryA !== indexCategoryB
                ? indexCategoryA - indexCategoryB
                : indexSubcategoryA !== indexSubcategoryB
                ? indexSubcategoryA - indexSubcategoryB
                : indexIndicatorA - indexIndicatorB;
        });
}

function getUpdatedCountriesSelectionFilter(
    oldVisualization: Visualization | undefined,
    newsVisualization: Visualization | undefined,
    selectedCountries: string[] | undefined,
    countriesAndRegions: Country[]
): string[] | undefined {
    const isEu27Selected = selectedCountries?.some(selectedCountry => selectedCountry === EU27);
    const isMoreThanOneCountrySelected = selectedCountries?.length && selectedCountries.length > 1;

    const isOldComparativeAndNewNotComparative = oldVisualization?.isComparative && !newsVisualization?.isComparative;
    const isNewNotComparativeAndNotHaveEur27 = !newsVisualization?.isComparative && !newsVisualization?.hasEur27;

    const areOldAndNewComparative = oldVisualization?.isComparative && newsVisualization?.isComparative;
    const areOldAndNewNotComparative = !oldVisualization?.isComparative && !newsVisualization?.isComparative;

    const isNewSingleCountrySelection = newsVisualization?.maxCountryFilter === 1;

    if (
        isOldComparativeAndNewNotComparative ||
        (isNewNotComparativeAndNotHaveEur27 && isEu27Selected) ||
        (isNewSingleCountrySelection && isMoreThanOneCountrySelected)
    ) {
        return [];
    }

    if (areOldAndNewNotComparative) {
        return handleBosniaAndHerzegovina(oldVisualization, newsVisualization, selectedCountries);
    }

    if (areOldAndNewComparative && selectedCountries?.length) {
        const totalCountries =
            countriesAndRegions.length +
            (oldVisualization?.hasEur27 ? 1 : 0) +
            (oldVisualization?.hideBosniaAndHerzegovinaRegions ? -2 : 0);
        const areAllCountriesSelected = selectedCountries.length === totalCountries;

        if (!areAllCountriesSelected) {
            const newSelection = newsVisualization?.hasEur27
                ? selectedCountries
                : selectedCountries.filter(country => country !== EU27);
            if (newSelection.length)
                return handleBosniaAndHerzegovina(oldVisualization, newsVisualization, newSelection);
        }
    }

    if (newsVisualization?.isComparative) {
        const countriesToSelect = handleBosniaAndHerzegovina(
            oldVisualization,
            newsVisualization,
            countriesAndRegions.map(c => c.id)
        );
        return newsVisualization?.hasEur27 ? [...countriesToSelect, EU27] : countriesToSelect;
    }
}

function handleBosniaAndHerzegovina(
    oldVisualization: Visualization | undefined,
    newsVisualization: Visualization | undefined,
    countriesToSelect: string[] | undefined
): string[] {
    countriesToSelect = countriesToSelect ?? [];
    const oldHide = oldVisualization?.hideBosniaAndHerzegovinaRegions;
    const newHide = newsVisualization?.hideBosniaAndHerzegovinaRegions;

    const bihSubRegions = [FederationOfBosniaAndHerzegovina, RepublikaSrpska];
    if (newHide) {
        if (
            countriesToSelect.some(country => bihSubRegions.includes(country)) &&
            !countriesToSelect.includes(BosniaAndHerzegovina) &&
            newsVisualization?.isComparative
        ) {
            countriesToSelect = [...countriesToSelect, BosniaAndHerzegovina];
        }
        return countriesToSelect.filter(country => !bihSubRegions.includes(country));
    } else if (
        oldHide &&
        !newHide &&
        countriesToSelect.includes(BosniaAndHerzegovina) &&
        newsVisualization?.isComparative
    ) {
        return [...countriesToSelect, ...bihSubRegions];
    }
    return countriesToSelect;
}

function getDisabledCountriesFilter(
    newsVisualization: Visualization | undefined,
    selectedCountriesFilter: string[] | undefined,
    countryOptions: TreeOption[]
): string[] {
    if ((selectedCountriesFilter?.length || 0) === newsVisualization?.maxCountryFilter) {
        const countriesToDisabled = countryOptions
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id));

        const subregionsToDisabled = countryOptions
            .flatMap(countryOption => (countryOption.children ? countryOption.children : []))
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id));
        return [...countriesToDisabled, ...subregionsToDisabled];
    }

    if (!newsVisualization?.hasEur27) {
        return [EU27];
    }

    return [];
}

function getSelectedYearsInFilter(newsVisualization: Visualization | undefined): string[] | undefined {
    if (!newsVisualization) {
        return;
    } else if (newsVisualization.selectedYearsByDefault && !!newsVisualization.selectedYearsByDefault.length) {
        return newsVisualization.selectedYearsByDefault.map(year => year.id);
    } else if (!newsVisualization.isYearSingleSelection) {
        if (newsVisualization.allowedYears?.length) {
            return newsVisualization.allowedYears.map(year => year.id);
        } else {
            const allYears = newsVisualization?.yearsFilterUpTo2YearsAgo
                ? allYearsFiltersUpTo2YearsAgo
                : allYearsFiltersUpToLastYear;
            return allYears.map(year => year.id);
        }
    }
}

function getYearOptionsInFilter(
    allowedYears: Year[] | undefined,
    isYearSingleSelection: boolean,
    isYearsFilterUpTo2YearsAgo?: boolean
): TreeOption[] {
    const allYears = isYearsFilterUpTo2YearsAgo ? allYearsFiltersUpTo2YearsAgo : allYearsFiltersUpToLastYear;
    if (allowedYears) {
        // HERE: there are charts that are ONLY latest COVID19, there are charts that are ONLY LAY, and there are charts that allow both and another years
        return allowedYears.map(year =>
            year.id === LatestCOVID19.id
                ? {
                      id: LatestCOVID19.id,
                      name: i18n.t("2019 or latest available year before COVID-19"),
                      parents: [],
                  }
                : year.id === LatestAvailable.id
                ? {
                      id: LatestAvailable.id,
                      name: i18n.t("Latest available year"),
                      parents: [],
                  }
                : { id: year.id, name: year.id, parents: [] }
        );
    } else if (isYearSingleSelection) {
        return allYears.map(year => ({ ...year, parents: [] }));
    } else {
        return allYears;
    }
}

function generateBulkAnalyticsEvents(args: {
    indicator: string;
    allCountriesSelected: boolean;
    countries: string[];
    years: string[];
    allYearsSelected: boolean;
}): AnalyticsEvent[] {
    const { indicator, allCountriesSelected, countries, years, allYearsSelected } = args;

    return (allYearsSelected ? ["All years"] : years)
        .flatMap((year): Array<[string, string]> => [[indicator, year]])
        .flatMap(([indicator, year]): Array<[string, string, string]> => {
            if (allCountriesSelected) {
                return [[indicator, "All countries and areas", year]];
            } else {
                return countries.flatMap(country => [[indicator, country, year]]);
            }
        })
        .map(
            ([indicator, country, year]): AnalyticsEvent => ({
                name: "indicator_explorer",
                indicator: indicator,
                country: country,
                year: year,
            })
        );
}
