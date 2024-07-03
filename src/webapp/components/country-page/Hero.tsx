import { CircularProgress, Grid } from "@material-ui/core";
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
    const { countriesAndRegions } = useAppContext();
    const country = useCountryInfo(countryId);

    if (!countryId) return <CircularProgress />;

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
                        key={countryId}
                        visualizationId={CHART_1_SCATTER_VISUALIZATION_ID}
                        years={[LatestCOVID19.id]}
                        countries={countriesAndRegions.map(({ id }) => id)}
                        currentCountry={countryId}
                        withoutBackground
                        useHeaderForCountryPage
                    />
                </VisualizationContainer>
            </GraphGrid>
        </Grid>
    );
};

const InfoGrid = styled(Grid)`
    background-color: ${colors.accentPrimary};
    padding: 40px 30px 60px 30px;
    padding-inline-start: 4.1rem;
    color: white;
    overflow-y: auto;
    font-size: 16px;
    @media (min-width: 743px) {
    padding-inline-end: 100px;
    }
    ul {
        list-style-position: outside;
        padding-left: 13px;
        > li {
            padding-inline-start: 7px;
        }
    }
    }
`;

const GraphGrid = styled(Grid)`
    padding: 20px 50px 30px 50px;
    background-color: white;
`;

const VisualizationContainer = styled.div`
    max-width: 100%;
`;
