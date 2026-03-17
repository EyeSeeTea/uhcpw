import _ from "lodash";
import { Id } from "../../../../domain/entities/Ref";

export function filterRowsByLastAvailableYear(
    rows: Array<string[]>,
    isUpTo2019?: boolean,
    maxYearToFilterBy?: string
): Array<string[]> {
    const lastAvailableYearByCountry = getLastAvailableYearByCountry(rows, isUpTo2019, maxYearToFilterBy);

    return filterRowsByYearInCountry(rows, lastAvailableYearByCountry);
}

export function filterRowsByCommonLastAvailableYearInTwoDataIds(params: {
    rows: Array<string[]>;
    dataId1: Id;
    dataId2: Id;
    isUpTo2019?: boolean;
    maxYearToFilterBy?: string;
}): Array<string[]> {
    const { rows, dataId1, dataId2, isUpTo2019, maxYearToFilterBy } = params;
    const lastAvailableYearByCountry = getCommonLastAvailableYearInTwoDataIds({
        rows,
        dataId1: dataId1,
        dataId2: dataId2,
        isUpTo2019,
        maxYearToFilterBy,
    });

    return filterRowsByYearInCountry(rows, lastAvailableYearByCountry);
}

export const getLastAvailableYearByCountry = (
    rows: Array<string[]>,
    isUpTo2019?: boolean,
    maxYearToFilterBy?: string
): Record<string, string> => {
    return rows.reduce((acc: Record<string, string>, row) => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        const yearIsLessOrEqual2019 = !isUpTo2019 || Number(year) <= 2019;
        const yearIsLessOrEqualMaxYear = !maxYearToFilterBy || Number(year) <= Number(maxYearToFilterBy);

        const accYearIsLessThanYear = acc[countryId] !== undefined && Number(acc[countryId]) < Number(year);

        return yearIsLessOrEqual2019 && yearIsLessOrEqualMaxYear && (!acc[countryId] || accYearIsLessThanYear)
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

export function getCommonLastAvailableYearInTwoDataIds(params: {
    rows: Array<string[]>;
    dataId1: Id;
    dataId2: Id;
    isUpTo2019?: boolean;
    maxYearToFilterBy?: string;
}): Record<string, string> {
    const { rows, dataId1, dataId2, isUpTo2019, maxYearToFilterBy } = params;
    const groupedByCountry = getGroupedYearsByCountryInTwoDataIds({ rows, dataId1: dataId1, dataId2: dataId2 });

    const yearFilter = (year: string) => {
        const numericYear = Number(year);
        return (!isUpTo2019 || numericYear <= 2019) && (!maxYearToFilterBy || numericYear <= Number(maxYearToFilterBy));
    };

    return Object.keys(groupedByCountry).reduce((acc, countryId) => {
        const filteredXYears = [...(groupedByCountry[countryId]?.dataId1Years || [])].filter(yearFilter);
        const filteredYYears = [...(groupedByCountry[countryId]?.dataId2Years || [])].filter(yearFilter);

        const commonYears = filteredXYears
            .filter(year => filteredYYears.includes(year))
            .sort((a, b) => parseInt(b) - parseInt(a));

        return {
            ...acc,
            [countryId]: commonYears.length > 0 && commonYears[0] ? commonYears[0] : "",
        };
    }, {} as Record<string, string>);
}

export function getGroupedYearsByCountryInTwoDataIds(params: {
    rows: Array<string[]>;
    dataId1: Id;
    dataId2: Id;
}): Record<
    string,
    {
        dataId1Years: Set<string>;
        dataId2Years: Set<string>;
    }
> {
    const { rows, dataId1, dataId2 } = params;

    return rows.reduce((acc, row) => {
        const dataId = row[0]?.toString() || "";
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        const countryData = acc[countryId] || { dataId1Years: new Set<string>(), dataId2Years: new Set<string>() };

        if (dataId === dataId1) {
            countryData.dataId1Years.add(year);
        } else if (dataId === dataId2) {
            countryData.dataId2Years.add(year);
        }

        return { ...acc, [countryId]: countryData };
    }, {} as Record<string, { dataId1Years: Set<string>; dataId2Years: Set<string> }>);
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
    isUpTo2019?: boolean,
    maxYearToFilterBy?: string
): Record<string, string> {
    const firstChartLatestAvailableYearByCountry = getLastAvailableYearByCountry(
        firstChartRows,
        isUpTo2019,
        maxYearToFilterBy
    );
    const secondChartLatestAvailableYearByCountry = getLastAvailableYearByCountry(
        secondChartRows,
        isUpTo2019,
        maxYearToFilterBy
    );

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
    isUpTo2019?: boolean,
    maxYearToFilterBy?: string
): Array<string[]> {
    const latestAvailableYearByCountryId = getLatestAvailableYearByCountryIdFromTwoCharts(
        firstChartRows || [],
        secondChartRows || [],
        isUpTo2019,
        maxYearToFilterBy
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
