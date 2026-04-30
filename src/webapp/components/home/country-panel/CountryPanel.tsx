import React from "react";
import { Button, Typography } from "@material-ui/core";
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
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { FinancialProtectionStatus } from "../../../../domain/entities/FinancialProtectionStatus";

export interface CountryPanelProps {
    country: Country;
    isRegionalPage?: boolean;
}

type ButtonItemType = {
    href?: string | undefined;
    children: React.ReactNode;
};

export const ButtonItem: React.FC<ButtonItemType> = ({ href, children }) => {
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <a href={href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
            <StyledButton>{children}</StyledButton>
        </a>
    );
};

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

            <ReactMarkdown
                components={{
                    a: ({ ...props }) => <ButtonItem {...props} />,
                }}
            >
                {summary}
            </ReactMarkdown>
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

const StyledButton = styled(Button)`
    background-color: white;
    opacity: 1;
    padding: 5px 30px;
    color: ${colors.accentPrimary};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.greyLight};
    }
`;
