import React, { useMemo } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styled from "styled-components";

import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import whoLogoWhite from "../../../assets/who-logo-white.png";
import europeFlag from "../../../assets/europe-flag.png";
import { AboutUsInfo } from "./AboutUsInfo";
import { AbbreviationsAndGlossary } from "./AbbreviationsAndGlossary";
import { PrivacyPolicyAndDisclaimer } from "./PrivacyPolicyAndDisclaimer";
import { ContactUs } from "./ContactUs";

export const MobileAppFooter: React.FC = () => {
    const items = useMemo(
        () => [
            {
                id: "about-us",
                title: i18n.t("About us"),
                content: <AboutUsInfo fullWidth />,
            },
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
                content: <ContactUs showTitle={false} />,
            },
        ],
        []
    );

    return (
        <>
            <FooterTop>
                <FlexContainer>
                    <WhoLogo src={whoLogoWhite} alt="WHO logo" />
                    <EuropeContainer>
                        <EuropeFlag src={europeFlag} alt="WHO logo" />
                        <EuropeText variant="body2">{i18n.t("Co-funded by the European Union")}</EuropeText>
                    </EuropeContainer>
                </FlexContainer>

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

const FlexContainer = styled.div<{ direction?: "row" | "column" }>`
    display: flex;
    flex-direction: ${props => props.direction || "row"};
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    gap: 20px;
    margin-block-end: 16px;
    padding-inline: 8px;

    @media (max-width: 500px) {
        gap: 16px;
    }

    @media (max-width: 360px) {
        padding-inline: 0;
    }
`;

const EuropeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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
    width: 150px;

    @media (max-width: 500px) {
        width: 130px;
    }

    @media (max-width: 450px) {
        width: 100px;
    }
`;

const EuropeText = styled(Typography)`
    max-width: 150px;
    margin-left: 16px;
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
