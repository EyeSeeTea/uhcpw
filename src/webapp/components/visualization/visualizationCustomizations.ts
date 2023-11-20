import { Country } from "../../../domain/entities/Country";

export type VisualizationCustomization = Record<string, ChartCustomization>;

export type ChartCustomization = {
    legend: LegendCustomization;
    series?: SerieCustomization[];
    allSeries?: AllSeriesCustomization;
    countrySerie?: (countries: Country[], serie: SerieCustomization) => SerieCustomization;
    title?: TitleCustomization;
};

export type LegendCustomization = {
    enabled: boolean;
    align?: "center" | "left" | "right";
    verticalAlign?: "bottom" | "middle" | "top";
    layout?: "horizontal" | "proximate" | "vertical";
    reversed?: boolean;
    itemMarginTop?: number;
};

export type TitleCustomization = {
    text?: string;
};

export type SerieCustomization = {
    id: string;
    color?: string;
    name?: string;
    marker?: { enabled: boolean };
};

export type AllSeriesCustomization = {
    color: string;
    marker?: { enabled: boolean; symbol: "circle" };
};

const baseLegend = {
    enabled: true,
    align: "right",
    verticalAlign: "middle",
    layout: "vertical",
} as LegendCustomization;

export const visualizationCustomizations: Record<string, ChartCustomization> = {
    Y31jQX5PVdI: {
        title: { text: "" },
        legend: { enabled: false },
        allSeries: { color: "#354498" },
    },
    ZxNdsDM8NSb: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true, itemMarginTop: 20 },
        series: [
            { id: "qgE5NJ9Nyaq", name: "Medicines", color: "#c00000" },
            { id: "OuiKmOeXUWQ", name: "Medical products", color: "#ed7d31" },
            { id: "a2u2ccahVJL", name: "Dental care", color: "#0071c0" },
            { id: "OEK4dKvUsOe", name: "Inpatient care", color: "#00b050" },
            { id: "qy4W8ZY2g5M", name: "Diagnostic tests", color: "#702fa0" },
            { id: "ykAPKvVQusS", name: "Outpatient care", color: "#ffc001" },
        ],
    },
    zkEtsohZTTf: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true, itemMarginTop: 20 },
        countrySerie: (countries, serie) => {
            const country = countries.find(country => country.id === serie.id);

            //TODO: Pending colors by country serie

            return { id: serie.id, name: country?.code || serie.name, marker: { enabled: true, symbol: "circle" } };
        },
    },
};
