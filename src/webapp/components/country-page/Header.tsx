import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import { CountryDropdown } from "./dropdown/CountryDropdown";
import { useResources } from "../../pages/resources/landing/useResources";
import i18n from "../../../locales";
import UmbrellaWeak from "../../assets/country-page/umbrella-weak.svg";
import { FC, MutableRefObject } from "react";

type HeaderType = {
    sliderRef: MutableRefObject<null>;
    resourcesRef: MutableRefObject<null>;
    expertRef: MutableRefObject<null>;
};

export const Header: FC<HeaderType> = ({ sliderRef, resourcesRef, expertRef }) => {
    const { filters } = useResources();

    const handleClick = (ref: MutableRefObject<any>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Container aria-label="country-page-header">
            <ButtonsContainer>
                <CountryDropdown
                    fullWidth
                    placeholder={i18n.t("Select country")}
                    options={filters.country.options}
                    value={"AjeCGGb8H76"}
                    onChange={() => {}}
                />
                <img src={UmbrellaWeak} width={100} alt={"umbrella"} />
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

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: linear-gradient(90deg, #c42929 0%, #ffe1d0 60.94%);
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
