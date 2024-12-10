import { Container, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import i18n from "../../../locales";
import { ExpertsNetwork } from "../../components/about/experts-network/ExpertsNetwork";
import { Header } from "../../components/about/header/Header";
import { Team } from "../../components/about/team/Team";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { useAbout } from "./useAbout";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

export const AboutPage: React.FC = React.memo(() => {
    const { team, experts, countryFilter, officeInfo } = useAbout();

    const { sendPageView } = useAnalytics();

    React.useEffect(() => {
        sendPageView({ title: "About us" });
    }, [sendPageView]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("WHO Barcelona Office for Health Systems Financing")}</Typography>
            </TitleContainer>

            <GradientDividerOrange />

            <HeaderSection>
                <Container maxWidth="xl">
                    <Header officeInfo={officeInfo} />
                </Container>
            </HeaderSection>

            <PeopleSection aria-label="Office team">
                <Container maxWidth="xl">
                    <Team team={team} />
                </Container>
            </PeopleSection>
            <GradientDividerOrange />

            <PeopleSection aria-label="Experts">
                <Container maxWidth="xl">
                    <ExpertsNetwork members={experts} countryFilter={countryFilter} />
                </Container>
            </PeopleSection>
        </Layout>
    );
});

const HeaderSection = styled.div`
    background: ${colors.gradientPrimary2};
    padding-bottom: 64px;
`;

const PeopleSection = styled.div`
    background: white;
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
