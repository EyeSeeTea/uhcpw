import { Country } from "../../../domain/entities/Country";

export type VisualizationCustomization = Record<string, ChartCustomization>;

export type ChartCustomization = {
    legend: LegendCustomization;
    series?: SerieCustomization[];
    allSeries?: AllSeriesCustomization;
    countrySerie?: (countries: Country[], serie: SerieCustomization) => SerieCustomization;
    title?: TitleCustomization;
    xAxis?: XAxisCustomization;
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
    dataLabels?: {
        enabled: boolean;
    };
};

export type AllSeriesCustomization = {
    color: string;
    marker?: { enabled: boolean; symbol: "circle" };
};

export type XAxisCustomization = {
    title?: string;
    labels: { rotation: number };
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
        legend: { ...baseLegend, reversed: true },
        countrySerie: (countries, serie) => {
            const country = countries.find(country => country.id === serie.id);

            const color = country ? countryPalette[countries.indexOf(country)] : undefined;

            return {
                id: serie.id,
                name: country?.code || serie.name,
                color,
                marker: { enabled: true, symbol: "circle" },
                dataLabels: {
                    enabled: false,
                },
            };
        },
        xAxis: {
            labels: {
                rotation: -90,
            },
        },
    },
    ZZAcIv6O9LY: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true },
        countrySerie: (countries, serie) => {
            const country = countries.find(country => country.id === serie.id);

            const color = country ? countryPalette[countries.indexOf(country)] : undefined;

            return {
                id: serie.id,
                name: country?.code || serie.name,
                color,
                marker: { enabled: true, symbol: "circle" },
                dataLabels: {
                    enabled: false,
                },
            };
        },
        xAxis: {
            labels: {
                rotation: -90,
            },
        },
    },
    rT39aStYqI3: {
        title: { text: "" },
        legend: { ...baseLegend, reversed: true, itemMarginTop: 20 },
        xAxis: {
            title: "",
            labels: {
                rotation: -90,
            },
        },
    },
};

const countryPalette = [
    "#FF6262",
    "#164FA8",
    "#0E78D9",
    "#6ABEED",
    "#FF8739",
    "#00BA5A",
    "#5D5DFF",
    "#A10000",
    "#C69CEE",
    "#E99AD0",
    "#B6A2D9",
    "#FFD800",
    "#0000A0",
    "#4E81B3",
    "#BAA400",
    "#2D1E75",
    "#9E7BA0",
    "#45BE00",
    "#735BAC",
    "#5DDFC0",
    "#404040",
    "#9DD167",
    "#E88520",
    "#5626AE",
    "#6EC06F",
    "#A1A2A3",
    "#1BAD72",
    "#CD2A4C",
    "#10ED30",
    "#6700FF",
    "#7E2765",
    "#31D5CE",
    "#EBB44A",
    "#7F53EA",
    "#DCE665",
    "#47A7FF",
    "#9C2FE0",
    "#4FFC16",
    "#4A79C3",
    "#B2BF00",
    "#E46B6C",
    "#B5F1EF",
    "#FFB450",
    "#5B849D",
    "#FFD073",
    "#CF3DFF",
    "#F1F9ED",
    "#E30033",
    "#82AFCD",
    "#EED3D3",
    "#F8CEDC",
    "#7ED1B9",
    "#FFCCE0",
    "#C3B45B",
    "#F0DEAC",
    "#5BFBF7",
    "#C3D1EA",
    "#FC9262",
    "#C4AACE",
    "#BACACF",
    "#B2DE5F",
    "#AAE9F3",
];
