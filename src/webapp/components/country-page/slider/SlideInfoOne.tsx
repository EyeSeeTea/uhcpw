import { Grid, Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled, { css } from "styled-components";
import Umbrella from "../../../assets/country-page/umbrella-3.svg";
import Rain from "../../../assets/country-page/rain.png";

export const SlideInfoOne: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" style={{ fontWeight: 500 }}>
                {i18n.t("What are the main gaps in publicly financed coverage?")}
            </Typography>
            <Grid container>
                <Grid item xs={12} md={8}>
                    <Column>
                        <Title>{i18n.t("Population coverage")}</Title>
                        <Typography>
                            {i18n.t(
                                "A large share of the population (15%) is uninsured and only has access to a few publicly financed health services. This is because access to National Health Insurance Fund benefits is based on the payment of contributions."
                            )}
                        </Typography>
                        <Title style={{ marginTop: "20px" }}>{i18n.t("Service coverage")}</Title>
                        <Typography>
                            {i18n.t(
                                "National Health Insurance Fund coverage of outpatient medicines, medical products and dental care is limited. Medicine prices are high compared to other countries."
                            )}
                        </Typography>
                        <Title style={{ marginTop: "20px" }}>{i18n.t("User charges (co-payments)")}</Title>
                        <Typography>
                            {i18n.t(
                                "Heavy percentage of co-payments for outpatient prescriptions and inadequate protection from co-payments, especially for poorer households and people with chronic conditions. More than half of all prescriptions financed by the National Health Insurance Fund incur a percentage co-payment of 50% or more of the reference price. There are no exemptions from these co-payments. There is no annual cap on all co-payments."
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
    color: #b20101;
`;

const Image = styled.img`
    width: 100%;
    max-width: 225px;
    height: auto;
`;
