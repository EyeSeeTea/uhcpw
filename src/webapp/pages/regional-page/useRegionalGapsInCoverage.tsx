import { useCallback, useMemo, useState } from "react";

import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { GapsInCoverageContent } from "../../../domain/entities/region/RegionInfo";
import { Maybe } from "../../../types/utils";
import { GapsInCoveragePanel } from "./GapsInCoveragePanel";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import { LatestAvailable } from "../../../domain/entities/Year";
import { GapsInCoverageFirstPanel } from "./GapsInCoverageFirstPanel";

export type RegionalGapsInCoverageState = {
    configs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    onResetTabs: () => void;
};

export function useRegionalGapsInCoverage(
    selectedRegionId: Maybe<Id>,
    gapsInCoverageContent: Maybe<GapsInCoverageContent>
): RegionalGapsInCoverageState {
    const { regions } = useAppContext();
    const isSmallScreen = useIsSmallScreen();

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
            selectedRegionId && gapsInCoverageContent && selectedRegion
                ? [
                      {
                          tab: 0,
                          tabTitle: gapsInCoverageContent.panelOneTitle,
                          Component: GapsInCoverageFirstPanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelOneTitle,
                              mainText: gapsInCoverageContent.panelOneMainText,
                              progressText: gapsInCoverageContent.panelOneProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visual: gapsInCoverageContent.hasPanelOneChartOne
                                  ? {
                                        visual: gapsInCoverageContent.panelOneChartOne,
                                        title:
                                            gapsInCoverageContent.panelOneChartOneTitle !== ""
                                                ? gapsInCoverageContent.panelOneChartOneTitle
                                                : undefined,
                                        textAbove: gapsInCoverageContent.panelOneChartOneTextAbove,
                                        textBelow: gapsInCoverageContent.panelOneChartOneTextBelow,
                                        textInfo: gapsInCoverageContent.panelOneChartOneInfoText,
                                    }
                                  : undefined,
                          },
                      },
                      {
                          tab: 1,
                          tabTitle: gapsInCoverageContent.panelTwoTitle,
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelTwoTitle,
                              mainText: gapsInCoverageContent.panelTwoMainText,
                              progressText: gapsInCoverageContent.panelTwoProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: gapsInCoverageContent.hasPanelTwoChartOne
                                  ? [
                                        {
                                            visual: gapsInCoverageContent.panelTwoChartOne,
                                            title:
                                                gapsInCoverageContent.panelTwoChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelTwoChartOneTitle
                                                    : undefined,
                                            textBelow: gapsInCoverageContent.panelTwoChartOneTextBelow,
                                            textAbove: gapsInCoverageContent.panelTwoChartOneTextAbove,
                                            textInfo: gapsInCoverageContent.panelTwoChartOneInfoText,
                                        },
                                    ]
                                  : [],
                          },
                      },
                      {
                          tab: 2,
                          tabTitle: gapsInCoverageContent.panelThreeTitle,
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelThreeTitle,
                              mainText: gapsInCoverageContent.panelThreeMainText,
                              progressText: gapsInCoverageContent.panelThreeProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: gapsInCoverageContent.hasPanelThreeChartOne
                                  ? [
                                        {
                                            visual: gapsInCoverageContent.panelThreeChartOne,
                                            title:
                                                gapsInCoverageContent.panelThreeChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelThreeChartOneTitle
                                                    : undefined,
                                            textBelow: gapsInCoverageContent.panelThreeChartOneTextBelow,
                                            textAbove: gapsInCoverageContent.panelThreeChartOneTextAbove,
                                            textInfo: gapsInCoverageContent.panelThreeChartOneInfoText,
                                        },
                                    ]
                                  : [],
                          },
                      },
                      {
                          tab: 3,
                          tabTitle: gapsInCoverageContent.panelFourTitle,
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelFourTitle,
                              mainText: gapsInCoverageContent.panelFourMainText,
                              progressText: gapsInCoverageContent.panelFourProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: [
                                  {
                                      policyCategoryId: "Nx6S3aQkvWe",
                                      countries: selectedRegion.countries || [],
                                      years: ["latest"],
                                      title:
                                          gapsInCoverageContent.panelFourChartOneTitle !== ""
                                              ? gapsInCoverageContent.panelFourChartOneTitle
                                              : undefined,
                                      textBelow: gapsInCoverageContent.panelFourChartOneTextBelow,
                                      textAbove: gapsInCoverageContent.panelFourChartOneTextAbove,
                                      textInfo: gapsInCoverageContent.panelFourChartOneInfoText,
                                  },
                              ],
                          },
                      },
                      {
                          tab: 4,
                          tabTitle: gapsInCoverageContent.panelFiveTitle,
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelFiveTitle,
                              mainText: gapsInCoverageContent.panelFiveMainText,
                              progressText: gapsInCoverageContent.panelFiveProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: [
                                  {
                                      policyCategoryId: "u800TAhsIBY_Cat",
                                      countries: selectedRegion.countries || [],
                                      years: ["latest"],
                                      title:
                                          gapsInCoverageContent.panelFiveChartOneTitle !== ""
                                              ? gapsInCoverageContent.panelFiveChartOneTitle
                                              : undefined,
                                      textAbove: gapsInCoverageContent.panelFiveChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelFiveChartOneTextBelow,
                                      textInfo: gapsInCoverageContent.panelFiveChartOneInfoText,
                                  },
                                  gapsInCoverageContent.hasPanelFiveChartTwo
                                      ? {
                                            visual: gapsInCoverageContent.panelFiveChartTwo,
                                            title:
                                                gapsInCoverageContent.panelFiveChartTwoTitle !== ""
                                                    ? gapsInCoverageContent.panelFiveChartTwoTitle
                                                    : undefined,
                                            textAbove: gapsInCoverageContent.panelFiveChartTwoTextAbove,
                                            textBelow: gapsInCoverageContent.panelFiveChartTwoTextBelow,
                                            textInfo: gapsInCoverageContent.panelFiveChartTwoInfoText,
                                        }
                                      : undefined,
                                  gapsInCoverageContent.hasPanelFiveChartThree
                                      ? {
                                            visual: gapsInCoverageContent.panelFiveChartThree,
                                            title:
                                                gapsInCoverageContent.panelFiveChartThreeTitle !== ""
                                                    ? gapsInCoverageContent.panelFiveChartThreeTitle
                                                    : undefined,
                                            textAbove: gapsInCoverageContent.panelFiveChartThreeTextAbove,
                                            textBelow: gapsInCoverageContent.panelFiveChartThreeTextBelow,
                                            textInfo: gapsInCoverageContent.panelFiveChartThreeInfoText,
                                        }
                                      : undefined,
                              ].filter(visual => visual !== undefined),
                          },
                      },
                      {
                          tab: 5,
                          tabTitle: gapsInCoverageContent.panelSixTitle,
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelSixTitle,
                              mainText: gapsInCoverageContent.panelSixMainText,
                              progressText: gapsInCoverageContent.panelSixProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: [
                                  {
                                      title:
                                          gapsInCoverageContent.panelSixChartOneTitle !== ""
                                              ? gapsInCoverageContent.panelSixChartOneTitle
                                              : undefined,
                                      textAbove: gapsInCoverageContent.panelSixChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelSixChartOneTextBelow,
                                      textInfo: gapsInCoverageContent.panelSixChartOneInfoText,
                                      visualizationId: "mcNfvQaVbfy",
                                      visualizationName:
                                          gapsInCoverageContent.panelSixChartOneTitle !== ""
                                              ? gapsInCoverageContent.panelSixChartOneTitle
                                              : VisualizationsSeeds["mcNfvQaVbfy"]?.regionalPageName,
                                      years: [LatestAvailable.id],
                                      currentCountryOrRegion: selectedRegion.linkedOrgUnitId,
                                      countries: [...(selectedRegion.countries || [])],
                                      regions: [selectedRegionId],
                                      seriesColors: {
                                          "eIs7xB9CAmV.JGYECk6mKHE": "#6f30a023",
                                          "eIs7xB9CAmV.xFBx8HXhRn6": "#ffbf002f",
                                          "eIs7xB9CAmV.NYLedCi0SnS": "#00b04f33",
                                          "eIs7xB9CAmV.WZQNt5d1TGm": "#ed7d31",
                                          "eIs7xB9CAmV.bHGxnqq0s6M": "#0070c0",
                                          "eIs7xB9CAmV.CgeNM5PZBLy": "#c00000",
                                      },
                                  },
                              ],
                          },
                      },
                      {
                          tab: 6,
                          tabTitle: gapsInCoverageContent.panelSevenTitle,
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelSevenTitle,
                              mainText: gapsInCoverageContent.panelSevenMainText,
                              progressText: gapsInCoverageContent.panelSevenProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: [
                                  {
                                      title:
                                          gapsInCoverageContent.panelSevenChartOneTitle !== ""
                                              ? gapsInCoverageContent.panelSevenChartOneTitle
                                              : undefined,
                                      textAbove: gapsInCoverageContent.panelSevenChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelSevenChartOneTextBelow,
                                      visualizationId: "y4qAv6eW4nb",
                                      visualizationName:
                                          gapsInCoverageContent.panelSevenChartOneTitle !== ""
                                              ? gapsInCoverageContent.panelSevenChartOneTitle
                                              : VisualizationsSeeds["y4qAv6eW4nb"]?.regionalPageName,
                                      years: [LatestAvailable.id],
                                      countries: [...(selectedRegion.countries || [])],
                                  },
                              ],
                          },
                      },
                  ]
                : [],
        [selectedRegionId, gapsInCoverageContent, selectedRegion, isSmallScreen]
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
