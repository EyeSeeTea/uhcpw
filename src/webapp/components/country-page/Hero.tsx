import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { useCountryInfo } from "../../pages/country/useCountryInfo";
import ReactMarkdown from "react-markdown";
import { ButtonItem } from "../home/country-panel/CountryPanel";
import { VisualizationPlugin } from "../visualization/VisualizationPlugin";
import { LatestCOVID19 } from "../../../domain/entities/Year";
import { useAppContext } from "../../contexts/app-context";

type HeroProps = {
    countryId: string;
};

const CHART_1_SCATTER_VISUALIZATION_ID = "hNU4Lj1xLYO";

export const Hero: React.FC<HeroProps> = ({ countryId }) => {
    const { countries } = useAppContext();
    const country = useCountryInfo(countryId);

    return (
        <Grid container aria-label="country-page-hero">
            {country && (
                <InfoGrid item md={5} lg={4} xs={12}>
                    <ReactMarkdown
                        components={{
                            a: ({ ...props }) => <ButtonItem {...props} />,
                        }}
                    >
                        {country.summary}
                    </ReactMarkdown>
                </InfoGrid>
            )}
            <GraphGrid item xs={12} md={7} lg={8}>
                <VisualizationContainer>
                    <VisualizationPlugin
                        visualizationId={CHART_1_SCATTER_VISUALIZATION_ID}
                        years={[LatestCOVID19.id]}
                        countries={countries.map(({ id }) => id)}
                        withoutBackground
                    />
                </VisualizationContainer>
            </GraphGrid>

            {/* <GraphGrid item xs={12} md={7} lg={8}>
                <Column>
                    <Row>
                        <Typography style={{ marginRight: "30px" }}>
                            {i18n.t(
                                "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19"
                            )}
                        </Typography>
                        <ActionButtons onIconButtonClick={() => setIsOpen(true)} graphImage={DashboardGraph} />
                    </Row>
                    <Image src={DashboardGraph} alt="hero-graph" />
                </Column>
            </GraphGrid>
            <NotesDialog
                isOpen={isOpen}
                onClose={handleClose}
                dialogInfo={{
                    infoNotes: [
                        "Data on catastrophic health spending and out-of-pocket payments are for the same year. The colour of the dots reflects the incidence of catastrophic health spending. Green < 5%; orange < 10%; red ≥ 10%. For catastrophic health spending, the Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                    ],
                    sourceName: "WHO Barcelona Office for Health Systems Financing",
                    sourceLink: "",
                }}
            /> */}
        </Grid>
    );
};

const InfoGrid = styled(Grid)`
    background-color: ${colors.accentPrimary};
    padding: 40px 30px 60px 30px;
    color: white;
    overflow-y: auto;
    font-size: 16px;
    ul {
        list-style-position: inside;
        padding-left: 0;
    }
`;

const GraphGrid = styled(Grid)`
    padding: 20px 50px 30px 50px;
    background-color: white;
`;

const VisualizationContainer = styled.div`
    max-width: 100%;
`;
