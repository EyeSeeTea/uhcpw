import { CircularProgress, Grid } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { useCountryInfo } from "../../pages/country/useCountryInfo";
import ReactMarkdown from "react-markdown";
import { ButtonItem } from "../home/country-panel/CountryPanel";
import { VisualizationPlugin } from "../visualization/VisualizationPlugin";
import { LatestAvailable } from "../../../domain/entities/Year";
import { useAppContext } from "../../contexts/app-context";
import React from "react";
import ScreenshotModal from "../screenshot-modal/ScreenshotModal";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import {
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
} from "../../../data/repositories/countries/CountryD2Repository";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";

type HeroProps = {
    countryId: string;
};

const CHART_1_SCATTER_VISUALIZATION_ID = "kIpnMBaBvZ9";
const CHART_1_SCATTER_VISUALIZATION_NAME =
    VisualizationsSeeds["kIpnMBaBvZ9"]?.countryPageName || VisualizationsSeeds["kIpnMBaBvZ9"]?.friendlyName;

const ANALYTICS_CONTENT = {
    contentGroup: "chart",
    contentId: CHART_1_SCATTER_VISUALIZATION_NAME,
};

export const Hero: React.FC<HeroProps> = ({ countryId }) => {
    const { countriesAndSubregions } = useAppContext();
    const country = useCountryInfo(countryId);
    const isSmallScreen = useIsSmallScreen();

    const [openScreenshot, setOpenScreenshot] = React.useState(false);

    const handleOpenScreenshot = React.useCallback(() => {
        setOpenScreenshot(true);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setOpenScreenshot(false);
    }, []);

    const countryIdSelected = React.useMemo(() => {
        if (countryId === FEDERACIJA_BOSNE_I_HERCEGOVINE || countryId === REPUBLICA_SERPSKA) {
            return BOSNIA_AND_HERZEGOVINA_LEVEL_4;
        } else {
            return countryId;
        }
    }, [countryId]);

    if (!countryIdSelected) return <CircularProgress />;

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
                        key={countryIdSelected}
                        visualizationId={CHART_1_SCATTER_VISUALIZATION_ID}
                        visualizationName={CHART_1_SCATTER_VISUALIZATION_NAME}
                        years={[LatestAvailable.id]}
                        countries={countriesAndSubregions.map(({ id }) => id)}
                        currentCountry={countryIdSelected}
                        withoutBackground
                        useHeaderForCountryPage
                        onDownloadImage={handleOpenScreenshot}
                        paddingEnd={false}
                        analyticsPageTitle="Country page"
                        showDialogInFullScreen={isSmallScreen}
                    />
                </VisualizationContainer>

                <ScreenshotModal
                    open={openScreenshot}
                    onClose={handleCloseScreenshot}
                    title={CHART_1_SCATTER_VISUALIZATION_NAME || ""}
                    backgroundColor={"#f1f9fc"}
                    isSquareChart={true}
                    analyticsPageTitle="Country page"
                    analyticsContent={ANALYTICS_CONTENT}
                    forceRotation={isSmallScreen}
                >
                    <VisualizationPlugin
                        visualizationId={CHART_1_SCATTER_VISUALIZATION_ID}
                        visualizationName={CHART_1_SCATTER_VISUALIZATION_NAME}
                        years={[LatestAvailable.id]}
                        countries={countriesAndSubregions.map(({ id }) => id)}
                        currentCountry={countryIdSelected}
                        withoutBackground
                        useHeaderForCountryPage
                        isScreenshot={true}
                        isSquareChart={true}
                        analyticsPageTitle="Country page"
                    />
                </ScreenshotModal>
            </GraphGrid>
        </Grid>
    );
};

const InfoGrid = styled(Grid)`
    background-color: ${colors.accentPrimary};
    padding: 20px 30px 60px 30px;
    padding-inline-start: 4.1rem;
    color: white;
    overflow-y: auto;
    font-size: 16px;
    @media (min-width: 743px) {
        padding-inline-end: 100px;
    }
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline-start: 20px;
    }
    ul {
        list-style-position: outside;
        padding-left: 13px;
        > li {
            padding-inline-start: 7px;
        }
    }
`;

const GraphGrid = styled(Grid)`
    padding: 20px 50px 30px 50px;
    background-color: white;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 20px 30px 30px 0px;
    }
`;

const VisualizationContainer = styled.div`
    max-width: 100%;
    padding-inline-end: 50px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 0;

        > div {
            padding: 0;
        }
    }
`;
