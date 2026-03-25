import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";
import { Divider } from "../common/Divider";
import { AnalysisContent } from "../../../../domain/entities/HomePageContent";
import { colors } from "../../../pages/app/themes/dhis2.theme";

type AnalysisProps = { content: AnalysisContent };

export const Analysis: React.FC<AnalysisProps> = ({ content }) => {
    return (
        <>
            <SectionHeader header={content.title} subheader={content.subtitle} />
            <Content container>
                <Region item md={6} xs={12}>
                    <BubbleImg
                        src={bubblePatternWhite}
                        alt="Bubble pattern"
                        aria-hidden="true"
                        decoding="async"
                        loading="eager"
                    />

                    <SectionBlock title={content.regional.title} text={content.regional.text} />

                    <ButtonContainer>
                        <Link href={content.regional.buttonLink || ""} isRegional>
                            {i18n.t(content.regional.buttonText || "")}
                        </Link>
                    </ButtonContainer>
                </Region>

                <CountryContext item md={6} xs={12}>
                    <BubbleImg
                        src={bubblePatternWhite}
                        alt="Bubble pattern"
                        aria-hidden="true"
                        decoding="async"
                        loading="eager"
                    />

                    <SectionBlock title={content.countries.title} text={content.countries.text} />

                    <ButtonContainer>
                        <Link href={content.countries.buttonLink || ""}>
                            {i18n.t(content.countries.buttonText || "")}
                        </Link>
                    </ButtonContainer>
                </CountryContext>
            </Content>
            <Divider />
        </>
    );
};

const Content = styled(Grid)``;

const CountryContext = styled(Grid)`
    background: ${colors.green};
    color: white;
    padding: 65px 55px;
    position: relative;
    overflow: hidden;
`;

const Region = styled(Grid)`
    background: ${colors.darkBlue};
    color: white;
    padding: 65px 55px;
    position: relative;
    overflow: hidden;
`;

const BubbleImg = styled.img`
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
    opacity: 0.9;
`;

const ButtonContainer = styled.div`
    margin-top: 30px;
`;

const Link = styled.a<{ isRegional?: boolean }>`
    color: ${props => (props.isRegional ? colors.accentPrimary : colors.green)};
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
