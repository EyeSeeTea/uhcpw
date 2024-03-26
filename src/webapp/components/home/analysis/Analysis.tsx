import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import { CTA } from "../buttons/CTA";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";
import { Divider } from "../common/Divider";
import { AnalysisContent } from "../../../pages/home/useHomePageContent";

const ALBANIA_COUNTRY_ID = "VGOzFKfSazN";

type AnalysisProps = { content: AnalysisContent };

export const Analysis: React.FC<AnalysisProps> = ({ content }) => {
    return (
        <>
            <SectionHeader header={content.title} subheader={content.subtitle} />
            <Content container>
                <CountryContext item md={6} xs={12}>
                    <SectionBlock title={content.countries.title} text={content.countries.text} />
                    <ButtonContainer>
                        <CTA
                            text={content.countries.buttonText || ""}
                            link={`/country-page?country=${ALBANIA_COUNTRY_ID}`}
                        />
                    </ButtonContainer>
                </CountryContext>
                <Region item md={6} xs={12}>
                    <SectionBlock title={content.regional.title} text={content.regional.text} />
                    <ButtonContainer>
                        <Link href="https://cmyn.short.gy/regionalreport" target="_blank" rel="noreferrer">
                            {i18n.t(content.regional.buttonText || "")}
                        </Link>
                    </ButtonContainer>
                </Region>
            </Content>
            <Divider />
        </>
    );
};

const Content = styled(Grid)``;

const CountryContext = styled(Grid)`
    background: #0360a6 url(${bubblePatternWhite}) no-repeat top right;
    color: white;
    padding: 65px 55px;
`;

const Region = styled(Grid)`
    background: #4fac56 url(${bubblePatternWhite}) no-repeat top right;
    color: white;
    padding: 65px 55px;
`;

const ButtonContainer = styled.div`
    margin-top: 30px;
`;

const Link = styled.a`
    color: #4fad56;
    background-color: white;
    font-size: 14px;
    border-radius: 30px;
    padding: 10px 40px;
    width: fit-content;
    height: 25px;
    display: flex;
    align-items: center;
    text-transform: none;
    text-decoration: none;
    font-size: 16px;
`;
