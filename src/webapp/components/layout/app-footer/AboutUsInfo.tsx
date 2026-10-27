import React from "react";
import { Typography, Link } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../../locales";
import { NavLink } from "react-router-dom";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { whoBarcelonaOfficeUrl } from "./footerLinks";
import { narrowDesktopFooterQuery } from "./footerStyles";

export const AboutUsInfo: React.FC = () => {
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <Container>
            <StyledNavLink to={"/about"}>
                <Typography variant="body1">{i18n.t("About us")}</Typography>
            </StyledNavLink>

            <StyledLink href={whoBarcelonaOfficeUrl} target="_blank" onClick={redirectWithExternalLink}>
                <OfficeName variant="body1">{i18n.t("WHO Barcelona Office for Health Systems Financing")}</OfficeName>
            </StyledLink>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
`;

const StyledLink = styled(Link)`
    color: white;
    text-decoration: none;
`;

// The single line the client asked for, as long as the columns are wide enough for it.
const OfficeName = styled(Typography)`
    white-space: nowrap;

    @media ${narrowDesktopFooterQuery} {
        white-space: normal;
    }
`;
