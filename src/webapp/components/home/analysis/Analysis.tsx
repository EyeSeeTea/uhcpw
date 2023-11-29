import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import { CTA } from "../buttons/CTA";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";
import { Divider } from "../common/Divider";

export const Analysis: React.FC = () => {
    return (
        <>
            <SectionHeader
                header={i18n.t("Analysis")}
                subheader={i18n.t("Country-level and comparative analysis of financial protection")}
            />
            <Content container>
                <CountryContext item md={6} xs={12}>
                    <SectionBlock
                        title={i18n.t("Countries in context")}
                        text={i18n.t(
                            "Find out about the health system factors that strengthen and undermine financial protection at country level"
                        )}
                    />
                    <ButtonContainer>
                        <CTA text={i18n.t("Country pages")} link={`/country-page?country=VGOzFKfSazN`} />
                    </ButtonContainer>
                </CountryContext>
                <Region item md={6} xs={12}>
                    <SectionBlock
                        title={i18n.t("The region at a glance")}
                        text={i18n.t(
                            "Compare financial protection indicators, identify gaps in coverage, explore good practice"
                        )}
                    />
                    <ButtonContainer>
                        <Tag>
                            <Typography>{i18n.t("Coming soon")}</Typography>
                        </Tag>
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

const Tag = styled.div`
    color: #4fad56;
    background-color: white;
    font-size: 14px;
    border-radius: 30px;
    padding: 10px 40px;
    width: fit-content;
    height: 25px;
    display: flex;
    align-items: center;
`;
