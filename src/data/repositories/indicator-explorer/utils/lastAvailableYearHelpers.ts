import _ from "lodash";

export function filterRowsByLastAvailableYear(rows: Array<string[]>, isUpTo2019?: boolean): Array<string[]> {
    const lastAvailableYearByCountry = getLastAvailableYearByCountry(rows, isUpTo2019);

    return filterRowsByYearInCountry(rows, lastAvailableYearByCountry);
}

export function filterXAxisAndYAxisByLastAvailableYear(
    rows: Array<string[]>,
    xAxis: string,
    yAxis: string,
    isUpTo2019?: boolean
): Array<string[]> {
    const lastAvailableYearByCountry = getCommonLastAvailableYearInBothAxis(rows, xAxis, yAxis, isUpTo2019);

    return filterRowsByYearInCountry(rows, lastAvailableYearByCountry);
}

export const getLastAvailableYearByCountry = (rows: Array<string[]>, isUpTo2019?: boolean): Record<string, string> => {
    return rows.reduce((acc: Record<string, string>, row) => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        return ((isUpTo2019 && Number(year) <= 2019) || !isUpTo2019) &&
            (!acc[countryId] || (acc[countryId] !== undefined && Number(acc[countryId]) < Number(year)))
            ? { ...acc, [countryId]: year }
            : acc;
    }, {});
};

export function filterRowsByYearIndicatorAndCountry(
    rows: Array<string[]>,
    xAxis: string,
    yAxis: string,
    yearByIndicatorAndCountry: Record<
        string,
        {
            xYears: string;
            yYears: string;
        }
    >
): Array<string[]> {
    return rows.filter(row => {
        const indicatorId = row[0]?.toString() || "";
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        if (indicatorId === xAxis) {
            return !!year && yearByIndicatorAndCountry[countryId]?.xYears === year;
        } else if (indicatorId === yAxis) {
            return !!year && yearByIndicatorAndCountry[countryId]?.yYears === year;
        }

        return false;
    });
}

export function getCommonLastAvailableYearInBothAxis(
    rows: Array<string[]>,
    xAxis: string,
    yAxis: string,
    isUpTo2019?: boolean
): Record<string, string> {
    const groupedByCountry = getGroupedYearsByCountry(rows, xAxis, yAxis);

    return Object.keys(groupedByCountry).reduce((acc, countryId) => {
        const filteredXYears = [...(groupedByCountry[countryId]?.xYears || [])].filter(year => {
            return isUpTo2019 ? Number(year) <= 2019 : true;
        });
        const filteredYYears = [...(groupedByCountry[countryId]?.yYears || [])].filter(year => {
            return isUpTo2019 ? Number(year) <= 2019 : true;
        });

        const commonYears = filteredXYears
            .filter(year => filteredYYears.includes(year))
            .sort((a, b) => parseInt(b) - parseInt(a));

        return {
            ...acc,
            [countryId]: commonYears.length > 0 && commonYears[0] ? commonYears[0] : "",
        };
    }, {} as Record<string, string>);
}

export function getGroupedYearsByCountry(
    rows: Array<string[]>,
    xAxis: string,
    yAxis: string
): Record<
    string,
    {
        xYears: Set<string>;
        yYears: Set<string>;
    }
> {
    return rows.reduce((acc, row) => {
        const dataId = row[0]?.toString() || "";
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        const countryData = acc[countryId] || { xYears: new Set<string>(), yYears: new Set<string>() };

        if (dataId === xAxis) {
            countryData.xYears.add(year);
        } else if (dataId === yAxis) {
            countryData.yYears.add(year);
        }

        return { ...acc, [countryId]: countryData };
    }, {} as Record<string, { xYears: Set<string>; yYears: Set<string> }>);
}

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
    secondChartRows: Array<string[]>,
    isUpTo2019?: boolean
): Record<string, string> {
    const firstChartLatestAvailableYearByCountry = getLastAvailableYearByCountry(firstChartRows, isUpTo2019);
    const secondChartLatestAvailableYearByCountry = getLastAvailableYearByCountry(secondChartRows, isUpTo2019);

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
    secondChartRows: Array<string[]>,
    isUpTo2019?: boolean
): Array<string[]> {
    const latestAvailableYearByCountryId = getLatestAvailableYearByCountryIdFromTwoCharts(
        firstChartRows || [],
        secondChartRows || [],
        isUpTo2019
    );

    const filteredFirstChartRows = filterRowsByYearInCountry(firstChartRows || [], latestAvailableYearByCountryId);
    const filteredSecondChartRows = filterRowsByYearInCountry(secondChartRows || [], latestAvailableYearByCountryId);

    return [...filteredFirstChartRows, ...filteredSecondChartRows];
}

export function orderLatestAvailableYearByAverageAndOther<
    OtherKey extends string,
    SeriesIds extends Record<"average" | OtherKey, string>
>(props: {
    latestAvailableYearByCountryId?: Record<string, string>;
    allRowsFilteredByLAY: string[][];
    seriesIds: SeriesIds;
    otherKey: OtherKey;
}) {
    const { latestAvailableYearByCountryId, allRowsFilteredByLAY, seriesIds, otherKey } = props;

    const averageId = seriesIds.average;
    const otherId = seriesIds[otherKey];

    return _(allRowsFilteredByLAY)
        .filter(
            ([serieId, countryId]) =>
                !!serieId &&
                [averageId, otherId].includes(serieId) &&
                !!countryId &&
                (!latestAvailableYearByCountryId || !!latestAvailableYearByCountryId[countryId])
        )
        .map(([serieId, countryId, year, value]) => ({
            serieId,
            countryId,
            year,
            [serieId === averageId ? "average" : otherKey]: parseFloat(value || "0"),
        }))
        .groupBy(row => `${row.countryId}-${row.year}`)
        .map(group => _.merge({}, ...group))
        .orderBy(["average", otherKey], ["asc", "asc"])
        .reduce((acc, { countryId, year }) => {
            if (countryId && year) acc[countryId] = year;
            return acc;
        }, {} as Record<string, string>);
}
