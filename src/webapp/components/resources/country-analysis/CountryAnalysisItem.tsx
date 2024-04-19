import { Box, Card, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { CountryAnalysisState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { AnalysisItem } from "../common/AnalysisItem";

export interface CountryAnalysisItemProps {
    countryAnalysis: CountryAnalysisState;
}

export const CountryAnalysisItem: React.FC<CountryAnalysisItemProps> = React.memo(({ countryAnalysis }) => {
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
            />
        </Item>
    );
});

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

const Row = styled.div`
    padding-top: 8px;

    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

const Flag = styled.img`
    width: 32px;
    height: 22px;
    margin-right: 8px;
`;
