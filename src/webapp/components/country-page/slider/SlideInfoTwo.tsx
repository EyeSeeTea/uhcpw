import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
import Umbrella from "../../../assets/country-page/umbrella-wordings.png";
import bubblePattern from "../../../assets/bubble-pattern.svg";

export const SlideInfoTwo: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" style={{ marginBottom: "50px", maxWidth: "70%" }}>
                {i18n.t("How can Bulgaria strengthen financial protection?")}
            </Typography>
            <InfoGrid container alignItems="center">
                <Grid item xs={12} md={6}>
                    <Column>
                        <Typography style={{ fontWeight: "bold" }}>
                            {i18n.t("Ensure the National Health Insurance Fund covers the whole population")}
                        </Typography>
                        <Typography>
                            {i18n.t(
                                "The Government should begin to pay social health insurance contributions for people living below the poverty line who are not entitled to social support. It should also stop penalizing non-payment of contributions by restricting access to health care; addressing non-payment of contributions should be the responsibility of the tax agency rather than the National Health Insurance Fund."
                            )}
                        </Typography>
                        <Typography style={{ fontWeight: "bold", marginTop: "20px" }}>
                            {i18n.t("Strengthen protection from user charges")}
                        </Typography>
                        <Typography>
                            {i18n.t(
                                "Exempt households with lower incomes and people with chronic conditions from co-payments. Introduce an annual income-based cap on all co-payments. Change percentage co-payments for medicines to low-fixed co-payments."
                            )}
                        </Typography>
                        <Typography style={{ fontWeight: "bold", marginTop: "20px" }}>
                            {i18n.t("Improve medicines policy")}
                        </Typography>
                        <Typography>
                            {i18n.t(
                                "Improve the capacity of the National Health Insurance Fund to purchase outpatient medicines. Continue to reduce medicine prices. Make sure health care providers and pharmacies have incentives to prescribe and dispense the cheapest alternatives."
                            )}
                        </Typography>
                        <Typography style={{ fontWeight: "bold", marginTop: "20px" }}>
                            {i18n.t("Increase public spending on health")}
                        </Typography>
                        <Typography>
                            {i18n.t(
                                "Support these policy changes by increasing the level of government budget transfers to the National Health Insurance Fund over time. Use additional resources carefully to meet equity and efficiency goals."
                            )}
                        </Typography>
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
    gap: 15px;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    @media (min-width: 1440px) {
        width: 500px;
    }
`;
