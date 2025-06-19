import React from "react";
import { Typography, Link } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../../locales";
import { NavLink } from "react-router-dom";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

const URL_WHO_BCN_OFFICE_HEALTH_SYSTEMS_FINANCING =
    "https://www.who.int/europe/teams/office-for-health-systems-financing-(barcelona)";

type AboutUsInfoProps = {
    fullWidth?: boolean;
    showTitle?: boolean;
};

export const AboutUsInfo: React.FC<AboutUsInfoProps> = props => {
    const { fullWidth = false, showTitle = true } = props;

    const { redirectWithExternalLink } = useAnalytics();

    return (
        <Container>
            {showTitle && (
                <StyledNavLink to={"/about"}>
                    <Typography variant="body1" gutterBottom>
                        {i18n.t("About us")}
                    </Typography>
                </StyledNavLink>
            )}

            <StyledLink
                href={URL_WHO_BCN_OFFICE_HEALTH_SYSTEMS_FINANCING}
                target="_blank"
                onClick={redirectWithExternalLink}
            >
                <StyledTypography variant="body2" gutterBottom fullWidth={fullWidth}>
                    {i18n.t("WHO Barcelona Office for Health Systems Financing")}
                </StyledTypography>
            </StyledLink>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
`;

const StyledLink = styled(Link)`
    color: white;
    text-decoration: none;
`;

const StyledTypography = styled(Typography)<{ fullWidth?: boolean }>`
    color: white;
    text-decoration: none;
    max-width: ${props => (props.fullWidth ? "100%" : "60%")};
`;
