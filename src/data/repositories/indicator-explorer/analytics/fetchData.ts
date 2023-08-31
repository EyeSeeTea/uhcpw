import { DIMENSION_ID_PERIOD, isYearOverYear, layoutGetDimensionItems } from "@dhis2/analytics";
import { VisualizationDimension } from "../../../../domain/entities/indicator-explorer/Visualization";
import { D2Visualization } from "../VisualizationD2Repository";
import { apiFetchAnalytics, apiFetchAnalyticsForYearOverYear } from "./analytics";
import { computeGenericPeriodNames, computeGenericPeriodNamesFromMatrix, computeYoYMatrix } from "./computeYoYMatrix";
import { getRelativePeriodTypeUsed } from "./getRelativePeriodTypeUsed";
import { getRequestOptions } from "./getRequestOptions";

export async function fetchData(d2DataEngine: unknown, visualization: D2Visualization, filters: unknown) {
    const displayProperty = "NAME";
    const forDashboard = false;

    const adaptedVisualization = {
        ...visualization,
        columns: removeItemAllFromAxisItems(visualization.columns as VisualizationDimension[]),
        rows: removeItemAllFromAxisItems(visualization.rows as VisualizationDimension[]),
        filters: removeItemAllFromAxisItems(visualization.filters as VisualizationDimension[]),
    };

    const options = getRequestOptions(adaptedVisualization, filters, displayProperty);

    const extraOptions = {
        dashboard: forDashboard,
    };

    if (isYearOverYear(adaptedVisualization.type)) {
        const { responses, yearlySeriesLabels } = await apiFetchAnalyticsForYearOverYear(
            d2DataEngine,
            adaptedVisualization,
            options
        );

        const peItems = layoutGetDimensionItems(adaptedVisualization, DIMENSION_ID_PERIOD);

        const relativePeriodTypeUsed = getRelativePeriodTypeUsed(peItems);

        const periodKeyAxisIndexMatrix = computeYoYMatrix(responses, relativePeriodTypeUsed);
        const periodKeyAxisIndexMap = periodKeyAxisIndexMatrix.reduce((map, periodKeys, index) => {
            periodKeys.forEach(periodKey => (map[periodKey] = index));

            return map;
        }, {} as Record<string, number>);

        const xAxisLabels = relativePeriodTypeUsed
            ? computeGenericPeriodNamesFromMatrix(periodKeyAxisIndexMatrix, relativePeriodTypeUsed)
            : computeGenericPeriodNames(responses);

        return {
            responses,
            extraOptions: {
                ...extraOptions,
                yearlySeries: yearlySeriesLabels,
                xAxisLabels,
                periodKeyAxisIndexMap,
            },
        };
    }

    return {
        responses: await apiFetchAnalytics(d2DataEngine, adaptedVisualization, options),
        extraOptions,
    };
}

const removeItemAllFromAxisItems = (axis: VisualizationDimension[]) =>
    (axis || []).map(ai => ({
        ...ai,
        items: ai?.items.filter(item => item.id !== "ALL_ITEMS"),
    }));
