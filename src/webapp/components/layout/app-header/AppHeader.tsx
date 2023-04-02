import React from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import whoLogoBlue from "../../../assets/who-logo-blue.png";
import { Box, Button, Menu, MenuItem, Typography } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import i18n from "../../../../locales";
import BookIcon from "@material-ui/icons/BookOutlined";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { useCountryOptions } from "../../../hooks/countries/useCountryOptions";

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
        //fontWeight: theme.typography.fontWeightMedium,
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

export const AppHeader: React.FC<AppHeaderProps> = ({ action }) => {
    const classes = useStyles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { countryOptions } = useCountryOptions();

    const handleParentMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (event.currentTarget.id === "resources") {
            history.push("/resources");
        } else {
            alert(event.currentTarget.innerText);
        }
    };

    const goToHome = () => {
        history.push("/");
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <MuiAppBar position="static">
                <Toolbar className={classes.toolbarTop}>
                    <Typography> {i18n.t("WHO Barcelona Office for Health Systems Financing")}</Typography>
                    <Box className={classes.rest} />
                    <MenuTopButton onClick={handleClick} startIcon={<BookIcon />}>
                        {i18n.t("Glossary")}
                    </MenuTopButton>
                    <MenuTopButton onClick={handleClick} startIcon={<SearchIcon />}>
                        {i18n.t("Search")}
                    </MenuTopButton>
                    {action}
                </Toolbar>
                <Toolbar className={classes.toolbarBottom}>
                    <LogoContainer>
                        <img src={whoLogoBlue} width={150} alt="WHO logo" onClick={goToHome} />;
                    </LogoContainer>
                    <Box className={classes.rest} />
                    <div>
                        <Button
                            className={classes.menu}
                            activeClassName={classes.menuActive}
                            component={NavLink}
                            to={"/indicator-explorer"}
                        >
                            {i18n.t("Indicator Explorer")}
                        </Button>
                        <Button
                            className={classes.menu}
                            activeClassName={classes.menuActive}
                            component={NavLink}
                            to={"/policy-explorer"}
                        >
                            {i18n.t("Policy Explorer")}
                        </Button>
                        <MenuButton
                            id="countries"
                            aria-controls="countries"
                            aria-haspopup="true"
                            onClick={handleParentMenuClick}
                            endIcon={<ExpandMoreIcon />}
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
                        >
                            {countryOptions.map(country => {
                                return (
                                    <MenuItem key={country.value} onClick={handleClick}>
                                        {country.text}
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                        <MenuButton
                            id="regions"
                            aria-controls="regions"
                            aria-haspopup="true"
                            onClick={handleParentMenuClick}
                            endIcon={<ExpandMoreIcon />}
                        >
                            {i18n.t("Regions")}
                        </MenuButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={anchorEl?.id === "regions"}
                            onClose={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <MenuItem onClick={handleClick}>Europe</MenuItem>
                            <MenuItem onClick={handleClick}>Asian</MenuItem>
                        </Menu>
                        <MenuButton
                            id="methods"
                            aria-controls="methods"
                            aria-haspopup="true"
                            onClick={handleParentMenuClick}
                            endIcon={<ExpandMoreIcon />}
                        >
                            {i18n.t("Methods")}
                        </MenuButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={anchorEl?.id === "methods"}
                            onClose={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <MenuItem onClick={handleClick}>Method 1</MenuItem>
                            <MenuItem onClick={handleClick}>Method 2</MenuItem>
                        </Menu>
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
                    </div>
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

const MenuTopButton = styled(Button)`
    margin: 0px 16px;
    text-transform: none;
`;

const MenuButton = styled(Button)`
    margin: 16px 16px;
    text-transform: none;
`;

const LogoContainer = styled.div`
    margin: 10px 10px;
    cursor: pointer;
`;
