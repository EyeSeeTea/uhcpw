import React from "react";
import styled from "styled-components";

import { AccordionConfig, AccordionPanel } from "../../components/accordion-panel/AccordionPanel";
import { VerticalTabConfig, VerticalTabsPanel } from "../../components/vertical-tabs-panel/VerticalTabsPanel";

type CoveragePolicySectionProps = {
    configs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    isSmallScreen?: boolean;
};

export const CoveragePolicySection: React.FC<CoveragePolicySectionProps> = React.memo(props => {
    const { configs, tabValue, expandedConfig, handleAccordionChange, handleTabChange, isSmallScreen = false } = props;

    if (!configs || configs.length === 0) {
        return null;
    }

    return (
        <Container>
            {isSmallScreen ? (
                <AccordionPanel
                    configs={configs}
                    expandedConfig={expandedConfig}
                    handleAccordionChange={handleAccordionChange}
                />
            ) : (
                <VerticalTabsPanel
                    tabsConfig={configs}
                    tabValue={tabValue}
                    onChangeTabValue={handleTabChange}
                    ariaLabel="coverage-policy-slider"
                />
            )}
        </Container>
    );
});

const Container = styled.div``;
