import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Country } from "../../../../domain/entities/Country";
import { MainMapPanelContent } from "../../../../domain/entities/HomePageContent";
import { RegionMainMapPanelContent } from "../../../../domain/entities/region/RegionInfo";
import { CountryPanel } from "../country-panel/CountryPanel";
import { HomePagePanel } from "../home-page-panel/HomePagePanel";
import { RegionMapPanel } from "../../region-map-panel/RegionMapPanel";

type UseMapSidePanelHeightOptions = {
    countries: ReadonlyArray<Country>;
    homePagePanelContent: MainMapPanelContent | undefined;
    regionMainMapPanelContent: RegionMainMapPanelContent | undefined;
    isRegionalPage: boolean;
    contentWidthPx: number;
    enabled: boolean;
};

type UseMapSidePanelHeightResult = {
    height: number | undefined;
    measurementContainer: React.ReactNode;
};

export function useMapSidePanelHeight(options: UseMapSidePanelHeightOptions): UseMapSidePanelHeightResult {
    const { countries, homePagePanelContent, regionMainMapPanelContent, isRegionalPage, contentWidthPx, enabled } =
        options;

    const measurementContainerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!enabled || !measurementContainerRef.current) return;

        const wrappers = Array.from(measurementContainerRef.current.children) as HTMLElement[];
        const maxHeight = wrappers.reduce((max, el) => Math.max(max, el.scrollHeight), 0);

        if (maxHeight > 0) {
            setHeight(maxHeight);
        }
    }, [enabled, countries, homePagePanelContent, regionMainMapPanelContent, contentWidthPx]);

    // Hidden container used it for measuring the height of the side panel based on countries and homepage content
    const measurementContainer = useMemo(() => {
        if (!enabled) return null;

        const defaultPanel = isRegionalPage ? (
            <RegionMapPanel mainPanelContent={regionMainMapPanelContent} />
        ) : (
            <HomePagePanel mainPanelContent={homePagePanelContent} />
        );

        return (
            <MeasurementContainer ref={measurementContainerRef} $width={contentWidthPx}>
                {countries.map(country => (
                    <PanelWrapper key={country.id} $width={contentWidthPx}>
                        <CountryPanel country={country} isRegionalPage={isRegionalPage} />
                    </PanelWrapper>
                ))}
                <PanelWrapper $width={contentWidthPx}>{defaultPanel}</PanelWrapper>
            </MeasurementContainer>
        );
    }, [enabled, countries, homePagePanelContent, regionMainMapPanelContent, isRegionalPage, contentWidthPx]);

    return { height, measurementContainer };
}

const MeasurementContainer = styled.div<{ $width: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.$width}px;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
    z-index: -1;
`;

const PanelWrapper = styled.div<{ $width: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.$width}px;
`;
