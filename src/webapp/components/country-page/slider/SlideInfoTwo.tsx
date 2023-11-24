import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
import Umbrella from "../../../assets/country-page/umbrella-wordings.png";
import bubblePattern from "../../../assets/bubble-pattern.svg";
import { Country } from "../../../../domain/entities/Country";

export const SlideInfoTwo: React.FC<{ country: Country }> = ({ country }) => {
    const {
        sliderInfo: { finProtecSection },
    } = country;
    return (
        <Container>
            <Typography variant="h3" style={{ marginBottom: "25px", fontWeight: 500 }}>
                {i18n.t(finProtecSection.sectionName)}
            </Typography>
            <InfoGrid container alignItems="center">
                <Grid item xs={12} md={6}>
                    <Column>
                        {finProtecSection.content.map(({ title, text }) => (
                            <>
                                <Typography style={{ fontWeight: "bold" }}>{i18n.t(title)}</Typography>
                                <Typography style={{ marginBottom: "10px" }}>{i18n.t(text)}</Typography>
                            </>
                        ))}
                    </Column>
                </Grid>
                <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center" }}>
                    <Image src={Umbrella} />
                </Grid>
            </InfoGrid>
        </Container>
    );
};

const Container = styled.div`
    background: url(${bubblePattern}) no-repeat right top;
    background-size: 50%;
    padding: 40px 10px 20px 30px;
`;

const InfoGrid = styled(Grid)``;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    @media (min-width: 1440px) {
        width: 500px;
    }
`;
