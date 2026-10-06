import React from "react";
import { Typography, Link } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { AboutUsInfo } from "./AboutUsInfo";
import { ContactUs } from "./ContactUs";
import { useAppContext } from "../../../contexts/app-context";
import { getDesktopFundingLines, getDisclaimerLines, getEuropeanUnionLines } from "./footerTextLines";
import { TextLines } from "./TextLines";

export const DesktopAppFooter: React.FC = () => {
    const { generalContent } = useAppContext();

    return (
        <>
            <FooterTop>
                <FooterGrid>
                    <Logo src={whoLogoWhite} width={200} alt="WHO logo" loading="eager" decoding="async" />

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

                    <EuropeContainer>
                        <img src={europeFlag} width={100} alt="European Union flag" />
                        <EuropeText variant="body1">
                            <TextLines lines={getEuropeanUnionLines(i18n.t("Co-funded by the European Union"))} />
                        </EuropeText>
                    </EuropeContainer>

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

                    <ContactArea>
                        <ContactUs />
                    </ContactArea>
                </FooterGrid>
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

// Each column is as wide as its content and the free space is shared out between them, so the gaps between
// the columns are the same and the first and last ones touch the footer margins.
// The client's lines never wrap: the columns need 968px plus the gaps, the margins and the scrollbar, so below 1160px
// (a 1920px screen zoomed to 175%) the footer falls back to two columns, each one taking half the width.
const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    justify-content: space-between;
    grid-template-areas:
        "logo fund  info"
        "flag discl contact";
    column-gap: 32px;
    row-gap: 48px;
    max-width: 1536px;
    margin: 0 auto;

    /* The client's banner spaces the lines more than the default body1 */
    .MuiTypography-body1 {
        line-height: 1.6;
    }

    @media (max-width: 1160px) {
        grid-template-columns: repeat(2, minmax(max-content, 1fr));
        grid-template-areas:
            "logo fund"
            "flag discl"
            "info contact";
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
    align-items: center;
`;

const EuropeText = styled(Typography)`
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
`;

const FundingText = styled(Typography)`
    grid-area: fund;
`;
