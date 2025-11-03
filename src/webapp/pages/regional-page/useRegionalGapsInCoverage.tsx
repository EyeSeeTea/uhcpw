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
                              visuals: [
                                  {
                                      visual: gapsInCoverageContent.panelOneChartOne,
                                      textAbove: gapsInCoverageContent.panelOneChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelOneChartOneTextBelow,
                                      textInfo: gapsInCoverageContent.panelOneChartOneInfoText,
                                  },
                              ],
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
                              visuals: [
                                  {
                                      visual: gapsInCoverageContent.panelThreeChartOne,
                                      title: "Population coverage, the main basis for entitlement to publicly financed health care and catastrophic health spending, latest available year",
                                      textBelow: gapsInCoverageContent.panelThreeChartOneTextBelow,
                                      textAbove: gapsInCoverageContent.panelThreeChartOneTextAbove,
                                      textInfo: gapsInCoverageContent.panelThreeChartOneInfoText,
                                  },
                              ],
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
                                      visual: gapsInCoverageContent.panelFourChartOne,
                                      title: "Entitlements for undocumented migrants, 2025",
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
                                      visual: gapsInCoverageContent.panelFiveChartOne,
                                      title: "User charges (co-payments) for covered health care by type of care, latest available year",
                                      textAbove: gapsInCoverageContent.panelFiveChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelFiveChartOneTextBelow,
                                      textInfo: gapsInCoverageContent.panelFiveChartOneInfoText,
                                  },
                                  {
                                      visual: gapsInCoverageContent.panelFiveChartTwo,
                                      title: "The design of user charges for outpatient prescribed medicines and catastrophic health spending, latest available year",
                                      textAbove: gapsInCoverageContent.panelFiveChartTwoTextAbove,
                                      textBelow: gapsInCoverageContent.panelFiveChartTwoTextBelow,
                                      textInfo: gapsInCoverageContent.panelFiveChartTwoInfoText,
                                  },
                                  {
                                      visual: gapsInCoverageContent.panelFiveChartThree,
                                      title: "Use of income-based caps to protect people from all co-payments, 2025",
                                      textAbove: gapsInCoverageContent.panelFiveChartThreeTextAbove,
                                      textBelow: gapsInCoverageContent.panelFiveChartThreeTextBelow,
                                      textInfo: gapsInCoverageContent.panelFiveChartThreeInfoText,
                                  },
                              ],
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
                                      visual: gapsInCoverageContent.panelSixChartOne,
                                      title: "Breakdown of catastrophic health spending by type of care on average and in the poorest quintile, latest available year",
                                      textAbove: gapsInCoverageContent.panelSixChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelSixChartOneTextBelow,
                                      textInfo: gapsInCoverageContent.panelSixChartOneInfoText,
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
                                      visual: gapsInCoverageContent.panelSevenChartOne,
                                      textAbove: gapsInCoverageContent.panelSevenChartOneTextAbove,
                                      textBelow: gapsInCoverageContent.panelSevenChartOneTextBelow,
                                      textInfo: gapsInCoverageContent.panelSevenChartOneInfoText,
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
