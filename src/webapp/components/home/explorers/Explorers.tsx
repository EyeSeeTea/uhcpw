import React from "react";
import { SectionHeader } from "../section-header/SectionHeader";
import i18n from "../../../../locales";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { SectionBlock } from "../section-block/SectionBlock";
import { CTA } from "../buttons/CTA";
import indicatorExplorer from "../../../assets/indicator-explorer.svg";
import policyExplorer from "../../../assets/policy-explorer.svg";
import bubblePatternWhite from "../../../assets/bubble-pattern-white.png";
import { Divider } from "../common/Divider";
import { ExplorersContent } from "../../../../domain/entities/HomePageContent";

type ExplorersProps = {
    content: ExplorersContent;
};

export const Explorers: React.FC<ExplorersProps> = ({ content }) => {
    return (
        <>
            <SectionHeader header={content.title} subheader={content.subtitle} isBackgroundOnRight />
            <Content container>
                <IndicatorExplorer item md={6} xs={12}>
                    <ContentSectionGrid container>
                        <Grid item>
                            <SectionBlock title={content.indicator.title} text={content.indicator.text} />
                            <ButtonContainer>
                                <CTA text={content.indicator.buttonText || ""} link="/indicator-explorer" />
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
                                <CTA text={content.policy.buttonText || ""} link="/policy-explorer" />
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
    background: #fe8c4f url(${bubblePatternWhite}) -400px -130px no-repeat;
    color: white;
`;

const PolicyExplorer = styled(Grid)`
    background: #0089d6;
    color: white;
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
