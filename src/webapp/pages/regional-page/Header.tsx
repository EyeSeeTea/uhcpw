import React from "react";
import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../locales";
import { Option } from "../../components/dropdown/Option";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../domain/entities/Ref";
import { MenuDropdown } from "../../components/menu-dropdown/MenuDropdown";
import { RegionalMenuItem, RegionalMenuItemConfig } from "./useRegionalPage";
import { colors } from "../app/themes/dhis2.theme";

type HeaderType = {
    selectedRegion: Id | undefined;
    onRegionChange: (value: Id) => void;
    regionOptions: Option<Id>[];
    handleHeaderItemClick: (item: RegionalMenuItem) => void;
    menuItemsConfig: RegionalMenuItemConfig[];
    isSmallScreen?: boolean;
};

export const Header: React.FC<HeaderType> = props => {
    const {
        selectedRegion,
        onRegionChange,
        regionOptions,
        handleHeaderItemClick,
        menuItemsConfig,
        isSmallScreen = false,
    } = props;

    return (
        <Container aria-label="regional-page-header">
            <DropdownContainer>
                <MenuDropdown
                    id="region"
                    fullWidth
                    placeholder={i18n.t("Select region")}
                    options={regionOptions}
                    value={selectedRegion}
                    onChange={onRegionChange}
                    forceRotation={isSmallScreen}
                    fullScreen={isSmallScreen}
                />
            </DropdownContainer>

            <ButtonsContainer>
                {menuItemsConfig.map(item => (
                    <Button key={item.id} onClick={() => handleHeaderItemClick(item.id)}>
                        <ButtonText>{item.label}</ButtonText>
                    </Button>
                ))}
            </ButtonsContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: ${colors.navyBlue};
    padding-inline-start: 64px;
    padding-inline-end: 80px;

    @media (max-width: 500px) {
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 4;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: 32px;
        flex-wrap: wrap;
        height: auto;
        padding-block: 8px;
        justify-content: flex-start;
    }
`;

const DropdownContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    width: 300px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        gap: 0px;
        img {
            width: 90px;
        }
    }

    div.MuiInputBase-root {
        border-radius: 8px;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        gap: 10px;
    }
`;

const ButtonText = styled(Typography)`
    text-transform: none;
    font-weight: 600;
    white-space: nowrap;
    color: ${colors.white};
`;
