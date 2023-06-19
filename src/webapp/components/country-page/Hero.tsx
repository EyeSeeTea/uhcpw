import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { IconButton } from "material-ui";
import InfoIcon from "@material-ui/icons/Info";
import GetAppIcon from "@material-ui/icons/GetApp";
import DashboardGraph from "../../assets/country-page/dashboard-graph.jpg";
//import ExpandIcon from "../../assets/country-page/expand-icon.svg";
import { useState } from "react";
import { NotesDialog } from "../dialog/NotesDialog";

export const Hero: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Grid container aria-label="country-page-hero">
            <InfoGrid item md={5} lg={4} xs={12}>
                <Column>
                    <Typography variant="h5" color="textSecondary" style={{ fontWeight: 500 }}>
                        {i18n.t("Financial hardship (2018)")}
                    </Typography>
                    <Text style={{ marginTop: "10px" }}>
                        {i18n.t("Impoverishing health spending: 8% of households")}
                    </Text>
                    <Text>{i18n.t("Catastrophic health spending: 19.2% of households")}</Text>
                    <Text>
                        {i18n.t("Most at risk: lower-income households, older people and people in rural areas")}
                    </Text>
                    <Text>{i18n.t("Main driver: outpatient medicines especially for low-income households")}</Text>
                </Column>
                <Column style={{ marginTop: "40px" }}>
                    <Typography variant="h5" color="textSecondary" style={{ fontWeight: 500 }}>
                        {i18n.t("Unmet need (2022)")}
                    </Typography>
                    <Text>{i18n.t("1% of people report unmet need for health care")}</Text>
                    <Text>{i18n.t("2% of people report unmet need for dental care")}</Text>
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
                        <IconButton style={{ color: "#035fa7" }} onClick={() => setIsOpen(true)}>
                            <InfoIcon />
                        </IconButton>
                        {/* <IconButton style={{ padding: "5px" }}>
                            <img src={ExpandIcon} alt="expand icon" />
                        </IconButton> */}
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
                    <Image src={DashboardGraph} alt="hero-graph" />
                </Column>
            </GraphGrid>
            <NotesDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                dialogInfo={{
                    infoNotes: [
                        "Data on catastrophic health spending and out-of-pocket payments are for the same year. The colour of the dots reflects the incidence of catastrophic health spending. Green < 5%; orange < 10%; red ≥ 10%. For catastrophic health spending, the Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                    ],
                    sourceName: "WHO Barcelona Office for Health Systems Financing",
                    sourceLink: "",
                }}
            />
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
