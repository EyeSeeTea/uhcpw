import { useCallback, useMemo, useState } from "react";

import { Country } from "../../../domain/entities/Country";
import { InitialCoordinates, MapState } from "../../components/home/map/MapState";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { countriesToGeoJson } from "../../components/home/map/useMap";

const initialCoordinates: InitialCoordinates = {
    center: [13.675063, 51.751569],
    maxZoom: 8,
    minZoom: 2.5,
    zoom: 2.5,
};

export function useCoveragePolicyMap(selectedRegionId?: Id): MapState {
    const { regions, countries } = useAppContext();
    const [selectedCountry, setSelectedCountry] = useState<Country>();

    const onSelectedCountryChange = useCallback((country?: Country) => {
        setSelectedCountry(country);
    }, []);

    const markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country> = useMemo(() => {
        if (!selectedRegionId) {
            return { type: "FeatureCollection", features: [] };
        }

        const region = regions.find(region => region.id === selectedRegionId);
        const countryIdsInRegion = region?.countries || [];

        const countriesInRegion = countries.filter(country => countryIdsInRegion.includes(country.id));
        return countriesToGeoJson(countriesInRegion);
    }, [countries, regions, selectedRegionId]);

    return {
        initialData: initialCoordinates,
        markers: markers,
        selectedCountry: selectedCountry,
        onSelectedCountryChange,
    };
}
