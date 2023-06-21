import { Card } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { ComparativeAnalysis } from "../../../../domain/entities/resources/Resource";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { AnalysisItem } from "../common/AnalysisItem";
import { ResourcesFiltersState } from "../../../pages/resources/common/ResourcesFiltersState";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysis;
    minimalVersion?: boolean;
    filters: ResourcesFiltersState;
}

export const ComparativeAnalysisItem: React.FC<CountryAnalysisProps> = React.memo(
    ({ comparativeAnalysis, minimalVersion, filters }) => {
        return (
            <Item elevation={0} role="listitem">
                <AnalysisItem
                    analysisResource={comparativeAnalysis}
                    minimalVersion={minimalVersion}
                    filters={filters}
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
`;
