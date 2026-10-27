import { Button, Typography, makeStyles } from "@material-ui/core";
import styled, { css } from "styled-components";
import { FC, MutableRefObject, useCallback, useRef } from "react";

import i18n from "../../../locales";
import { MenuDropdown } from "../menu-dropdown/MenuDropdown";
import { useCountryInfo } from "../../pages/country/useCountryInfo";
import { Option } from "../../components/dropdown/Option";
import { getBackgroundColorByFinancialProtectionStatus } from "../../pages/country/utils";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { UmbrellaIcon } from "../umbrella-icon/UmbrellaIcon";
import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";
import { Maybe } from "../../../types/utils";
import { ExplainerVideoButton } from "../explainer-video/ExplainerVideoButton";
import { useFitsInOneLine } from "../../common/hooks/screen/useFitsInOneLine";

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
    dashboardRef: MutableRefObject<HTMLDivElement | null>;
    sliderRef: MutableRefObject<HTMLDivElement | null>;
    resourcesRef: MutableRefObject<HTMLDivElement | null>;
    expertRef: MutableRefObject<HTMLDivElement | null>;
    handleResetTab: (value: boolean) => void;
};

export const Header: FC<HeaderType> = ({
    countryId,
    onCountryChange,
    countryOptions,
    sliderRef,
    resourcesRef,
    expertRef,
    dashboardRef,
    handleResetTab,
}) => {
    const country = useCountryInfo(countryId);
    const classes = useStyles();
    const isSmallScreen = useIsSmallScreen();
    const containerRef = useRef<HTMLDivElement>(null);
    const fitsInOneLine = useFitsInOneLine(containerRef);

    const handleClick = useCallback(
        (
            ref: Maybe<MutableRefObject<HTMLDivElement | null>>,
            where: "dashboard" | "detail" | "resources" | "expert"
        ) => {
            ref?.current?.scrollIntoView({ behavior: "smooth" });
            if (where === "detail") {
                handleResetTab(true);
            }
        },
        [handleResetTab]
    );

    return (
        <Container
            ref={containerRef}
            aria-label="country-page-header"
            status={country?.status}
            $twoLines={!fitsInOneLine}
            className={classes.container}
        >
            <DropdownContainer $twoLines={!fitsInOneLine}>
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

            {!fitsInOneLine && (
                <ExplainerContainer>
                    <ExplainerVideoButton page="country" />
                </ExplainerContainer>
            )}

            <ButtonsContainer $twoLines={!fitsInOneLine}>
                <Button>
                    <ButtonText onClick={() => handleClick(dashboardRef, "dashboard")}>
                        {i18n.t("Dashboard")}
                    </ButtonText>
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
                {fitsInOneLine && <ExplainerVideoButton page="country" />}
            </ButtonsContainer>
        </Container>
    );
};

type TwoLinesProps = { $twoLines: boolean };

const Container = styled.div<{ status: FinancialProtectionStatus | undefined } & TwoLinesProps>`
    position: sticky;
    top: 0;
    z-index: 2;

    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: ${props => getBackgroundColorByFinancialProtectionStatus(props.status)};
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: 16px;
        flex-wrap: nowrap;
    }
    ${props =>
        props.$twoLines &&
        css`
            /* NOTICE: two rows sharing the first column, whose width is set by the menu buttons */
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
                "dropdown . explainer"
                "menu . .";
            gap: 4px 20px;
            height: auto;
            padding-block: 8px;
        `}
`;

const DropdownContainer = styled.div<TwoLinesProps>`
    display: flex;
    flex-shrink: 0;
    gap: 20px;
    align-items: center;
    img {
        flex-shrink: 0;
    }
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        gap: 0px;
        img {
            width: 90px;
        }
    }
    ${props =>
        props.$twoLines &&
        css`
            grid-area: dropdown;
            /* NOTICE: it fills the column without widening it, so the umbrella ends where the menu buttons end */
            width: 0;
            min-width: 100%;
        `}
`;

const ExplainerContainer = styled.div`
    grid-area: explainer;
`;

const ButtonsContainer = styled.div<TwoLinesProps>`
    display: flex;
    flex-shrink: 0;
    gap: 20px;
    align-items: center;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        gap: 10px;
    }
    ${props =>
        props.$twoLines &&
        css`
            grid-area: menu;
        `}
`;

const ButtonText = styled(Typography)`
    text-transform: none;
    font-weight: 400;
    white-space: nowrap;
`;
