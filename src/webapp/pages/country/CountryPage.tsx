import styled from "styled-components";
import { Layout } from "../../components/layout/Layout";
import i18n from "../../../locales";
import { useResources } from "../resources/landing/useResources";
//import { useParams } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import UmbrellaWeak from "../../assets/country-page/umbrella-weak.svg";
import { CountryDropdown } from "../../components/country-page/dropdown/CountryDropdown";
import { Slider } from "../../components/country-page/slider/Slider";
import { MutableRefObject, useRef } from "react";

export const CountryPage: React.FC = () => {
    //const { country } = useParams<{ country: string }>();
    const { filters } = useResources();
    const sliderRef = useRef(null);
    const resourcesRef = useRef(null);
    const expertRef = useRef(null);

    const handleClick = (ref: MutableRefObject<any>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Layout>
            <Header>
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
            </Header>
            <Hero />
            <Divider />
            <div ref={sliderRef}>
                <Slider />
            </div>
            <Divider isOrange={false} />
            <div ref={resourcesRef}>
                <CountryResources />
            </div>
            <Divider />
            <div ref={expertRef}>
                <CountryExpert />
            </div>
        </Layout>
    );
};

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    background: linear-gradient(90deg, rgba(255, 60, 60, 1) 0%, rgba(252, 210, 210, 1) 92%);
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
