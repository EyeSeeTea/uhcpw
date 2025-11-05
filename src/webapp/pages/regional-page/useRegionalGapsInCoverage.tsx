import { useCallback, useMemo, useState } from "react";

import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { GapsInCoverageContent } from "../../../domain/entities/region/RegionInfo";
import { Maybe } from "../../../types/utils";
import { GapsInCoveragePanel } from "./GapsInCoveragePanel";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
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
                          Component: GapsInCoveragePanel,
                          props: {
                              regionId: selectedRegionId,
                              title: gapsInCoverageContent.panelOneTitle,
                              mainText: gapsInCoverageContent.panelOneMainText,
                              progressText: gapsInCoverageContent.panelOneProgressText,
                              showDialogInFullScreen: isSmallScreen,
                              visuals: gapsInCoverageContent.hasPanelOneChartOne
                                  ? [
                                        {
                                            visual: gapsInCoverageContent.panelOneChartOne,
                                            title:
                                                gapsInCoverageContent.panelOneChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelOneChartOneTitle
                                                    : undefined,
                                            textAbove: gapsInCoverageContent.panelOneChartOneTextAbove,
                                            textBelow: gapsInCoverageContent.panelOneChartOneTextBelow,
                                            textInfo: gapsInCoverageContent.panelOneChartOneInfoText,
                                        },
                                    ]
                                  : [],
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
                              visuals: gapsInCoverageContent.hasPanelFourChartOne
                                  ? [
                                        {
                                            visual: gapsInCoverageContent.panelFourChartOne,
                                            title:
                                                gapsInCoverageContent.panelFourChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelFourChartOneTitle
                                                    : undefined,
                                            textBelow: gapsInCoverageContent.panelFourChartOneTextBelow,
                                            textAbove: gapsInCoverageContent.panelFourChartOneTextAbove,
                                            textInfo: gapsInCoverageContent.panelFourChartOneInfoText,
                                        },
                                    ]
                                  : [],
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
                                  gapsInCoverageContent.hasPanelFiveChartOne
                                      ? {
                                            visual: gapsInCoverageContent.panelFiveChartOne,
                                            title:
                                                gapsInCoverageContent.panelFiveChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelFiveChartOneTitle
                                                    : undefined,
                                            textAbove: gapsInCoverageContent.panelFiveChartOneTextAbove,
                                            textBelow: gapsInCoverageContent.panelFiveChartOneTextBelow,
                                            textInfo: gapsInCoverageContent.panelFiveChartOneInfoText,
                                        }
                                      : undefined,

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
                              visuals: gapsInCoverageContent.hasPanelSixChartOne
                                  ? [
                                        {
                                            visual: gapsInCoverageContent.panelSixChartOne,
                                            title:
                                                gapsInCoverageContent.panelSixChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelSixChartOneTitle
                                                    : undefined,
                                            textAbove: gapsInCoverageContent.panelSixChartOneTextAbove,
                                            textBelow: gapsInCoverageContent.panelSixChartOneTextBelow,
                                            textInfo: gapsInCoverageContent.panelSixChartOneInfoText,
                                        },
                                    ]
                                  : [],
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
                              visuals: gapsInCoverageContent.hasPanelSevenChartOne
                                  ? [
                                        {
                                            title:
                                                gapsInCoverageContent.panelSevenChartOneTitle !== ""
                                                    ? gapsInCoverageContent.panelSevenChartOneTitle
                                                    : undefined,
                                            visual: gapsInCoverageContent.panelSevenChartOne,
                                            textAbove: gapsInCoverageContent.panelSevenChartOneTextAbove,
                                            textBelow: gapsInCoverageContent.panelSevenChartOneTextBelow,
                                            textInfo: gapsInCoverageContent.panelSevenChartOneInfoText,
                                        },
                                    ]
                                  : [],
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
