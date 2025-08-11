import { useCallback, useMemo, useState } from "react";

import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { Id } from "../../../domain/entities/Ref";
import { SlideGraph } from "../../components/country-page/slider/SlideGraph";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { LatestAvailable } from "../../../domain/entities/Year";
import { useAppContext } from "../../contexts/app-context";
import { RegionNumbersPanelTitles } from "../../../domain/entities/region/RegionInfo";
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
    numbersPanelTitles: Maybe<RegionNumbersPanelTitles>
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
            selectedRegionId && numbersPanelTitles && selectedRegion
                ? [
                      {
                          tab: 0,
                          tabTitle: numbersPanelTitles.panelOne,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "People who face catastrophic health spending may struggle to afford other basic needs like food, housing and heating. Levels of catastrophic health spending are closely related to levels of out-of-pocket payments as a share of current spending on health. Financial hardship is higher in health systems that rely more heavily on out-of-pocket payments – but policy also matters.",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "kIpnMBaBvZ9",
                                  visualizationName:
                                      VisualizationsSeeds["kIpnMBaBvZ9"]?.countryPageName ||
                                      VisualizationsSeeds["kIpnMBaBvZ9"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                      {
                          tab: 1,
                          tabTitle: numbersPanelTitles.panelTwo,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "Out-of-pocket payments push people into poverty – or further into poverty – in every country in the region.",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "dbc87Ljw8uN",
                                  visualizationName:
                                      VisualizationsSeeds["dbc87Ljw8uN"]?.countryPageName ||
                                      VisualizationsSeeds["dbc87Ljw8uN"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                      {
                          tab: 2,
                          tabTitle: numbersPanelTitles.panelThree,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "Out-of-pocket payments affect households with low incomes the most.",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "GimM6ANOKhd",
                                  visualizationName:
                                      VisualizationsSeeds["GimM6ANOKhd"]?.countryPageName ||
                                      VisualizationsSeeds["GimM6ANOKhd"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                              graphTwo: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "WDUV9ZrJiNC",
                                  visualizationName:
                                      VisualizationsSeeds["WDUV9ZrJiNC"]?.countryPageName ||
                                      VisualizationsSeeds["WDUV9ZrJiNC"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                      {
                          tab: 3,
                          tabTitle: numbersPanelTitles.panelFour,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "Across countries, financial hardship is mainly driven by out-of-pocket payments for outpatient medicines, dental care and medical products. Within countries, drivers differ across quintiles. Outpatient medicines consistently account for a larger share of catastrophic health spending in the poorest quintile than in the other quintiles, while dental care usually accounts for a smaller share.",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "VB7bdJ8ZXya",
                                  visualizationName:
                                      VisualizationsSeeds["VB7bdJ8ZXya"]?.countryPageName ||
                                      VisualizationsSeeds["VB7bdJ8ZXya"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                              graphTwo: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "mcNfvQaVbfy",
                                  visualizationName:
                                      VisualizationsSeeds["mcNfvQaVbfy"]?.countryPageName ||
                                      VisualizationsSeeds["mcNfvQaVbfy"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                      {
                          tab: 4,
                          tabTitle: numbersPanelTitles.panelFive,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "EU-SILC data on unmet need for health care and dental care due to cost, distance and waiting time indicate that dental care is a greater driver of unmet need than health care",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "xJhFIBuwGVC",
                                  visualizationName:
                                      VisualizationsSeeds["xJhFIBuwGVC"]?.countryPageName ||
                                      VisualizationsSeeds["xJhFIBuwGVC"]?.friendlyName,
                                  years: generateYears().map(year => year.id),
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                              graphTwo: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "zkEtsohZTTf",
                                  visualizationName:
                                      VisualizationsSeeds["zkEtsohZTTf"]?.countryPageName ||
                                      VisualizationsSeeds["zkEtsohZTTf"]?.friendlyName,
                                  years: generateYears().map(year => year.id),
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                      {
                          tab: 5,
                          tabTitle: numbersPanelTitles.panelSix,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "For health care and dental care, levels of unmet need are consistently higher among people in the poorest quintile",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "EtHaEt6bnm5_nlYSkEMZxgN",
                                  visualizationName:
                                      VisualizationsSeeds["EtHaEt6bnm5_nlYSkEMZxgN"]?.countryPageName ||
                                      VisualizationsSeeds["EtHaEt6bnm5_nlYSkEMZxgN"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                              graphTwo: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "AophAEpx5e0_BOcLONPSyYS",
                                  visualizationName:
                                      VisualizationsSeeds["AophAEpx5e0_BOcLONPSyYS"]?.countryPageName ||
                                      VisualizationsSeeds["AophAEpx5e0_BOcLONPSyYS"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                      {
                          tab: 6,
                          tabTitle: numbersPanelTitles.panelSeven,
                          Component: SlideGraph,
                          props: {
                              selectedRegionId: selectedRegionId,
                              kind: "graph",
                              title: "Out-of-pocket payments have decreased over time. Financial protection is stronger in countries with a higher priority to health in the government budget.",
                              graphOne: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                                  visualizationId: "d3kq9OCv8tH",
                                  visualizationName:
                                      VisualizationsSeeds["d3kq9OCv8tH"]?.countryPageName ||
                                      VisualizationsSeeds["d3kq9OCv8tH"]?.friendlyName,
                                  years: generateYears().map(year => year.id),
                              },
                              graphTwo: {
                                  currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                  visualizationId: "B4CnzUqVR3n",
                                  visualizationName:
                                      VisualizationsSeeds["B4CnzUqVR3n"]?.countryPageName ||
                                      VisualizationsSeeds["B4CnzUqVR3n"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [...(selectedRegion.countries || []), selectedRegion.linkedOrgUnitId],
                              },
                          },
                      },
                  ]
                : [],
        [selectedRegionId, numbersPanelTitles, selectedRegion]
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
