import React, { lazy, Suspense, useEffect, useState } from "react";
import type { InitialCoordinates } from "@shared/webapp/components/home/map/MapState";
import type { HomeMarkerCountry } from "@/data/home/home-resource";

export interface HomeMapProps {
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, HomeMarkerCountry>;
    initialData: InitialCoordinates;
}

const DESKTOP_QUERY = "(min-width: 960px)";

// Lazy-import so the Mapbox + MUI bundles only download on desktop viewports.
const HomeMapDesktop = lazy(() =>
    import("./HomeMapDesktop").then(m => ({ default: m.HomeMapDesktop })),
);

export const HomeMap: React.FC<HomeMapProps> = props => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_QUERY);
        setIsDesktop(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    if (!isDesktop) return null;

    return (
        <Suspense fallback={null}>
            <HomeMapDesktop {...props} />
        </Suspense>
    );
};
