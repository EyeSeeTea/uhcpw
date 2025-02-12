import { DATA_TAB_NAME, CHART_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const PARAMETER_NAMES: { x: string; y: string } = {
    x: "Out-of-pocket payments as a share of current spending on health",
    y: "Households with catastrophic health spending",
};

export const chart_kIpnMBaBvZ9_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);

    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];

    const parameterIndex = headers?.indexOf("Parameter");
    const countryIndex = headers?.indexOf("Country");
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");

    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        parameterIndex === undefined ||
        parameterIndex === -1 ||
        yearIndex === undefined ||
        yearIndex === -1 ||
        valueIndex === undefined ||
        valueIndex === -1
    ) {
        throw new Error("Missing required columns in the data tab");
    }

    const allCountries = dataTab.data
        .slice(2)
        .map(row => row[countryIndex])
        .filter((country): country is string => country !== undefined);
    const allCountriesUnique = [...new Set(allCountries)];

    const headersBase = [["Country / Parameter", "Year", PARAMETER_NAMES.x, PARAMETER_NAMES.y]];

    const data = allCountriesUnique.reduce((acc: (string | number)[][], country): (string | number)[][] => {
        const year = dataTab.data.find(row => row[parameterIndex] === PARAMETER_NAMES.x)?.[yearIndex];
        if (!year) {
            return acc;
        }

        const quintileData = Object.values(PARAMETER_NAMES).map(axisName => {
            const row = dataTab.data.find(row => row[parameterIndex] === axisName && row[countryIndex] === country);
            const value = row ? row[valueIndex] : undefined;

            if (!row || !value) {
                return 0;
            }

            return Number(value?.replace(",", "."));
        });

        return [...acc, [country, year, ...quintileData]];
    }, []);

    const chartTab = {
        name: CHART_TAB_NAME,
        data: [[chartName], ...headersBase, ...data],
    };

    return [...tabs, chartTab];
};
