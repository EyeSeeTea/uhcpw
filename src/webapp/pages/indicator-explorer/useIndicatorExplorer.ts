import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { GlobalMessage, IndicatorExplorerState, IndicatorOption } from "./IndicatorExplorerState";

import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { LatestAvailable, LatestCOVID19, Year } from "../../../domain/entities/Year";
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
import { Indicator } from "../../../domain/entities/indicator-explorer/Indicator";

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
    const { compositionRoot, countriesAndSubregions } = useAppContext();
    const {
        selected: selectedCountries,
        onSelectedChange: onSelectedCountryChange,
        options: countryOptions,
        ...countryFilterOptions
    } = useMultiCountryOptionsV2({ showEurRegion: true, showSubRegions: true });
    const { sendEvent } = useAnalytics();

    const [indicatorFilters, setIndicatorFilters] = useState<IndicatorOption[]>([]);
    const [selectedIndicatorFilter, setSelectedIndicatorFilter] = useState<string | undefined>();
    const [pageContent, setPageContent] = useState<IndicatorExplorerContent | undefined>(undefined);

    const [yearFilters, setYearsFilters] = useState<TreeOption[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [indicators, setIndicators] = useState<Indicator[]>([]);

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>();

    const [showVisualization, setShowVisualization] = useState(false);

    const [disabledCountries, setDisabledCountries] = useState<string[]>([]);
    const [maxCountrySelection, setMaxCountrySelection] = useState<number | undefined>(undefined);
    const [isOnlyEu27Comparison, setIsOnlyEu27Comparison] = useState(false);
    const [isYearSingleSelection, setIsYearSingleSelection] = useState(false);
    const [disabledYears, setDisabledYears] = useState<string[]>([]);
    const [hideBosniaAndHerzegovinaRegions, setHideBosniaAndHerzegovinaRegions] = useState(false);

    const showNonComparativeMessageIfRequired = useCallback(
        (oldIndicator: Indicator | undefined, newsIndicator: Indicator | undefined) => {
            const isOldComparativeAndNewNotComparative = oldIndicator?.isComparative && !newsIndicator?.isComparative;

            if (
                isOldComparativeAndNewNotComparative &&
                newsIndicator?.maxCountryFilter &&
                newsIndicator?.maxCountryFilter >= 1
            ) {
                setGlobalMessage({
                    text: i18n.t(`You can only select {{count}} countries at a time with this indicator`, {
                        count: newsIndicator.maxCountryFilter,
                    }),
                    type: "info",
                });
            }

            const isNewSingleCountrySelection = newsIndicator?.maxCountryFilter === 1;
            const isOldMultipleCountrySelection =
                !oldIndicator?.maxCountryFilter ||
                (oldIndicator?.maxCountryFilter || 0) > 1 ||
                oldIndicator?.isComparative;
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
            const oldIndicator = indicators.find(indicator => indicator.id === selectedIndicatorFilter);
            const newIndicator = indicators.find(indicator => indicator.id === value);

            const maybeUpdatedCountrySelection = getUpdatedCountriesSelectionFilter(
                oldIndicator,
                newIndicator,
                selectedCountries,
                countriesAndSubregions
            );

            if (maybeUpdatedCountrySelection) {
                onSelectedCountryChange(maybeUpdatedCountrySelection);
            }

            const selectedCountriesInFilter = maybeUpdatedCountrySelection ?? selectedCountries;
            const disabledCountries = getDisabledCountriesFilter(
                newIndicator,
                selectedCountriesInFilter,
                countryOptions
            );
            setDisabledCountries(disabledCountries);

            const selectedYearsInFilter = getSelectedYearsInFilter(newIndicator);
            setSelectedYearFilter(selectedYearsInFilter);

            // Reset countries filter depending on maxCountryFilter
            if (
                selectedCountries &&
                newIndicator?.maxCountryFilter &&
                selectedCountries?.length > newIndicator?.maxCountryFilter
            ) {
                onSelectedCountryChange([]);
            }

            showNonComparativeMessageIfRequired(oldIndicator, newIndicator);

            setMaxCountrySelection(newIndicator?.maxCountryFilter);
            setIsOnlyEu27Comparison(!!newIndicator?.isOnlyEu27Comparison);
            setSelectedIndicatorFilter(value);
            setShowVisualization(false);
            setIsYearSingleSelection(!!newIndicator?.isYearSingleSelection);
            setHideBosniaAndHerzegovinaRegions(!!newIndicator?.hideBosniaAndHerzegovinaRegions);
            setDisabledYears([]);
        },
        [
            countriesAndSubregions,
            countryOptions,
            onSelectedCountryChange,
            selectedCountries,
            selectedIndicatorFilter,
            showNonComparativeMessageIfRequired,
            indicators,
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
        compositionRoot.indicatorExplorer.getIndicators.execute().run(
            indicators => {
                setIndicatorFilters(buildIndicatorOptionsAndSortByCategories(indicators));

                setIndicators(indicators);
            },
            () => {
                setIndicatorFilters([]);
            }
        );
    }, [compositionRoot.indicatorExplorer]);

    useEffect(() => {
        const selectedIndicator = indicators.find(indicator => indicator.id === selectedIndicatorFilter);

        const yearOptionsInFilter = getYearOptionsInFilter(
            selectedIndicator?.allowedYears,
            isYearSingleSelection,
            selectedIndicator?.yearsFilterUpTo2YearsAgo
        );

        setYearsFilters(yearOptionsInFilter);

        const disabledYears =
            isYearSingleSelection && selectedYearFilter && selectedYearFilter.length
                ? yearOptionsInFilter.map(year => year.id).filter(id => !selectedYearFilter.includes(id))
                : [];
        setDisabledYears(disabledYears);
    }, [isYearSingleSelection, selectedIndicatorFilter, selectedYearFilter, indicators]);

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

        const allCountriesSelected = selectedCountries?.length === countriesAndSubregions.length;

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
            .map(countryId => countriesAndSubregions.find(country => country.id === countryId)?.name)
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
        countriesAndSubregions,
        sendEvent,
    ]);

    const onGet = useCallback(() => {
        const selectedIndicator = indicators.find(visualization => visualization.id === selectedIndicatorFilter);

        if (
            selectedIndicator?.minCountryFilter &&
            (selectedCountries?.length || 0) < selectedIndicator.minCountryFilter
        ) {
            setGlobalMessage({
                text: i18n.t(`This indicator needs at least {{count}} countries`, {
                    count: selectedIndicator.minCountryFilter,
                }),
                type: "info",
            });
        } else if (
            selectedIndicator?.maxCountryFilter &&
            (selectedCountries?.length || 0) > selectedIndicator.maxCountryFilter
        ) {
            const { minCountryFilter } = selectedIndicator;
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
    }, [selectedCountries, selectedIndicatorFilter, indicators, sendAnalyticsEvents]);

    const onCountriesChange = useCallback(
        (countries: string[] | undefined) => {
            const selectedIndicator = indicators.find(visualization => visualization.id === selectedIndicatorFilter);
            const totalCountriesSelected = countries?.length || 0;

            if (totalCountriesSelected === selectedIndicator?.maxCountryFilter) {
                setDisabledCountries(getCountriesNotSelected(countryOptions, countries));
            } else if (
                isOnlyEu27Comparison &&
                totalCountriesSelected + 1 === selectedIndicator?.maxCountryFilter &&
                !countries?.includes(EU27)
            ) {
                setDisabledCountries(getCountriesNotSelected(countryOptions, countries).filter(id => id !== EU27));
            } else {
                setDisabledCountries(selectedIndicator && !selectedIndicator.hasEur27 ? [EU27] : []);
            }

            onSelectedCountryChange(countries);
        },
        [countryOptions, isOnlyEu27Comparison, onSelectedCountryChange, selectedIndicatorFilter, indicators]
    );

    const closeVisualization = useCallback(() => {
        setShowVisualization(false);
    }, []);

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
                ...countryFilterOptions,
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
        closeVisualization,
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

function buildIndicatorOptionsAndSortByCategories(indicators: Indicator[]): IndicatorOption[] {
    return indicators
        .map(indicator => ({
            value: indicator.id,
            text: `${indicator.friendlyName.charAt(0).toUpperCase()}${indicator.friendlyName.slice(1)}`,
            category: indicator.categoryName,
            subcategory: indicator.subcategoryName || "",
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
    oldIndicator: Indicator | undefined,
    newIndicator: Indicator | undefined,
    selectedCountries: string[] | undefined,
    countriesAndSubregions: Country[]
): string[] | undefined {
    const isEu27Selected = selectedCountries?.some(selectedCountry => selectedCountry === EU27);
    const isMoreThanOneCountrySelected = selectedCountries?.length && selectedCountries.length > 1;

    const isOldComparativeAndNewNotComparative = oldIndicator?.isComparative && !newIndicator?.isComparative;
    const isNewNotComparativeAndNotHaveEur27 = !newIndicator?.isComparative && !newIndicator?.hasEur27;

    const areOldAndNewComparative = oldIndicator?.isComparative && newIndicator?.isComparative;
    const areOldAndNewNotComparative = !oldIndicator?.isComparative && !newIndicator?.isComparative;

    const isNewSingleCountrySelection = newIndicator?.maxCountryFilter === 1;

    if (
        isOldComparativeAndNewNotComparative ||
        (isNewNotComparativeAndNotHaveEur27 && isEu27Selected) ||
        (isNewSingleCountrySelection && isMoreThanOneCountrySelected)
    ) {
        return [];
    }

    if (areOldAndNewNotComparative) {
        return handleBosniaAndHerzegovina(oldIndicator, newIndicator, selectedCountries);
    }

    if (areOldAndNewComparative && selectedCountries?.length) {
        const totalCountries =
            countriesAndSubregions.length +
            (oldIndicator?.hasEur27 ? 1 : 0) +
            (oldIndicator?.hideBosniaAndHerzegovinaRegions ? -2 : 0);
        const areAllCountriesSelected = selectedCountries.length === totalCountries;

        if (!areAllCountriesSelected) {
            const newSelection = newIndicator?.hasEur27
                ? selectedCountries
                : selectedCountries.filter(country => country !== EU27);
            if (newSelection.length) return handleBosniaAndHerzegovina(oldIndicator, newIndicator, newSelection);
        }
    }

    if (newIndicator?.isComparative) {
        const countriesToSelect = handleBosniaAndHerzegovina(
            oldIndicator,
            newIndicator,
            countriesAndSubregions.map(c => c.id)
        );
        return newIndicator?.hasEur27 ? [...countriesToSelect, EU27] : countriesToSelect;
    }
}

function handleBosniaAndHerzegovina(
    oldIndicator: Indicator | undefined,
    newIndicator: Indicator | undefined,
    countriesToSelect: string[] | undefined
): string[] {
    countriesToSelect = countriesToSelect ?? [];
    const oldHide = oldIndicator?.hideBosniaAndHerzegovinaRegions;
    const newHide = newIndicator?.hideBosniaAndHerzegovinaRegions;

    const bihSubRegions = [FederationOfBosniaAndHerzegovina, RepublikaSrpska];
    if (newHide) {
        if (
            countriesToSelect.some(country => bihSubRegions.includes(country)) &&
            !countriesToSelect.includes(BosniaAndHerzegovina) &&
            newIndicator?.isComparative
        ) {
            countriesToSelect = [...countriesToSelect, BosniaAndHerzegovina];
        }
        return countriesToSelect.filter(country => !bihSubRegions.includes(country));
    } else if (oldHide && !newHide && countriesToSelect.includes(BosniaAndHerzegovina) && newIndicator?.isComparative) {
        return [...countriesToSelect, ...bihSubRegions];
    }
    return countriesToSelect;
}

function getDisabledCountriesFilter(
    newIndicator: Indicator | undefined,
    selectedCountriesFilter: string[] | undefined,
    countryOptions: TreeOption[]
): string[] {
    if ((selectedCountriesFilter?.length || 0) === newIndicator?.maxCountryFilter) {
        const countriesToDisabled = countryOptions
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id));

        const subregionsToDisabled = countryOptions
            .flatMap(countryOption => (countryOption.children ? countryOption.children : []))
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id));
        return [...countriesToDisabled, ...subregionsToDisabled];
    }

    if (!newIndicator?.hasEur27) {
        return [EU27];
    }

    return [];
}

function getSelectedYearsInFilter(newIndicator: Indicator | undefined): string[] | undefined {
    if (!newIndicator) {
        return;
    } else if (newIndicator.selectedYearsByDefault && !!newIndicator.selectedYearsByDefault.length) {
        return newIndicator.selectedYearsByDefault.map(year => year.id);
    } else if (!newIndicator.isYearSingleSelection) {
        if (newIndicator.allowedYears?.length) {
            return newIndicator.allowedYears.map(year => year.id);
        } else {
            const allYears = newIndicator?.yearsFilterUpTo2YearsAgo
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
