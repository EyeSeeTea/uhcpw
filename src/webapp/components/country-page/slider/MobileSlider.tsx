import { CircularProgress, Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { useCountrySlider } from "../../../pages/country/useCountrySlider";
import styled from "styled-components";
import { MobileSliderContent } from "./MobileSliderContent";
import { ChangeEvent, useEffect } from "react";
import React from "react";

export const MobileSlider: React.FC<{
    countryId: string;
}> = ({ countryId }) => {
    const { configs, expandedSliderConfig, handleAccordionChange } = useCountrySlider(countryId);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!expandedSliderConfig) return;

            const accordion = document.getElementById(`${expandedSliderConfig.tab}-header`);

            accordion?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 380);

        return () => {
            clearTimeout(timer);
        };
    }, [expandedSliderConfig]);

    if (!countryId) return <CircularProgress />;

    return (
        <AccordionContainer>
            {configs.map(config => (
                <StyledAccordion
                    key={`${config.tab}-key`}
                    expanded={config.tab === expandedSliderConfig?.tab}
                    onChange={(event: ChangeEvent<{}>, isExpanded: boolean) => {
                        handleAccordionChange(event, config.tab, isExpanded);
                    }}
                >
                    <StyledAccordionSummary aria-controls={`${config.tab}-content`} id={`${config.tab}-header`}>
                        <Typography>{config.tabTitle}</Typography>
                    </StyledAccordionSummary>
                    <StyledAccordionDetails>
                        <MobileSliderContent countryId={countryId} config={config} />
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
