import React, { useRef, useEffect } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import styled from "styled-components";
import { style } from "./style";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";
// Fix bug in production build
// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

type MarkerData = {
    name: string;
    description: string;
    color: string;
};

const geoJson: GeoJSON.FeatureCollection<GeoJSON.Point, MarkerData> = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Madrid",
                description: "Madrid, Spain",
                color: "red",
            },
            geometry: {
                type: "Point",
                coordinates: [-3.70256, 40.4165],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Lisbon",
                description: "Lisbon, Portugal",
                color: "green",
            },
            geometry: {
                type: "Point",
                coordinates: [-9.13333, 38.71667],
            },
        },
    ],
};

export const Map: React.FC = () => {
    const mapContainer = useRef<any>(null);

    useEffect(() => {
        if (mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: style,
                center: [1.675063, 47.751569], // { lat: 47.751569, lng: 1.675063 },
                maxZoom: 3,
                minZoom: 3,
                zoom: 3,
                maxBounds: undefined,
                preserveDrawingBuffer: true,
            });

            map.on("load", () => {
                console.log("load");

                geoJson.features.forEach(feature => {
                    const marker = new mapboxgl.Marker({ color: feature.properties.color })
                        .setLngLat(feature.geometry.coordinates as LngLatLike)
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 }) // add popups
                                .setHTML(`<h3>${feature.properties.name}</h3><p>${feature.properties.description}</p>`)
                        )
                        .addTo(map);

                    marker.getElement().addEventListener("click", e => {
                        console.log("marker");
                    });
                });
            });

            map.on("click", e => {
                console.log(e.lngLat);
            });
        }
    }, []);

    return <MapContainer ref={mapContainer} />;
};

const MapContainer = styled.div`
    overflow: hidden;
    position: "absolute";
    bottom: 0;
    top: 0;
    height: 90vh;
`;
