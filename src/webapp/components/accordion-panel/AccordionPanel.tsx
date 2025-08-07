import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import styled from "styled-components";
import React from "react";

import { colors } from "../../pages/app/themes/dhis2.theme";

export type AccordionConfig = {
    tab: number;
    tabTitle: string;
    Component: React.ComponentType<any>;
    props?: Record<string, any>;
};

type AccordionPanelProps = {
    configs: AccordionConfig[];
    expandedConfig?: AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
};

export const AccordionPanel: React.FC<AccordionPanelProps> = props => {
    const { configs, expandedConfig, handleAccordionChange } = props;

    return (
        <AccordionContainer>
            {configs.map(config => (
                <StyledAccordion
                    key={`${config.tab}-${config.tabTitle}-key`}
                    expanded={config.tab === expandedConfig?.tab}
                    onChange={(event: React.ChangeEvent<{}>, isExpanded: boolean) => {
                        handleAccordionChange(event, config.tab, isExpanded);
                    }}
                >
                    <StyledAccordionSummary
                        aria-controls={`${config.tab}-${config.tabTitle}-content`}
                        id={`${config.tab}-${config.tabTitle}-header`}
                    >
                        <Typography>{config.tabTitle}</Typography>
                    </StyledAccordionSummary>
                    <StyledAccordionDetails>
                        <config.Component {...config.props} />
                    </StyledAccordionDetails>
                </StyledAccordion>
            ))}
        </AccordionContainer>
    );
};

const AccordionContainer = styled.div`
    padding: 0;
    background: white;
    color: white;
`;

const StyledAccordion = styled(Accordion)`
    background-color: ${colors.accentPrimary};
    color: white;
    border: none;
    border-radius: 0;
    margin: 4px 0;
    box-shadow: none;

    &.Mui-expanded {
        margin: 4px 0;
        &:last-child,
        &:first-child {
            margin: 4px 0;
        }
    }

    &::before {
        display: none;
    }

    &:last-child,
    &:first-child {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
    min-height: 48px;
    padding: 0 25px 0 64px;
    .MuiTypography-root {
        font-weight: 500;
        font-size: 16px;
    }

    .MuiAccordionSummary-content {
        margin: 12px 0;
    }

    .MuiSvgIcon-root {
        color: white;
    }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
    font-size: 14px;
    border-radius: 0;
    border: none;
    background: white;
    padding: 0;
`;
