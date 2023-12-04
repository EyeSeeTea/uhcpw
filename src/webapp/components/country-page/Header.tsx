import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import { CountryDropdown } from "./dropdown/CountryDropdown";
import { useResources } from "../../pages/resources/landing/useResources";
import i18n from "../../../locales";
import UmbrellaWeak from "../../assets/country-page/umbrella-weak.svg";
import UmbrellaGap from "../../assets/country-page/umbrella-normal.png";
import UmbrellaStrong from "../../assets/country-page/umbrella-strong.png";
import { FC, MutableRefObject } from "react";
import { useCountryInfo } from "../../pages/country/useCountryInfo";
import { CountryStatus } from "../../../domain/entities/Country";

type HeaderType = {
    countryId: string;
    onCountryChange: (value: string) => void;
    sliderRef: MutableRefObject<null>;
    resourcesRef: MutableRefObject<null>;
    expertRef: MutableRefObject<null>;
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

const handleBackgroundColor = (status?: CountryStatus) => {
    switch (status) {
        case "Weak":
            return "linear-gradient(90deg, #c42929 1.8%, #ffe1d0 60.94%)";
        case "Gaps":
            return "linear-gradient(90deg, #FF8D4E 1.8%, #FFD3A5 100%)";
        case "Strong":
            return "linear-gradient(90deg, #4FAD56 70.8%, #9CD77B 100%)";
    }
};

export const Header: FC<HeaderType> = ({ countryId, onCountryChange, sliderRef, resourcesRef, expertRef }) => {
    const { filters } = useResources();
    const country = useCountryInfo(countryId);

    const handleClick = (ref: MutableRefObject<any>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Container aria-label="country-page-header" status={country?.status}>
            <ButtonsContainer>
                <CountryDropdown
                    fullWidth
                    placeholder={i18n.t("Select country")}
                    options={filters.country.options}
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
                    <ButtonText onClick={() => handleClick(sliderRef)}>{i18n.t("In detail")}</ButtonText>
                </Button>
                <Button>
                    <ButtonText onClick={() => handleClick(resourcesRef)}>{i18n.t("Country resources")}</ButtonText>
                </Button>
                <Button>
                    <ButtonText onClick={() => handleClick(expertRef)}>{i18n.t("Country expert")}</ButtonText>
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
    background: ${props => handleBackgroundColor(props.status)};
    padding: 0px 40px;
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
