import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useCallback, useEffect, useState } from "react";
import { Country } from "../../../../domain/entities/Country";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { InitialCoordinates, MapState } from "./MapState";

const initialData: InitialCoordinates = {
    center: [13.675063, 51.751569],
    maxZoom: 8,
    minZoom: 3,
    zoom: 3,
};

export function useMap(): MapState {
    const [markers, setMarkers] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Country>>({
        type: "FeatureCollection",
        features: [],
    });

    const [selectedCountry, setSelectedCountry] = useState<Country>();
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    useEffect(() => {
        compositionRoot.countries.get.execute().run(
            countries => {
                setMarkers(countriesToGeoJson(countries));
            },
            () => {
                snackbar.error(i18n.t("An error has ocurred loading countries"));
            }
        );
    }, [compositionRoot.countries, snackbar]);

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
            properties: country,
            geometry: {
                type: "Point",
                coordinates: country.coordinates,
            },
        })),
    };
};
