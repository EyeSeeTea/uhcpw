import _ from "lodash";

export function filterRowsByLastAvailableYear(rows: Array<string[]>): Array<string[]> {
    const lastAvailableYearByCountry = getLastAvailableYearByCountry(rows);

    return rows.filter(row => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";
        return lastAvailableYearByCountry[countryId] === year;
    });
}

export const getLastAvailableYearByCountry = (rows: Array<string[]>): Record<string, string> => {
    return rows.reduce((acc: Record<string, string>, row) => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        return !acc[countryId] || (acc[countryId] !== undefined && Number(acc[countryId]) < Number(year))
            ? { ...acc, [countryId]: year }
            : acc;
    }, {});
};

export const filterRowsByYearInCountry = (
    rows: Array<string[]>,
    yearsByCountryId: Record<string, string>
): Array<string[]> => {
    return rows.filter(row => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";
        return yearsByCountryId[countryId] === year;
    });
};

export function getLatestAvailableYearByCountryIdFromTwoCharts(
    firstChartRows: Array<string[]>,
    secondChartRows: Array<string[]>
): Record<string, string> {
    const firstChartLatestAvailableYearByCountry = getLastAvailableYearByCountry(firstChartRows);
    const secondChartLatestAvailableYearByCountry = getLastAvailableYearByCountry(secondChartRows);

    const allCountryIdsUnique = [
        ...new Set([
            ...Object.keys(firstChartLatestAvailableYearByCountry),
            ...Object.keys(secondChartLatestAvailableYearByCountry),
        ]),
    ];

    return allCountryIdsUnique.reduce((acc: Record<string, string>, countryId) => {
        const firstChartYear = firstChartLatestAvailableYearByCountry[countryId];
        const secondChartYear = secondChartLatestAvailableYearByCountry[countryId];
        return { ...acc, [countryId]: Math.max(Number(firstChartYear || 0), Number(secondChartYear || 0)).toString() };
    }, {});
}

export function getAllRowsLatestAvailableYearFromTwoCharts(
    firstChartRows: Array<string[]>,
    secondChartRows: Array<string[]>
): Array<string[]> {
    const latestAvailableYearByCountryId = getLatestAvailableYearByCountryIdFromTwoCharts(
        firstChartRows || [],
        secondChartRows || []
    );

    const filteredFirstChartRows = filterRowsByYearInCountry(firstChartRows || [], latestAvailableYearByCountryId);
    const filteredSecondChartRows = filterRowsByYearInCountry(secondChartRows || [], latestAvailableYearByCountryId);

    return [...filteredFirstChartRows, ...filteredSecondChartRows];
}

export function orderLatestAvailableYearByAverageAndPoorest(
    latestAvailableYearByCountryId: Record<string, string>,
    allRowsFilteredByLAY: string[][],
    seriesIds: Record<string, string>
) {
    return _(allRowsFilteredByLAY)
        .filter(
            ([serieId, countryId]) =>
                !!serieId &&
                [seriesIds.average, seriesIds.poorest].includes(serieId) &&
                !!countryId &&
                !!latestAvailableYearByCountryId[countryId]
        )
        .map(([serieId, countryId, year, value]) => ({
            serieId,
            countryId,
            year,
            [serieId === seriesIds.average ? "average" : "poorest"]: parseFloat(value || "0"),
        }))
        .groupBy(row => `${row.countryId}-${row.year}`)
        .map(group => _.merge({}, ...group))
        .orderBy(["average", "poorest"], ["asc", "asc"])
        .reduce((acc, { countryId, year }) => {
            if (countryId && year) acc[countryId] = year;
            return acc;
        }, {} as Record<string, string>);
}
