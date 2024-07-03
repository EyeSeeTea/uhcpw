import { Button, Typography, makeStyles } from "@material-ui/core";
import styled from "styled-components";
import { CountryDropdown } from "./dropdown/CountryDropdown";
import i18n from "../../../locales";
import UmbrellaWeak from "../../assets/country-page/umbrella-weak.svg";
import UmbrellaGap from "../../assets/country-page/umbrella-normal.png";
import UmbrellaStrong from "../../assets/country-page/umbrella-strong.png";
import { FC, MutableRefObject, useCallback } from "react";
import { useCountryInfo } from "../../pages/country/useCountryInfo";
import { CountryStatus } from "../../../domain/entities/Country";
import { Option } from "../../components/dropdown/Option";
import { getBackgroundColorByCountryStatus } from "../../pages/country/utils";

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

const UmbrellaIcon = ({ status }: { status: CountryStatus }) => {
    switch (status) {
        case "Weak":
            return <img src={UmbrellaWeak} width={100} alt={"umbrella weak"} />;
        case "Gaps":
            return <img src={UmbrellaGap} width={100} alt={"umbrella gap"} />;
        case "Strong":
            return <img src={UmbrellaStrong} width={100} alt={"umbrella strong"} />;
    }
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
            <ButtonsContainer>
                <CountryDropdown
                    fullWidth
                    placeholder={i18n.t("Select country or area")}
                    countryOptions={countryOptions}
                    value={countryId}
                    onChange={onCountryChange}
                />
                {country && <UmbrellaIcon status={country?.status} />}
            </ButtonsContainer>
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

const Container = styled.div<{ status: CountryStatus | undefined }>`
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: ${props => getBackgroundColorByCountryStatus(props.status)};
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const ButtonText = styled(Typography)`
    text-transform: none;
    font-weight: 400;
`;
