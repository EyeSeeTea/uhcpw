import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";

import { Country } from "../../../../domain/entities/Country";
import ReactMarkdown from "react-markdown";
import insufficientDataIcon from "../../../assets/map/icon-insufficient.svg";
import weakIcon from "../../../assets/map/icon-weak.svg";
import veryWeakIcon from "../../../assets/map/icon-very-weak.svg";
import gapsIcon from "../../../assets/map/icon-gaps.svg";
import emergingIcon from "../../../assets/map/icon-emerging.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import { Divider } from "material-ui";
import { FinancialProtectionStatus } from "../../../../domain/entities/FinancialProtectionStatus";
import { countrySummaryMarkdownComponents } from "../../country-summary/countrySummaryMarkdownComponents";

export interface CountryPanelProps {
    country: Country;
    isRegionalPage?: boolean;
}

const iconStatusMap: Record<FinancialProtectionStatus, string> = {
    Strong: strongIcon,
    Emerging: emergingIcon,
    Gaps: gapsIcon,
    Weak: weakIcon,
    VeryWeak: veryWeakIcon,
    InsufficientData: insufficientDataIcon,
};

export const CountryPanel: React.FC<CountryPanelProps> = ({ country, isRegionalPage }) => {
    const summary = React.useMemo(() => {
        if (isRegionalPage) {
            return `${country.generalSummary}\n\n${country.regionalPageSummary}`;
        }

        return `${country.generalSummary}\n\n${country.homePageSummary}`;
    }, [country, isRegionalPage]);

    return (
        <Container $isRegionalPage={isRegionalPage}>
            <Row>
                <UmbrellaItem>
                    <Marker src={iconStatusMap[country.status]} />
                </UmbrellaItem>
                <StyledTitle variant="h2" $isRegionalPage={isRegionalPage} style={{ fontWeight: 400 }}>
                    {country.name}
                </StyledTitle>
            </Row>

            <Divider style={{ backgroundColor: "white", margin: "38px 0px" }} />

            <ReactMarkdown components={countrySummaryMarkdownComponents}>{summary}</ReactMarkdown>
        </Container>
    );
};

const Container = styled.div<{ $isRegionalPage?: boolean }>`
    padding-inline-start: ${props => (props.$isRegionalPage ? "16px" : "0")};
    overflow-y: auto;
    font-size: 16px;
    ul {
        list-style-position: outside;
        padding-inline-start: 16px;
        > li {
            padding-inline-start: 7px;
        }
    }
`;

const StyledTitle = styled(Typography)<{ $isRegionalPage?: boolean }>`
    font-size: ${props => (props.$isRegionalPage ? "42px" : "3.75rem")};
    line-height: 1.2;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 32px;
`;

const UmbrellaItem = styled.div`
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
`;

const Marker = styled.img`
    background-size: cover;
    width: 80px;
    margin-right: 24px;
`;
