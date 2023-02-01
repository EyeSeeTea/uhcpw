import React, { useRef, useEffect } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import styled from "styled-components";
import { style } from "./style";
import { useMap } from "./useMap";
import { WelcomePanel } from "../welcome-panel/WelcomePanel";
import { CountryPanel } from "../country-panel/CountryPanel";
import { colors } from "../../../pages/app/themes/dhis2.theme";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

// Fix bug in production build
// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const Map: React.FC = () => {
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<any>(null);
    const mapState = useMap();

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: style,
                center: mapState.initialData.center,
                maxZoom: mapState.initialData.maxZoom,
                minZoom: mapState.initialData.minZoom,
                zoom: mapState.initialData.zoom,
                maxBounds: undefined,
                preserveDrawingBuffer: true,
            });

            mapRef.current = map;
        }
    }, [mapState.initialData, mapState.markers]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.on("load", () => {
                mapState.markers.features.forEach(feature => {
                    const el = document.createElement("div");
                    el.className = "marker";

                    const marker = new mapboxgl.Marker(el, { color: feature.properties.color })
                        .setLngLat(feature.geometry.coordinates as LngLatLike)
                        .addTo(mapRef.current);

                    marker.getElement().addEventListener("mouseenter", () => {
                        mapState.onSelectedCountryChange(feature.properties);
                    });

                    marker.getElement().addEventListener("mouseleave", () => {
                        mapState.onSelectedCountryChange(undefined);
                    });
                });
            });
        }
    }, [mapState]);

    return (
        <Container>
            <MapContent ref={mapContainerRef} />
            <MapSidePanel>
                {mapState.selectedCountry ? <CountryPanel country={mapState.selectedCountry} /> : <WelcomePanel />}
            </MapSidePanel>
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    position: relative;
`;

const MapContent = styled.div`
    overflow: hidden;
    height: 100%;
    .marker {
        background-image: url("https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png");
        background-size: cover;
        width: 30px;
        height: 30px;
    }
    .marker:hover {
        width: 50px;
        height: 50px;
    }
    .mapboxgl-ctrl-logo {
        display: none !important;
    }
`;

const MapSidePanel = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 400px;
    background: ${colors.accentPrimary};
    color: white;
    padding: 48px;
    opacity: 0.9;
`;
