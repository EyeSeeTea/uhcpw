import { Card } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { ComparativeAnalysisState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { AnalysisItem } from "../common/AnalysisItem";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysisState;
    minimalVersion?: boolean;
}

export const ComparativeAnalysisItem: React.FC<CountryAnalysisProps> = React.memo(
    ({ comparativeAnalysis, minimalVersion }) => {
        return (
            <Item elevation={0} role="listitem">
                <AnalysisItem
                    title={comparativeAnalysis.title}
                    themeCode={comparativeAnalysis.theme}
                    themeName={comparativeAnalysis.themeName}
                    links={comparativeAnalysis.links}
                    image={comparativeAnalysis.imageOriginal}
                    date={comparativeAnalysis.date}
                    minimalVersion={minimalVersion}
                    type="comparative-analysis"
                />
            </Item>
        );
    }
);

const Item = styled(Card)`
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
    a {
        text-decoration: none;
        font-size: 14px;
        color: ${colors.accentPrimary};
    }
    width: 180px;
`;
