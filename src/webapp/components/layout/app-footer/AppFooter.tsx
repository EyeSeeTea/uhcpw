import React from "react";
import { Box, Container, Grid, Typography, Link } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../../locales";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { NavLink } from "react-router-dom";

const URL_WHO_BCN_OFFICE_HEALTH_SYSTEMS_FINANCING =
    "https://www.who.int/europe/teams/office-for-health-systems-financing-(barcelona)";

export const AppFooter: React.FC = () => {
    return (
        <>
            <FooterTop>
                <Container maxWidth="xl">
                    <Grid container spacing={6}>
                        <Grid item lg={3} md={6} xs={12}>
                            <img src={whoLogoWhite} width={150} alt="WHO logo" />
                        </Grid>
                        <Grid item lg={3} md={6} xs={12}>
                            <EuropeContainer>
                                <img src={europeFlag} width={100} alt="WHO logo" />
                                <EuropeText variant="body2">{i18n.t("Co-funded by the European Union")}</EuropeText>
                            </EuropeContainer>
                        </Grid>
                        <Grid item lg={3} md={6} xs={12}>
                            <StyledNavLink to={"/about"}>
                                <Typography variant="body1" gutterBottom>
                                    {i18n.t("About us")}
                                </Typography>
                            </StyledNavLink>
                            <Link href={URL_WHO_BCN_OFFICE_HEALTH_SYSTEMS_FINANCING} target="_blank">
                                <Typography variant="body2" gutterBottom style={{ maxWidth: "60%", color: "white" }}>
                                    {i18n.t("WHO Barcelona Office for Health Systems Financing")}
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item lg={3} md={6} xs={12}>
                            <Typography variant="body1" gutterBottom>
                                {i18n.t("Contact our office")}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {i18n.t("Sant Pau Art Nouveau Site (La Mercè pavillon)")}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {i18n.t("Sant Antoni Maria Claret 167")}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {i18n.t("08025 Barcelona, Spain")}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {i18n.t("Tel: +34 673 290 861", { nsSeparator: false })}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {i18n.t("Email: uhcwatch@who.int", { nsSeparator: false })}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </FooterTop>

            <FooterBottom>
                <Typography variant="body2">{i18n.t(`© ${new Date().getFullYear()} WHO`)}</Typography>
                <Box width={20} />
                <Typography variant="body2" display="inline">
                    {i18n.t("Privacy legal notice")}
                </Typography>
            </FooterBottom>
        </>
    );
};

const EuropeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
`;

const EuropeText = styled(Typography)`
    width: 150px;
    margin-left: 16px;
`;

const FooterTop = styled.div`
    padding: 48px 32px;
    background: #0089d6;
    color: white;
`;

const FooterBottom = styled.div`
    padding-left: 48px;
    height: 50px;
    background: #0360a6;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
`;
