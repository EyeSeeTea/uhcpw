import _ from "lodash";

import i18n from "../../../locales";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { TreeOption } from "../../components/tree-selector/TreeSelector";
import { LatestAvailable, LatestCOVID19, Year } from "../../../domain/entities/Year";
import {
    BosniaAndHerzegovina,
    Country,
    FederationOfBosniaAndHerzegovina,
    RepublikaSrpska,
} from "../../../domain/entities/Country";
import {
    sortedCategoryNames,
    sortedCharts,
    sortedSubcategoryNames,
} from "../../../data/repositories/indicator-explorer/seed/utils";
import { AnalyticsEvent } from "../../../domain/entities/AnalyticsEvent";
import { Indicator } from "../../../domain/entities/indicator-explorer/Indicator";
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/Region";
import { Id } from "../../../domain/entities/Ref";
import { AVERAGES_REGIONS_PARENT } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { IndicatorOption } from "./IndicatorExplorerState";
import { ALL_NODE_ID } from "../../components/tree-selector/useTreeSelector";

export const allYearsItem = { id: ALL_NODE_ID, name: i18n.t("All years"), parents: [] };

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

export function getDisabledRegionIds(
    countryAndRegionsOptions: TreeOption[],
    selectedIndicator: Indicator | undefined
): Id[] {
    if (!selectedIndicator) return [];

    const regionOptions = countryAndRegionsOptions.filter(
        (option: TreeOption) => option.parents.length === 1 && option.parents[0]?.id === AVERAGES_REGIONS_PARENT.id
    );
    const { hasEURegion, hasEECARegion, hasWesternBalkansRegion, hasEUCandidatesRegion, hasEuropeanRegion } =
        selectedIndicator;

    const activeRegionIds: Id[] = _.compact([
        hasEURegion ? ORG_UNIT_GROUP_IDS.EUROPEAN_UNION : null,
        hasEECARegion ? ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA : null,
        hasWesternBalkansRegion ? ORG_UNIT_GROUP_IDS.WESTERN_BALKANS : null,
        hasEUCandidatesRegion ? ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES : null,
        hasEuropeanRegion ? ORG_UNIT_GROUP_IDS.EUROPEAN_REGION : null,
    ]);

    return regionOptions.reduce((currentDisabledIds: Id[], option: TreeOption): Id[] => {
        return activeRegionIds.includes(option.id) ? currentDisabledIds : [...currentDisabledIds, option.id];
    }, []);
}

export function getCountriesAndRegionsToBeDisabled(
    countryAndRegionsOptions: TreeOption[],
    newSelectedCountriesAndRegions: Id[] | undefined,
    disabledRegionIds: Id[]
): string[] {
    const countriesAndRegionsToDisabled = countryAndRegionsOptions
        .map(op => op.id)
        .filter(id => !newSelectedCountriesAndRegions?.includes(id) || disabledRegionIds.includes(id));

    const subregionsToDisabled = countryAndRegionsOptions
        .flatMap(countryOption => (countryOption.children ? countryOption.children : []))
        .map(op => op.id)
        .filter(id => !newSelectedCountriesAndRegions?.includes(id));

    return [...countriesAndRegionsToDisabled, ...subregionsToDisabled];
}

