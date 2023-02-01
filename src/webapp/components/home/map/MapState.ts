import { Country } from "../../../../domain/entities/Country";

export type InitialCoordinates = {
    center: [number, number];
    maxZoom: number;
    minZoom: number;
    zoom: number;
};

export type MapState = {
    initialData: InitialCoordinates;
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    selectedCountry?: Country;
    onSelectedCountryChange: (country?: Country) => void;
};
