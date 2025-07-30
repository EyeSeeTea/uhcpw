import React from "react";
import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../locales";
import { Option } from "../../components/dropdown/Option";
import { getBackgroundColorByFinancialProtectionStatus } from "../country/utils";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../domain/entities/Ref";
import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";
import { MenuDropdown } from "../../components/menu-dropdown/MenuDropdown";
import { UmbrellaIcon } from "../../components/umbrella-icon/UmbrellaIcon";
import { RegionalMenuItem, RegionalMenuItemConfig } from "./useRegionalPage";
import { colors } from "../app/themes/dhis2.theme";

type HeaderType = {
    selectedRegion: Id | undefined;
    regionStatus?: FinancialProtectionStatus;
    onRegionChange: (value: Id) => void;
    regionOptions: Option<Id>[];
    handleHeaderItemClick: (item: RegionalMenuItem) => void;
    menuItemsConfig: RegionalMenuItemConfig[];
    isSmallScreen?: boolean;
};

export const Header: React.FC<HeaderType> = props => {
    const {
        selectedRegion,
        regionStatus,
        onRegionChange,
        regionOptions,
        handleHeaderItemClick,
        menuItemsConfig,
        isSmallScreen = false,
    } = props;

    return (
        <Container aria-label="regional-page-header" status={undefined}>
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
                {regionStatus && <UmbrellaIcon status={regionStatus} />}
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

const Container = styled.div<{ status: FinancialProtectionStatus | undefined }>`
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: ${props =>
        props.status ? getBackgroundColorByFinancialProtectionStatus(props.status) : colors.accentPrimary};
    padding-inline-start: 64px;
    padding-inline-end: 80px;

    @media (max-width: 500px) {
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 4;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: 16px;
        flex-wrap: nowrap;
    }
`;

const DropdownContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        gap: 0px;
        img {
            width: 90px;
        }
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
    font-weight: 400;
    white-space: nowrap;
`;
