import React, { useMemo } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { AbbreviationsAndGlossary } from "./AbbreviationsAndGlossary";
import { PrivacyPolicyAndDisclaimer } from "./PrivacyPolicyAndDisclaimer";
import { ContactUs } from "./ContactUs";
import { getEuropeanUnionLines, getMobileFundingLines } from "./footerTextLines";
import { TextLines } from "./TextLines";
import { whoLogoEdgeAlignment } from "./footerStyles";

export const MobileAppFooter: React.FC = () => {
    const items = useMemo(
        () => [
            {
                id: "abbreviations-glossary",
                title: i18n.t("Abbreviations & glossary"),
                content: <AbbreviationsAndGlossary />,
            },
            {
                id: "privacy-policy-disclaimer",
                title: i18n.t("WHO privacy policy & disclaimer"),
                content: <PrivacyPolicyAndDisclaimer />,
            },
            {
                id: "contact-our-office",
                title: i18n.t("Contact our office"),
                content: <ContactUs isMobile />,
            },
        ],
        []
    );

    return (
        <>
            <FooterTop>
                <FlexContainer>
                    <WhoLogo src={whoLogoWhite} alt="WHO logo" loading="eager" decoding="async" />
                    <EuropeContainer>
                        <EuropeFlag src={europeFlag} alt="European Union flag" />
                        <EuropeText variant="body2">
                            {getEuropeanUnionLines(i18n.t("Co-funded by the European Union")).map(line => (
                                <EuropeTextLine key={line}>{line} </EuropeTextLine>
                            ))}
                        </EuropeText>
                    </EuropeContainer>
                </FlexContainer>

                <FundingText variant="body2">
                    <TextLines
                        lines={getMobileFundingLines(
                            i18n.t(
                                "The WHO Regional Office for Europe gratefully acknowledges funding from the Government of the Autonomous Community of Catalonia, Spain"
                            )
                        )}
                    />
                </FundingText>

                <AboutUsLink to="/about">
                    <Typography>{i18n.t("About us")}</Typography>
                </AboutUsLink>

                {items.map(item => (
                    <StyledAccordion key={item.id}>
                        <StyledAccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${item.id}-content`}
                            id={`${item.id}-header`}
                        >
                            <Typography>{item.title}</Typography>
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>{item.content}</StyledAccordionDetails>
                    </StyledAccordion>
                ))}
            </FooterTop>

            <FooterBottom>
                <Typography variant="body1">{i18n.t(`© ${new Date().getFullYear()} WHO`)}</Typography>
            </FooterBottom>
        </>
    );
};

// The logos span the whole row: the WHO logo touches the left padding and the EU text the right one.
const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    gap: 12px;
    margin-block-end: 16px;
`;

const EuropeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
`;

const EuropeFlag = styled.img`
    width: 100px;

    @media (max-width: 500px) {
        width: 80px;
    }

    @media (max-width: 450px) {
        width: 60px;
    }
`;

const WhoLogo = styled.img`
    --who-logo-width: 150px;
    width: var(--who-logo-width);
    flex-shrink: 0;
    ${whoLogoEdgeAlignment}

    @media (max-width: 500px) {
        --who-logo-width: 130px;
    }

    @media (max-width: 450px) {
        --who-logo-width: 100px;
    }
`;

const EuropeText = styled(Typography)`
    margin-left: 16px;
`;

// Unbreakable left-aligned lines keep the label as wide as its longest line, so it ends exactly at the right padding.
// From 580px the row has room for the whole label (logo, flag and label need about 490px), so the lines join into one;
// the trailing space inside each line separates the words then.
const EuropeTextLine = styled.span`
    display: block;
    white-space: nowrap;

    @media (min-width: 580px) {
        display: inline;
    }
`;

const FundingText = styled(Typography)`
    width: 100%;
    max-width: 100%;
    text-align: center;
    margin-block: 20px;
`;

const FooterTop = styled.div`
    padding: 48px 32px;
    background: ${colors.accentPrimary};
    color: white;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
    font-size: 14px;
    border-radius: 20px;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
    min-height: 48px;
    .MuiTypography-root {
        font-weight: 500;
        font-size: 20px;
    }

    .MuiAccordionSummary-content {
        margin: 12px 0;
    }

    .MuiSvgIcon-root {
        color: white;
    }
`;

const AboutUsLink = styled(NavLink)`
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    margin: 8px 0;
    background-color: ${colors.accentPrimary};
    color: white;
    text-decoration: none;
    border: 1px solid #ffffff33;
    border-radius: 20px;

    .MuiTypography-root {
        font-weight: 500;
        font-size: 20px;
        margin: 12px 0;
    }
`;

const StyledAccordion = styled(Accordion)`
    background-color: ${colors.accentPrimary};
    color: white;
    border: 1px solid #ffffff33;
    border-radius: 20px;
    margin: 8px 0;
    box-shadow: none;

    &::before {
        display: none;
    }

    &:last-child {
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }
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
