import { useCallback, useMemo, useState } from "react";

import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { Id } from "../../../domain/entities/Ref";
import { SlideGraph } from "../../components/country-page/slider/SlideGraph";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import { LatestAvailable } from "../../../domain/entities/Year";
import { useAppContext } from "../../contexts/app-context";
import { RegionNumbersPanelContent } from "../../../domain/entities/region/RegionInfo";
import { Maybe } from "../../../types/utils";
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/region/Region";
import { manageBIHInCountries } from "./bosniaAndHerzegovinaHelper";

export type RegionNumbersState = {
    configs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    onResetTabs: () => void;
};

export function useRegionNumbers(
    selectedRegionId: Maybe<Id>,
    numbersPanelContent: Maybe<RegionNumbersPanelContent>
): RegionNumbersState {
    const { regions } = useAppContext();
    const [tabValue, setTabValue] = useState(0);
    const [expandedConfig, setExpandedConfig] = useState<VerticalTabConfig | AccordionConfig | undefined>(undefined);

    const handleTabChange = useCallback((_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }, []);

    const onResetTabs = useCallback(() => {
        if (tabValue !== 0) {
            setTabValue(0);
        }
        if (expandedConfig !== undefined) {
            setExpandedConfig(undefined);
        }
    }, [expandedConfig, tabValue]);

    const selectedRegion = useMemo(
        () => regions.find(region => region.id === selectedRegionId),
        [regions, selectedRegionId]
    );

    const configs: (VerticalTabConfig | AccordionConfig)[] = useMemo(
        () =>
            selectedRegionId && numbersPanelContent && selectedRegion
                ? [
                      {
                          tab: 0,
                          tabTitle: numbersPanelContent.panelOneTitle,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              hasNarrowerText: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "dbc87Ljw8uN",
                                      visualizationName: numbersPanelContent.panelOneGraphOneTitle
                                          ? numbersPanelContent.panelOneGraphOneTitle
                                          : VisualizationsSeeds["dbc87Ljw8uN"]?.regionalPageName ||
                                            VisualizationsSeeds["dbc87Ljw8uN"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS
                                              ? manageBIHInCountries("addSubRegionsAndFilterBIH", [
                                                    ...(selectedRegion.countries || []),
                                                ])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelOneGraphOneText,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 1,
                          tabTitle: numbersPanelContent.panelTwoTitle,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              hasNarrowerText: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "kIpnMBaBvZ9",
                                      visualizationName: numbersPanelContent.panelTwoGraphOneTitle
                                          ? numbersPanelContent.panelTwoGraphOneTitle
                                          : VisualizationsSeeds["kIpnMBaBvZ9"]?.regionalPageName ||
                                            VisualizationsSeeds["kIpnMBaBvZ9"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS
                                              ? manageBIHInCountries("addSubRegionsAndFilterBIH", [
                                                    ...(selectedRegion.countries || []),
                                                ])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelTwoGraphOneText,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 2,
                          tabTitle: numbersPanelContent.panelThreeTitle,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              hasNarrowerText: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "GimM6ANOKhd",
                                      visualizationName: numbersPanelContent.panelThreeGraphOneTitle
                                          ? numbersPanelContent.panelThreeGraphOneTitle
                                          : VisualizationsSeeds["GimM6ANOKhd"]?.regionalPageName ||
                                            VisualizationsSeeds["GimM6ANOKhd"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS
                                              ? manageBIHInCountries("addSubRegionsAndFilterBIH", [
                                                    ...(selectedRegion.countries || []),
                                                ])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelThreeGraphOneText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "WDUV9ZrJiNC",
                                      visualizationName: numbersPanelContent.panelThreeGraphTwoTitle
                                          ? numbersPanelContent.panelThreeGraphTwoTitle
                                          : VisualizationsSeeds["WDUV9ZrJiNC"]?.regionalPageName ||
                                            VisualizationsSeeds["WDUV9ZrJiNC"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS
                                              ? manageBIHInCountries("addSubRegionsAndFilterBIH", [
                                                    ...(selectedRegion.countries || []),
                                                ])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelThreeGraphTwoText,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 3,
                          tabTitle: numbersPanelContent.panelFourTitle,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              hasNarrowerText: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "VB7bdJ8ZXya",
                                      visualizationName: numbersPanelContent.panelFourGraphOneTitle
                                          ? numbersPanelContent.panelFourGraphOneTitle
                                          : VisualizationsSeeds["VB7bdJ8ZXya"]?.regionalPageName ||
                                            VisualizationsSeeds["VB7bdJ8ZXya"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS
                                              ? manageBIHInCountries("addSubRegionsAndFilterBIH", [
                                                    ...(selectedRegion.countries || []),
                                                ])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelFourGraphOneText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "mcNfvQaVbfy",
                                      visualizationName: numbersPanelContent.panelFourGraphTwoTitle
                                          ? numbersPanelContent.panelFourGraphTwoTitle
                                          : VisualizationsSeeds["mcNfvQaVbfy"]?.regionalPageName ||
                                            VisualizationsSeeds["mcNfvQaVbfy"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS
                                              ? manageBIHInCountries("addSubRegionsAndFilterBIH", [
                                                    ...(selectedRegion.countries || []),
                                                ])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelFourGraphTwoText,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 4,
                          tabTitle: numbersPanelContent.panelFiveTitle,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              hasNarrowerText: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "EtHaEt6bnm5_nlYSkEMZxgN",
                                      visualizationName: numbersPanelContent.panelFiveGraphOneTitle
                                          ? numbersPanelContent.panelFiveGraphOneTitle
                                          : VisualizationsSeeds["EtHaEt6bnm5_nlYSkEMZxgN"]?.regionalPageName ||
                                            VisualizationsSeeds["EtHaEt6bnm5_nlYSkEMZxgN"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS ||
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.EUROPEAN_REGION
                                              ? manageBIHInCountries("filterBIH", [...(selectedRegion.countries || [])])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelFiveGraphOneText,
                                      sharedYAxisMax: 25,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "AophAEpx5e0_BOcLONPSyYS",
                                      visualizationName: numbersPanelContent.panelFiveGraphTwoTitle
                                          ? numbersPanelContent.panelFiveGraphTwoTitle
                                          : VisualizationsSeeds["AophAEpx5e0_BOcLONPSyYS"]?.regionalPageName ||
                                            VisualizationsSeeds["AophAEpx5e0_BOcLONPSyYS"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS ||
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.EUROPEAN_REGION
                                              ? manageBIHInCountries("filterBIH", [...(selectedRegion.countries || [])])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelFiveGraphTwoText,
                                      sharedYAxisMax: 25,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "MfLZYD6QCPy",
                                      visualizationName: numbersPanelContent.panelFiveGraphThreeTitle
                                          ? numbersPanelContent.panelFiveGraphThreeTitle
                                          : VisualizationsSeeds["MfLZYD6QCPy"]?.regionalPageName ||
                                            VisualizationsSeeds["MfLZYD6QCPy"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries:
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.WESTERN_BALKANS ||
                                          selectedRegion.id === ORG_UNIT_GROUP_IDS.EUROPEAN_REGION
                                              ? manageBIHInCountries("filterBIH", [...(selectedRegion.countries || [])])
                                              : [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelFiveGraphThreeText,
                                      needToKnowLatestAvailableYearInChart: true,
                                      sharedYAxisMax: 25,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 5,
                          tabTitle: numbersPanelContent.panelSixTitle,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              hasNarrowerText: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "twyY1ulr7uD",
                                      visualizationName: numbersPanelContent.panelSixGraphOneTitle
                                          ? numbersPanelContent.panelSixGraphOneTitle
                                          : VisualizationsSeeds["twyY1ulr7uD"]?.regionalPageName ||
                                            VisualizationsSeeds["twyY1ulr7uD"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelSixGraphOneText,
                                      filterByLatestAvailableYearInRegion: true,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "CdqVV1Ib0XS",
                                      visualizationName: numbersPanelContent.panelSixGraphTwoTitle
                                          ? numbersPanelContent.panelSixGraphTwoTitle
                                          : VisualizationsSeeds["CdqVV1Ib0XS"]?.regionalPageName ||
                                            VisualizationsSeeds["CdqVV1Ib0XS"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelSixGraphTwoText,
                                      filterByLatestAvailableYearInRegion: true,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "fnOIi0bdISn",
                                      visualizationName: numbersPanelContent.panelSixGraphThreeTitle
                                          ? numbersPanelContent.panelSixGraphThreeTitle
                                          : VisualizationsSeeds["fnOIi0bdISn"]?.regionalPageName ||
                                            VisualizationsSeeds["fnOIi0bdISn"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelSixGraphThreeText,
                                      visualizationIdInIndicatorExplorer: "mUjcWO90CRr",
                                      needToKnowLatestAvailableYearInChart: true,
                                  },
                                  {
                                      visualizationId: "B4CnzUqVR3n",
                                      visualizationName: numbersPanelContent.panelSixGraphFourTitle
                                          ? numbersPanelContent.panelSixGraphFourTitle
                                          : VisualizationsSeeds["B4CnzUqVR3n"]?.regionalPageName ||
                                            VisualizationsSeeds["B4CnzUqVR3n"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      text: numbersPanelContent.panelSixGraphFourText,
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      filterByLatestAvailableYearInRegion: true,
                                      visualizationIdInIndicatorExplorer: "iMI82inOBiD",
                                  },
                              ],
                          },
                      },
                  ]
                : [],
        [selectedRegionId, numbersPanelContent, selectedRegion]
    );

    const handleAccordionChange = useCallback(
        (_event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => {
            const sliderConfigSelected = isExpanded ? configs.find(config => config.tab === tabId) : undefined;
            setExpandedConfig(sliderConfigSelected);
        },
        [configs]
    );

    return {
        configs: configs,
        tabValue: tabValue,
        expandedConfig: expandedConfig,
        handleAccordionChange: handleAccordionChange,
        handleTabChange: handleTabChange,
        onResetTabs: onResetTabs,
    };
}
