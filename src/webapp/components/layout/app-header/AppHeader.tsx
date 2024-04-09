import React, { useCallback, useMemo } from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Hidden, Menu, MenuItem, Typography } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import whoLogoBlue from "../../../assets/who-logo-blue.png";
import i18n from "../../../../locales";
import { useHistory } from "react-router";
import { NavLink, useLocation } from "react-router-dom";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { MobileMenu } from "./MobileMenu";
import { Option } from "../../dropdown/Option";
import { useCountryPage } from "../../../pages/country/useCountryPage";

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
        paddingRight: theme.spacing(8),
        "@media (max-width: 500px)": {
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 4,
        },
    },
    toolbarBottom: {
        background: "white",
        minHeight: 70,
        alignItems: "center",
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        paddingLeft: theme.spacing(6),
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
    const history = useHistory();
    const { pathname } = useLocation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { countryFilter } = useCountryPage();

    const handleParentMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const goToHome = useCallback(() => {
        history.push("/");
    }, [history]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleCountryClick = useCallback(
        (country: Option<string>) => {
            history.push(`/country-page?country=${country.value}`);
            handleClose();
        },
        [handleClose, history]
    );

    const isHomePage = useMemo(() => pathname === "/", [pathname]);

    return (
        <div className={classes.root}>
            <MuiAppBar position="static">
                <Toolbar className={classes.toolbarTop}>
                    <Typography> {i18n.t("WHO Barcelona Office for Health Systems Financing")}</Typography>
                    <Box className={classes.rest} />
                    <TagContainer>
                        <Tag>
                            <Typography variant="body2">{i18n.t("Mobile-friendly version coming soon")}</Typography>
                        </Tag>
                    </TagContainer>
                    <MenuTopLink target="_blank" href="https://cmyn.short.gy/abbreviations">
                        {i18n.t("Abbreviations")}
                    </MenuTopLink>
                    <MenuTopLink target="_blank" href="https://cmyn.short.gy/glossary">
                        {i18n.t("Glossary")}
                    </MenuTopLink>
                </Toolbar>
                <Toolbar className={classes.toolbarBottom}>
                    <LogoContainer>
                        <img src={whoLogoBlue} width={150} alt="WHO logo" onClick={goToHome} />;
                    </LogoContainer>
                    <Box className={classes.rest} />
                    <Hidden lgUp>
                        <MobileMenu />
                    </Hidden>
                    <Hidden mdDown>
                        {!isHomePage ? (
                            <HomeButton className={classes.menu} onClick={goToHome}>
                                <HomeOutlinedIcon style={{ color: "#3D3D3D" }} />
                            </HomeButton>
                        ) : null}
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
                            aria-controls="countries"
                            aria-haspopup="true"
                            onClick={handleParentMenuClick}
                            endIcon={anchorEl?.id === "countries" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                            {i18n.t("Countries")}
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
                                    <MenuItem key={country.value} onClick={() => handleCountryClick(country)}>
                                        {country.text}
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                        <MenuTopLink
                            id="regions"
                            aria-controls="regions"
                            target="_blank"
                            href="https://cmyn.short.gy/regionalreport"
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
                    </Hidden>
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

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

const TagContainer = styled.div`
    margin-right: 16px;
`;

const Tag = styled.div`
    text-align: center;
    min-width: 100px;
    background-color: #4fad56;
    color: white;
    border-radius: 30px;
    padding: 5px 10px;
`;

const HomeButton = styled(Button)`
    min-width: unset;
`;
