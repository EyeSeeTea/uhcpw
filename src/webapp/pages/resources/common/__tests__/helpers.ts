import {
    ComparativeAnalysis,
    CountryAnalysis,
    Multimedia,
    News,
} from "../../../../../domain/entities/resources/Resource";
import { ResourceCategory } from "../../../../../domain/entities/resources/ResourceCategory";
import { ResourceTheme } from "../../../../../domain/entities/resources/ResourceTheme";
import { givenAThemes } from "../../../../../utils/tests-ui";

/** Even resources have only a main theme, odd resources have a main and a secondary theme */
function getThemeCodes(themes: ReadonlyArray<ResourceTheme>, index: number): string[] {
    const themeCodes = index % 2 === 0 ? [themes[0]?.code] : [themes[1]?.code, themes[2]?.code];
    return themeCodes.flatMap(themeCode => (themeCode ? [themeCode] : []));
}

export function createComparativeAnalysisResources(count: number): ComparativeAnalysis[] {
    const themes = givenAThemes();

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "comparative-analysis" as const,
            id: `id-comparative-analysis-${index}`,
            imageOriginal: `http://image${index}.png`,
            imageCustom: `http://image${index}.png`,
            themeCodes: getThemeCodes(themes, index),
            links: [
                { url: `http://link${Math.random()}.pdf`, language: "English" },
                { url: `http://link${Math.random()}.pdf`, language: "Spain" },
            ],
            title: `title ${index}`,
            date: new Date(new Date().getFullYear() - index),
            favouriteHome: true,
            favouriteHomeOrder: index,
            favouriteSection: true,
            favouriteSectionOrder: index,
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
            themeCodes: getThemeCodes(themes, index),
            links: [
                { url: `http://link${Math.random()}.pdf`, language: "English" },
                { url: `http://link${Math.random()}.pdf`, language: "Castellano" },
            ],
            title: `title ${index}`,
            date: new Date(new Date().getFullYear() - index),
            countryId: "DVnpk4xiXGJ",
            favouriteHome: true,
            favouriteHomeOrder: index,
            favouriteSection: false,
            favouriteSectionOrder: 0,
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
            favouriteHome: true,
            favouriteHomeOrder: index,
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
            themeCodes: [`test theme`],
            favouriteHome: true,
            favouriteHomeOrder: index,
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
