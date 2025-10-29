import { Button, Typography, makeStyles } from "@material-ui/core";
import styled from "styled-components";
import { FC, MutableRefObject, useCallback } from "react";

import i18n from "../../../locales";
import { MenuDropdown } from "../menu-dropdown/MenuDropdown";
import { useCountryInfo } from "../../pages/country/useCountryInfo";
import { Option } from "../../components/dropdown/Option";
import { getBackgroundColorByFinancialProtectionStatus } from "../../pages/country/utils";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { UmbrellaIcon } from "../umbrella-icon/UmbrellaIcon";
import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";

const useStyles = makeStyles(theme => ({
    container: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(10),
        "@media (max-width: 500px)": {
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 4,
        },
    },
}));

type HeaderType = {
    countryId: string;
    onCountryChange: (value: string) => void;
    countryOptions: Option<string>[];
    sliderRef: MutableRefObject<null>;
    resourcesRef: MutableRefObject<null>;
    expertRef: MutableRefObject<null>;
    handleResetTab: (value: boolean) => void;
};

export const Header: FC<HeaderType> = ({
    countryId,
    onCountryChange,
    countryOptions,
    sliderRef,
    resourcesRef,
    expertRef,
    handleResetTab,
}) => {
    const country = useCountryInfo(countryId);
    const classes = useStyles();
    const isSmallScreen = useIsSmallScreen();

    const handleClick = useCallback(
        (ref: MutableRefObject<any>, where: "detail" | "resources" | "expert") => {
            ref.current?.scrollIntoView({ behavior: "smooth" });
            if (where === "detail") {
                handleResetTab(true);
            }
        },
        [handleResetTab]
    );

    return (
        <Container aria-label="country-page-header" status={country?.status} className={classes.container}>
            <DropdownContainer>
                <MenuDropdown
                    fullWidth
                    id="country"
                    placeholder={i18n.t("Select country or area")}
                    options={countryOptions}
                    value={countryId}
                    onChange={onCountryChange}
                    forceRotation={isSmallScreen}
                    fullScreen={isSmallScreen}
                />
                {country && <UmbrellaIcon status={country?.status} />}
            </DropdownContainer>
            <ButtonsContainer>
                <Button>
                    <ButtonText>{i18n.t("Dashboard")}</ButtonText>
                </Button>
                <Button>
                    <ButtonText onClick={() => handleClick(sliderRef, "detail")}>{i18n.t("In detail")}</ButtonText>
                </Button>
                <Button>
                    <ButtonText onClick={() => handleClick(resourcesRef, "resources")}>
                        {i18n.t("Resources")}
                    </ButtonText>
                </Button>
                <Button>
                    <ButtonText onClick={() => handleClick(expertRef, "expert")}>{i18n.t("Experts")}</ButtonText>
                </Button>
            </ButtonsContainer>
        </Container>
    );
};

const Container = styled.div<{ status: FinancialProtectionStatus | undefined }>`
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: ${props => getBackgroundColorByFinancialProtectionStatus(props.status)};
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
