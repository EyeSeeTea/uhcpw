import { useMemo } from "react";
import { ComparativeAnalysis } from "../../../../domain/entities/resources/Resource";
import { useResourcesByType } from "../by-type/useResourcesByType";
import { CountryAnalysisItem, ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const { filters, items, onGetResources } = useResourcesByType();

    const comparativeAnalysis = useMemo(() => {
        return items.filter(item => item.kind === "comparative-analysis").slice(0, 4) as ComparativeAnalysis[];
    }, [items]);

    console.log({ comparativeAnalysis });

    // useEffect(() => {
    //     setCountryAnalysis(
    //         countryAnalysisOriginals.filter(
    //             item =>
    //                 (!filters.category.selected || item.category === filters.category.selected) &&
    //                 (!filters.theme.selected || item.theme === filters.theme.selected) &&
    //                 (!filters.country.selected ||
    //                     filters.country.selected?.length === 0 ||
    //                     filters.country.selected.includes(item.code)) &&
    //                 (!filters.year.selected ||
    //                     filters.year.selected?.length === 0 ||
    //                     filters.year.selected.includes(item.year))
    //         )
    //     );
    // }, [filters.category.selected, filters.theme.selected, filters.country.selected, filters.year.selected]);

    return {
        countryAnalysis,
        filters,
        comparativeAnalysis,
        news,
        multimedia,
        onGetResources,
    };
}

const countryAnalysis: CountryAnalysisItem[] = [
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
