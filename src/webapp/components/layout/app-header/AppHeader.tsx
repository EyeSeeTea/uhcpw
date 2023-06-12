import React from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import whoLogoBlue from "../../../assets/who-logo-blue.png";
import { Box, Button, Menu, MenuItem, Typography } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import i18n from "../../../../locales";
import BookIcon from "@material-ui/icons/BookOutlined";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { useCountryOptionsOnlyBulgaria } from "../../../common/hooks/countries/useCountryOptionsOnlyBulgaria";
import { Glossary } from "./Glossary";

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
    const [isGlossaryOpen, setIsGlossaryOpen] = React.useState(false);
    const { countryOptions } = useCountryOptionsOnlyBulgaria();

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
                    <BetaVersionTagContainer><Tag>Beta version</Tag></BetaVersionTagContainer>
                    <MenuTopButton onClick={() => setIsGlossaryOpen(true)} startIcon={<BookIcon />}>
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
                        >
                            {countryOptions.map(country => {
                                return (
                                    <MenuItem
                                        key={country.value}
                                        onClick={() => history.push(`country/${country.text.toLowerCase()}`)}
                                    >
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
                            endIcon={anchorEl?.id === "regions" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                            {i18n.t("Regions")}
                        </MenuButton>
                        <MenuContainer
                            anchorEl={anchorEl}
                            keepMounted
                            open={anchorEl?.id === "regions"}
                            onClose={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <CommingSoonTagContainer><Tag>{i18n.t("Comming soon")}</Tag></CommingSoonTagContainer>
                        </MenuContainer>
                        <MenuButton
                            id="methods"
                            aria-controls="methods"
                            aria-haspopup="true"
                            onClick={handleParentMenuClick}
                            endIcon={anchorEl?.id === "methods" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                            {i18n.t("Methods")}
                        </MenuButton>
                        <MenuContainer
                            anchorEl={anchorEl}
                            keepMounted
                            open={anchorEl?.id === "methods"}
                            onClose={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <CommingSoonTagContainer><Tag>{i18n.t("Comming soon")}</Tag></CommingSoonTagContainer>
                        </MenuContainer>
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
            <Glossary isOpen={isGlossaryOpen} setIsOpen={setIsGlossaryOpen} />
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

const BetaVersionTagContainer = styled.div`
    margin-right: 16px;
`;

const CommingSoonTagContainer = styled.div`
    margin: 22px 10px;
`;

const Tag = styled.div`
    display: flex;
    justify-content: center;
    min-width: 100px;
    background-color: #4fad56;
    color: white;
    font-size: 15px;
    border-radius: 30px;
    padding: 5px 10px;
`;

const MenuContainer = styled(Menu)`
    .MuiPaper-rounded {
        border-radius: 15px;
        border: 1px solid rgba(36, 38, 38, 0.3);
    }
`;
