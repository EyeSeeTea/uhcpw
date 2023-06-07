import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { IconButton } from "material-ui";
import InfoIcon from "@material-ui/icons/Info";
import GetAppIcon from "@material-ui/icons/GetApp";
import DashboardGraph from "../../assets/country-page/dashboard-graph.jpg";
import ExpandIcon from "../../assets/country-page/expand-icon.svg";

export const Hero: React.FC = () => {
    return (
        <Grid container>
            <InfoGrid item md={5} lg={4} xs={12}>
                <Column>
                    <Typography variant="h5" color="textSecondary" style={{ fontWeight: 500 }}>
                        {i18n.t("Financial hardship (2018)")}
                    </Typography>
                    <Text style={{ marginTop: "10px" }}>
                        {i18n.t("Impoverishing health spending: 8% of households")}
                    </Text>
                    <Text>{i18n.t("Catastrophic health spending: 19% of households")}</Text>
                    <Text>
                        {i18n.t("Most at rish: lower-income households, older people, people living in rural areas")}
                    </Text>
                    <Text>{i18n.t("Main driver: outpatient medicines, medical products, impatient care")}</Text>
                </Column>
                <Column style={{ marginTop: "40px" }}>
                    <Typography variant="h5" color="textSecondary" style={{ fontWeight: 500 }}>
                        {i18n.t("Unmet need (2021)")}
                    </Typography>
                    <Text>{i18n.t("Health care: 1% of people")}</Text>
                    <Text>{i18n.t("Dental care: 1.7% of people")}</Text>
                </Column>
            </InfoGrid>
            <GraphGrid item xs={12} md={7} lg={8}>
                <Column>
                    <Row>
                        <Typography style={{ marginRight: "30px" }}>
                            {i18n.t(
                                "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19"
                            )}
                        </Typography>
                        <IconButton style={{ color: "#035fa7" }}>
                            <InfoIcon />
                        </IconButton>
                        <IconButton style={{ padding: "5px" }}>
                            <img src={ExpandIcon} alt="expand icon" />
                        </IconButton>
                        <a href={DashboardGraph} download>
                            <IconButton style={{ color: "#035fa7" }}>
                                <GetAppIcon
                                    style={{
                                        color: "white",
                                        backgroundColor: "#035fa7",
                                        borderRadius: "50%",
                                        padding: "4px",
                                        fontSize: "14px",
                                    }}
                                />
                            </IconButton>
                        </a>
                    </Row>
                    <Image src={DashboardGraph} />
                </Column>
            </GraphGrid>
        </Grid>
    );
};

const Image = styled.img`
    width: 100%;
    height: auto;
    @media (min-width: 1440px) {
        width: 900px;
    }
`;

const InfoGrid = styled(Grid)`
    background-color: ${colors.accentPrimary};
    padding: 40px 30px 60px 30px;
`;

const GraphGrid = styled(Grid)`
    padding: 20px 50px 30px 50px;
    background-color: white;
`;

const Column = styled.div`
    padding: 16px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: start;
    gap: 10px;
`;

const Text = styled(Typography)`
    color: white;
    font-weight: 300;
    max-width: 55%;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;
