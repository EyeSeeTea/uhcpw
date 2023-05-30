import { Box, Card, Divider, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { CountryAnalysisState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { Theme } from "../theme/Theme";

export interface CountryAnalysisItemProps {
    countryAnalysis: CountryAnalysisState;
}

export const CountryAnalysisItem: React.FC<CountryAnalysisItemProps> = React.memo(({ countryAnalysis }) => {
    return (
        <Item elevation={0} role="listitem">
            <Column>
                <Row>
                    <Flag src={countryAnalysis.countryFlag} alt={countryAnalysis.countryName} />
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                        {countryAnalysis.countryName}
                    </Typography>
                </Row>
                <Box height={8} />
                <Cover width={"100%"} src={countryAnalysis.image} alt={countryAnalysis.text} />
                <Box height={20} />
                <Theme theme={countryAnalysis.theme} />
                <Row>
                    <Typography variant="body1">{countryAnalysis.year}</Typography>

                    <StyledDivider orientation="vertical" flexItem />

                    {countryAnalysis.links.map((link, index) => {
                        return (
                            <>
                                <a key={link.url} href={link.url} style={{ fontSize: "16px" }}>
                                    {link.language}
                                </a>
                                {index < countryAnalysis.links.length - 1 && (
                                    <StyledDivider orientation="vertical" flexItem />
                                )}
                            </>
                        );
                    })}
                </Row>
                <Box height={6} />
                <Typography variant="body1">{countryAnalysis.text}</Typography>
            </Column>
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

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const StyledDivider = styled(Divider)`
    margin: 0px 8px 0px 4px;
`;

const Flag = styled.img`
    width: 32px;
    height: 22px;
    margin-right: 8px;
`;

const Cover = styled.img`
    border: 1px solid #c3bfbf;
`;
