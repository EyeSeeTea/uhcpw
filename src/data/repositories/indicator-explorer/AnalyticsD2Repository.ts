import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api) {} //, private d2dataEngine: unknown) {}

    public get(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<Analytics> {
        // const { dimension, filter } = this.getDimensionsAndFilter(visualization, periods, orgUnits);

        // return apiToFuture(
        //     this.api.analytics
        //         .get({
        //             dimension,
        //             filter,
        //         })
        //         .map(response => {
        //             //TODO: Response from analytics endpoint hasn't metadataItems
        //             return response.data as unknown as Analytics;
        //         })
        // );

        return Future.success(hardcodedAnalytics as unknown as Analytics);
    }

    getDimensionsAndFilter(
        visualization: Visualization,
        periods: string[],
        orgUnits: string[]
    ): { dimension: string[]; filter?: string[] } {
        const dataDimension = `dx:${visualization.dataDimensionItems.map(item => item.dataElement.id).join(";")}`;
        const orgUnitDimension = `ou:${orgUnits.join(";")}`;
        const categoryDimensions = visualization.categoryDimensions.map(
            catDim => `${catDim.category.id}:${catDim.categoryOptions.map(catOp => catOp.id).join(";")}`
        );
        const periodDimension = `pe:${periods.join(";")}`;

        return {
            dimension: [...categoryDimensions, periodDimension],
            filter: [dataDimension, orgUnitDimension],
        };
    }

    //     async fetchData(visualization: Visualization, filters: unknown) {
    //         const displayProperty = false;
    //         const forDashboard = false;

    //         const adaptedVisualization = {
    //             ...visualization,
    //             columns: removeItemAllFromAxisItems(visualization.columns),
    //             rows: removeItemAllFromAxisItems(visualization.rows),
    //             filters: removeItemAllFromAxisItems(visualization.filters),
    //         };

    //         const options = getRequestOptions(adaptedVisualization, filters, displayProperty);

    //         const extraOptions = {
    //             dashboard: forDashboard,
    //         };

    //         if (isYearOverYear(adaptedVisualization.type)) {
    //             const { responses, yearlySeriesLabels } = await apiFetchAnalyticsForYearOverYear(
    //                 dataEngine,
    //                 adaptedVisualization,
    //                 options
    //             );

    //             const peItems = layoutGetDimensionItems(adaptedVisualization, DIMENSION_ID_PERIOD);

    //             const relativePeriodTypeUsed = getRelativePeriodTypeUsed(peItems);

    //             const periodKeyAxisIndexMatrix = computeYoYMatrix(responses, relativePeriodTypeUsed);
    //             const periodKeyAxisIndexMap = periodKeyAxisIndexMatrix.reduce((map, periodKeys, index) => {
    //                 periodKeys.forEach(periodKey => (map[periodKey] = index));

    //                 return map;
    //             }, {});

    //             const xAxisLabels = relativePeriodTypeUsed
    //                 ? computeGenericPeriodNamesFromMatrix(periodKeyAxisIndexMatrix, relativePeriodTypeUsed)
    //                 : computeGenericPeriodNames(responses);

    //             return {
    //                 responses,
    //                 extraOptions: {
    //                     ...extraOptions,
    //                     yearlySeries: yearlySeriesLabels,
    //                     xAxisLabels,
    //                     periodKeyAxisIndexMap,
    //                 },
    //             };
    //         }

    //         return {
    //             responses: await apiFetchAnalytics(dataEngine, adaptedVisualization, options),
    //             extraOptions,
    //         };
    //     }
}

// const removeItemAllFromAxisItems = axis =>
//     (axis || []).map(ai => ({
//         ...ai,
//         items: ai?.items?.filter(item => item.id !== ALL_DYNAMIC_DIMENSION_ITEMS),
//     }));

