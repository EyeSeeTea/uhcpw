import { Country } from "../../../../../domain/entities/Country";

export const countriesToGeoJson = (countries: Country[]): GeoJSON.FeatureCollection<GeoJSON.Point, Country> => {
    return {
        type: "FeatureCollection",
        features: countries.reduce((acc: Array<GeoJSON.Feature<GeoJSON.Point, Country>>, country) => {
            return country.coordinates
                ? [
                      ...acc,
                      {
                          type: "Feature",
                          properties: {
                              ...country,
                          },
                          geometry: {
                              type: "Point",
                              coordinates: country.coordinates,
                          },
                      },
                  ]
                : acc;
        }, []),
    };
};
