import React from "react";
import { IconButton, Menu, withStyles } from "@material-ui/core";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@material-ui/icons";
import styled from "styled-components";

import { colors } from "../../../pages/app/themes/dhis2.theme";
import { useAppHeader } from "./useAppHeader";
import { MenuItems } from "./MenuItems";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";

type MobileMenuProps = {
    isScreenRotated?: boolean;
};

export const MobileMenu: React.FC<MobileMenuProps> = props => {
    const { isScreenRotated = false } = props;
    const {
        regionalReport,
        anchorEl,
        isHomePage,
        isCountryPage,
        menuRef,
        open,
        onToggleForSmallScreens,
        goToHome,
        handleCountryClick,
        handleMenuItemClick,
        handleClose,
        handleSetAnchorEl,
    } = useAppHeader(isScreenRotated);
    const isSmallScreen = useIsSmallScreen();

    const StyledMenu = withStyles({
        root: {
            backgroundColor: "red",
        },
        paper: {
            border: "1px solid #d3d4d5",
            backgroundColor: colors.accentPrimary,
            color: "white",
            padding: "0px 10px",
        },
    })(Menu);

    return (
        <Wrapper>
            <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={isSmallScreen && isScreenRotated ? onToggleForSmallScreens : handleSetAnchorEl}
            >
                {open ? <CloseOutlinedIcon /> : <MenuIcon />}
            </IconButton>

            {isSmallScreen && isScreenRotated ? (
                open ? (
                    <MenuContainer ref={menuRef}>
                        <MenuItems
                            regionalReport={regionalReport}
                            isHomePage={isHomePage}
                            isCountryPage={isCountryPage}
                            goToHome={goToHome}
                            handleCountryClick={handleCountryClick}
                            handleMenuItemClick={handleMenuItemClick}
                        />
                    </MenuContainer>
                ) : null
            ) : (
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
                    <MenuItems
                        regionalReport={regionalReport}
                        isHomePage={isHomePage}
                        isCountryPage={isCountryPage}
                        goToHome={goToHome}
                        handleCountryClick={handleCountryClick}
                        handleMenuItemClick={handleMenuItemClick}
                    />
                </StyledMenu>
            )}
        </Wrapper>
    );
};

const MenuContainer = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background: ${colors.accentPrimary};
    color: white;
    border: 1px solid #d3d4d5;
    padding: 10px;
    z-index: 10;
`;

const Wrapper = styled.div`
    position: relative;
`;
