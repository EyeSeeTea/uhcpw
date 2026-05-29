import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { TabsWithStringOrNumbers } from "../exportToCSV";

export function splitColumnRowsBy99(rows: Array<string[]>) {
    return rows.reduce<{
        columnRowsGreaterOrEqual99: Array<string[]>;
        columnRowsLowerThan99: Array<string[]>;
    }>(
        (acc, row) => {
            const numericValue = Number(row[3]);

            return numericValue >= 99
                ? {
                      ...acc,
                      columnRowsGreaterOrEqual99: [...acc.columnRowsGreaterOrEqual99, row],
                  }
                : {
                      ...acc,
                      columnRowsLowerThan99: [...acc.columnRowsLowerThan99, row],
                  };
        },
        {
            columnRowsGreaterOrEqual99: [],
            columnRowsLowerThan99: [],
        }
    );
}

export function splitScatterRows(params: {
    scatterRows: Array<string[]>;
    columnRowsLowerThan99: Array<string[]>;
    columnRowsGreaterOrEqual99: Array<string[]>;
}): {
    scatterLowerThan99: Array<string[]>;
    scatterGreaterOrEqual99: Array<string[]>;
} {
    const makeCountryYearKey = (row: string[]) => `${row[1]}-${row[2]}`;

    const lowerKeys = new Set(params.columnRowsLowerThan99.map(makeCountryYearKey));
    const greaterOrEqualKeys = new Set(params.columnRowsGreaterOrEqual99.map(makeCountryYearKey));

    return params.scatterRows.reduce<{
        scatterLowerThan99: Array<string[]>;
        scatterGreaterOrEqual99: Array<string[]>;
    }>(
        (acc, row) => {
            const key = makeCountryYearKey(row);

            return greaterOrEqualKeys.has(key)
                ? { ...acc, scatterGreaterOrEqual99: [...acc.scatterGreaterOrEqual99, row] }
                : lowerKeys.has(key)
                ? { ...acc, scatterLowerThan99: [...acc.scatterLowerThan99, row] }
                : acc;
        },
        {
            scatterLowerThan99: [],
            scatterGreaterOrEqual99: [],
        }
    );
}

export function buildXAxisCategories(params: {
    scatterLowerThan99: Array<string[]>;
    columnRowsLowerThan99: Array<string[]>;
    scatterGreaterOrEqual99: Array<string[]>;
    columnRowsGreaterOrEqual99: Array<string[]>;
}): Array<string | null> {
    const keyOf = (row: string[]) => `${row[1]}-${row[2]}`;

    const buildPart = (scatterRows: Array<string[]>, columnRows: Array<string[]>): string[] => {
        const scatterKeysSorted = [...scatterRows].sort((a, b) => Number(a[3]) - Number(b[3])).map(keyOf);

        const scatterKeySet = new Set(scatterKeysSorted);

        const remainingColumnKeysSorted = columnRows
            .map(keyOf)
            .filter(key => !scatterKeySet.has(key))
            .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

        return [...remainingColumnKeysSorted, ...scatterKeysSorted];
    };
    const lowerPart = buildPart(params.scatterLowerThan99, params.columnRowsLowerThan99);
    const greaterPart = buildPart(params.scatterGreaterOrEqual99, params.columnRowsGreaterOrEqual99);

    return lowerPart.length > 0 && greaterPart.length > 0
        ? [...greaterPart, null, ...lowerPart]
        : [...greaterPart, ...lowerPart];
}

export function getSeparatingColumn(tabs: TabsWithStringOrNumbers[]): number | undefined {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error(`Data tab not found`);
    }

    const countryAndYearRow = dataTab.data[2];
    const separatorIndex = countryAndYearRow?.findIndex(category => category === null) ?? 0;
    const nextCountry = countryAndYearRow ? countryAndYearRow[separatorIndex + 1] : undefined;

    return !!separatorIndex && !!nextCountry ? separatorIndex : undefined;
}
