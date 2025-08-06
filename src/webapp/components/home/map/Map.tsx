import React, { useRef, useEffect, useCallback } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import styled from "styled-components";
import { Fab, Tooltip } from "@material-ui/core";

import { style } from "./style";
import { HomePagePanel } from "../home-page-panel/HomePagePanel";
import { CountryPanel } from "../country-panel/CountryPanel";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { Add as ZoomInIcon, Remove as ZoomOutIcon } from "@material-ui/icons";
import weakHoverPin from "../../../assets/map/pin-weak-hover.svg";
import weakPin from "../../../assets/map/pin-weak.svg";
import strongHoverPin from "../../../assets/map/pin-strong-hover.svg";
import strongPin from "../../../assets/map/pin-strong.svg";
import gapsHoverPin from "../../../assets/map/pin-gaps-hover.svg";
import gapsPin from "../../../assets/map/pin-gaps.svg";

import { MapState } from "./MapState";
import i18n from "../../../../locales";
import { MainMapPanelContent } from "../../../../domain/entities/HomePageContent";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";
import { RegionMainMapPanelContent } from "../../../../domain/entities/region/RegionInfo";
import { RegionMapPanel } from "../../region-map-panel/RegionMapPanel";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

// Fix bug in production build
// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export type MapProps = {
    mapState: MapState;
    homePagePanelContent?: MainMapPanelContent;
    regionMainMapPanelContent?: RegionMainMapPanelContent;
    isMobile?: boolean;
};

export const Map: React.FC<MapProps> = ({
    mapState,
    homePagePanelContent,
    regionMainMapPanelContent,
    isMobile = false,
}) => {
    const mainContainerRef = useRef<any>(null);
    const mapContainerRef = useRef<any>(null);
    const mapRef = useRef<any>(null);

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
        if (mapRef.current && !isMobile) {
            mapRef.current.on("load", () => {
                mapState.markers.features.forEach(feature => {
                    const el = document.createElement("div");
                    el.className = `marker ${
                        feature.properties.status === "Strong"
                            ? "marker-strong"
                            : feature.properties.status === "Weak"
                            ? "marker-weak"
                            : "marker-gaps"
                    }`;

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(feature.geometry.coordinates as LngLatLike)
                        .addTo(mapRef.current);

                    marker.getElement().addEventListener("mouseenter", () => {
                        mapState.onSelectedCountryChange(feature.properties);
                    });
                });
            });
            mainContainerRef.current.addEventListener("mouseleave", () => {
                mapState.onSelectedCountryChange(undefined);
            });
        }
    }, [mapState, isMobile]);

    const zoomIn = useCallback(() => {
        const newZoom = mapRef.current.getZoom() * 1.25;
        mapRef.current.flyTo({ zoom: newZoom });
    }, []);

    const zoomOut = useCallback(() => {
        const newZoom = mapRef.current.getZoom() * 0.8;
        mapRef.current.flyTo({ zoom: newZoom });
    }, []);

    return (
        <Container ref={mainContainerRef}>
            <MapContent ref={mapContainerRef} />
            <MapSidePanel>
                {mapState.selectedCountry ? (
                    <CountryPanel country={mapState.selectedCountry} />
                ) : regionMainMapPanelContent ? (
                    <RegionMapPanel mainPanelContent={regionMainMapPanelContent} />
                ) : (
                    <HomePagePanel mainPanelContent={homePagePanelContent} isMobile={isMobile} />
                )}
            </MapSidePanel>
            {!isMobile && (
                <MapControls>
                    <Tooltip title={i18n.t("Zoom in")}>
                        <MapFab size="small" onClick={zoomIn}>
                            <ZoomInIcon fontSize="small" />
                        </MapFab>
                    </Tooltip>
                    <Tooltip title={i18n.t("Zoom out")}>
                        <MapFab size="small" onClick={zoomOut}>
                            <ZoomOutIcon fontSize="small" />
                        </MapFab>
                    </Tooltip>
                </MapControls>
            )}
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
`;

const MapContent = styled.div`
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: relative;
    .marker-weak {
        background-image: url(${() => weakPin});
    }
    .marker-weak:hover {
        background-image: url(${() => weakHoverPin});
    }
    .marker-strong {
        background-image: url(${() => strongPin});
    }
    .marker-strong:hover {
        background-image: url(${() => strongHoverPin});
    }
    .marker-gaps {
        background-image: url(${() => gapsPin});
    }
    .marker-gaps:hover {
        background-image: url(${() => gapsHoverPin});
    }
    .marker {
        background-size: cover;
        width: 15px;
        height: 20px;
        position: absolute;
    }
    .marker:hover {
        width: 35px;
        height: 48px;
        cursor: pointer;
    }
    .mapboxgl-ctrl-logo {
        display: none !important;
    }
`;

const MapSidePanel = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    max-width: 500px;
    background: ${colors.accentPrimary};
    color: white;
    padding: 48px;
    opacity: 0.9;
    z-index: 1;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
        width: calc(100% - 48px);
        padding: 24px;
    }
`;

const MapControls = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    top: 60px;
    right: 10px;
`;

const MapFab = styled(Fab)`
    background: #0360a6;
    color: white;
    margin: 4px;
    min-height: 30px;
    width: 30px;
    height: 30px;
    :hover {
        background: #0360a6;
    }
`;
