import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
import Umbrella from "../../../assets/country-page/umbrella-3.svg";
import UmbrellaWeak from "../../../assets/country-page/umbrella-weak.svg";
import bubblePattern from "../../../assets/bubble-pattern.svg";

export const SlideInfoOne: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" style={{ marginBottom: "50px", maxWidth: "70%" }}>
                {i18n.t("What are the main gaps in publicly financed coverage?")}
            </Typography>
            <InfoGrid container alignItems="center">
                <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center" }}>
                    <Image src={Umbrella} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Column>
                        <Row>
                            <img src={UmbrellaWeak} width={100} alt={"umbrella"} />
                            <Typography variant="h5">{i18n.t("Main gaps in coverage")}</Typography>
                        </Row>

                        <Typography style={{ fontWeight: "bold" }}>{i18n.t("Population coverage:")}</Typography>
                        <Typography>
                            {i18n.t(
                                "A large share of the population (15%) is uninsured and only has access to a few publicly financed health services. This is because access to National Health Insurance Fund benefits is based on the payment of contributions."
                            )}
                        </Typography>
                        <Typography style={{ fontWeight: "bold", marginTop: "20px" }}>
                            {i18n.t("Service coverage:")}
                        </Typography>
                        <Typography>
                            {i18n.t(
                                "National Health Insurance Fund coverage of outpatient medicines, medical products and dental care is limited. Medicine prices are high compared to other countries."
                            )}
                        </Typography>
                        <Typography style={{ fontWeight: "bold", marginTop: "20px" }}>
                            {i18n.t("User charges (co-payments): ")}
                        </Typography>
                        <Typography>
                            {i18n.t(
                                "Heavy percentage of co-payments for outpatient prescriptions and inadequate protection from co-payments, especially for poorer households and people with chronic conditions. More than half of all prescriptions financed by the National Health Insurance Fund incur a percentage co-payment of 50% or more of the reference price. There are no exemptions from these co-payments. There is no annual cap on all co-payments."
                            )}
                        </Typography>
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
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    @media (min-width: 1440px) {
        width: 500px;
    }
`;
