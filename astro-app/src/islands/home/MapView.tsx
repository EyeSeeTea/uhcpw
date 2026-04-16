import React, { useRef, useEffect, useCallback } from "react";
import mapboxgl, { type LngLatLike } from "mapbox-gl";
import type { Country } from "@shared/domain/entities/Country";
import type { InitialCoordinates } from "@shared/webapp/components/home/map/MapState";
import { fullStyle } from "@shared/webapp/components/home/map/style";
import type { FinancialProtectionStatus } from "@shared/domain/entities/FinancialProtectionStatus";

mapboxgl.accessToken =
    "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

const markerStatusClass: Record<FinancialProtectionStatus, string> = {
    InsufficientData: "marker-insufficientdata",
    VeryWeak: "marker-very-weak",
    Weak: "marker-weak",
    Gaps: "marker-gaps",
    Emerging: "marker-emerging",
    Strong: "marker-strong",
};

export interface MapViewProps {
    initialData: InitialCoordinates;
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    onSelectedCountryChange: (country?: Country) => void;
    isMobile?: boolean;
    children?: React.ReactNode;
}

export const MapView: React.FC<MapViewProps> = ({
    initialData,
    markers,
    onSelectedCountryChange,
    isMobile = false,
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: fullStyle,
            center: initialData.center,
            maxZoom: initialData.maxZoom,
            minZoom: initialData.minZoom,
            zoom: initialData.zoom,
            preserveDrawingBuffer: true,
        });

        mapRef.current = map;

        if (!isMobile) {
            map.on("load", () => {
                markers.features.forEach(feature => {
                    const el = document.createElement("div");
                    el.className = `marker ${markerStatusClass[feature.properties.status]}`;

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(feature.geometry.coordinates as LngLatLike)
                        .addTo(map);

                    marker.getElement().addEventListener("mouseenter", () => {
                        onSelectedCountryChange(feature.properties);
                    });
                });
            });
        }

        return () => {
            map.remove();
        };
    }, [initialData, markers, onSelectedCountryChange, isMobile]);

    useEffect(() => {
        if (isMobile) return;
        const el = containerRef.current;
        if (!el) return;
        const handleLeave = () => onSelectedCountryChange(undefined);
        el.addEventListener("mouseleave", handleLeave);
        return () => el.removeEventListener("mouseleave", handleLeave);
    }, [onSelectedCountryChange, isMobile]);

    const zoomIn = useCallback(() => {
        const map = mapRef.current;
        if (map) map.flyTo({ zoom: map.getZoom() * 1.25 });
    }, []);

    const zoomOut = useCallback(() => {
        const map = mapRef.current;
        if (map) map.flyTo({ zoom: map.getZoom() * 0.8 });
    }, []);

    return (
        <div ref={containerRef} className="map-root">
            <div ref={mapContainerRef} className="map-canvas-container" />

            <div className="map-side-panel">{children}</div>

            <div className="map-controls">
                <button className="map-zoom-btn" onClick={zoomIn} aria-label="Zoom in">
                    +
                </button>
                <button className="map-zoom-btn" onClick={zoomOut} aria-label="Zoom out">
                    −
                </button>
            </div>
        </div>
    );
};
