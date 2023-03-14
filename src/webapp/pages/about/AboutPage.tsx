import { Container, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Team } from "../../components/about/team/Team";
import { Layout } from "../../components/layout/Layout";

import { colors } from "../app/themes/dhis2.theme";
import { useAbout } from "./useAbout";

export const AboutPage: React.FC = React.memo(() => {
    const { team } = useAbout();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("WHO Barcelona Office for Health Systems Financing")}</Typography>
            </TitleContainer>
            <GradientDividerOrange />

            <TeamSection>
                <Container maxWidth="xl">
                    <Team team={team} />
                </Container>
            </TeamSection>
            {/* <NewsSection>
                <Container maxWidth="xl">
                    <News newsItems={news} />
                </Container>
            </NewsSection> */}
        </Layout>
    );
});

const TeamSection = styled.div`
    background: white;
    padding-bottom: 64px;
`;

const MultimediaSection = styled.div`
    background: ${colors.gradientPrimary2};
    padding-bottom: 64px;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary2};
    color: white;
    padding: 32px 64px;
`;

const GradientDividerOrange = styled.div`
    background: linear-gradient(90deg, rgb(255, 141, 78) 0%, rgb(255, 223, 190) 100%);
    height: 20px;
`;
