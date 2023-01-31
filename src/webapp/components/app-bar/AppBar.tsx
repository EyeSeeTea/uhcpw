import React from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import whoLogo from "../../assets/who-logo.png";
import { Box, Button, Menu, MenuItem, Typography } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import i18n from "../../../locales";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BookIcon from "@material-ui/icons/BookOutlined";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    toolbarTop: {
        background: "linear-gradient(90deg, rgba(10,160,244,1) 0%, rgba(240,247,252,1) 100%)",
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
}));

export const AppBar: React.FC = () => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleParentMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        alert(event.currentTarget.innerText);
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
                    <SwitchColourButton variant="contained" color="default" startIcon={<VisibilityIcon />}>
                        {i18n.t("Switch to colour-blind friendly")}
                    </SwitchColourButton>
                </Toolbar>
                <Toolbar className={classes.toolbarBottom}>
                    <LogoContainer>
                        <img src={whoLogo} width={150} alt="WHO logo" />;
                    </LogoContainer>
                    <Box className={classes.rest} />
                    <div>
                        <MenuButton onClick={handleClick}>{i18n.t("Indicator Explorer")}</MenuButton>
                        <MenuButton onClick={handleClick}>{i18n.t("Policy Explorer")}</MenuButton>
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
                            <MenuItem onClick={handleClick}>Spain</MenuItem>
                            <MenuItem onClick={handleClick}>portugal</MenuItem>
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
                        <MenuButton onClick={handleClick}>{i18n.t("Resources")}</MenuButton>
                        <MenuButton onClick={handleClick}>{i18n.t("About us")}</MenuButton>
                    </div>
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

const SwitchColourButton = styled(Button)`
    background: white;
    text-transform: none;
    border-radius: 20px;
    margin-left: 48px;
`;

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
`;
