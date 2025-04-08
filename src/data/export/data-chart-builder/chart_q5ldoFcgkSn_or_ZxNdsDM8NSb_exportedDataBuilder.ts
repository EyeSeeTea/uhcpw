import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const SORTED_PARAMETERS = [
    "Medicines",
    "Dental care",
    "Medical products",
    "Inpatient care",
    "Outpatient care",
    "Diagnostic tests",
];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADER_DATA_QUINTILE_NAME = "Quintile";
const HEADERS_BASE = ["Country", "Parameter / Year - Quintile"];
const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string
) => TabsWithStringOrNumbers[] = (tabs, chartName) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf("Country");
    const dataParamIndex = headers?.indexOf(HEADER_DATA_PARAM_NAME);
    const quintileIndex = headers?.indexOf(HEADER_DATA_QUINTILE_NAME);
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");
    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        dataParamIndex === undefined ||
        dataParamIndex === -1 ||
        quintileIndex === undefined ||
        quintileIndex === -1 ||
        yearIndex === undefined ||
        yearIndex === -1 ||
        valueIndex === undefined ||
        valueIndex === -1
    ) {
        throw new Error("Missing required columns in the data tab");
    }

    const country = dataTab.data[2] ? dataTab.data[2][countryIndex] : "";
    if (!country) {
        throw new Error("Missing country in the data tab");
    }

    const allYears = dataTab.data
        .slice(2)
        .map(row => row[yearIndex])
        .filter((year): year is string => year !== undefined);

    const allYearsUnique = [...new Set(allYears)].map(year => Number(year)).sort((yearA, yearB) => yearA - yearB);

    const restHeaders = allYearsUnique.reduce(
        (acc: string[], year: number) => [...acc, ...SORTED_QUINTILES.map(quintile => `${year}-${quintile}`)],
        []
    );

    const finalHeaders = [[...HEADERS_BASE, ...restHeaders]];

    const dataByDataParam: TabsWithStringOrNumbers["data"] = SORTED_PARAMETERS.reduce(
        (acc: TabsWithStringOrNumbers["data"], param): TabsWithStringOrNumbers["data"] => {
            const paramData = restHeaders.flatMap(yearAndQuintile => {
                const [year, quintile] = yearAndQuintile.split("-");
                const row = dataTab.data.find(
                    row =>
                        row[dataParamIndex] === param &&
                        row[yearIndex] === year?.toString() &&
                        row[quintileIndex] === quintile
                );
                const value = row ? row[valueIndex] : undefined;
                if (!row || !value) {
                    return 0;
                }
                return Number(value?.replace(",", "."));
            });
            return [...acc, [param, ...paramData]];
        },
        []
    ).map(row => [country, ...row]);

    const data = [[chartName], ...finalHeaders, ...dataByDataParam];

    const chartTab = {
        name: DATA_TAB_NAME,
        data: data,
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
};
