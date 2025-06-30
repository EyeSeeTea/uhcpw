import React from "react";
import { Container, Grid, Typography, Link } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { AboutUsInfo } from "./AboutUsInfo";
import { ContactUs } from "./ContactUs";
import { useAppContext } from "../../../contexts/app-context";

export const DesktopAppFooter: React.FC = () => {
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
                            <AboutUsInfo />
                        </Grid>

                        <Grid item lg={3} md={6} xs={12}>
                            <ContactUs />
                        </Grid>
                    </Grid>
                </Container>
            </FooterTop>

            <FooterBottom>
                <Cookies href={generalContent?.cookies.policyUrl} target="_blank">
                    <Typography variant="body1">{i18n.t("WHO privacy policy")}</Typography>
                </Cookies>

                <Typography variant="body1">{i18n.t(`© ${new Date().getFullYear()} WHO`)}</Typography>
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
    gap: 4px;
`;

const Cookies = styled(Link)`
    color: white;
    display: flex;
`;

const Disclaimer = styled(Typography)`
    margin-block-start: 16px;
    padding-inline-start: 0.3125rem;
    max-width: 43.75rem;
`;

const FirstGrid = styled(Grid)`
    &.MuiGrid-item {
        padding-inline-end: 0;
    }
`;
