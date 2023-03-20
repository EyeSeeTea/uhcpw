import { Container, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { PolicyExplorerFilters } from "../../components/policy-explorer/resources-filters/PolicyExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { usePolicyExplorer } from "./usePolicyExplorer";

export const PolicyExplorerPage: React.FC = React.memo(() => {
    const { filters } = usePolicyExplorer();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Policy Explorer")}</Typography>
                <Typography variant="body1" style={{ maxWidth: "600px", padding: "8px 0px" }}>
                    {i18n.t(
                        "Track and compare policies on population coverage, service coverage, user charges and voluntary health insurance and explore gaps in coverage"
                    )}
                </Typography>
            </TitleContainer>

            <MainSection>
                <Container maxWidth="lg">
                    <PolicyExplorerFilters filters={filters} />
                </Container>
            </MainSection>
        </Layout>
    );
});

const MainSection = styled.div`
    background: white;
    padding-bottom: 64px;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 48px 64px;
`;
