import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

type ContactUsProps = Readonly<{
    isMobile?: boolean;
}>;

export const ContactUs: React.FC<ContactUsProps> = props => {
    const { isMobile = false } = props;
    const { redirectWithExternalLink } = useAnalytics();
    const variant = isMobile ? "body2" : "body1";

    return (
        <Container>
            {/* Mobile separates the address from the phone and email; desktop lists them all together */}
            <Address $isSpaced={isMobile}>
                <Typography variant={variant}>{i18n.t("Sant Pau Art Nouveau Site (La Mercè)")}</Typography>

                <Typography variant={variant}>{i18n.t("Sant Antoni Maria Claret 167")}</Typography>

                <Typography variant={variant}>{i18n.t("08025 Barcelona, Spain")}</Typography>
            </Address>

            <Typography variant={variant}>{i18n.t("Tel: +34 673 290 861", { nsSeparator: false })}</Typography>

            <Typography variant={variant}>
                {i18n.t("Email:")}{" "}
                <MailLink
                    href="mailto:uhcwatch@who.int"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={redirectWithExternalLink}
                >
                    uhcwatch@who.int
                </MailLink>
            </Typography>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const MailLink = styled.a`
    text-decoration: none;
    color: inherit;
`;

const Address = styled.div<{ $isSpaced: boolean }>`
    margin-block-end: ${props => (props.$isSpaced ? "30px" : "0")};
`;
