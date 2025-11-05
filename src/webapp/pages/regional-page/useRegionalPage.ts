import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { useRegionalPageFilter } from "./useRegionalPageFilter";
import i18n from "../../../locales";
import { Country } from "../../../domain/entities/Country";
import { useAppContext } from "../../contexts/app-context";
import { countriesToGeoJson } from "../../components/home/map/useMap";
import { useHistory } from "react-router-dom";
import { useRegionalPageContent } from "./useRegionalPageContent";
import { RegionMainMapPanelContent } from "../../../domain/entities/region/RegionInfo";
import { ORG_UNIT_GROUP_IDS, Region } from "../../../domain/entities/region/Region";
import { RegionNumbersState, useRegionNumbers } from "./useRegionNumbers";
import { RegionalPolicyChecklistState, useRegionalPolicyChecklist } from "./useRegionalPolicyChecklist";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { NumbersSection } from "./NumbersSection";
import { PolicyChecklistSection } from "./PolicyChecklistSection";
import { CountryResources } from "../../components/country-page/CountryResources";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import {
    formatCountryOrRegionParamName,
    parseCountryOrRegionParamToName,
} from "../../utils/formatCountryOrRegionParamName";
import { GapsInCoverageSection } from "./GapsInCoverageSection";
import { RegionalGapsInCoverageState, useRegionalGapsInCoverage } from "./useRegionalGapsInCoverage";

export type RegionalMenuItem = "regionMap" | "numbers" | "gapsInCoverage" | "policyChecklist" | "resources" | "experts";

export type RegionalMenuItemConfig = {
    id: RegionalMenuItem;
    label: string;
    ref: MutableRefObject<HTMLElement | null>;
};

export type RegionalFilter = {
    regionOptions: Option<Id>[];
    selectedRegionId: Id | undefined;
    selectedRegion: Region | undefined;
    onRegionChange: (value: Id) => void;
};

export type RegionMapState = {
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    mainPanelContent: RegionMainMapPanelContent | undefined;
};

export type RegionalPageState = {
    regionFilter: RegionalFilter;
    isSmallScreen: boolean;
    refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>>;
    menuItemsConfig: RegionalMenuItemConfig[];
    handleHeaderItemClick: (item: RegionalMenuItem) => void;
    regionMap: RegionMapState;
    policyChecklist: RegionalPolicyChecklistState & {
        content: {
            textSectionLeft: string;
            textSectionRight: string;
        };
    };
    regionNumbers: RegionNumbersState;
    gapsInCoverage: RegionalGapsInCoverageState;
    highlightedISO3Countries: string[];
    isEUorEuropeanRegion: boolean;
    goTo: (link: string) => void;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    expandedSectionsAccordion: AccordionConfig | undefined;
    sectionsAccordionConfig: AccordionConfig[];
};

