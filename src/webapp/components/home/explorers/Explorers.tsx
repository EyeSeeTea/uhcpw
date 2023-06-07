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

export const Explorers: React.FC = () => {
    return (
        <>
            <SectionHeader
                header={i18n.t("Explorers")}
                subheader={i18n.t("Assess the current situation, monitor trends, compare countries")}
                isBackgroundOnRight
            />
            <Content container>
                <IndicatorExplorer item md={6} xs={12}>
                    <ContentSectionGrid container>
                        <Grid item>
                            <SectionBlock
                                title={i18n.t("Indicator explorer")}
                                text={i18n.t(
                                    "Over 50 indicators of financial hardship, unmet need for health care and spending on health"
                                )}
                            />
                            <ButtonContainer>
                                <CTA text={i18n.t("Explore data")} link="/indicator-explorer" />
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
                            <SectionBlock
                                title={i18n.t("Policy explorer")}
                                text={i18n.t(
                                    "Information on population coverage, service coverage, user charges and voluntary health insurance"
                                )}
                            />
                            <ButtonContainer>
                                <CTA text={i18n.t("Explore data")} link="/policy-explorer" />
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
`;

const Image = styled.img`
    @media (max-width: 1440px) {
        width: 100px;
    }
    @media (max-width: 768px) {
        width: 100px;
    }
`;
