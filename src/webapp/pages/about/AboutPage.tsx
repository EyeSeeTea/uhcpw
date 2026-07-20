import { Container, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import i18n from "../../../locales";
import { ExpertsNetwork } from "../../components/about/experts-network/ExpertsNetwork";
import { Header } from "../../components/about/header/Header";
import { Team } from "../../components/about/team/Team";
import { Layout } from "../../components/layout/Layout";
import { colors } from "../app/themes/dhis2.theme";
import { useAbout } from "./useAbout";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

const EXPERTS_HASH = "#experts";

export const AboutPage: React.FC<{ searchParams?: string }> = React.memo(props => {
    const regionCode = useMemo(
        () => new URLSearchParams(props.searchParams).get("region") ?? undefined,
        [props.searchParams]
    );
    const { team, experts, countryFilter, officeInfo, isLoading } = useAbout({ regionCode });
    const { sendPageView } = useAnalytics();
    const location = useLocation();
    const expertsRef = useRef<HTMLDivElement>(null);
    const hasScrolledToExpertsRef = useRef(false);

    useEffect(() => {
        sendPageView({ title: "About us" });
    }, [sendPageView]);

    useEffect(() => {
        if (location.hash !== EXPERTS_HASH || isLoading || hasScrolledToExpertsRef.current) return;

        hasScrolledToExpertsRef.current = true;
        const scrollAfterRender = window.setTimeout(() => {
            expertsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);

        return () => window.clearTimeout(scrollAfterRender);
    }, [location.hash, isLoading]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("WHO Barcelona Office for Health Systems Financing")}</Typography>
            </TitleContainer>

            <GradientDividerOrange />

            <HeaderSection>
                <StyledContainer maxWidth="xl">
                    <Header officeInfo={officeInfo} />
                </StyledContainer>
            </HeaderSection>

            <PeopleSection aria-label="Office team">
                <StyledContainer maxWidth="xl">
                    <Team team={team} />
                </StyledContainer>
            </PeopleSection>
            <GradientDividerOrange />

            <PeopleSection aria-label="Experts" ref={expertsRef}>
                <StyledContainer maxWidth="xl">
                    <ExpertsNetwork members={experts} countryFilter={countryFilter} />
                </StyledContainer>
            </PeopleSection>
        </Layout>
    );
});

const StyledContainer = styled(Container)`
    overflow: hidden;
`;

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
    @media (max-width: 959px) {
        padding: 32px;
    }
`;

const GradientDividerOrange = styled.div`
    background: linear-gradient(90deg, rgb(255, 141, 78) 0%, rgb(255, 223, 190) 100%);
    height: 20px;
`;
