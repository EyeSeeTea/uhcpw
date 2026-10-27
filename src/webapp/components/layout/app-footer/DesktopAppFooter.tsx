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
import { whoLogoEdgeAlignment } from "./footerStyles";

export const DesktopAppFooter: React.FC = () => {
    const { generalContent } = useAppContext();

    return (
        <>
            <FooterTop>
                <FooterGrid>
                    <Logo src={whoLogoWhite} alt="WHO logo" loading="eager" decoding="async" />

                    <FundingText variant="body1">
                        <TextLines
                            isFlowingWhenNarrow
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
                            <TextLines
                                lines={getEuropeanUnionLines(i18n.t("Co-funded by the European Union"))}
                                isFlowingWhenNarrow
                            />
                        </EuropeText>
                    </EuropeContainer>

                    <Disclaimer variant="body1">
                        <TextLines
                            isFlowingWhenNarrow
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

// Three equal columns with the gap of the home page resources grid, so each column starts at the left edge of a
// resource card at every desktop width and zoom.
const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-areas:
        "logo fund  info"
        "flag discl contact";
    column-gap: 40px;
    row-gap: 48px;

    /* The client's banner spaces the lines more than the default body1 */
    .MuiTypography-body1 {
        line-height: 1.6;
    }
`;

const Logo = styled.img`
    --who-logo-width: 200px;
    grid-area: logo;
    width: var(--who-logo-width);
    ${whoLogoEdgeAlignment}
    /* The client lines up the top of the emblem's olive branches, not the tip of the staff, with the capitals of the
       first text line. The branches start 13px below the top of the logo and the capitals 7px below the top of the
       line, so the logo moves up 6px without changing the row height. */
    transform: translateY(-6px);
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
    margin-block-start: 6px;
`;

const EuropeText = styled(Typography)`
    margin-left: 16px;
`;

// Same side padding as the home page resources grid, so the footer columns start where the resource cards do
const FooterTop = styled.div`
    padding: 48px;
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
