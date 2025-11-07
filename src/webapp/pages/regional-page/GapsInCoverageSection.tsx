import React from "react";
import styled from "styled-components";
import { VerticalTabConfig, VerticalTabsPanel } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig, AccordionPanel } from "../../components/accordion-panel/AccordionPanel";

type GapsInCoverageSectionProps = {
    configs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    isSmallScreen?: boolean;
};

export const GapsInCoverageSection: React.FC<GapsInCoverageSectionProps> = React.memo(props => {
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
                    isSecondaryColor
                />
            ) : (
                <VerticalTabsPanel
                    tabsConfig={configs}
                    tabValue={tabValue}
                    onChangeTabValue={handleTabChange}
                    ariaLabel="region-gaps-in-coverage-slider"
                    isSecondaryColor
                />
            )}
        </Container>
    );
});

const Container = styled.div`
    width: 100%;
`;
