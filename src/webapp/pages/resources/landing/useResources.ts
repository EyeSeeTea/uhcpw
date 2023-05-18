import { useEffect, useState } from "react";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { CountryAnalysisItem, ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const filters = useResourcesFilters();

    const [countryAnalysis, setCountryAnalysis] = useState<CountryAnalysisItem[]>(countryAnalysisOriginals);

    useEffect(() => {
        setCountryAnalysis(
            countryAnalysisOriginals.filter(
                item =>
                    (!filters.category.selected || item.category === filters.category.selected) &&
                    (!filters.theme.selected || item.theme === filters.theme.selected) &&
                    (!filters.country.selected ||
                        filters.country.selected?.length === 0 ||
                        filters.country.selected.includes(item.code)) &&
                    (!filters.year.selected ||
                        filters.year.selected?.length === 0 ||
                        filters.year.selected.includes(item.year))
            )
        );
    }, [filters.category.selected, filters.theme.selected, filters.country.selected, filters.year.selected]);

    return {
        countryAnalysis,
        filters,
        comparativeAnalysis,
        news,
        multimedia,
    };
}

const countryAnalysisOriginals: CountryAnalysisItem[] = [
    {
        name: "Albania",
        image: "https://flagpedia.net/data/flags/h160/al.webp",
        code: "ALB",
        category: "1",
        theme: "1",
        year: "2023",
    },
    {
        name: "Austria",
        image: "https://flagpedia.net/data/flags/w1160/at.png",
        code: "AUT",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Bulgaria",
        image: "https://flagpedia.net/data/flags/h160/bg.webp",
        code: "BGR",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Croacia",
        image: "https://flagpedia.net/data/flags/h160/hr.webp",
        code: "HRV",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Cyprus",
        image: "https://flagpedia.net/data/flags/h160/cy.webp",
        code: "CYP",
        category: "2",
        theme: "1",
        year: "2022",
    },
    {
        name: "Estonia",
        image: "https://flagpedia.net/data/flags/h160/ee.webp",
        code: "EST",
        category: "2",
        theme: "1",
        year: "2022",
    },
    {
        name: "Finland",
        image: "https://flagpedia.net/data/flags/h160/fi.webp",
        code: "",
        category: "2",
        theme: "2",
        year: "2022",
    },
    {
        name: "Georgia",
        image: "https://flagpedia.net/data/flags/h160/ge.webp",
        code: "FIN",
        category: "2",
        theme: "2",
        year: "2020",
    },
    {
        name: "Germany",
        image: "https://flagpedia.net/data/flags/h160/de.webp",
        code: "DEU",
        category: "2",
        theme: "2",
        year: "2021",
    },
    {
        name: "Ireland",
        image: "https://flagpedia.net/data/flags/h160/ie.webp",
        code: "IRL",
        category: "2",
        theme: "1",
        year: "2020",
    },
];

const comparativeAnalysis = [
    {
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        language: "English",
        year: "2022",
    },
    {
        text: "text example 1 text example 1",
        theme: "Sprending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        language: "English",
        year: "2022",
    },
    {
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        language: "English",
        year: "2022",
    },
];

const news = [
    {
        title: "text example 1 text example 1",
        img: "https://picsum.photos/seed/example-news-1/400/300",
        date: "2022",
    },
    {
        title: "text example 2 text example 2",
        img: "https://picsum.photos/seed/example-news-2/400/300",
        date: "2022",
    },
    {
        title: "text example 3 text example 3",
        img: "https://picsum.photos/seed/example-news-3/400/300",
        date: "2022",
    },
];

const multimedia = [
    {
        title: "text example 1 text example 1",
        img: "https://picsum.photos/seed/example-multimedia-1/400/300",
        date: "2022",
    },
    {
        title: "text example 2 text example 2",
        img: "https://picsum.photos/seed/example-multimedia-2/400/300",
        date: "2022",
    },
    {
        title: "text example 3 text example 3",
        img: "https://picsum.photos/seed/example-multimedia-3/400/300",
        date: "2022",
    },
];
