import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
import Umbrella from "../../../assets/country-page/umbrella-3.svg";
import UmbrellaWeak from "../../../assets/country-page/umbrella-red-icon.svg";
import bubblePattern from "../../../assets/bubble-pattern.svg";
import { Country } from "../../../../domain/entities/Country";

export const SlideInfoOne: React.FC<{ country: Country }> = ({ country }) => {
    const {
        sliderInfo: { gapsSection },
    } = country;

    return (
        <Container>
            <Typography variant="h3" style={{ marginBottom: "5px", fontWeight: 500 }}>
                {i18n.t(gapsSection.sectionName)}
            </Typography>
            <InfoGrid container alignItems="center">
                <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center" }}>
                    <Image src={Umbrella} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Column>
                        <Row>
                            <img src={UmbrellaWeak} width={40} alt={"umbrella"} />
                            <Typography variant="h5">{i18n.t("Main gaps in coverage")}</Typography>
                        </Row>
                        {gapsSection.content.map(({ title, text }) => (
                            <>
                                <Typography style={{ fontWeight: "bold" }}>{i18n.t(title)}</Typography>
                                <Typography style={{ marginBottom: "20px" }}>{i18n.t(text)}</Typography>
                            </>
                        ))}
                    </Column>
                </Grid>
            </InfoGrid>
        </Container>
    );
};

const Container = styled.div`
    background: url(${bubblePattern}) no-repeat -200px top;
    background-size: 50%;
    padding: 40px 10px 20px 30px;
`;

const InfoGrid = styled(Grid)``;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 15px;
    max-width: 85%;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    margin-left: -25px;
`;

const Image = styled.img`
    width: 80%;
    height: auto;
    @media (min-width: 1440px) {
        width: 500px;
    }
`;
