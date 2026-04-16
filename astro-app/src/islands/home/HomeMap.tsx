import "mapbox-gl/dist/mapbox-gl.css";
import "./HomeMap.css";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import type { Country } from "@shared/domain/entities/Country";
import type { MainMapPanelContent } from "@shared/domain/entities/HomePageContent";
import type { InitialCoordinates } from "@shared/webapp/components/home/map/MapState";
import { AppContext } from "@shared/webapp/contexts/app-context";
import { HomePagePanel } from "@shared/webapp/components/home/home-page-panel/HomePagePanel";
import { CountryPanel } from "@shared/webapp/components/home/country-panel/CountryPanel";
import { muiTheme } from "@shared/webapp/pages/app/themes/dhis2.theme";
import { buildAstroAnalyticsContext } from "./analytics-context";
import { MapView } from "./MapView";

export interface HomeMapProps {
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    homePagePanelContent: MainMapPanelContent;
    initialData: InitialCoordinates;
}

const MOBILE_QUERY = "(max-width: 959px)";

export const HomeMap: React.FC<HomeMapProps> = ({
    markers,
    homePagePanelContent,
    initialData,
}) => {
    const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        setIsMobile(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const onSelectedCountryChange = useCallback((country?: Country) => {
        setSelectedCountry(country);
    }, []);

    const analyticsContext = useMemo(() => buildAstroAnalyticsContext(), []);

    return (
        <StylesProvider injectFirst>
            <MuiThemeProvider theme={muiTheme}>
                <AppContext.Provider value={analyticsContext}>
                    <div className="home-map-container">
                        <MapView
                            initialData={initialData}
                            markers={markers}
                            onSelectedCountryChange={onSelectedCountryChange}
                            isMobile={isMobile}
                        >
                            {selectedCountry ? (
                                <CountryPanel country={selectedCountry} />
                            ) : (
                                <HomePagePanel
                                    mainPanelContent={homePagePanelContent}
                                    isMobile={isMobile}
                                />
                            )}
                        </MapView>
                    </div>
                </AppContext.Provider>
            </MuiThemeProvider>
        </StylesProvider>
    );
};
