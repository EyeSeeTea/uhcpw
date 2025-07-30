import React from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import i18n from "../../../../locales";
import { NavLink } from "react-router-dom";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { useAppHeader } from "./useAppHeader";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { useStyles } from "./AppHeader";
import { useRegionalPageFilter } from "../../../pages/regional-page/useRegionalPageFilter";

export const DesktopMenu: React.FC = () => {
    const classes = useStyles();
    const { redirectWithPageView } = useAnalytics();
    const { countryFilter } = useCountryPage();
    const { regionalReport, anchorEl, handleCountryClick, handleClose, handleSetAnchorEl, handleRegionalClick } =
        useAppHeader();
    const { regionOptions } = useRegionalPageFilter();

    const regionalReportPageView = redirectWithPageView({ title: "Regional report" });

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

            <MenuButton
                id="regions"
                aria-controls="Regions"
                aria-haspopup="true"
                onClick={handleSetAnchorEl}
                endIcon={anchorEl?.id === "regions" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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

            <MenuTopLink
                id="regional-report"
                aria-controls="regional-report"
                target="_blank"
                href={regionalReport}
                onClick={regionalReportPageView}
            >
                {i18n.t("Regional report")}
            </MenuTopLink>

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
