import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { sortSerieDataByValueInSerie } from "./utils/sortSerieDataByValueInSerie";

export const chart_z6nPPMMbOw5_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    series: [
        {
            id: "S0rJgTIK3Gv",
            name: "Out-of-pocket payments (HF .3)",
            color: "#c00000",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "u8ZcWehUz9H",
            name: "Voluntary health insurance (HF .2)",
            color: "#ffc112",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "OE8u72wcKty",
            name: "Public spending on health (HF .1)",
            color: "#00b050",
            dataLabels: {
                enabled: false,
            },
        },
    ],
    xAxis: {
        title: { text: "" },
    },
    sortSerieData: (series, categories) => {
        if (!series) return series;

        const seriesWithCategoryInData = series.map(serie => {
            return {
                ...serie,
                data: (serie.data || []).map((item, index) => {
                    return {
                        y: item,
                        name: categories[index],
                    };
                }),
            } as unknown as SeriesColumnOptions;
        });

        return sortSerieDataByValueInSerie(seriesWithCategoryInData, "S0rJgTIK3Gv");
    },
};
