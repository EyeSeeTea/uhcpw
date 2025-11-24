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
            downloadFile: string;
            hasDownloadFile: boolean;
        };
    };
    regionNumbers: RegionNumbersState;
    gapsInCoverage: RegionalGapsInCoverageState;
    highlightedISO3Countries: string[];
    isEUorEuropeanRegion: boolean;
    isEuropeanRegion: boolean;
    goTo: (link: string) => void;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    expandedSectionsAccordion: AccordionConfig | undefined;
    sectionsAccordionConfig: AccordionConfig[];
    setPendingScrollTab: (tab: number | null) => void;
    pendingScrollTab: number | null;
    isLoadingContent: boolean;
    sidePanelWidth: number | undefined;
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
    const [pendingScrollTab, setPendingScrollTab] = useState<number | null>(null);
    const [sidePanelWidth, setSidePanelWidth] = useState<number | undefined>(undefined);

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

    const isEuropeanRegion = useMemo(() => selectedRegionId === ORG_UNIT_GROUP_IDS.EUROPEAN_REGION, [selectedRegionId]);

    const menuItemsConfig: RegionalMenuItemConfig[] = useMemo(() => {
        const resourcesAndExpertsSections: RegionalMenuItemConfig[] = isEuropeanRegion
            ? []
            : [
                  {
                      id: "resources",
                      label: i18n.t("Resources"),
                      ref: refs.resources,
                  },
                  {
                      id: "experts",
                      label: i18n.t("Experts"),
                      ref: refs.experts,
                  },
              ];
        return [
            { id: "regionMap", label: i18n.t("The region at a glance"), ref: refs.regionMap },
            { id: "numbers", label: i18n.t("Numbers"), ref: refs.numbers },
            { id: "gapsInCoverage", label: i18n.t("Gaps in coverage"), ref: refs.gapsInCoverage },
            { id: "policyChecklist", label: i18n.t("Policy checklist"), ref: refs.policyChecklist },
            ...resourcesAndExpertsSections,
        ];
    }, [
        refs.experts,
        refs.gapsInCoverage,
        refs.numbers,
        refs.policyChecklist,
        refs.regionMap,
        refs.resources,
        isEuropeanRegion,
    ]);

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const regionNameInFilter = searchParams.get("region");
        const regionName = regionNameInFilter ? parseCountryOrRegionParamToName(regionNameInFilter, true) : undefined;

        const regionIdInFilter = regionName ? regionOptions.find(option => option.text === regionName)?.value : null;

        return {
            region: regionIdInFilter ? regionIdInFilter : undefined,
        };
    }, [history.location.search, regionOptions]);

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
        },
        [countries, history, onRegionChange, regionOptions, regions]
    );

    useEffect(() => {
        if (filterInParams.region && filterInParams.region !== selectedRegionId) {
            handleRegionChange(filterInParams.region);
        }
    }, [filterInParams.region, handleRegionChange, selectedRegionId]);

    const goTo = useCallback(
        (link: string) => {
            history.push(link);
        },
        [history]
    );

    const sectionsAccordionConfig: AccordionConfig[] = useMemo(() => {
        const resourcesAndExpertsSections = isEuropeanRegion
            ? []
            : [
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
              ];

        return [
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
                    sidePanelWidth: sidePanelWidth,
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
                    setSidePanelWidth: setSidePanelWidth,
                    sidePanelWidth: sidePanelWidth,
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
                    downloadFile: content?.policyChecklistContent.downloadFile || "",
                    hasDownloadFile: content?.policyChecklistContent.hasDownloadFile || false,
                },
            },
            ...resourcesAndExpertsSections,
        ];
    }, [
        isEuropeanRegion,
        isEUorEuropeanRegion,
        refs.resources,
        refs.experts,
        refs.numbers,
        refs.gapsInCoverage,
        refs.policyChecklist,
        selectedRegion?.countries,
        regionNumbers.configs,
        regionNumbers.tabValue,
        regionNumbers.expandedConfig,
        regionNumbers.handleAccordionChange,
        regionNumbers.handleTabChange,
        isSmallScreen,
        sidePanelWidth,
        gapsInCoverage.configs,
        gapsInCoverage.tabValue,
        gapsInCoverage.expandedConfig,
        gapsInCoverage.handleAccordionChange,
        gapsInCoverage.handleTabChange,
        content?.policyChecklistContent.textSectionLeft,
        content?.policyChecklistContent.textSectionRight,
        content?.policyChecklistContent.downloadFile,
        content?.policyChecklistContent.hasDownloadFile,
        policyChecklist?.checklist,
        policyChecklist?.filteredCountryExperiences,
        policyChecklist.selectedChecklistItem,
        policyChecklist.onSelectChecklistItem,
        policyChecklist.isLoading,
        goTo,
    ]);

    const handleHeaderItemClick = useCallback(
        (item: RegionalMenuItem) => {
            const ref = refs[item];
            if (isSmallScreen && ref) {
                ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setExpandedSectionsAccordion(undefined);
            }

            if (item === "regionMap") {
                const targetRef = refs.regionMap;
                targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setExpandedSectionsAccordion(undefined);
                return;
            }

            const sectionToExpand = getSectionAccordionConfigByHeaderItemId(item, sectionsAccordionConfig);
            if (sectionToExpand) {
                if (sectionToExpand.tab !== expandedSectionsAccordion?.tab) {
                    setExpandedSectionsAccordion(sectionToExpand);
                    setPendingScrollTab(sectionToExpand.tab);
                } else {
                    sectionToExpand.ref?.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                    setPendingScrollTab(null);
                }
            } else {
                setPendingScrollTab(null);
            }
        },
        [expandedSectionsAccordion?.tab, isSmallScreen, refs, sectionsAccordionConfig]
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
                downloadFile: content?.policyChecklistContent.downloadFile || "",
                hasDownloadFile: content?.policyChecklistContent.hasDownloadFile || false,
            },
            checklist: policyChecklist.checklist,
            filteredCountryExperiences: policyChecklist.filteredCountryExperiences,
            selectedChecklistItem: policyChecklist.selectedChecklistItem,
            onSelectChecklistItem: policyChecklist.onSelectChecklistItem,
            onCleanSelection: policyChecklist.onCleanSelection,
            isLoading: policyChecklist.isLoading,
        },
        regionNumbers: regionNumbers,
        gapsInCoverage: gapsInCoverage,
        highlightedISO3Countries: highlightedISO3Countries,
        isEUorEuropeanRegion: isEUorEuropeanRegion,
        isEuropeanRegion: isEuropeanRegion,
        goTo: goTo,
        handleAccordionChange: handleAccordionChange,
        expandedSectionsAccordion: expandedSectionsAccordion,
        sectionsAccordionConfig: sectionsAccordionConfig,
        setPendingScrollTab: setPendingScrollTab,
        pendingScrollTab: pendingScrollTab,
        isLoadingContent: isLoading,
        sidePanelWidth: sidePanelWidth,
    };
}

function getSectionAccordionConfigByHeaderItemId(
    item: RegionalMenuItem,
    sectionsAccordionConfig: AccordionConfig[]
): AccordionConfig | undefined {
    switch (item) {
        case "numbers":
            return sectionsAccordionConfig[0];
        case "gapsInCoverage":
            return sectionsAccordionConfig[1];
        case "policyChecklist":
            return sectionsAccordionConfig[2];
        case "resources":
            return sectionsAccordionConfig[3];
        case "experts":
            return sectionsAccordionConfig[4];
        default:
            return undefined;
    }
}
