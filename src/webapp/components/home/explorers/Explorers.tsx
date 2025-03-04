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
                    <ContentSectionGrid container>
                        <StyledGrid item>
                            <FlexContainer gap={30} isColumn>
                                <FlexContainer gap={20}>
                                    <SectionBlock title={content.indicator.title} text={content.indicator.text} />

                                    <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
                                </FlexContainer>

                                <ButtonContainer>
                                    <Link href={content.indicator.buttonLink || ""}>
                                        {i18n.t(content.indicator.buttonText || "")}
                                    </Link>
                                </ButtonContainer>
                            </FlexContainer>
                        </StyledGrid>
                    </ContentSectionGrid>
                </IndicatorExplorer>

                <PolicyExplorer item md={6} xs={12}>
                    <ContentSectionGrid container>
                        <StyledGrid item>
                            <FlexContainer gap={30} isColumn>
                                <FlexContainer gap={20}>
                                    <SectionBlock title={content.policy.title} text={content.policy.text} />

                                    <Image src={policyExplorer} alt={i18n.t("policy explorer")} />
                                </FlexContainer>

                                <ButtonContainer>
                                    <Link href={content.policy.buttonLink || ""}>
                                        {i18n.t(content.policy.buttonText || "")}
                                    </Link>
                                </ButtonContainer>
                            </FlexContainer>
                        </StyledGrid>
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

const ButtonContainer = styled.div``;

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

const StyledGrid = styled(Grid)`
    width: 100%;
`;

const FlexContainer = styled.div<{ isColumn?: boolean; gap: number }>`
    display: flex;
    flex-direction: ${props => (props.isColumn ? "column" : "row")};
    justify-content: space-between;
    width: 100%;
    gap: ${props => props.gap}px;
`;
