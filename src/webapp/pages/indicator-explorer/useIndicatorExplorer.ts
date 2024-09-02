import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { GlobalMessage, IndicatorExplorerState, IndicatorOption } from "./IndicatorExplorerState";

import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { LatestAvailable, LatestCOVID19 } from "../../../domain/entities/Year";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Country, EU27 } from "../../../domain/entities/Country";
import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { sortedCategoryNames, sortedCharts } from "../../../data/repositories/indicator-explorer/seed/utils";
import { TreeOption } from "../../components/tree-selector/TreeSelector";

export const allYearsItem = { id: "all", name: i18n.t("All years"), parents: [] };
export const yearsItems = generateYears().map(year => ({ id: year.id, name: year.id, parents: [allYearsItem] }));
const allYearsFilters: TreeOption[] = yearsItems;

export function useIndicatorExplorer(): IndicatorExplorerState {
    const { compositionRoot, countriesAndRegions } = useAppContext();
    const {
        selected: selectedCountries,
        onSelectedChange: onSelectedCountryChange,
        options: countryOptions,
    } = useMultiCountryOptionsV2({ showEurRegion: true, showSubRegions: true });

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

    const showNonComparativeMessageIfRequired = useCallback(
        (oldVisualization: Visualization | undefined, newsVisualization: Visualization | undefined) => {
            if (oldVisualization?.isComparative && !newsVisualization?.isComparative) {
                if (newsVisualization?.maxCountryFilter && newsVisualization?.maxCountryFilter === 1) {
                    setGlobalMessage({
                        text: i18n.t(`You can only select one country at a time with this indicator`, {
                            count: newsVisualization.minCountryFilter,
                        }),
                        type: "info",
                    });
                } else if (newsVisualization?.maxCountryFilter && newsVisualization?.maxCountryFilter >= 1) {
                    setGlobalMessage({
                        text: i18n.t(`You can only select {{count}} countries at a time with this indicator`, {
                            count: newsVisualization.maxCountryFilter,
                        }),
                        type: "info",
                    });
                }
            }
        },
        []
    );

    const onChangeCategoryFilter = useCallback(
        (value: string | undefined) => {
            const oldVisualization = visualizations.find(visualization => visualization.id === selectedIndicatorFilter);
            const newsVisualization = visualizations.find(visualization => visualization.id === value);
            const isEu27Selected = !!selectedCountries?.find(selectedCountry => selectedCountry === EU27);

            const maybeUpdatedCountrySelection = getUpdatedCountriesSelectionFilter(
                oldVisualization,
                newsVisualization,
                isEu27Selected,
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

            if (newsVisualization?.selectedYearsByDefault && !!newsVisualization.selectedYearsByDefault.length) {
                setSelectedYearFilter(newsVisualization.selectedYearsByDefault.map(year => year.id));
            } else if (!newsVisualization?.isComparative) {
                const allAllowedYears = newsVisualization?.allowedYears
                    ? allYearsFilters
                          .map(year => year.id)
                          .filter(id => newsVisualization?.allowedYears?.some(year => year.id === id))
                    : allYearsFilters.map(year => year.id);

                setSelectedYearFilter(allAllowedYears);
            } else if (newsVisualization?.isComparative) {
                setSelectedYearFilter(newsVisualization?.allowedYears?.map(year => year.id));
            }

            showNonComparativeMessageIfRequired(oldVisualization, newsVisualization);

            setMaxCountrySelection(newsVisualization?.maxCountryFilter);
            setIsOnlyEu27Comparison(!!newsVisualization?.isOnlyEu27Comparison);
            setSelectedIndicatorFilter(value);
            setShowVisualization(false);
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

    const onChangeYearFilter = useCallback((value: string[] | undefined) => {
        setSelectedYearFilter(value);

        setShowVisualization(false);
    }, []);

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
        const allowedYears = visualizations.find(
            visualization => visualization.id === selectedIndicatorFilter
        )?.allowedYears;

        // HERE: habrá charts comparativos que serán SOLO pre2019, habrá charts que serán SOLO LAY, y habrá charts que permitan ambos
        if (allowedYears) {
            setYearsFilters(
                allowedYears.map(year =>
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
                )
            );
        } else {
            setYearsFilters(allYearsFilters);
        }
    }, [indicatorFilters, selectedIndicatorFilter, visualizations]);

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
                showSubRegions: true,
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
    countriesAndRegions: Country[]
): string[] | undefined {
    if (
        (oldVisualization?.isComparative && !newsVisualization?.isComparative) ||
        (!newsVisualization?.isComparative && !newsVisualization?.hasEur27 && isEu27Selected)
    ) {
        return [];
    }

    if (newsVisualization?.isComparative && newsVisualization?.hasEur27) {
        return [...countriesAndRegions.map(c => c.id), EU27];
    }

    if (newsVisualization?.isComparative) {
        return countriesAndRegions.map(c => c.id).filter(id => id !== EU27);
    }
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
