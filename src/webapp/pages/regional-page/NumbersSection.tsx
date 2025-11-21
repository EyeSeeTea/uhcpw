import React from "react";
import styled from "styled-components";
import { VerticalTabConfig, VerticalTabsPanel } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { AccordionConfig, AccordionPanel } from "../../components/accordion-panel/AccordionPanel";

type NumbersSectionProps = {
    configs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    isSmallScreen?: boolean;
    setSidePanelWidth?: (width: number) => void;
};

export const NumbersSection: React.FC<NumbersSectionProps> = React.memo(props => {
    const {
        configs,
        tabValue,
        expandedConfig,
        handleAccordionChange,
        handleTabChange,
        isSmallScreen = false,
        setSidePanelWidth,
    } = props;
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
                    onTabsWidthChange={setSidePanelWidth}
                    ariaLabel="region-numbers-slider"
                    isSecondaryColor
                />
            )}
        </Container>
    );
});

const Container = styled.div``;