export function buildIndicatorOptionsAndSortByCategories(indicators: Indicator[]): IndicatorOption[] {
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

export function getUpdatedCountriesSelectionFilter(
    oldIndicator: Indicator | undefined,
    newIndicator: Indicator | undefined,
    selectedCountriesAndRegions: string[] | undefined,
    countriesAndSubregions: Country[]
): string[] | undefined {
    const isRegionSelected = (regionId: Id): boolean =>
        !!selectedCountriesAndRegions?.some(selectedCountry => selectedCountry === regionId);

    const isMoreThanOneCountrySelected = selectedCountriesAndRegions?.length && selectedCountriesAndRegions.length > 1;

    const isOldComparativeAndNewNotComparative = oldIndicator?.isComparative && !newIndicator?.isComparative;

    const areOldAndNewComparative = oldIndicator?.isComparative && newIndicator?.isComparative;
    const areOldAndNewNotComparative = !oldIndicator?.isComparative && !newIndicator?.isComparative;

    const isNewSingleCountrySelection = newIndicator?.maxCountryFilter === 1;

    const isInvalidRegionSelected = () => {
        return (
            (isRegionSelected(ORG_UNIT_GROUP_IDS.EUROPEAN_UNION) && !newIndicator?.hasEURegion) ||
            (isRegionSelected(ORG_UNIT_GROUP_IDS.EUROPEAN_REGION) && !newIndicator?.hasEuropeanRegion) ||
            (isRegionSelected(ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA) && !newIndicator?.hasEECARegion) ||
            (isRegionSelected(ORG_UNIT_GROUP_IDS.WESTERN_BALKANS) && !newIndicator?.hasWesternBalkansRegion) ||
            (isRegionSelected(ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES) && !newIndicator?.hasEUCandidatesRegion)
        );
    };

    if (
        isOldComparativeAndNewNotComparative ||
        (isNewSingleCountrySelection && isMoreThanOneCountrySelected) ||
        isInvalidRegionSelected()
    ) {
        return [];
    }

    if (areOldAndNewNotComparative) {
        return handleBosniaAndHerzegovina(oldIndicator, newIndicator, selectedCountriesAndRegions);
    }

    if (areOldAndNewComparative && selectedCountriesAndRegions?.length) {
        const totalCountries =
            countriesAndSubregions.length +
            (oldIndicator?.hasEURegion ? 1 : 0) +
            (oldIndicator?.hideBosniaAndHerzegovinaRegions ? -2 : 0);
        const areAllCountriesSelected = selectedCountriesAndRegions.length === totalCountries;

        if (!areAllCountriesSelected) {
            const newSelection = newIndicator?.hasEURegion
                ? selectedCountriesAndRegions
                : selectedCountriesAndRegions.filter(country => country !== ORG_UNIT_GROUP_IDS.EUROPEAN_UNION);
            if (newSelection.length) return handleBosniaAndHerzegovina(oldIndicator, newIndicator, newSelection);
        }
    }

    if (newIndicator?.isComparative) {
        const countriesToSelect = handleBosniaAndHerzegovina(
            oldIndicator,
            newIndicator,
            countriesAndSubregions.map(c => c.id)
        );
        return newIndicator?.hasEURegion
            ? [...countriesToSelect, ORG_UNIT_GROUP_IDS.EUROPEAN_UNION]
            : countriesToSelect;
    }
}

export function handleBosniaAndHerzegovina(
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

export function getDisabledCountriesFilter(
    newIndicator: Indicator | undefined,
    selectedCountriesFilter: string[] | undefined,
    countryAndRegionsOptions: TreeOption[]
): string[] {
    const areAllPossibleCountriesSelected = (selectedCountriesFilter?.length || 0) === newIndicator?.maxCountryFilter;

    if (areAllPossibleCountriesSelected) {
        const disabledRegionIds = getDisabledRegionIds(countryAndRegionsOptions, newIndicator);
        const countriesToDisabled = countryAndRegionsOptions
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id) || disabledRegionIds.includes(id));

        const subregionsToDisabled = countryAndRegionsOptions
            .flatMap(countryOption => (countryOption.children ? countryOption.children : []))
            .map(op => op.id)
            .filter(id => !selectedCountriesFilter?.includes(id));
        return [...countriesToDisabled, ...subregionsToDisabled];
    } else {
        return getDisabledRegionIds(countryAndRegionsOptions, newIndicator);
    }
}

export function getSelectedYearsInFilter(newIndicator: Indicator | undefined): string[] | undefined {
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

export function getYearOptionsInFilter(
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

export function generateBulkAnalyticsEvents(args: {
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
