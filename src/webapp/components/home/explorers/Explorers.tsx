import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import indicatorExplorer from "../../../assets/indicator-explorer.svg";
import policyExplorer from "../../../assets/policy-explorer.svg";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";
import { Divider } from "../common/Divider";
import { ExplorersContent } from "../../../../domain/entities/HomePageContent";
import { colors } from "../../../pages/app/themes/dhis2.theme";

type ExplorersProps = {
    content: ExplorersContent;
};

export const Explorers: React.FC<ExplorersProps> = ({ content }) => {
    return (
        <>
            <SectionHeader header={content.title} subheader={content.subtitle} isBackgroundOnRight />

            <Content container>
                <IndicatorExplorer item md={6} xs={12}>
                    <BubbleImg
                        src={bubblePatternWhite}
                        alt="Bubble pattern"
                        aria-hidden="true"
                        decoding="async"
                        loading="eager"
                    />

                    <ContentSectionGrid container>
                        <Grid item>
                            <SectionBlock title={content.indicator.title} text={content.indicator.text} />

                            <ButtonContainer>
                                <Link href={content.indicator.buttonLink || ""}>
                                    {i18n.t(content.indicator.buttonText || "")}
                                </Link>
                            </ButtonContainer>
                        </Grid>

                        <Grid item>
                            <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
                        </Grid>
                    </ContentSectionGrid>
                </IndicatorExplorer>

                <PolicyExplorer item md={6} xs={12}>
                    <ContentSectionGrid container>
                        <Grid item>
                            <SectionBlock title={content.policy.title} text={content.policy.text} />

                            <ButtonContainer>
                                <Link href={content.policy.buttonLink || ""}>
                                    {i18n.t(content.policy.buttonText || "")}
                                </Link>
                            </ButtonContainer>
                        </Grid>

                        <Grid item>
                            <Image src={policyExplorer} alt={i18n.t("policy explorer")} />
                        </Grid>
                    </ContentSectionGrid>
                </PolicyExplorer>
            </Content>
            <Divider />
        </>
    );
};

const Content = styled(Grid)``;

const IndicatorExplorer = styled(Grid)`
    background: #fe8c4f;
    color: white;
    position: relative;
    overflow: hidden;
`;

const PolicyExplorer = styled(Grid)`
    background: #0089d6;
    color: white;
`;

const BubbleImg = styled.img`
    position: absolute;
    top: -130px;
    left: -400px;
    height: auto;
    pointer-events: none;
    opacity: 0.9;
`;

const ButtonContainer = styled.div`
    margin-top: 30px;
`;

const ContentSectionGrid = styled(Grid)`
    width: 100%;
    padding: 65px 55px;
    justify-content: space-between;
    gap: 5px;
`;

const Image = styled.img`
    @media (max-width: 1440px) {
        width: 100px;
    }
    @media (max-width: 768px) {
        width: 100px;
    }
`;

const Link = styled.a`
    color: ${colors.accentPrimary};
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
