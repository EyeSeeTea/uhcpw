import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import styled from "styled-components";
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { colors } from "../../pages/app/themes/dhis2.theme";

export type AccordionConfig = {
    tab: number;
    tabTitle: string;
    onTitleClick?: (tab: number) => void;
    Component: React.ComponentType<any> | null;
    disabled?: boolean;
    props?: Record<string, any>;
    isGradientColor?: boolean;
    isSecondaryGradientColor?: boolean;
    hasExpandIcon?: boolean;
    ref?: React.RefObject<HTMLElement> | null;
};

type AccordionPanelProps = {
    configs: AccordionConfig[];
    expandedConfig?: AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    isSecondaryColor?: boolean;
    isBold?: boolean;
    bigFont?: boolean;
    scrollMarginTop?: string;
    setPendingScrollTab?: (tab: number | null) => void;
    pendingScrollTab?: number | null;
};

export const AccordionPanel: React.FC<AccordionPanelProps> = props => {
    const {
        configs,
        expandedConfig,
        handleAccordionChange,
        isSecondaryColor = false,
        isBold = false,
        bigFont = false,
        scrollMarginTop,
        pendingScrollTab,
        setPendingScrollTab,
    } = props;

    return (
        <AccordionContainer>
            {configs.map(config => {
                return (
                    <StyledAccordion
                        ref={config.ref}
                        key={`${config.tab}-${config.tabTitle}-key`}
                        $isSecondaryColor={isSecondaryColor}
                        $isGradientColor={config.isGradientColor}
                        $isSecondaryGradientColor={config.isSecondaryGradientColor}
                        expanded={config.tab === expandedConfig?.tab}
                        onChange={(event: React.ChangeEvent<{}>, isExpanded: boolean) => {
                            !config.disabled && handleAccordionChange(event, config.tab, isExpanded);
                        }}
                        onClick={() => {
                            config.onTitleClick && config.onTitleClick(config.tab);
                        }}
                        $scrollMarginTop={scrollMarginTop}
                        TransitionProps={{
                            onEntered: () => {
                                if (pendingScrollTab === config.tab) {
                                    config.ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    setPendingScrollTab && setPendingScrollTab(null);
                                }
                            },
                        }}
                    >
                        <StyledAccordionSummary
                            aria-controls={`${config.tab}-${config.tabTitle}-content`}
                            id={`${config.tab}-${config.tabTitle}-header`}
                            expandIcon={config.hasExpandIcon ? <ExpandMoreIcon /> : null}
                            $isBold={isBold}
                            $bigFont={bigFont}
                            $isSecondaryColor={isSecondaryColor}
                        >
                            <Typography>{config.tabTitle}</Typography>
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>
                            {config.Component ? <config.Component {...config.props} /> : null}
                        </StyledAccordionDetails>
                    </StyledAccordion>
                );
            })}
        </AccordionContainer>
    );
};

const AccordionContainer = styled.div`
    padding: 0;
    background: white;
    color: white;
`;

const StyledAccordion = styled(Accordion)<{
    $isSecondaryColor?: boolean;
    $isGradientColor?: boolean;
    $isSecondaryGradientColor?: boolean;
    $scrollMarginTop?: string;
}>`
    background: ${({ $isSecondaryColor, $isGradientColor, $isSecondaryGradientColor }) => {
        if ($isSecondaryColor) return colors.blue20;
        if ($isGradientColor) return colors.gradientBlueLight;
        if ($isSecondaryGradientColor) return colors.gradientBlueLight2;
        return colors.accentPrimary;
    }};
    color: ${props => (props.$isSecondaryColor ? colors.black : colors.white)};
    border: none;
    border-radius: 0;
    margin: 4px 0;
    box-shadow: none;
    scroll-margin-top: ${props => props.$scrollMarginTop || "0"};

    &.Mui-expanded {
        margin: 4px 0;
        &:last-child,
        &:first-child {
            margin: 4px 0;
        }
        background-color: ${props => (props.$isSecondaryColor ? colors.blue50 : colors.accentPrimaryDark)};
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

const StyledAccordionSummary = styled(AccordionSummary)<{
    $isBold?: boolean;
    $bigFont?: boolean;
    $isSecondaryColor?: boolean;
}>`
    min-height: 48px;
    padding: 0 25px 0 64px;
    justify-content: flex-start;

    .MuiTypography-root {
        font-weight: 500;
        font-size: 16px;
    }

    .MuiAccordionSummary-content {
        margin: 12px 0;
        flex-grow: initial;

        & p.MuiTypography-root {
            font-weight: ${props => (props.$isBold ? "bold" : "normal")};
            font-size: ${props => (props.$bigFont ? "24px" : "16px")};
        }

        &.Mui-expanded {
            & p.MuiTypography-body1 {
                font-weight: ${props => (props.$isSecondaryColor || props.$isBold ? "bold" : "normal")};
            }
        }
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
