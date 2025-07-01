import { Box, Card, Typography } from "@material-ui/core";

import React, { useCallback } from "react";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { CountryAnalysisState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { AnalysisItem } from "../common/AnalysisItem";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";

export interface CountryAnalysisItemProps {
    countryAnalysis: CountryAnalysisState;
    analyticsPageTitle: string;
}

export const CountryAnalysisItem: React.FC<CountryAnalysisItemProps> = React.memo(props => {
    const { countryAnalysis, analyticsPageTitle } = props;
    const { redirectWithEvent } = useAnalytics();

    const analyticsEvent = useCallback(
        (language: string) =>
            redirectWithEvent({
                name: "resource",
                pageTitle: analyticsPageTitle,
                year: countryAnalysis.date.getFullYear(),
                resourceName: countryAnalysis.title,
                category: countryAnalysis.kind,
                theme: countryAnalysis.themeName,
                language: language,
                country: countryAnalysis.countryName,
            }),
        [analyticsPageTitle, countryAnalysis, redirectWithEvent]
    );

    return (
        <Item elevation={0} role="listitem">
            <Row>
                <Flag src={countryAnalysis.countryFlag} alt={countryAnalysis.countryName} />
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                    {countryAnalysis.countryName}
                </Typography>
            </Row>
            <Box height={8} />
            <AnalysisItem
                type="country-analysis"
                title={countryAnalysis.title}
                themeCode={countryAnalysis.theme}
                themeName={countryAnalysis.themeName}
                links={countryAnalysis.links}
                image={countryAnalysis.imageOriginal}
                date={countryAnalysis.date}
                redirectWithEvent={analyticsEvent}
            />
        </Item>
    );
});

const Item = styled(Card)`
    border-radius: 10px;
    padding-block: 16px;
    flex-direction: column;
    a {
        text-decoration: none;
        font-size: 14px;
        color: ${colors.accentPrimary};
    }
    min-width: 180px;
    overflow: unset;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 85%;
        max-width: 400px;
        padding: 24px;
        justify-self: center;
        place-items: center;
        height: calc(100% - 48px);
    }
`;

const Row = styled.div`
    padding-top: 8px;
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-top: 0;
        margin-inline: 0;
        justify-self: flex-start;
        flex-wrap: nowrap;
    }
`;

const Flag = styled.img`
    width: 32px;
    height: 22px;
    margin-right: 8px;
`;
