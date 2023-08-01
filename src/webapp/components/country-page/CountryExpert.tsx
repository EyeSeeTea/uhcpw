import { Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import countryExpertImage from "../../assets/country-page/antoniya-dimova.png";
import bubblePattern from "../../assets/bubble-pattern.svg";

export const CountryExpert: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3">{i18n.t("Country expert")}</Typography>
            <Row>
                <Image src={countryExpertImage} />
                <ExpertDetailsContainer>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                        {i18n.t("Antoniya Dimova")}
                    </Typography>
                    <Typography variant="body1">{i18n.t("Professor")}</Typography>
                    <Typography variant="body1">
                        {i18n.t("Medical University - Professor Dr Paraskev Stoyanov - Varna")}
                    </Typography>
                    <Typography variant="body1">{i18n.t("Bulgaria")}</Typography>
                </ExpertDetailsContainer>
            </Row>
        </Container>
    );
};

const Container = styled.div`
    padding: 40px 0px 40px 60px;
    background: white url(${bubblePattern}) no-repeat right top;
    background-size: contain;
`;

const Image = styled.img``;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;
    margin-top: 30px;
    margin-right: 10px;
    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const ExpertDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
