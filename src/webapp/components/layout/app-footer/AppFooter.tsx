import React from "react";
import { Container, Grid, Typography, Link } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../../locales";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../../contexts/app-context";

const URL_WHO_BCN_OFFICE_HEALTH_SYSTEMS_FINANCING =
    "https://www.who.int/europe/teams/office-for-health-systems-financing-(barcelona)";

export const AppFooter: React.FC = () => {
    const { generalContent } = useAppContext();
    return (
        <>
            <FooterTop>
                <Container maxWidth="xl">
                    <Grid container spacing={6}>
                        <FirstGrid item lg={3} md={6} xs={12}>
                            <img src={whoLogoWhite} width={150} alt="WHO logo" />
                            <Disclaimer variant="body2">
                                {i18n.t(
                                    generalContent?.footer.disclaimer ||
                                        "* All references to Kosovo should be understood to be in the context of the United Nations Security Council resolution 1244 (1999)"
                                )}
                            </Disclaimer>
                        </FirstGrid>
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
                                {i18n.t("Sant Pau Art Nouveau Site (La Mercè)")}
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
                                {i18n.t("Email:")}{" "}
                                <MailLink href="mailto:uhcwatch@who.int" target="_blank" rel="noopener noreferrer">
                                    uhcwatch@who.int
                                </MailLink>
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </FooterTop>

            <FooterBottom>
                <Typography variant="body2">{i18n.t(`© ${new Date().getFullYear()} WHO`)}</Typography>
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
    padding-inline-start: 3.75rem;
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

const MailLink = styled.a`
    text-decoration: none;
    color: inherit;
`;

const Disclaimer = styled(Typography)`
    margin-block-start: 16px;
    padding-inline-start: 0.3125rem;
`;

const FirstGrid = styled(Grid)`
    &.MuiGrid-item {
        padding-inline-end: 0;
    }
`;
