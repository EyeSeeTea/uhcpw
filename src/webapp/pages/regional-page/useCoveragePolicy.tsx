import { useCallback, useMemo, useState } from "react";

import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";
import { Id } from "../../../domain/entities/Ref";
import { CoveragePolicyFirstPanel } from "./CoveragePolicyFirstPanel";
import { CoveragePolicySecondPanel } from "./CoveragePolicySecondPanel";
import { CoveragePolicyEmptyPanel } from "./CoveragePolicyEmptyPanel";
import { useCoveragePolicyMap } from "./useCoveragePolicyMap";

export type CoveragePolicyState = {
    configs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    onResetTabs: () => void;
};

const firstPanelLeftContent =
    "**Gaps in coverage lead to out-of-pocket payments, financial hardship and unmet need.**\n\n **Rationing is inevitable, but some forms of rationing are more harmful than others.**";
const firstPanelRightContent =
    "**Coverage policy choices to avoid:** some of the coverage policy choices that countries make when rationing access to health care are “bad ideas” because: \n\n - they do not reflect evidence; \n- they undermine financial protection, have a disproportionately negative impact on people with low incomes or chronic conditions and increase inefficiency in the use of health care; \n- they weaken household and health system resilience to shocks; \n- they slow a country’s progress towards UHC; \n- better options for rationing are usually available.";
const firstPanelBottomContent =
    "**In the following sections we highlight five coverage policy choices that countries should avoid.**";

const secondPanelTitle = "# **Avoid linking entitlement to payment of contributions:**";
const secondPanelContent =
    "This policy choice mainly occurs in countries with social health insurance (SHI) schemes.\n\n It penalizes people who do not pay the required contributions by restricting their access to some or all publicly financed health care.\n\n It leads to visible gaps in population coverage, particularly in countries with weak tax systems and a sizeable informal economy, and mainly harms people in precarious work.\n\n Precarious employment is a growing problem in Europe, so without action, this gap in coverage is likely to expand over time.";
const secondPanelChartTitle =
    "Fig. Population coverage, the main basis for entitlement to publicly financed health care and catastrophic health spending, 2019 or the latest available year before COVID-19";
const secondPanelNotes = "Notes, text.";

export function useCoveragePolicy(selectedRegionId?: Id): CoveragePolicyState {
    const mapState = useCoveragePolicyMap(selectedRegionId);
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

    const configs: (VerticalTabConfig | AccordionConfig)[] = useMemo(
        () =>
            selectedRegionId
                ? [
                      {
                          tab: 0,
                          tabTitle:
                              "“Addiction” to bad ideas: the coverage policy choices that undermine financial protection",
                          Component: CoveragePolicyFirstPanel,
                          props: {
                              selectedRegionId: selectedRegionId,
                              leftContent: firstPanelLeftContent,
                              rightContent: firstPanelRightContent,
                              bottomContent: firstPanelBottomContent,
                          },
                      },
                      {
                          tab: 1,
                          tabTitle: "1. Avoid basing entitlement on payment of contributions",
                          Component: CoveragePolicySecondPanel,
                          props: {
                              selectedRegionId: selectedRegionId,
                              title: secondPanelTitle,
                              content: secondPanelContent,
                              chartTitle: secondPanelChartTitle,
                              notes: secondPanelNotes,
                              mapState: mapState,
                          },
                      },
                      {
                          tab: 2,
                          tabTitle: "2. Avoid excluding people from coverage",
                          Component: CoveragePolicyEmptyPanel,
                          props: {
                              selectedRegionId: selectedRegionId,
                          },
                      },
                      {
                          tab: 3,
                          tabTitle: "3. Avoid applying user charges without effective protection mechanisms",
                          Component: CoveragePolicyEmptyPanel,
                          props: {
                              selectedRegionId: selectedRegionId,
                          },
                      },
                      {
                          tab: 4,
                          tabTitle: "4. Avoid failing to cover treatment in primary care settings",
                          Component: CoveragePolicyEmptyPanel,
                          props: {
                              selectedRegionId: selectedRegionId,
                          },
                      },
                      {
                          tab: 5,
                          tabTitle: "5. Avoid thinking voluntary health insurance (VHI) is the answer",
                          Component: CoveragePolicyEmptyPanel,
                          props: {
                              selectedRegionId: selectedRegionId,
                          },
                      },
                  ]
                : [],
        [selectedRegionId, mapState]
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
