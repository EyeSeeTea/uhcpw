import "mapbox-gl/dist/mapbox-gl.css";
import "./HomeMap.css";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import type { Country } from "@shared/domain/entities/Country";
import { AppContext } from "@shared/webapp/contexts/app-context";
import { CountryPanel } from "@shared/webapp/components/home/country-panel/CountryPanel";
import { muiTheme } from "@shared/webapp/pages/app/themes/dhis2.theme";
import { buildAstroAnalyticsContext } from "./analytics-context";
import { MapView } from "./MapView";
import type { HomeMapProps } from "./HomeMap";
import type { HomeMarkerCountry } from "@/data/home/home-resource";

export const HomeMapDesktop: React.FC<HomeMapProps> = ({
    markers,
    initialData,
}) => {
    const [selectedCountry, setSelectedCountry] = useState<HomeMarkerCountry | undefined>();

    const onSelectedCountryChange = useCallback((country?: HomeMarkerCountry) => {
        setSelectedCountry(country);
        document.getElementById("map-section")?.classList.toggle("is-country-selected", !!country);
    }, []);

    useEffect(() => {
        return () => document.getElementById("map-section")?.classList.remove("is-country-selected");
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
                        >
                            {selectedCountry ? (
                                // CountryPanel reads only {name, status, summary};
                                // the rest of Country is never accessed at runtime.
                                <CountryPanel country={selectedCountry as Country} />
                            ) : null}
                        </MapView>
                    </div>
                </AppContext.Provider>
            </MuiThemeProvider>
        </StylesProvider>
    );
};
