import React from "react";
import { MenuItem, Divider } from "@material-ui/core";
import styled from "styled-components";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import i18n from "../../../../locales";
import { MobileMenuSubItem } from "./MobileMenuSubItem";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { Option } from "../../dropdown/Option";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";

type MenuItemsProps = {
    regionalReport: string;
    isHomePage: boolean;
    isCountryPage: boolean;
    goToHome: (closeMenu?: boolean) => void;
    handleCountryClick: (country: Option<string>) => void;
    handleMenuItemClick: (link: string) => void;
};
export const MenuItems: React.FC<MenuItemsProps> = props => {
    const { regionalReport, isHomePage, isCountryPage, goToHome, handleCountryClick, handleMenuItemClick } = props;

    const { redirectWithPageView } = useAnalytics();
    const { countryFilter } = useCountryPage();
    const isSmallScreen = useIsSmallScreen();

    const regionalReportPageView = redirectWithPageView({ title: "Regional report" });

    return (
        <>
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

            {!isCountryPage || (isCountryPage && !isSmallScreen) ? (
                <>
                    <MenuItem>
                        <MobileMenuSubItem item={i18n.t("Countries & areas")}>
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
                </>
            ) : null}

            <MenuItem>
                <MenuLink target="_blank" href={regionalReport} rel="noreferrer" onClick={regionalReportPageView}>
                    {i18n.t("Regional report")}
                </MenuLink>
            </MenuItem>

            <StyledDivider />

            <MenuItem onClick={() => handleMenuItemClick("/methods")}>{i18n.t("Methods")}</MenuItem>

            <StyledDivider />

            <MenuItem onClick={() => handleMenuItemClick("/resources")}>{i18n.t("Resources")}</MenuItem>

            <StyledDivider />

            <MenuItem onClick={() => handleMenuItemClick("/about")}>{i18n.t("About us")}</MenuItem>
        </>
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
