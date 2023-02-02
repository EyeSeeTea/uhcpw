import { Country } from "../../domain/entities/Country";
import { Future, FutureData } from "../../domain/entities/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { D2Api } from "../../types/d2-api";

export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Country[]> {
        return Future.success([
            {
                name: "Albania",
                description: "Albania",
                color: "red",
                coordinates: [20.17, 41.15],
            },
            {
                name: "Austria",
                description: "Austria",
                color: "orange",
                coordinates: [14.55, 47.52],
            },
            {
                name: "Belarus",
                description: "Belarus",
                color: "orange",
                coordinates: [27.95, 53.71],
            },
            {
                name: "Belgium",
                description: "Belgium",
                color: "orange",
                coordinates: [4.47, 50.5],
            },
            {
                name: "Bulgaria",
                description: "Bulgaria",
                color: "orange",
                coordinates: [25.49, 42.73],
            },
            {
                name: "Croatia",
                description: "Bulgaria",
                color: "orange",
                coordinates: [15.2, 45.1],
            },
            {
                name: "Cyprus",
                description: "Cyprus",
                color: "orange",
                coordinates: [33.43, 35.13],
            },
            {
                name: "Czech Republic",
                description: "Czech Republic",
                color: "orange",
                coordinates: [15.47, 49.82],
            },
            {
                name: "Denmark",
                description: "Denmark",
                color: "orange",
                coordinates: [9.5, 56.26],
            },
            {
                name: "Finland",
                description: "Finland",
                color: "orange",
                coordinates: [25.75, 61.92],
            },
            {
                name: "France",
                description: "France",
                color: "orange",
                coordinates: [2.21, 46.23],
            },
            {
                name: "Georgia",
                description: "Georgia",
                color: "orange",
                coordinates: [43.36, 42.32],
            },
            {
                name: "Germany",
                description: "Germany",
                color: "orange",
                coordinates: [10.45, 51.17],
            },
            {
                name: "Greece",
                description: "Greece",
                color: "orange",
                coordinates: [21.82, 39.07],
            },
            {
                name: "Hungary",
                description: "Hungary",
                color: "orange",
                coordinates: [19.5, 47.16],
            },
            {
                name: "Iceland",
                description: "Iceland",
                color: "orange",
                coordinates: [-19.02, 64.96],
            },
            {
                name: "Italy",
                description: "Italy",
                color: "orange",
                coordinates: [12.57, 41.87],
            },

            {
                name: "Kosovo",
                description: "Kosovo",
                color: "orange",
                coordinates: [20.9, 42.6],
            },
            {
                name: "Lithuania",
                description: "Lithuania",
                color: "orange",
                coordinates: [23.88, 55.17],
            },
            {
                name: "Luxembourg",
                description: "Luxembourg",
                color: "orange",
                coordinates: [6.13, 49.82],
            },
            {
                name: "Macedonia",
                description: "Macedonia",
                color: "orange",
                coordinates: [21.75, 41.61],
            },
            {
                name: "Malta",
                description: "Malta",
                color: "orange",
                coordinates: [14.38, 35.94],
            },
            {
                name: "Netherlands",
                description: "Netherlands",
                color: "orange",
                coordinates: [5.29, 52.13],
            },
            {
                name: "Norway",
                description: "Norway",
                color: "orange",
                coordinates: [8.47, 60.47],
            },
            {
                name: "Poland",
                description: "Poland",
                color: "orange",
                coordinates: [19.15, 51.92],
            },

            {
                name: "Portugal",
                description: "Portugal",
                color: "green",
                coordinates: [-8.22, 39.4],
            },
            {
                name: "Spain",
                description: "Spain",
                color: "red",
                coordinates: [-3.75, 40.46],
            },
            {
                name: "Serbia",
                description: "Serbia",
                color: "red",
                coordinates: [21.01, 44.02],
            },
            {
                name: "Slovakia",
                description: "Slovakia",
                color: "red",
                coordinates: [19.7, 48.67],
            },
            {
                name: "Slovenia",
                description: "Slovenia",
                color: "red",
                coordinates: [15, 46.15],
            },
            {
                name: "Sweden",
                description: "Sweden",
                color: "red",
                coordinates: [18.64, 60.13],
            },
            {
                name: "Switzerland",
                description: "Switzerland",
                color: "red",
                coordinates: [8.23, 46.82],
            },
            {
                name: "Turkey",
                description: "Turkey",
                color: "red",
                coordinates: [35.24, 38.96],
            },
            {
                name: "Ukraine",
                description: "Ukraine",
                color: "red",
                coordinates: [31.17, 48.38],
            },
            {
                name: "United Kingdom",
                description: "United Kingdom",
                color: "red",
                coordinates: [-3.44, 55.38],
            },
        ]);
    }
}
