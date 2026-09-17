import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

type ContactUsProps = {
    showTitle?: boolean;
};

export const ContactUs: React.FC<ContactUsProps> = props => {
    const { showTitle = true } = props;
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <Container>
            {showTitle && <Heading variant="body2">{i18n.t("Contact our office")}</Heading>}

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
    gap: 4px;
`;

const Heading = styled(Typography)`
    margin-bottom: 8px;
`;

const MailLink = styled.a`
    text-decoration: none;
    color: inherit;
`;
