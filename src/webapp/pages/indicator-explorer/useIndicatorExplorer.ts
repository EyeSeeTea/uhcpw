import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { GlobalMessage, IndicatorExplorerState, IndicatorOption } from "./IndicatorExplorerState";

import {
    AVERAGES_REGIONS_PARENT,
    useMultiCountryOptionsV2,
} from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { LatestAvailable } from "../../../domain/entities/Year";
import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { TreeOption } from "../../components/tree-selector/TreeSelector";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { Indicator } from "../../../domain/entities/indicator-explorer/Indicator";
import { ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS } from "../../../domain/entities/region/Region";
import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";
import {
    allYearsItem,
    buildIndicatorOptionsAndSortByCategories,
    generateBulkAnalyticsEvents,
    getCountriesAndRegionsToBeDisabled,
    getDisabledCountriesFilter,
    getDisabledRegionIds,
    getSelectedYearsInFilter,
    getUpdatedCountriesSelectionFilter,
    getYearOptionsInFilter,
} from "./helpers";
import { useUpdateSearchParam } from "../../common/hooks/useUpdateSearchParam";

export function useIndicatorExplorer(
    initialIndicator?: string,
    initialYears?: string[],
    initialCountriesAndAreas?: string[]
): IndicatorExplorerState {
    const { compositionRoot, countriesAndSubregions } = useAppContext();
    const {
        selected: selectedCountriesAndRegions,
        onSelectedChange: onSelectedCountryAndRegionsChange,
        options: countryAndRegionsOptions,
        ...countryFilterOptions
    } = useMultiCountryOptionsV2({
        showRegions: true,
        showSubRegions: true,
        selectedCountries: initialCountriesAndAreas,
    });
    const { sendEvent } = useAnalytics();
    const { updateSearchParam, updateSearchParams } = useUpdateSearchParam();

    const [indicatorFilters, setIndicatorFilters] = useState<IndicatorOption[]>([]);
    const [selectedIndicatorFilter, setSelectedIndicatorFilter] = useState<string | undefined>(initialIndicator);
    const [pageContent, setPageContent] = useState<IndicatorExplorerContent | undefined>(undefined);

    const [yearFilters, setYearsFilters] = useState<TreeOption[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>(initialYears);

    const [indicators, setIndicators] = useState<Indicator[]>([]);

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>();

    const [showVisualization, setShowVisualization] = useState(false);

    const [disabledCountriesAndRegions, setDisabledCountriesAndRegions] = useState<string[]>([]);
    const [maxCountrySelection, setMaxCountrySelection] = useState<number | undefined>(undefined);
    const [isOnlyEu27Comparison, setIsOnlyEu27Comparison] = useState(false);
    const [isYearSingleSelection, setIsYearSingleSelection] = useState(false);
    const [disabledYears, setDisabledYears] = useState<string[]>([]);
    const [hideBosniaAndHerzegovinaRegions, setHideBosniaAndHerzegovinaRegions] = useState(false);
    const [hasSyncedFilters, setHasSyncedFilters] = useState(false);

    const selectedCountriesAndSubregions: Id[] = useMemo(() => {
        const countryAndSubregionIds = countryAndRegionsOptions
            .filter(
                (option: TreeOption) =>
                    option.parents.length !== 0 && !option.parents.map(p => p.id).includes(AVERAGES_REGIONS_PARENT.id)
            )
            .flatMap(option => [option.id, ...(option?.children || []).map(child => child.id)]);

        return (selectedCountriesAndRegions || [])?.filter(selected => countryAndSubregionIds.includes(selected));
    }, [countryAndRegionsOptions, selectedCountriesAndRegions]);

    const selectedRegions: Id[] = useMemo(() => {
        const regionOptions = countryAndRegionsOptions
            .filter(
                (option: TreeOption) =>
                    option.parents.length === 1 && option.parents[0]?.id === AVERAGES_REGIONS_PARENT.id
            )
            .map(option => option.id);

        const selectedRegionsIds = (selectedCountriesAndRegions || []).filter(selected =>
            regionOptions.includes(selected)
        );

        return selectedRegionsIds;
    }, [countryAndRegionsOptions, selectedCountriesAndRegions]);

    const showNonComparativeMessageIfRequired = useCallback(
        (oldIndicator: Indicator | undefined, newsIndicator: Indicator | undefined) => {
            const isOldComparativeAndNewNotComparative = oldIndicator?.isComparative && !newsIndicator?.isComparative;

            if (
                isOldComparativeAndNewNotComparative &&
                newsIndicator?.maxCountryFilter &&
                newsIndicator?.maxCountryFilter >= 1
            ) {
                setGlobalMessage({
                    text: i18n.t(`You can only select {{count}} countries or areas at a time with this indicator`, {
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
            const isMoreThanOneCountrySelected =
                selectedCountriesAndRegions?.length && selectedCountriesAndRegions.length > 1;

            if (isOldMultipleCountrySelection && isNewSingleCountrySelection && isMoreThanOneCountrySelected) {
                setGlobalMessage({
                    text: i18n.t(`You can only select one country or area at a time with this indicator`),
                    type: "info",
                });
            }
        },
        [selectedCountriesAndRegions?.length]
    );

    const onChangeIndicatorFilter = useCallback(
        (value: string | undefined) => {
            const oldIndicator = indicators.find(indicator => indicator.id === selectedIndicatorFilter);
            const newIndicator = indicators.find(indicator => indicator.id === value);

            const maybeUpdatedCountrySelection = getUpdatedCountriesSelectionFilter(
                oldIndicator,
                newIndicator,
                selectedCountriesAndRegions,
                countriesAndSubregions
            );

            if (maybeUpdatedCountrySelection) {
                onSelectedCountryAndRegionsChange(maybeUpdatedCountrySelection);
            }

            const selectedCountriesInFilter = maybeUpdatedCountrySelection ?? selectedCountriesAndRegions;
            const disabledCountries = getDisabledCountriesFilter(
                newIndicator,
                selectedCountriesInFilter,
                countryAndRegionsOptions
            );
            setDisabledCountriesAndRegions(disabledCountries);

            const selectedYearsInFilter = getSelectedYearsInFilter(newIndicator);
            setSelectedYearFilter(selectedYearsInFilter);

            const countriesToBeReset =
                selectedCountriesAndRegions &&
                newIndicator?.maxCountryFilter &&
                selectedCountriesAndRegions?.length > newIndicator?.maxCountryFilter;
            if (countriesToBeReset) {
                onSelectedCountryAndRegionsChange([]);
            }

            showNonComparativeMessageIfRequired(oldIndicator, newIndicator);

            setMaxCountrySelection(newIndicator?.maxCountryFilter);
            setIsOnlyEu27Comparison(!!newIndicator?.isOnlyEu27Comparison);
            setSelectedIndicatorFilter(value);
            setShowVisualization(false);
            setIsYearSingleSelection(!!newIndicator?.isYearSingleSelection);
            setHideBosniaAndHerzegovinaRegions(!!newIndicator?.hideBosniaAndHerzegovinaRegions);
            setDisabledYears([]);
            updateSearchParams({
                years: selectedYearsInFilter,
                indicator: value,
                countriesAndAreas: countriesToBeReset
                    ? []
                    : maybeUpdatedCountrySelection
                    ? maybeUpdatedCountrySelection
                    : selectedCountriesAndRegions,
            });
        },
        [
            updateSearchParams,
            indicators,
            selectedCountriesAndRegions,
            countriesAndSubregions,
            countryAndRegionsOptions,
            showNonComparativeMessageIfRequired,
            selectedIndicatorFilter,
            onSelectedCountryAndRegionsChange,
        ]
    );

    const onChangeYearFilter = useCallback(
        (value: string[] | undefined) => {
            setSelectedYearFilter(value);
            updateSearchParam("years", value);

            setShowVisualization(false);

            if (isYearSingleSelection) {
                const disabled =
                    value && value.length ? yearFilters.map(year => year.id).filter(id => !value.includes(id)) : [];
                setDisabledYears(disabled);
            }
        },
        [updateSearchParam, isYearSingleSelection, yearFilters]
    );

    useEffect(() => {
        if (!selectedIndicatorFilter) {
            setDisabledCountriesAndRegions([]);
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
        if (!indicator || !selectedCountriesAndRegions || !selectedYearFilter) return;

        const allCountriesSelected = selectedCountriesAndRegions?.length === countriesAndSubregions.length;

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
            eu27average: selectedCountriesAndRegions.some(country => country === ORG_UNIT_GROUP_IDS.EUROPEAN_UNION),
            numberOfCountries: selectedCountriesAndRegions.length,
        });

        const selectedCountriesNames = selectedCountriesAndRegions
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
        selectedCountriesAndRegions,
        selectedYearFilter,
        countriesAndSubregions,
        sendEvent,
    ]);

    const onGet = useCallback(() => {
        const selectedIndicator = indicators.find(visualization => visualization.id === selectedIndicatorFilter);

        if (
            selectedIndicator?.minCountryFilter &&
            (selectedCountriesAndRegions?.length || 0) < selectedIndicator.minCountryFilter
        ) {
            setGlobalMessage({
                text: i18n.t(`This indicator needs at least {{count}} countries`, {
                    count: selectedIndicator.minCountryFilter,
                }),
                type: "info",
            });
        } else if (
            selectedIndicator?.maxCountryFilter &&
            (selectedCountriesAndRegions?.length || 0) > selectedIndicator.maxCountryFilter
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
    }, [selectedCountriesAndRegions, selectedIndicatorFilter, indicators, sendAnalyticsEvents]);

    const onCountriesAndRegionsChange = useCallback(
        (newSelectedCountriesAndRegions: Id[] | undefined) => {
            const selectedIndicator = indicators.find(visualization => visualization.id === selectedIndicatorFilter);
            const totalCountriesSelected = newSelectedCountriesAndRegions?.length || 0;
            const areAllPossibleCountriesSelected = totalCountriesSelected === selectedIndicator?.maxCountryFilter;
            const onlyEURegionCanBeSelected =
                isOnlyEu27Comparison &&
                totalCountriesSelected + 1 === selectedIndicator?.maxCountryFilter &&
                !newSelectedCountriesAndRegions?.includes(ORG_UNIT_GROUP_IDS.EUROPEAN_UNION);
            const disabledRegionIds = getDisabledRegionIds(countryAndRegionsOptions, selectedIndicator);

            if (areAllPossibleCountriesSelected) {
                setDisabledCountriesAndRegions(
                    getCountriesAndRegionsToBeDisabled(
                        countryAndRegionsOptions,
                        newSelectedCountriesAndRegions,
                        disabledRegionIds
                    )
                );
            } else if (onlyEURegionCanBeSelected) {
                const euIds: readonly string[] = [ORG_UNIT_GROUP_IDS.EUROPEAN_UNION, ORG_UNIT_IDS.EUROPEAN_UNION];
                setDisabledCountriesAndRegions(
                    getCountriesAndRegionsToBeDisabled(
                        countryAndRegionsOptions,
                        newSelectedCountriesAndRegions,
                        disabledRegionIds
                    ).filter(id => euIds.includes(id))
                );
            } else {
                setDisabledCountriesAndRegions(disabledRegionIds);
            }

            onSelectedCountryAndRegionsChange(newSelectedCountriesAndRegions);
            updateSearchParam("countriesAndAreas", newSelectedCountriesAndRegions);
            setShowVisualization(false);
        },
        [
            updateSearchParam,
            countryAndRegionsOptions,
            isOnlyEu27Comparison,
            onSelectedCountryAndRegionsChange,
            selectedIndicatorFilter,
            indicators,
        ]
    );

    const closeVisualization = useCallback(() => {
        setShowVisualization(false);
    }, []);

    useEffect(() => {
        if (hasSyncedFilters) return;

        const hasParams = initialIndicator && initialCountriesAndAreas?.length && initialYears?.length;

        if (!hasParams) return;

        if (
            indicatorFilters.length === 0 ||
            yearFilters.length === 0 ||
            countryAndRegionsOptions.length === 0 ||
            !onCountriesAndRegionsChange ||
            !onChangeYearFilter ||
            !onChangeIndicatorFilter
        ) {
            return;
        }

        onChangeIndicatorFilter(initialIndicator || "");
        onCountriesAndRegionsChange(initialCountriesAndAreas || []);
        onChangeYearFilter(initialYears || []);
        onGet();

        setHasSyncedFilters(true);
    }, [
        countryAndRegionsOptions.length,
        hasSyncedFilters,
        indicatorFilters.length,
        initialCountriesAndAreas,
        initialIndicator,
        initialYears,
        onChangeIndicatorFilter,
        onChangeYearFilter,
        onCountriesAndRegionsChange,
        onGet,
        yearFilters.length,
    ]);

    return {
        filters: {
            countryAndRegions: {
                selected: selectedCountriesAndRegions,
                selectedCountriesAndSubregions: selectedCountriesAndSubregions,
                selectedRegions: selectedRegions,
                onSelectedChange: onCountriesAndRegionsChange,
                options: countryAndRegionsOptions,
                disabledCountriesAndRegions: disabledCountriesAndRegions,
                maxCountrySelection,
                showSubRegions: !hideBosniaAndHerzegovinaRegions,
                selectedItemsToShowWhenAllSelected: Object.values(ORG_UNIT_GROUP_IDS),
                isOnlyEu27Comparison: isOnlyEu27Comparison,
                ...countryFilterOptions,
            },
            indicators: {
                options: indicatorFilters,
                selected: selectedIndicatorFilter,
                onSelectedChange: onChangeIndicatorFilter,
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
