import { Card } from "@material-ui/core";

import React, { useCallback } from "react";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { ComparativeAnalysisState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { AnalysisItem } from "../common/AnalysisItem";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysisState;
    minimalVersion?: boolean;
    analyticsPageTitle: string;
    normalize?: boolean;
}

export const ComparativeAnalysisItem: React.FC<CountryAnalysisProps> = React.memo(props => {
    const { comparativeAnalysis, minimalVersion, analyticsPageTitle, normalize } = props;
    const { redirectWithEvent } = useAnalytics();

    const analyticsEvent = useCallback(
        (language: string) =>
            redirectWithEvent({
                name: "resource",
                pageTitle: analyticsPageTitle,
                year: comparativeAnalysis.date.getFullYear(),
                resourceName: comparativeAnalysis.title,
                category: comparativeAnalysis.kind,
                theme: comparativeAnalysis.analyticsTheme,
                language: language,
            }),
        [analyticsPageTitle, comparativeAnalysis, redirectWithEvent]
    );

    return (
        <Item elevation={0} role="listitem">
            {normalize && <Row />}
            <AnalysisItem
                title={comparativeAnalysis.title}
                themes={comparativeAnalysis.resourceThemes}
                links={comparativeAnalysis.links}
                image={comparativeAnalysis.imageOriginal}
                date={comparativeAnalysis.date}
                minimalVersion={minimalVersion}
                redirectWithEvent={analyticsEvent}
                type="comparative-analysis"
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
    width: 180px;
    overflow: unset;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        width: 90%;
        max-width: 400px;
        padding: 16px;
        justify-self: center;
        place-items: center;
        height: 100%;
        padding: 0;
    }
`;

const Row = styled.div`
    padding: 8px 0;
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-top: 0;
        margin-inline: 16px;
        justify-self: flex-start;
        flex-wrap: nowrap;
    }
`;
