import React from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import i18n from "../../../../locales";
import { NavLink } from "react-router-dom";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { useAppHeader } from "./useAppHeader";
import { useStyles } from "./AppHeader";
import { useRegionFilterOptions } from "../../../pages/regional-page/useRegionFilterOptions";

export const DesktopMenu: React.FC = () => {
    const classes = useStyles();
    const { countryFilter } = useCountryPage();
    const { anchorEl, handleCountryClick, handleClose, handleSetAnchorEl, handleRegionalClick } = useAppHeader();
    const regionOptions = useRegionFilterOptions();

    return (
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
                id="regions"
                aria-controls="Regions"
                aria-haspopup="true"
                onClick={handleSetAnchorEl}
                endIcon={anchorEl?.id === "regions" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
                {i18n.t("Regional overview")}
            </MenuButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={anchorEl?.id === "regions"}
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
                {regionOptions.map(region => {
                    return (
                        <MenuItem key={region.value} onClick={() => handleRegionalClick(region)}>
                            {region.text}
                        </MenuItem>
                    );
                })}
            </Menu>

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
                        <MenuItem key={country.value} onClick={() => handleCountryClick(country)}>
                            {country.text}
                        </MenuItem>
                    );
                })}
            </Menu>

            <Button className={classes.menu} activeClassName={classes.menuActive} component={NavLink} to={"/methods"}>
                {i18n.t("Methods")}
            </Button>

            <Button className={classes.menu} activeClassName={classes.menuActive} component={NavLink} to={"/resources"}>
                {i18n.t("Resources")}
            </Button>

            <Button className={classes.menu} activeClassName={classes.menuActive} component={NavLink} to={"/about"}>
                {i18n.t("About us")}
            </Button>
        </DesktopMenuContainer>
    );
};

const DesktopMenuContainer = styled.div`
    white-space: nowrap;
`;

const MenuButton = styled(Button)`
    margin: 16px 16px;
    text-transform: none;
`;
