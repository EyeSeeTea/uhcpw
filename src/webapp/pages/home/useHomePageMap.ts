import { useCallback, useEffect, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { useAppContext } from "../../contexts/app-context";
import { InitialCoordinates, MapState } from "../../components/home/map/MapState";
import { countriesToGeoJson } from "../../components/home/map/utils/countriesToGeoJson";

const initialData: InitialCoordinates = {
    center: [13.675063, 51.751569],
    maxZoom: 8,
    minZoom: 2.5,
    zoom: 2.5,
};

export function useHomePageMap(): MapState {
    const [markers, setMarkers] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Country>>({
        type: "FeatureCollection",
        features: [],
    });

    const [selectedCountry, setSelectedCountry] = useState<Country>();
    const { countries } = useAppContext();

    useEffect(() => {
        const countriesWithSummary = countries.filter(country => country.summary);

        setMarkers(countriesToGeoJson(countriesWithSummary));
    }, [countries]);

    const onSelectedCountryChange = useCallback((country?: Country) => {
        setSelectedCountry(country);
    }, []);

    return {
        initialData,
        markers,
        selectedCountry,
        onSelectedCountryChange,
    };
}