// const WaznCszwnj7 = {
//     headers: [
//         {
//             name: "dx",
//             column: "Data",
//             valueType: "TEXT",
//             type: "java.lang.String",
//             hidden: false,
//             meta: true,
//             isPrefix: false,
//             isCollect: false,
//             index: 0,
//         },
//         {
//             name: "ou",
//             column: "Organisation unit",
//             valueType: "TEXT",
//             type: "java.lang.String",
//             hidden: false,
//             meta: true,
//             isPrefix: false,
//             isCollect: false,
//             index: 1,
//         },
//         {
//             name: "value",
//             column: "Value",
//             valueType: "NUMBER",
//             type: "java.lang.Double",
//             hidden: false,
//             meta: false,
//             isPrefix: false,
//             isCollect: false,
//             index: 2,
//         },
//         {
//             name: "numerator",
//             column: "Numerator",
//             valueType: "NUMBER",
//             type: "java.lang.Double",
//             hidden: false,
//             meta: false,
//             isPrefix: false,
//             isCollect: false,
//             index: 3,
//         },
//         {
//             name: "denominator",
//             column: "Denominator",
//             valueType: "NUMBER",
//             type: "java.lang.Double",
//             hidden: false,
//             meta: false,
//             isPrefix: false,
//             isCollect: false,
//             index: 4,
//         },
//         {
//             name: "factor",
//             column: "Factor",
//             valueType: "NUMBER",
//             type: "java.lang.Double",
//             hidden: false,
//             meta: false,
//             isPrefix: false,
//             isCollect: false,
//             index: 5,
//         },
//         {
//             name: "multiplier",
//             column: "Multiplier",
//             valueType: "NUMBER",
//             type: "java.lang.Double",
//             hidden: false,
//             meta: false,
//             isPrefix: false,
//             isCollect: false,
//             index: 6,
//         },
//         {
//             name: "divisor",
//             column: "Divisor",
//             valueType: "NUMBER",
//             type: "java.lang.Double",
//             hidden: false,
//             meta: false,
//             isPrefix: false,
//             isCollect: false,
//             index: 7,
//         },
//     ],
//     metaData: {
//         items: {
//             "202208": {
//                 uid: "202208",
//                 code: "202208",
//                 name: "August 2022",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2022-08-01T00:00:00.000",
//                 endDate: "2022-08-31T00:00:00.000",
//             },
//             "202209": {
//                 uid: "202209",
//                 code: "202209",
//                 name: "September 2022",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2022-09-01T00:00:00.000",
//                 endDate: "2022-09-30T00:00:00.000",
//             },
//             "202210": {
//                 uid: "202210",
//                 code: "202210",
//                 name: "October 2022",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2022-10-01T00:00:00.000",
//                 endDate: "2022-10-31T00:00:00.000",
//             },
//             "202211": {
//                 uid: "202211",
//                 code: "202211",
//                 name: "November 2022",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2022-11-01T00:00:00.000",
//                 endDate: "2022-11-30T00:00:00.000",
//             },
//             "202212": {
//                 uid: "202212",
//                 code: "202212",
//                 name: "December 2022",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2022-12-01T00:00:00.000",
//                 endDate: "2022-12-31T00:00:00.000",
//             },
//             "202301": {
//                 uid: "202301",
//                 code: "202301",
//                 name: "January 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-01-01T00:00:00.000",
//                 endDate: "2023-01-31T00:00:00.000",
//             },
//             "202302": {
//                 uid: "202302",
//                 code: "202302",
//                 name: "February 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-02-01T00:00:00.000",
//                 endDate: "2023-02-28T00:00:00.000",
//             },
//             "202303": {
//                 uid: "202303",
//                 code: "202303",
//                 name: "March 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-03-01T00:00:00.000",
//                 endDate: "2023-03-31T00:00:00.000",
//             },
//             "202304": {
//                 uid: "202304",
//                 code: "202304",
//                 name: "April 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-04-01T00:00:00.000",
//                 endDate: "2023-04-30T00:00:00.000",
//             },
//             "202305": {
//                 uid: "202305",
//                 code: "202305",
//                 name: "May 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-05-01T00:00:00.000",
//                 endDate: "2023-05-31T00:00:00.000",
//             },
//             "202306": {
//                 uid: "202306",
//                 code: "202306",
//                 name: "June 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-06-01T00:00:00.000",
//                 endDate: "2023-06-30T00:00:00.000",
//             },
//             "202307": {
//                 uid: "202307",
//                 code: "202307",
//                 name: "July 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-07-01T00:00:00.000",
//                 endDate: "2023-07-31T00:00:00.000",
//             },
//             "202308": {
//                 uid: "202308",
//                 code: "202308",
//                 name: "August 2023",
//                 dimensionItemType: "PERIOD",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//                 startDate: "2023-08-01T00:00:00.000",
//                 endDate: "2023-08-31T00:00:00.000",
//             },
//             zXAaAXzwt4M: {
//                 uid: "zXAaAXzwt4M",
//                 code: "NA",
//                 name: "NA",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             THIS_MONTH: {
//                 name: "This month",
//             },
//             LAST_12_MONTHS: {
//                 name: "Last 12 months",
//             },
//             dx: {
//                 uid: "dx",
//                 name: "Data",
//                 dimensionType: "DATA_X",
//             },
//             svSQSBLTVz6: {
//                 uid: "svSQSBLTVz6",
//                 code: "EUR",
//                 name: "EUR",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             ou: {
//                 uid: "ou",
//                 name: "Organisation unit",
//                 dimensionType: "ORGANISATION_UNIT",
//             },
//             seHJdofSPcM: {
//                 uid: "seHJdofSPcM",
//                 code: "AFR",
//                 name: "AFR",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             yWc1CTszR3s: {
//                 uid: "yWc1CTszR3s",
//                 code: "EMR",
//                 name: "EMR",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             afomkmfy9xk: {
//                 uid: "afomkmfy9xk",
//                 code: "SEAR",
//                 name: "SEAR",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             RA5zxsbittk: {
//                 uid: "RA5zxsbittk",
//                 code: "WPR",
//                 name: "WPR",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             pe: {
//                 uid: "pe",
//                 name: "Period",
//                 dimensionType: "PERIOD",
//             },
//             H8RixfF8ugH: {
//                 uid: "H8RixfF8ugH",
//                 code: "WHO-HQ",
//                 name: "Global",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             wP2zKq0dDpw: {
//                 uid: "wP2zKq0dDpw",
//                 code: "AMR",
//                 name: "AMR",
//                 dimensionItemType: "ORGANISATION_UNIT",
//                 valueType: "NUMBER",
//                 totalAggregationType: "SUM",
//             },
//             I37a3GkniJq: {
//                 uid: "I37a3GkniJq",
//                 name: "ETA Patients Referred In - Total Patient %(events)",
//                 description: "ETA Patients Referred In - Total Patient % (Tracker AND Event)",
//                 dimensionItemType: "INDICATOR",
//                 valueType: "NUMBER",
//                 totalAggregationType: "AVERAGE",
//                 indicatorType: {
//                     name: "Percent",
//                     displayName: "Percent",
//                     factor: 100,
//                     number: false,
//                 },
//             },
//         },
//         dimensions: {
//             dx: ["I37a3GkniJq"],
//             pe: [
//                 "202208",
//                 "202209",
//                 "202210",
//                 "202211",
//                 "202212",
//                 "202301",
//                 "202302",
//                 "202303",
//                 "202304",
//                 "202305",
//                 "202306",
//                 "202307",
//                 "202308",
//             ],
//             ou: [
//                 "H8RixfF8ugH",
//                 "seHJdofSPcM",
//                 "wP2zKq0dDpw",
//                 "yWc1CTszR3s",
//                 "svSQSBLTVz6",
//                 "zXAaAXzwt4M",
//                 "afomkmfy9xk",
//                 "RA5zxsbittk",
//             ],
//             co: [],
//         },
//     },
//     rows: [
//         ["I37a3GkniJq", "H8RixfF8ugH", "61.1", "11.0", "18.0", "100.0", "100", "1"],
//         ["I37a3GkniJq", "seHJdofSPcM", "57.1", "4.0", "7.0", "100.0", "100", "1"],
//         ["I37a3GkniJq", "wP2zKq0dDpw", "100.0", "3.0", "3.0", "100.0", "100", "1"],
//         ["I37a3GkniJq", "yWc1CTszR3s", "33.3", "1.0", "3.0", "100.0", "100", "1"],
//         ["I37a3GkniJq", "zXAaAXzwt4M", "66.7", "2.0", "3.0", "100.0", "100", "1"],
//     ],
//     width: 8,
//     height: 5,
//     headerWidth: 8,
// };

