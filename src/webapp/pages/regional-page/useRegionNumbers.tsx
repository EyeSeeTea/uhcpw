import { useCallback, useMemo, useState } from "react";

import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { Id } from "../../../domain/entities/Ref";
import { SlideGraph } from "../../components/country-page/slider/SlideGraph";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { LatestAvailable } from "../../../domain/entities/Year";
import { useAppContext } from "../../contexts/app-context";
import { RegionNumbersPanelContent } from "../../../domain/entities/region/RegionInfo";
import { Maybe } from "../../../types/utils";

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
                              title: numbersPanelContent.panelOneTitle,
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "kIpnMBaBvZ9",
                                      visualizationName:
                                          VisualizationsSeeds["kIpnMBaBvZ9"]?.regionalPageName ||
                                          VisualizationsSeeds["kIpnMBaBvZ9"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
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
                              title: numbersPanelContent.panelTwoTitle,
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "dbc87Ljw8uN",
                                      visualizationName:
                                          VisualizationsSeeds["dbc87Ljw8uN"]?.regionalPageName ||
                                          VisualizationsSeeds["dbc87Ljw8uN"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
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
                              title: numbersPanelContent.panelThreeTitle,
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "GimM6ANOKhd",
                                      visualizationName:
                                          VisualizationsSeeds["GimM6ANOKhd"]?.regionalPageName ||
                                          VisualizationsSeeds["GimM6ANOKhd"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelThreeGraphOneText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "WDUV9ZrJiNC",
                                      visualizationName:
                                          VisualizationsSeeds["WDUV9ZrJiNC"]?.regionalPageName ||
                                          VisualizationsSeeds["WDUV9ZrJiNC"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
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
                              title: numbersPanelContent.panelFourTitle,
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "VB7bdJ8ZXya",
                                      visualizationName:
                                          VisualizationsSeeds["VB7bdJ8ZXya"]?.regionalPageName ||
                                          VisualizationsSeeds["VB7bdJ8ZXya"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelFourGraphOneText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "mcNfvQaVbfy",
                                      visualizationName:
                                          VisualizationsSeeds["mcNfvQaVbfy"]?.regionalPageName ||
                                          VisualizationsSeeds["mcNfvQaVbfy"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
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
                              title: numbersPanelContent.panelFiveTitle,
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "EtHaEt6bnm5_nlYSkEMZxgN",
                                      visualizationName:
                                          VisualizationsSeeds["EtHaEt6bnm5_nlYSkEMZxgN"]?.regionalPageName ||
                                          VisualizationsSeeds["EtHaEt6bnm5_nlYSkEMZxgN"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelSixGraphOneText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "AophAEpx5e0_BOcLONPSyYS",
                                      visualizationName:
                                          VisualizationsSeeds["AophAEpx5e0_BOcLONPSyYS"]?.regionalPageName ||
                                          VisualizationsSeeds["AophAEpx5e0_BOcLONPSyYS"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelSixGraphTwoText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "MfLZYD6QCPy",
                                      visualizationName:
                                          VisualizationsSeeds["MfLZYD6QCPy"]?.regionalPageName ||
                                          VisualizationsSeeds["MfLZYD6QCPy"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelSixGraphThreeText,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 5,
                          tabTitle: numbersPanelContent.panelSixTitle,
                          Component: SlideGraph,
                          props: {
                              title: numbersPanelContent.panelSixTitle,
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              isRegionalPage: true,
                              graphs: [
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "d3kq9OCv8tH",
                                      visualizationName:
                                          VisualizationsSeeds["d3kq9OCv8tH"]?.regionalPageName ||
                                          VisualizationsSeeds["d3kq9OCv8tH"]?.friendlyName,
                                      years: generateYears().map(year => year.id),
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelFiveGraphOneText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "z6nPPMMbOw5",
                                      visualizationName:
                                          VisualizationsSeeds["z6nPPMMbOw5"]?.regionalPageName ||
                                          VisualizationsSeeds["z6nPPMMbOw5"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelFiveGraphTwoText,
                                  },
                                  {
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      visualizationId: "mUjcWO90CRr",
                                      visualizationName:
                                          VisualizationsSeeds["mUjcWO90CRr"]?.regionalPageName ||
                                          VisualizationsSeeds["mUjcWO90CRr"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelFiveGraphThreeText,
                                  },
                                  {
                                      // TODO: Use iMI82inOBiD or B4CnzUqVR3n because in IE we don't have B4CnzUqVR3n but iMI82inOBiD does not have LAY?
                                      visualizationId: "B4CnzUqVR3n",
                                      visualizationName:
                                          VisualizationsSeeds["B4CnzUqVR3n"]?.countryPageName ||
                                          VisualizationsSeeds["B4CnzUqVR3n"]?.friendlyName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                      text: numbersPanelContent.panelSixGraphFourText,
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
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
