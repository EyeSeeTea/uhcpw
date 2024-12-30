import React from "react";
import { IconButton, Menu, MenuItem, Divider, withStyles } from "@material-ui/core";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@material-ui/icons";
import styled from "styled-components";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import { colors } from "../../../pages/app/themes/dhis2.theme";
import i18n from "../../../../locales";
import { MobileMenuSubItem } from "./MobileMenuSubItem";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { useAppHeader } from "./useAppHeader";

export const MobileMenu: React.FC = () => {
    const { countryFilter } = useCountryPage();
    const {
        regionalReport,
        anchorEl,
        isHomePage,
        goToHome,
        handleCountryClick,
        handleMenuItemClick,
        handleClose,
        handleSetAnchorEl,
    } = useAppHeader();
    const open = Boolean(anchorEl);

    const StyledMenu = withStyles({
        paper: {
            border: "1px solid #d3d4d5",
            backgroundColor: colors.accentPrimary,
            color: "white",
            padding: "0px 10px",
        },
    })(Menu);

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleSetAnchorEl}
            >
                {open ? <CloseOutlinedIcon /> : <MenuIcon />}
            </IconButton>
            <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={() => handleClose()}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: -40,
                    horizontal: "center",
                }}
            >
                {!isHomePage ? (
                    <>
                        <HomeMenuItem onClick={() => goToHome(true)}>
                            <HomeOutlinedIcon style={{ color: "#F0F0FF" }} />
                        </HomeMenuItem>
                        <StyledDivider />
                    </>
                ) : null}

                <MenuItem onClick={() => handleMenuItemClick("/indicator-explorer")}>
                    {i18n.t("Indicator explorer")}
                </MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleMenuItemClick("/policy-explorer")}>{i18n.t("Policy explorer")}</MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MobileMenuSubItem item="Countries & areas">
                        <div>
                            {countryFilter.countryOptions.map(country => {
                                return (
                                    <MenuItem key={country.value} onClick={() => handleCountryClick(country)}>
                                        {country.text}
                                    </MenuItem>
                                );
                            })}
                        </div>
                    </MobileMenuSubItem>
                </MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MenuLink target="_blank" href={regionalReport} rel="noreferrer">
                        {i18n.t("Regional report")}
                    </MenuLink>
                </MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleMenuItemClick("/methods")}>{i18n.t("Methods")}</MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleMenuItemClick("/resources")}>{i18n.t("Resources")}</MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleMenuItemClick("/blog")}>{i18n.t("Blog")}</MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleMenuItemClick("/about")}>{i18n.t("About us")}</MenuItem>
            </StyledMenu>
        </div>
    );
};

const StyledDivider = styled(Divider)`
    margin: 7px auto;
    width: 80%;
    background-color: #b5b5b5;
`;

const MenuLink = styled.a`
    text-transform: none;
    text-decoration: none;
    color: white;
`;

const HomeMenuItem = styled(MenuItem)`
    justify-content: center;
`;
