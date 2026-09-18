import React from "react";
import { Container, Typography, Link } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { AboutUsInfo } from "./AboutUsInfo";
import { ContactUs } from "./ContactUs";
import { useAppContext } from "../../../contexts/app-context";
import { getDesktopFundingLines, getDisclaimerLines } from "./footerTextLines";
import { TextLines } from "./TextLines";

export const DesktopAppFooter: React.FC = () => {
    const { generalContent } = useAppContext();

    return (
        <>
            <FooterTop>
                <Container maxWidth="xl">
                    <FooterGrid>
                        <Logo src={whoLogoWhite} width={150} alt="WHO logo" loading="eager" decoding="async" />

                        <FundingText variant="body1">
                            <TextLines
                                lines={getDesktopFundingLines(
                                    i18n.t(
                                        "The WHO Regional Office for Europe gratefully acknowledges funding from the Government of the Autonomous Community of Catalonia, Spain"
                                    )
                                )}
                            />
                        </FundingText>

                        <InfoArea>
                            <AboutUsInfo />
                        </InfoArea>

                        <Disclaimer variant="body1">
                            <TextLines
                                lines={getDisclaimerLines(
                                    i18n.t(
                                        generalContent?.footer.disclaimer ||
                                            "* All references to Kosovo should be understood to be in the context of the United Nations Security Council resolution 1244 (1999)"
                                    )
                                )}
                            />
                        </Disclaimer>

                        <EuropeContainer>
                            <img src={europeFlag} width={100} alt="WHO logo" />
                            <EuropeText variant="body1">{i18n.t("Co-funded by the European Union")}</EuropeText>
                        </EuropeContainer>

                        <ContactArea>
                            <ContactUs showTitle={false} />
                        </ContactArea>
                    </FooterGrid>
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

const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
        "logo  fund  info"
        "discl flag  contact";
    column-gap: 48px;
    row-gap: 8px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas:
            "logo  fund"
            "discl flag"
            "info  contact";
        row-gap: 24px;
    }
`;

const Logo = styled.img`
    grid-area: logo;
`;

const InfoArea = styled.div`
    grid-area: info;
`;

const ContactArea = styled.div`
    grid-area: contact;
`;

const EuropeContainer = styled.div`
    grid-area: flag;
    align-self: start;
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
    grid-area: discl;
    padding-inline-start: 0.3125rem;
    max-width: 43.75rem;
`;

const FundingText = styled(Typography)`
    grid-area: fund;
    margin-block-end: 12px;
`;
