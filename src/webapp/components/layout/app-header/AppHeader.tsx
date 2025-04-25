import React from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Hidden, Menu, MenuItem, Typography } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import whoLogoBlue from "../../../assets/who-logo-blue.png";
import uhcwHomeLogo from "../../../assets/uhcw-home-logo.png";
import i18n from "../../../../locales";
import { NavLink } from "react-router-dom";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { MobileMenu } from "./MobileMenu";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { useAppHeader } from "./useAppHeader";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

const useStyles = makeStyles(theme => ({
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
        "@media (max-width: 450px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
        },
        "@media (max-width: 800px)": {
            background: colors.accentPrimary,
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
}

export const AppHeader: React.FC<AppHeaderProps> = () => {
    const classes = useStyles();
    const { redirectWithPageView } = useAnalytics();
    const { countryFilter } = useCountryPage();
    const {
        regionalReport,
        anchorEl,
        isHomePage,
        goToHome,
        handleCountryClick,
        handleClose,
        handleSetAnchorEl,
        logoWidth,
    } = useAppHeader();

    const regionalReportPageView = redirectWithPageView({ title: "Regional report" });

    return (
        <div className={classes.root}>
            <MuiAppBar position="static">
                <Toolbar className={classes.toolbarTop}>
                    <StyledTypography> {i18n.t("WHO Barcelona Office for Health Systems Financing")}</StyledTypography>
                    <Box className={classes.rest} />
                </Toolbar>
                <Toolbar className={classes.toolbarBottom}>
                    <FlexContainer isFullWidth>
                        <FlexContainer>
                            <LogoContainer>
                                <img src={whoLogoBlue} width={logoWidth} alt="WHO logo" onClick={() => goToHome()} />;
                            </LogoContainer>

                            {!isHomePage ? (
                                <LogoContainer>
                                    <img
                                        src={uhcwHomeLogo}
                                        width={logoWidth}
                                        alt="UHC watch logo to go home"
                                        onClick={() => goToHome()}
                                    />
                                    ;
                                </LogoContainer>
                            ) : null}
                        </FlexContainer>

                        {/* <Box className={classes.rest} /> */}

                        <MenuContainer>
                            <Hidden lgUp>
                                <MobileMenu />
                            </Hidden>

                            <Hidden mdDown>
                                <DesktopMenuContainer>
                                    <Button
                                        className={classes.menu}
                                        activeClassName={classes.menuActive}
                                        component={NavLink}
                                        to={"/indicator-explorer"}
                                    >
                                        {i18n.t("Indicator explorer")}
                                    </Button>
                                    <Button
                                        className={classes.menu}
                                        activeClassName={classes.menuActive}
                                        component={NavLink}
                                        to={"/policy-explorer"}
                                    >
                                        {i18n.t("Policy explorer")}
                                    </Button>
                                    <MenuButton
                                        id="countries"
                                        aria-controls="countries & areas"
                                        aria-haspopup="true"
                                        onClick={handleSetAnchorEl}
                                        endIcon={anchorEl?.id === "countries" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    >
                                        {i18n.t("Countries & areas")}
                                    </MenuButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={anchorEl?.id === "countries"}
                                        onClose={handleClose}
                                        getContentAnchorEl={null}
                                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                                        PaperProps={{
                                            style: {
                                                maxHeight: 556,
                                                overflowY: "auto",
                                            },
                                        }}
                                    >
                                        {countryFilter.countryOptions.map(country => {
                                            return (
                                                <MenuItem
                                                    key={country.value}
                                                    onClick={() => handleCountryClick(country)}
                                                >
                                                    {country.text}
                                                </MenuItem>
                                            );
                                        })}
                                    </Menu>
                                    <MenuTopLink
                                        id="regions"
                                        aria-controls="regions"
                                        target="_blank"
                                        href={regionalReport}
                                        onClick={regionalReportPageView}
                                    >
                                        {i18n.t("Regional report")}
                                    </MenuTopLink>
                                    <Button
                                        className={classes.menu}
                                        activeClassName={classes.menuActive}
                                        component={NavLink}
                                        to={"/methods"}
                                    >
                                        {i18n.t("Methods")}
                                    </Button>
                                    <Button
                                        className={classes.menu}
                                        activeClassName={classes.menuActive}
                                        component={NavLink}
                                        to={"/resources"}
                                    >
                                        {i18n.t("Resources")}
                                    </Button>
                                    <Button
                                        className={classes.menu}
                                        activeClassName={classes.menuActive}
                                        component={NavLink}
                                        to={"/about"}
                                    >
                                        {i18n.t("About us")}
                                    </Button>
                                </DesktopMenuContainer>
                            </Hidden>
                        </MenuContainer>
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

const MenuContainer = styled.div``;

const StyledTypography = styled(Typography)`
    white-space: nowrap;
`;

const DesktopMenuContainer = styled.div`
    white-space: nowrap;
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

const MenuButton = styled(Button)`
    margin: 16px 16px;
    text-transform: none;
`;

const LogoContainer = styled.div`
    margin: 10px 10px;
    cursor: pointer;
`;
