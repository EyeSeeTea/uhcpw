import { useCallback, useMemo, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { InitialCoordinates, MapState } from "../../components/home/map/MapState";
import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/region/Region";

const initialData: InitialCoordinates = {
    center: [5.0, 50.0],
    maxZoom: 8,
    minZoom: 2.5,
    zoom: 3,
};

const CENTER_BY_REGION: Record<Id, [number, number]> = {
    [ORG_UNIT_GROUP_IDS.EUROPEAN_UNION]: [5.0, 50.0],
    [ORG_UNIT_GROUP_IDS.WESTERN_BALKANS]: [15.0, 42.5],
    [ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA]: [35.0, 50.0],
    [ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES]: [22.0, 43.5],
};

const ZOOM_BY_REGION: Record<Id, number> = {
    [ORG_UNIT_GROUP_IDS.EUROPEAN_UNION]: 3,
    [ORG_UNIT_GROUP_IDS.WESTERN_BALKANS]: 4.4,
    [ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA]: 3,
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
