import { mapFromWhoCountryNameToId, mapToWhoCountryCode } from "../../repositories/countries/mapToWhoCountryData";
import { DATA_TAB_NAME, D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    COUNTRY_AREA_COLUMN,
    PARAMETER_COLUMN,
    VALUE_COLUMN,
    YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const PARAMETER_NAMES: {
    x: string;
    y: string;
} = {
    x: "Public spending on health as a share of GDP",
    y: "Out-of-pocket payments as a share of current spending on health",
};

export const chart_mUjcWO90CRr_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);

    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];

    const parameterIndex = headers?.indexOf(PARAMETER_COLUMN);
    const countryIndex = headers?.indexOf(COUNTRY_AREA_COLUMN);
    const yearIndex = headers?.indexOf(YEAR_COLUMN);
    const valueIndex = headers?.indexOf(VALUE_COLUMN);

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

    const headersBase = [[COUNTRY_AREA_COLUMN, "Label", YEAR_COLUMN, PARAMETER_NAMES.x, PARAMETER_NAMES.y]];

    const data = allCountriesUnique.reduce(
        (acc: TabsWithStringOrNumbers["data"], countryName): TabsWithStringOrNumbers["data"] => {
            const year = dataTab.data.find(
                row => row[parameterIndex] === PARAMETER_NAMES.x && row[countryIndex] === countryName
            )?.[yearIndex];

            if (!year) {
                return acc;
            }

            const rowXAxis = dataTab.data.find(
                row => row[parameterIndex] === PARAMETER_NAMES.x && row[countryIndex] === countryName
            );
            const rowYAxis = dataTab.data.find(
                row => row[parameterIndex] !== PARAMETER_NAMES.x && row[countryIndex] === countryName
            );
            const valueXAxis = rowXAxis ? rowXAxis[valueIndex] : "";
            const valueYAxis = rowYAxis ? rowYAxis[valueIndex] : "";

            const maybeCountryCode =
                orgUnits.find(
                    orgUnit =>
                        orgUnit.shortName === countryName || orgUnit.id === mapFromWhoCountryNameToId(countryName)
                )?.code || countryName;

            const maybeWhoCountryCode = mapToWhoCountryCode(maybeCountryCode);

            return [...acc, [countryName, maybeWhoCountryCode, year, Number(valueXAxis), Number(valueYAxis)]];
        },
        []
    );

    const chartTab = {
        name: DATA_TAB_NAME,
        data: [[chartName], ...headersBase, ...data],
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
};
