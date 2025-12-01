import React from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Hidden, Typography } from "@material-ui/core";
import styled from "styled-components";

import whoLogoBlue from "../../../assets/who-logo-blue.png";
import uhcwHomeLogo from "../../../assets/uhcw-home-logo.png";
import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { MobileMenu } from "./MobileMenu";
import { useAppHeader } from "./useAppHeader";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { DesktopMenu } from "./DesktopMenu";
import { useReferenceLinks } from "../../../common/hooks/analytics/useReferenceLinks";

export const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    toolbarTop: {
        background: colors.gradientPrimary,
        minHeight: 20,
        alignItems: "center",
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(7.5),
        "@media (max-width: 960px)": {
            background: colors.gradientPrimaryMobile,
        },
        "@media (max-width: 500px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
        },
    },
    toolbarBottom: {
        background: "white",
        minHeight: 70,
        alignItems: "center",
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(8),
        "@media (max-width: 1279px)": {
            paddingLeft: 40,
            paddingRight: 40,
        },
        "@media (max-width: 960px)": {
            paddingLeft: 0,
        },
    },
    rest: {
        flexGrow: 1,
        alignSelf: "flex-end",
    },
    menuActive: {
        color: theme.palette.primary.main,
        "& $icon": {
            color: theme.palette.primary.main,
        },
    },
    menu: {
        margin: "16px 16px",
        textTransform: "none",
    },
}));

interface AppHeaderProps {
    action?: React.ReactNode;
    isScreenRotated?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = props => {
    const { isScreenRotated = false } = props;
    const classes = useStyles();
    const { abbreviationsLink, glossaryLink } = useReferenceLinks();
    const { goToHome, whoLogoWidth, uhcwLogoWidth, isHomePage, isCountryPage } = useAppHeader();
    const isSmallScreen = useIsSmallScreen();

    return (
        <div className={classes.root}>
            <MuiAppBar position="static">
                <Toolbar className={classes.toolbarTop}>
                    <ToolbarTextContainer isFullWidth={isSmallScreen} isCentered={isSmallScreen}>
                        <StyledTypography>
                            {i18n.t("WHO Barcelona Office for Health Systems Financing")}
                        </StyledTypography>
                    </ToolbarTextContainer>

                    <Box className={classes.rest} />

                    <Hidden mdDown>
                        <MenuTopLink {...abbreviationsLink}>{i18n.t("Abbreviations")}</MenuTopLink>

                        <MenuTopLink {...glossaryLink}>{i18n.t("Glossary")}</MenuTopLink>
                    </Hidden>
                </Toolbar>

                <Toolbar className={classes.toolbarBottom}>
                    <FlexContainer isFullWidth>
                        <FlexLogoContainer isCountryPage={isCountryPage}>
                            <LogoContainer>
                                <img
                                    src={whoLogoBlue}
                                    width={whoLogoWidth}
                                    alt="WHO logo"
                                    onClick={() => goToHome()}
                                    loading="eager"
                                    decoding="async"
                                />
                            </LogoContainer>

                            {isSmallScreen || !isHomePage ? (
                                <LogoContainer>
                                    <img
                                        src={uhcwHomeLogo}
                                        width={uhcwLogoWidth}
                                        alt="UHC watch logo to go home"
                                        onClick={() => goToHome()}
                                        loading="eager"
                                        decoding="async"
                                    />
                                </LogoContainer>
                            ) : null}
                        </FlexLogoContainer>

                        <FlexContainer>
                            <MenuContainer>
                                <Hidden lgUp>
                                    <MobileMenu isScreenRotated={isScreenRotated} />
                                </Hidden>

                                <Hidden mdDown>
                                    <DesktopMenu />
                                </Hidden>
                            </MenuContainer>
                        </FlexContainer>
                    </FlexContainer>
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

const FlexContainer = styled.div<{ isFullWidth?: boolean; isWrap?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-flow: ${props => (props.isWrap ? "wrap" : "row")};
    width: ${props => (props.isFullWidth ? "100%" : "auto")};
    justify-content: space-between;
`;

const FlexLogoContainer = styled(FlexContainer)<{ isCountryPage?: boolean }>`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: ${props => (props.isCountryPage ? "5px" : "40px")};
    }
`;

const MenuContainer = styled.div``;

const StyledTypography = styled(Typography)`
    padding: 6px 0px;
    @media (max-width: 400px) {
        font-size: 14px;
    }
`;

const MenuTopLink = styled.a`
    margin: 0px 16px;
    text-transform: none;
    text-decoration: none;
    text-align: center;
    color: #000000;
    padding: 6px 8px;
    font-size: 0.875rem;
    min-width: 64px;
    cursor: pointer;
    :hover {
        background-color: rgba(150, 150, 150, 0.1);
        transition: background-color 250ms;
    }
    font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
`;

const LogoContainer = styled.div`
    margin: 10px 10px;
    cursor: pointer;

    @media (max-width: 402px) {
        max-height: 50px;
    }
`;

const ToolbarTextContainer = styled.div<{ isFullWidth?: boolean; isCentered?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-self: ${props => (props.isCentered ? "center" : "flex-start")};
    width: ${props => (props.isFullWidth ? "100%" : "auto")};
`;
