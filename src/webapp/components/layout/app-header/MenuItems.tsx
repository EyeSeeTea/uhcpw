import React, { useCallback } from "react";
import { MenuItem, Divider } from "@material-ui/core";
import styled from "styled-components";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import i18n from "../../../../locales";
import { MobileMenuSubItem } from "./MobileMenuSubItem";
import { useCountryPage } from "../../../pages/country/useCountryPage";
import { Option } from "../../dropdown/Option";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../../domain/entities/Ref";
import { useRegionFilterOptions } from "../../../pages/regional-page/useRegionFilterOptions";
import { PopUp } from "../../popup/PopUp";
import { useAppContext } from "../../../contexts/app-context";

type MenuItemsProps = {
    isHomePage: boolean;
    isCountryPage: boolean;
    goToHome: (closeMenu?: boolean) => void;
    handleCountryClick: (country: Option<Id>) => void;
    handleMenuItemClick: (link: string) => void;
    handleRegionalClick: (region: Option<Id>) => void;
    isRegionalPage?: boolean;
};
export const MenuItems: React.FC<MenuItemsProps> = props => {
    const {
        isHomePage,
        isCountryPage,
        goToHome,
        handleCountryClick,
        handleMenuItemClick,
        handleRegionalClick,
        isRegionalPage = false,
    } = props;

    const { countryFilter } = useCountryPage();
    const isSmallScreen = useIsSmallScreen();
    const regionOptions = useRegionFilterOptions();
    const { generalContent } = useAppContext();

    const [showRegionalPagePopup, setShowRegionalPagePopup] = React.useState(false);

    const onOpenPopup = useCallback(() => {
        setShowRegionalPagePopup(true);
    }, []);

    const onClosePopup = useCallback(() => {
        setShowRegionalPagePopup(false);
    }, []);

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

            {isRegionalPage && !isSmallScreen ? (
                <>
                    <MenuItem>
                        <MobileMenuSubItem item={i18n.t("Regional overview")}>
                            <div>
                                {regionOptions.map(region => {
                                    return (
                                        <MenuItem
                                            key={region.value}
                                            onClick={() => handleRegionalClick(region)}
                                            onMouseDown={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRegionalClick(region);
                                            }}
                                        >
                                            {region.text}
                                        </MenuItem>
                                    );
                                })}
                            </div>
                        </MobileMenuSubItem>
                    </MenuItem>
                    <StyledDivider />
                </>
            ) : (
                <>
                    <MenuItem onClick={onOpenPopup}>{i18n.t("Regional overview")}</MenuItem>
                    <StyledDivider />
                </>
            )}

            {!isCountryPage || (isCountryPage && !isSmallScreen) ? (
                <>
                    <MenuItem>
                        <MobileMenuSubItem item={i18n.t("Countries & areas")}>
                            <div>
                                {countryFilter.countryOptions.map(country => {
                                    return (
                                        <MenuItem
                                            key={country.value}
                                            onClick={() => handleCountryClick(country)}
                                            onMouseDown={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleCountryClick(country);
                                            }}
                                        >
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

            <MenuItem onClick={() => handleMenuItemClick("/methods")}>{i18n.t("Methods")}</MenuItem>

            <StyledDivider />

            <MenuItem onClick={() => handleMenuItemClick("/resources")}>{i18n.t("Resources")}</MenuItem>

            <StyledDivider />

            <MenuItem onClick={() => handleMenuItemClick("/about")}>{i18n.t("About us")}</MenuItem>

            {showRegionalPagePopup && generalContent?.regionalPageMobilePopUp.disclaimer && (
                <PopUp
                    isOpen={showRegionalPagePopup}
                    onClose={onClosePopup}
                    text={generalContent.regionalPageMobilePopUp.disclaimer}
                    linkText={generalContent.regionalPageMobilePopUp.buttonText}
                    linkUrl={generalContent.regionalPageMobilePopUp.url}
                />
            )}
        </>
    );
};

const StyledDivider = styled(Divider)`
    margin: 7px auto;
    width: 80%;
    background-color: #b5b5b5;
`;

const HomeMenuItem = styled(MenuItem)`
    justify-content: center;
`;