export function useRegionalPage(): RegionalPageState {
    const isSmallScreen = useIsSmallScreen();
    const history = useHistory();
    const { regions, countries } = useAppContext();
    const { regionOptions, selectedRegion: selectedRegionId, onRegionChange } = useRegionalPageFilter();
    const { content, isLoading } = useRegionalPageContent(selectedRegionId);
    const regionNumbers = useRegionNumbers(selectedRegionId, content?.numbersPanelContent);
    const gapsInCoverage = useRegionalGapsInCoverage(selectedRegionId, content?.gapsInCoverageContent);
    const policyChecklist = useRegionalPolicyChecklist();

    const [markers, setMarkers] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Country>>({
        type: "FeatureCollection",
        features: [],
    });
    const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
    const [highlightedISO3Countries, setHighlightedISO3Countries] = useState<string[]>([]);
    const [expandedSectionsAccordion, setExpandedSectionsAccordion] = useState<AccordionConfig | undefined>(undefined);

    const regionMapRef = useRef<HTMLElement | null>(null);
    const numbersRef = useRef<HTMLElement | null>(null);
    const gapsInCoverageRef = useRef<HTMLElement | null>(null);
    const policyChecklistRef = useRef<HTMLElement | null>(null);
    const resourcesRef = useRef<HTMLElement | null>(null);
    const expertsRef = useRef<HTMLElement | null>(null);

    const refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>> = useMemo(
        () => ({
            regionMap: regionMapRef,
            numbers: numbersRef,
            gapsInCoverage: gapsInCoverageRef,
            policyChecklist: policyChecklistRef,
            resources: resourcesRef,
            experts: expertsRef,
        }),
        []
    );

    const isEUorEuropeanRegion = useMemo(
        () =>
            selectedRegionId === ORG_UNIT_GROUP_IDS.EUROPEAN_UNION ||
            selectedRegionId === ORG_UNIT_GROUP_IDS.EUROPEAN_REGION,
        [selectedRegionId]
    );

    const menuItemsConfig: RegionalMenuItemConfig[] = useMemo(() => {
        return [
            { id: "regionMap", label: i18n.t("The region at a glance"), ref: refs.regionMap },
            { id: "numbers", label: i18n.t("Numbers"), ref: refs.numbers },
            { id: "gapsInCoverage", label: i18n.t("Gaps in coverage"), ref: refs.gapsInCoverage },
            { id: "policyChecklist", label: i18n.t("Policy checklist"), ref: refs.policyChecklist },
            { id: "resources", label: i18n.t("Resources"), ref: refs.resources },
            { id: "experts", label: i18n.t("Experts"), ref: refs.experts },
        ];
    }, [refs.experts, refs.gapsInCoverage, refs.numbers, refs.policyChecklist, refs.regionMap, refs.resources]);

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const regionNameInFilter = searchParams.get("region");
        const regionName = regionNameInFilter ? parseCountryOrRegionParamToName(regionNameInFilter) : undefined;

        const regionIdInFilter = regionName ? regionOptions.find(option => option.text === regionName)?.value : null;

        return {
            region: regionIdInFilter ? regionIdInFilter : undefined,
        };
    }, [history.location.search, regionOptions]);

    const resetSelectedValues = useCallback(() => {
        policyChecklist.onSelectChecklistItem(undefined);
        setExpandedSectionsAccordion(undefined);
        regionNumbers.onResetTabs();
        gapsInCoverage.onResetTabs();
    }, [policyChecklist, regionNumbers, gapsInCoverage]);

    const handleRegionChange = useCallback(
        (newRegion: Id) => {
            const searchParams = new URLSearchParams(history.location.search);
            const newRegionName = regionOptions.find(option => option.value === newRegion)?.text;
            const regionNameInFilter = newRegionName ? formatCountryOrRegionParamName(newRegionName) : undefined;

            if (regionNameInFilter) {
                searchParams.set("region", regionNameInFilter);
            }
            history.push({ search: searchParams.toString() });

            const region = regions.find(region => region.id === newRegion);
            const countryIdsInRegion = region?.countries || [];

            const countriesWithSummary = countries.filter(
                country => countryIdsInRegion.includes(country.id) && country.summary
            );

            const iso3CountriesInRegion = countries
                .filter(country => countryIdsInRegion.includes(country.id) && country.iso3Code)
                .map(country => country.iso3Code);

            setMarkers(countriesToGeoJson(countriesWithSummary));
            setHighlightedISO3Countries(iso3CountriesInRegion);
            setSelectedRegion(region);
            onRegionChange(newRegion);
            resetSelectedValues();
        },
        [countries, history, onRegionChange, regionOptions, regions, resetSelectedValues]
    );

    useEffect(() => {
        if (filterInParams.region && filterInParams.region !== selectedRegionId) {
            handleRegionChange(filterInParams.region);
        }
    }, [filterInParams.region, handleRegionChange, selectedRegionId]);

    const handleHeaderItemClick = useCallback(
        (item: RegionalMenuItem) => {
            const targetRef = refs[item];
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        [refs]
    );

    const goTo = useCallback(
        (link: string) => {
            history.push(link);
        },
        [history]
    );

    const sectionsAccordionConfig: AccordionConfig[] = useMemo(
        () => [
            {
                tab: 0,
                tabTitle: i18n.t("Numbers: financial hardship, unmet need and spending on health"),
                isGradientColor: true,
                hasExpandIcon: true,
                Component: NumbersSection,
                ref: refs.numbers,
                props: {
                    configs: regionNumbers.configs,
                    tabValue: regionNumbers.tabValue,
                    expandedConfig: regionNumbers.expandedConfig,
                    handleAccordionChange: regionNumbers.handleAccordionChange,
                    handleTabChange: regionNumbers.handleTabChange,
                    isSmallScreen: isSmallScreen,
                },
            },
            {
                tab: 1,
                tabTitle: i18n.t("The story behind the numbers: gaps in coverage"),
                isGradientColor: true,
                hasExpandIcon: true,
                Component: GapsInCoverageSection,
                ref: refs.gapsInCoverage,
                props: {
                    configs: gapsInCoverage.configs,
                    tabValue: gapsInCoverage.tabValue,
                    expandedConfig: gapsInCoverage.expandedConfig,
                    handleAccordionChange: gapsInCoverage.handleAccordionChange,
                    handleTabChange: gapsInCoverage.handleTabChange,
                    isSmallScreen: isSmallScreen,
                },
            },
            {
                tab: 2,
                tabTitle: i18n.t("Progress is possible: a checklist for policy-makers"),
                isGradientColor: true,
                hasExpandIcon: true,
                Component: PolicyChecklistSection,
                ref: refs.policyChecklist,
                props: {
                    textSectionLeft: content?.policyChecklistContent.textSectionLeft || "",
                    textSectionRight: content?.policyChecklistContent.textSectionRight || "",
                    checklist: policyChecklist?.checklist,
                    filteredCountryExperiences: policyChecklist?.filteredCountryExperiences,
                    selectedChecklistItem: policyChecklist.selectedChecklistItem,
                    onSelectChecklistItem: policyChecklist.onSelectChecklistItem,
                    isLoading: policyChecklist.isLoading,
                    isSmallScreen: isSmallScreen,
                },
            },
            {
                tab: 3,
                tabTitle: i18n.t("Resources"),
                onTitleClick: isEUorEuropeanRegion
                    ? () => {
                          goTo("/resources");
                      }
                    : undefined,
                isSecondaryGradientColor: true,
                hasExpandIcon: !isEUorEuropeanRegion,
                Component: isEUorEuropeanRegion ? null : CountryResources,
                disabled: isEUorEuropeanRegion,
                ref: refs.resources,
                props: { countryIds: selectedRegion?.countries || [], isRegionalPage: true },
            },
            {
                tab: 4,
                tabTitle: i18n.t("Expert network"),
                onTitleClick: isEUorEuropeanRegion
                    ? () => {
                          goTo("/about");
                      }
                    : undefined,
                isSecondaryGradientColor: true,
                hasExpandIcon: !isEUorEuropeanRegion,
                Component: isEUorEuropeanRegion ? null : CountryExpert,
                disabled: isEUorEuropeanRegion,
                ref: refs.experts,
                props: { countryIds: selectedRegion?.countries || [], isRegionalPage: true },
            },
        ],
        [
            content?.policyChecklistContent.textSectionLeft,
            content?.policyChecklistContent.textSectionRight,
            gapsInCoverage.configs,
            gapsInCoverage.expandedConfig,
            gapsInCoverage.handleAccordionChange,
            gapsInCoverage.handleTabChange,
            gapsInCoverage.tabValue,
            goTo,
            isEUorEuropeanRegion,
            isSmallScreen,
            policyChecklist?.checklist,
            policyChecklist?.filteredCountryExperiences,
            policyChecklist.isLoading,
            policyChecklist.onSelectChecklistItem,
            policyChecklist.selectedChecklistItem,
            refs.experts,
            refs.gapsInCoverage,
            refs.numbers,
            refs.policyChecklist,
            refs.resources,
            regionNumbers.configs,
            regionNumbers.expandedConfig,
            regionNumbers.handleAccordionChange,
            regionNumbers.handleTabChange,
            regionNumbers.tabValue,
            selectedRegion?.countries,
        ]
    );

    const handleAccordionChange = useCallback(
        (_event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => {
            const sliderConfigSelected = isExpanded
                ? sectionsAccordionConfig.find(config => config.tab === tabId)
                : undefined;
            setExpandedSectionsAccordion(sliderConfigSelected);
        },
        [sectionsAccordionConfig]
    );

    return {
        isSmallScreen: isSmallScreen,
        menuItemsConfig: menuItemsConfig,
        refs: refs,
        regionFilter: {
            regionOptions: regionOptions,
            selectedRegionId: selectedRegionId,
            onRegionChange: handleRegionChange,
            selectedRegion: selectedRegion,
        },
        handleHeaderItemClick: handleHeaderItemClick,
        regionMap: {
            markers: markers,
            mainPanelContent: content?.mainMapPanelContent,
        },
        policyChecklist: {
            content: {
                textSectionLeft: content?.policyChecklistContent.textSectionLeft || "",
                textSectionRight: content?.policyChecklistContent.textSectionRight || "",
            },
            checklist: policyChecklist.checklist,
            filteredCountryExperiences: policyChecklist.filteredCountryExperiences,
            selectedChecklistItem: policyChecklist.selectedChecklistItem,
            onSelectChecklistItem: policyChecklist.onSelectChecklistItem,
            isLoading: isLoading || policyChecklist.isLoading,
        },
        regionNumbers: regionNumbers,
        gapsInCoverage: gapsInCoverage,
        highlightedISO3Countries: highlightedISO3Countries,
        isEUorEuropeanRegion: isEUorEuropeanRegion,
        goTo: goTo,
        handleAccordionChange: handleAccordionChange,
        expandedSectionsAccordion: expandedSectionsAccordion,
        sectionsAccordionConfig: sectionsAccordionConfig,
    };
}
