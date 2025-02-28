import { DATA_TAB_NAME, CHART_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { cellNameByVisualizationId } from "../../repositories/indicator-explorer/utils/getCustomCellName";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const PARAMETER_NAMES: {
    x: string;
    y_low: string;
    y_medium: string;
    y_medium_hight: string;
    y_hight: string;
    y_extra_hight: string;
} = {
    x: cellNameByVisualizationId?.kIpnMBaBvZ9?.x || "Out-of-pocket payments as a share of current spending on health",
    y_low: "LOW - Households with catastrophic health spending",
    y_medium: "MEDIUM - Households with catastrophic health spending",
    y_medium_hight: "MEDIUM-HIGHT - Households with catastrophic health spending",
    y_hight: "HIGHT - Households with catastrophic health spending",
    y_extra_hight: "EXTRA-HIGHT - Households with catastrophic health spending",
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

    const headersBase = [
        [
            "Country / Parameter",
            "Year",
            "Label",
            PARAMETER_NAMES.x,
            PARAMETER_NAMES.y_low,
            PARAMETER_NAMES.y_medium,
            PARAMETER_NAMES.y_medium_hight,
            PARAMETER_NAMES.y_hight,
            PARAMETER_NAMES.y_extra_hight,
        ],
    ];

    const data = allCountriesUnique.reduce((acc: (string | number)[][], country): (string | number)[][] => {
        const year = dataTab.data.find(row => row[parameterIndex] === PARAMETER_NAMES.x)?.[yearIndex];
        if (!year) {
            return acc;
        }

        const rowXAxis = dataTab.data.find(
            row => row[parameterIndex] === PARAMETER_NAMES.x && row[countryIndex] === country
        );
        const rowYAxis = dataTab.data.find(
            row => row[parameterIndex] !== PARAMETER_NAMES.x && row[countryIndex] === country
        );
        const valueXAxis = rowXAxis ? rowXAxis[valueIndex] : "";
        const valueYAxis = rowYAxis ? rowYAxis[valueIndex] : "";

        const parametersData = getParametersData(
            Number(valueXAxis?.replace(",", ".")),
            Number(valueYAxis?.replace(",", "."))
        );

        return [...acc, [country, year, `${country} ${year}`, ...parametersData]];
    }, []);

    const chartTab = {
        name: CHART_TAB_NAME,
        data: [[chartName], ...headersBase, ...data],
    };

    return [...tabs, chartTab];
};

function getParametersData(valueXAxis: number, valueYAxis: number): (number | string)[] {
    const defaultData = [valueXAxis, "", "", "", "", ""];

    if (valueXAxis < 0) return defaultData;

    const ranges = [
        { min: 0, max: 2, index: 1 },
        { min: 2, max: 5, index: 2 },
        { min: 5, max: 10, index: 3 },
        { min: 10, max: 15, index: 4 },
        { min: 15, max: Infinity, index: 5 },
    ];

    return [
        valueXAxis,
        ...ranges.map(r => {
            if (valueYAxis >= r.min && valueYAxis < r.max) {
                return valueYAxis;
            } else {
                return "";
            }
        }),
    ];
}
