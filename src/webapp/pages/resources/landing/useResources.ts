import { useMemo } from "react";
import { ComparativeAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { useResourcesByType } from "../by-type/useResourcesByType";
import { CountryAnalysisItem, ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const { filters, items, onGetResources } = useResourcesByType();

    const resources = useMemo(() => {
        return items
            ? {
                  countryAnalysis,
                  comparativeAnalysis: items
                      .filter(item => item.kind === "comparative-analysis")
                      .slice(0, 4) as ComparativeAnalysis[],
                  news: items.filter(item => item.kind === "news").slice(0, 1) as News[],
                  multimedia: items.filter(item => item.kind === "multimedia").slice(0, 1) as Multimedia[],
              }
            : undefined;
    }, [items]);

    return {
        filters,
        resources,
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
