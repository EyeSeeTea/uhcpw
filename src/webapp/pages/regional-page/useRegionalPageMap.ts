import { useCallback, useMemo, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { InitialCoordinates, MapState } from "../../components/home/map/MapState";
import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/region/Region";

const initialData: InitialCoordinates = {
    center: [13.675063, 51.751569],
    maxZoom: 8,
    minZoom: 2.5,
    zoom: 2.5,
};

const CENTER_BY_REGION: Record<Id, [number, number]> = {
    [ORG_UNIT_GROUP_IDS.WESTERN_BALKANS]: [20.0, 43.5],
    [ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA]: [60.0, 58.0],
    [ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES]: [22.0, 43.5],
};

const ZOOM_BY_REGION: Record<Id, number> = {
    [ORG_UNIT_GROUP_IDS.WESTERN_BALKANS]: 3,
    [ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA]: 2.5,
    [ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES]: 3,
};

export function useRegionalPageMap(params: {
    selectedRegionId?: Id;
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
}): MapState {
    const { selectedRegionId, markers } = params;
    const [selectedCountry, setSelectedCountry] = useState<Country>();

    const onSelectedCountryChange = useCallback((country?: Country) => {
        setSelectedCountry(country);
    }, []);

    const initialCoordinates: InitialCoordinates = useMemo(() => {
        const center: [number, number] =
            CENTER_BY_REGION[selectedRegionId as keyof typeof CENTER_BY_REGION] || initialData.center;
        const zoom: number = ZOOM_BY_REGION[selectedRegionId as keyof typeof ZOOM_BY_REGION] || initialData.zoom;
        return {
            ...initialData,
            center: center,
            zoom: zoom,
        };
    }, [selectedRegionId]);

    return {
        initialData: initialCoordinates,
        markers: markers,
        selectedCountry: selectedCountry,
        onSelectedCountryChange,
    };
}
