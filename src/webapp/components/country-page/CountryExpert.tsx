import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import bubblePattern from "../../assets/bubble-pattern.svg";
import { useCountryExpert } from "../../pages/country/useCountryExpert";

export const CountryExpert: React.FC<{ countryId: string }> = ({ countryId }) => {
    const { experts } = useCountryExpert(countryId);

    return (
        <Container aria-label="experts">
            <Typography variant="h3">{i18n.t("Country expert")}</Typography>
            <GridContainer container spacing={5}>
                {experts.map((expert, i) => (
                    <Grid key={i} xs={12} md={6} role="listitem">
                        <Row>
                            <img src={expert.image} alt={`${expert.firstName} ${expert.lastName}`} />
                            <ExpertDetailsContainer>
                                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                                    {i18n.t(`${expert.firstName} ${expert.lastName}`)}
                                </Typography>
                                <Typography variant="body1">{i18n.t(expert.position)}</Typography>
                                {expert.institution && (
                                    <Typography variant="body1">{i18n.t(expert.institution)}</Typography>
                                )}
                                <Typography variant="body1">{i18n.t(expert.countryName)}</Typography>
                            </ExpertDetailsContainer>
                        </Row>
                    </Grid>
                ))}
            </GridContainer>
        </Container>
    );
};

const Container = styled.div`
    padding: 40px 0px 40px 60px;
    background: white url(${bubblePattern}) no-repeat right top;
    background-size: contain;
`;

const GridContainer = styled(Grid)`
    margin: 30px 0px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;
    margin: 30px 10px 30px 0px;
    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const ExpertDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
