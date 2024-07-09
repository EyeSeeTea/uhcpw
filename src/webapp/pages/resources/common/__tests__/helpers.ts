import {
    ComparativeAnalysis,
    CountryAnalysis,
    Multimedia,
    News,
} from "../../../../../domain/entities/resources/Resource";
import { ResourceCategory } from "../../../../../domain/entities/resources/ResourceCategory";
import { givenAThemes } from "../../../../../utils/tests-ui";

export function createComparativeAnalysisResources(count: number): ComparativeAnalysis[] {
    const themes = givenAThemes();

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "comparative-analysis" as const,
            id: `id-comparative-analysis-${index}`,
            imageOriginal: `http://image${index}.png`,
            imageCustom: `http://image${index}.png`,
            theme: (index % 2 === 0 ? themes[0]?.name : themes[1]?.name) || "",
            links: [
                { url: `http://link${Math.random()}.pdf`, language: "English" },
                { url: `http://link${Math.random()}.pdf`, language: "Spain" },
            ],
            title: `title ${index}`,
            date: new Date(new Date().getFullYear() - index),
            favourite: true,
            favouriteOrder: index,
            favouriteSection: true,
            favouriteSectionOrder: index,
            relatedCountries: ["DVnpk4xiXGJ"],
        };
    });

    return data;
}

export function createCountryAnalysisResources(count: number): CountryAnalysis[] {
    const themes = givenAThemes();

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "country-analysis" as const,
            id: `id-country-analysis-${index}`,
            imageOriginal: `http://image${index}.png`,
            imageCustom: `http://image${index}.png`,
            theme: (index % 2 === 0 ? themes[0]?.name : themes[1]?.name) || "",
            links: [
                { url: `http://link${Math.random()}.pdf`, language: "English" },
                { url: `http://link${Math.random()}.pdf`, language: "Castellano" },
            ],
            title: `title ${index}`,
            date: new Date(new Date().getFullYear() - index),
            countryId: "DVnpk4xiXGJ",
            favourite: true,
            favouriteOrder: index,
            favouriteSection: true,
            favouriteSectionOrder: index,
        };
    });

    return data;
}

export function createNewsResources(count: number): News[] {
    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "news" as const,
            id: `id-news-${index}`,
            imageOriginal: `http://image${index}.png`,
            imageCustom: `http://image${index}.png`,
            title: `title ${index}`,
            date: new Date(`${index + 1} January 2023`),
            url: `http://news-${index}.html`,
            favourite: true,
            favouriteOrder: index,
            favouriteSection: true,
            favouriteSectionOrder: index,
        };
    });

    return data;
}

export function createMultimediaResources(count: number): Multimedia[] {
    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "multimedia" as const,
            id: `id-multimedia-${index}`,
            imageOriginal: `http://image${index}.png`,
            imageCustom: `http://image${index}.png`,
            title: `title ${index}`,
            date: new Date(`${index + 1} January 2023`),
            url: `http://news-${index}.html`,
            theme: `test theme`,
            favourite: true,
            favouriteOrder: index,
            favouriteSection: true,
            favouriteSectionOrder: index,
        };
    });

    return data;
}

export function createResourceCategories(): ResourceCategory[] {
    const data = [
        { id: "bcMc7kD0M98", name: "Comparative Analysis", code: "comparative-analysis" },
        { id: "lQ4chDNdjkA", name: "news", code: "news" },
        { id: "MXKMGulj2KF", name: "multimedia", code: "multimedia" },
        { id: "bkO3SJzKQeD", name: "Country or area analysis", code: "country-analysis" },
    ];

    return data;
}
