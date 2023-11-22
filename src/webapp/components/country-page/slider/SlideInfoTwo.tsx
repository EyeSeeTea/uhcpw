import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled, { css } from "styled-components";
import Umbrella from "../../../assets/country-page/umbrellaGreen.png";

import Rain from "../../../assets/country-page/rain.png";

export const SlideInfoTwo: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" style={{ fontWeight: 500 }}>
                {i18n.t("How can Bulgaria strengthen financial protection?")}
            </Typography>
            <Grid container>
                <Grid item xs={12} md={8}>
                    <Column>
                        <Title>{i18n.t("Ensure the National Health Insurance Fund covers the whole population")}</Title>
                        <Typography>
                            {i18n.t(
                                "The Government should begin to pay social health insurance contributions for people living below the poverty line who are not entitled to social support. It should also stop penalizing non-payment of contributions by restricting access to health care; addressing non-payment of contributions should be the responsibility of the tax agency rather than the National Health Insurance Fund."
                            )}
                        </Typography>
                        <Title style={{ marginTop: "10px" }}>{i18n.t("Strengthen protection from user charges")}</Title>
                        <Typography>
                            {i18n.t(
                                "Exempt households with lower incomes and people with chronic conditions from co-payments. Introduce an annual income-based cap on all co-payments. Change percentage co-payments for medicines to low-fixed co-payments."
                            )}
                        </Typography>
                        <Title style={{ marginTop: "10px" }}>{i18n.t("Improve medicines policy")}</Title>
                        <Typography>
                            {i18n.t(
                                "Improve the capacity of the National Health Insurance Fund to purchase outpatient medicines. Continue to reduce medicine prices. Make sure health care providers and pharmacies have incentives to prescribe and dispense the cheapest alternatives."
                            )}
                        </Typography>
                        <Title style={{ marginTop: "10px" }}>{i18n.t("Increase public spending on health")}</Title>
                        <Typography>
                            {i18n.t(
                                "Support these policy changes by increasing the level of government budget transfers to the National Health Insurance Fund over time. Use additional resources carefully to meet equity and efficiency goals."
                            )}
                        </Typography>
                    </Column>
                </Grid>
                <UmbrellaContainer item xs={12} md={4}>
                    <Image src={Umbrella} />
                </UmbrellaContainer>
            </Grid>
        </Container>
    );
};

const visuallyHidden = css`
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    overflow: hidden;
    white-space: nowrap;
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
`;

const Container = styled.div`
    padding: 0px 10px 20px 30px;
    @media (min-width: 960px) {
        > h3 {
            ${visuallyHidden};
        }
    }
`;

const UmbrellaContainer = styled(Grid)`
    display: none;
    @media (min-width: 1024px) {
        display: flex;
        height: 100vh;
        background: url(${Rain}) top;
        align-items: start;
        padding-block-start: 40px;
        justify-content: center;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 15px;
    max-width: 658px;
    width: 100%;
    padding-block: 46px;
`;

const Title = styled(Typography)`
    font-weight: bold;
    color: #4fad56;
`;

const Image = styled.img`
    width: 100%;
    max-width: 225px;
    height: auto;
`;
