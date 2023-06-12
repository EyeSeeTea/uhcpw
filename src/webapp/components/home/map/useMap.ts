import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useCallback, useEffect, useState } from "react";
import { Country } from "../../../../domain/entities/Country";
import { useAppContext } from "../../../contexts/app-context";
import { InitialCoordinates, MapState } from "./MapState";

const initialData: InitialCoordinates = {
    center: [13.675063, 51.751569],
    maxZoom: 8,
    minZoom: 2.5,
    zoom: 2.5,
};

export function useMap(): MapState {
    const [markers, setMarkers] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Country>>({
        type: "FeatureCollection",
        features: [],
    });

    const [selectedCountry, setSelectedCountry] = useState<Country>();
    const { countries } = useAppContext();
    const snackbar = useSnackbar();

    useEffect(() => {
        const countriesWithSummary = countries.filter(country => country.summary);

        setMarkers(countriesToGeoJson(countriesWithSummary));
    }, [countries, snackbar]);

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

export const countriesToGeoJson = (countries: Country[]): GeoJSON.FeatureCollection<GeoJSON.Point, Country> => {
    return {
        type: "FeatureCollection",
        features: countries.map(country => ({
            type: "Feature",
            properties: {
                ...country,
            },
            geometry: {
                type: "Point",
                coordinates: country.coordinates,
            },
        })),
    };
};
