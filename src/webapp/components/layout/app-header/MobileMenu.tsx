import React, { useCallback, useMemo } from "react";
import { IconButton, Menu, MenuItem, Divider, withStyles } from "@material-ui/core";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@material-ui/icons";
import styled from "styled-components";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import { colors } from "../../../pages/app/themes/dhis2.theme";
import i18n from "../../../../locales";
import { useHistory, useLocation } from "react-router-dom";
import { MobileMenuSubItem } from "./MobileMenuSubItem";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { Option } from "../../dropdown/Option";

export const MobileMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { countryFilter } = useCountryPage();
    const history = useHistory();
    const { pathname } = useLocation();

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(
        (link?: string) => {
            setAnchorEl(null);
            if (link) {
                history.push(link);
            }
        },
        [history]
    );

    const StyledMenu = withStyles({
        paper: {
            border: "1px solid #d3d4d5",
            backgroundColor: colors.accentPrimary,
            color: "white",
            padding: "0px 10px",
        },
    })(Menu);

    const onCountryChange = useCallback(
        (country: Option<string>) => {
            history.push(`/country-page?country=${country.value}`);
            handleCloseMenu();
        },
        [handleCloseMenu, history]
    );

    const isHomePage = useMemo(() => pathname === "/", [pathname]);

    const goToHome = useCallback(() => {
        history.push("/");
        handleCloseMenu();
    }, [handleCloseMenu, history]);

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                {open ? <CloseOutlinedIcon /> : <MenuIcon />}
            </IconButton>
            <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={() => handleCloseMenu()}
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
                        <HomeMenuItem onClick={goToHome}>
                            <HomeOutlinedIcon style={{ color: "#F0F0FF" }} />
                        </HomeMenuItem>
                        <StyledDivider />
                    </>
                ) : null}

                <MenuItem onClick={() => handleCloseMenu("/indicator-explorer")}>
                    {i18n.t("Indicator explorer")}
                </MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/policy-explorer")}>{i18n.t("Policy explorer")}</MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MobileMenuSubItem item="countries">
                        <div>
                            {countryFilter.countryOptions.map(country => {
                                return (
                                    <MenuItem key={country.value} onClick={() => onCountryChange(country)}>
                                        {country.text}
                                    </MenuItem>
                                );
                            })}
                        </div>
                    </MobileMenuSubItem>
                </MenuItem>
                <StyledDivider />
                <MenuItem>
                    <MenuLink target="_blank" href="https://bit.ly/uhcwatch_regionalreport2023" rel="noreferrer">
                        {i18n.t("Regional report")}
                    </MenuLink>
                </MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/methods")}>{i18n.t("Methods")}</MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/resources")}>{i18n.t("Resources")}</MenuItem>
                <StyledDivider />
                <MenuItem onClick={() => handleCloseMenu("/about")}>{i18n.t("About us")}</MenuItem>
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
