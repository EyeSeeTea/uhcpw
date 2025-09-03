import React, { useRef, useEffect } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import styled from "styled-components";

import { style } from "../../components/home/map/style";
import weakHoverPin from "../../assets/map/pin-weak-hover.svg";
import weakPin from "../../assets/map/pin-weak.svg";
import strongHoverPin from "../../assets/map/pin-strong-hover.svg";
import strongPin from "../../assets/map/pin-strong.svg";
import gapsHoverPin from "../../assets/map/pin-gaps-hover.svg";
import gapsPin from "../../assets/map/pin-gaps.svg";
import { MapState } from "../../components/home/map/MapState";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

// Fix bug in production build
// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export type CoveragePolicyMapProps = {
    mapState: MapState;
};

export const CoveragePolicyMap: React.FC<CoveragePolicyMapProps> = props => {
    const { mapState } = props;

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
        if (mapRef.current) {
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
    }, [mapState]);

    return (
        <Container ref={mainContainerRef}>
            <MapContent ref={mapContainerRef} className="MAP" />
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    width: 100%;
`;

const MapContent = styled.div`
    height: 100%;
    width: 100%;
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