const hardcodedAnalytics = {
    headers: [
        {
            name: "dx",
            column: "Data",
            valueType: "TEXT",
            type: "java.lang.String",
            hidden: false,
            meta: true,
            isPrefix: false,
            isCollect: false,
            index: 0,
        },
        {
            name: "pe",
            column: "Period",
            valueType: "TEXT",
            type: "java.lang.String",
            hidden: false,
            meta: true,
            isPrefix: false,
            isCollect: false,
            index: 1,
        },
        {
            name: "value",
            column: "Value",
            valueType: "NUMBER",
            type: "java.lang.Double",
            hidden: false,
            meta: false,
            isPrefix: false,
            isCollect: false,
            index: 2,
        },
    ],
    metaData: {
        items: {
            202208: {
                uid: "202208",
                code: "202208",
                name: "August 2022",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2022-08-01T00:00:00.000",
                endDate: "2022-08-31T00:00:00.000",
            },
            202209: {
                uid: "202209",
                code: "202209",
                name: "September 2022",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2022-09-01T00:00:00.000",
                endDate: "2022-09-30T00:00:00.000",
            },
            202210: {
                uid: "202210",
                code: "202210",
                name: "October 2022",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2022-10-01T00:00:00.000",
                endDate: "2022-10-31T00:00:00.000",
            },
            202211: {
                uid: "202211",
                code: "202211",
                name: "November 2022",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2022-11-01T00:00:00.000",
                endDate: "2022-11-30T00:00:00.000",
            },
            202212: {
                uid: "202212",
                code: "202212",
                name: "December 2022",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2022-12-01T00:00:00.000",
                endDate: "2022-12-31T00:00:00.000",
            },
            202301: {
                uid: "202301",
                code: "202301",
                name: "January 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-01-01T00:00:00.000",
                endDate: "2023-01-31T00:00:00.000",
            },
            202302: {
                uid: "202302",
                code: "202302",
                name: "February 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-02-01T00:00:00.000",
                endDate: "2023-02-28T00:00:00.000",
            },
            202303: {
                uid: "202303",
                code: "202303",
                name: "March 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-03-01T00:00:00.000",
                endDate: "2023-03-31T00:00:00.000",
            },
            202304: {
                uid: "202304",
                code: "202304",
                name: "April 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-04-01T00:00:00.000",
                endDate: "2023-04-30T00:00:00.000",
            },
            202305: {
                uid: "202305",
                code: "202305",
                name: "May 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-05-01T00:00:00.000",
                endDate: "2023-05-31T00:00:00.000",
            },
            202306: {
                uid: "202306",
                code: "202306",
                name: "June 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-06-01T00:00:00.000",
                endDate: "2023-06-30T00:00:00.000",
            },
            202307: {
                uid: "202307",
                code: "202307",
                name: "July 2023",
                dimensionItemType: "PERIOD",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
                startDate: "2023-07-01T00:00:00.000",
                endDate: "2023-07-31T00:00:00.000",
            },
            sB79w2hiLp8: {
                uid: "sB79w2hiLp8",
                name: "ANC 3 Coverage",
                description: "Total 3rd ANC visits (Fixed and outreach) by expected number of pregnant women.",
                legendSet: "fqs276KXCXi",
                dimensionItemType: "INDICATOR",
                valueType: "NUMBER",
                totalAggregationType: "AVERAGE",
                indicatorType: {
                    name: "Per cent",
                    displayName: "Per cent",
                    factor: 100,
                    number: false,
                },
            },
            ou: {
                uid: "ou",
                name: "Organisation unit",
                dimensionType: "ORGANISATION_UNIT",
            },
            OdiHJayrsKo: {
                uid: "OdiHJayrsKo",
                code: "IN_52491",
                name: "ANC 2 Coverage",
                description: "Total 2nd ANC visits (Fixed and outreach) by expected number of pregnant women.",
                legendSet: "fqs276KXCXi",
                dimensionItemType: "INDICATOR",
                valueType: "NUMBER",
                totalAggregationType: "AVERAGE",
                indicatorType: {
                    name: "Per cent",
                    displayName: "Per cent",
                    factor: 100,
                    number: false,
                },
            },
            LAST_12_MONTHS: {
                name: "Last 12 months",
            },
            ImspTQPwCqd: {
                uid: "ImspTQPwCqd",
                code: "OU_525",
                name: "Sierra Leone",
                dimensionItemType: "ORGANISATION_UNIT",
                valueType: "NUMBER",
                totalAggregationType: "SUM",
            },
            dx: {
                uid: "dx",
                name: "Data",
                dimensionType: "DATA_X",
            },
            pe: {
                uid: "pe",
                name: "Period",
                dimensionType: "PERIOD",
            },
            Uvn6LCg7dVU: {
                uid: "Uvn6LCg7dVU",
                code: "IN_52486",
                name: "ANC 1 Coverage",
                description: "Total 1st ANC visits (Fixed and outreach) by expected number of pregnant women.",
                legendSet: "fqs276KXCXi",
                dimensionItemType: "INDICATOR",
                valueType: "NUMBER",
                totalAggregationType: "AVERAGE",
                indicatorType: {
                    name: "Per cent",
                    displayName: "Per cent",
                    factor: 100,
                    number: false,
                },
            },
        },
        dimensions: {
            dx: ["Uvn6LCg7dVU", "OdiHJayrsKo", "sB79w2hiLp8"],
            pe: [
                "202208",
                "202209",
                "202210",
                "202211",
                "202212",
                "202301",
                "202302",
                "202303",
                "202304",
                "202305",
                "202306",
                "202307",
            ],
            ou: ["ImspTQPwCqd"],
            co: [],
        },
    },
    rows: [
        ["Uvn6LCg7dVU", "202208", "106.2"],
        ["Uvn6LCg7dVU", "202209", "111.3"],
        ["Uvn6LCg7dVU", "202210", "86.5"],
        ["Uvn6LCg7dVU", "202211", "98.2"],
        ["Uvn6LCg7dVU", "202212", "79.4"],
        ["Uvn6LCg7dVU", "202301", "94.7"],
        ["Uvn6LCg7dVU", "202302", "98.8"],
        ["Uvn6LCg7dVU", "202303", "87.9"],
        ["Uvn6LCg7dVU", "202304", "107.0"],
        ["Uvn6LCg7dVU", "202305", "139.4"],
        ["Uvn6LCg7dVU", "202306", "116.4"],
        ["Uvn6LCg7dVU", "202307", "107.1"],
        ["OdiHJayrsKo", "202208", "98.5"],
        ["OdiHJayrsKo", "202209", "101.9"],
        ["OdiHJayrsKo", "202210", "77.8"],
        ["OdiHJayrsKo", "202211", "97.0"],
        ["OdiHJayrsKo", "202212", "73.3"],
        ["OdiHJayrsKo", "202301", "82.1"],
        ["OdiHJayrsKo", "202302", "97.3"],
        ["OdiHJayrsKo", "202303", "87.1"],
        ["OdiHJayrsKo", "202304", "95.7"],
        ["OdiHJayrsKo", "202305", "112.3"],
        ["OdiHJayrsKo", "202306", "116.8"],
        ["OdiHJayrsKo", "202307", "100.3"],
        ["sB79w2hiLp8", "202208", "70.8"],
        ["sB79w2hiLp8", "202209", "76.3"],
        ["sB79w2hiLp8", "202210", "57.1"],
        ["sB79w2hiLp8", "202211", "74.2"],
        ["sB79w2hiLp8", "202212", "51.3"],
        ["sB79w2hiLp8", "202301", "56.1"],
        ["sB79w2hiLp8", "202302", "63.7"],
        ["sB79w2hiLp8", "202303", "59.2"],
        ["sB79w2hiLp8", "202304", "68.1"],
        ["sB79w2hiLp8", "202305", "74.3"],
        ["sB79w2hiLp8", "202306", "76.6"],
        ["sB79w2hiLp8", "202307", "70.5"],
    ],
};
