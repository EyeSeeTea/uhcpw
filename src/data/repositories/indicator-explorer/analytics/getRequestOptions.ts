import { D2Visualization } from "../VisualizationD2Repository";
import { AnalyticsOptions, getOptionsForRequest } from "./options";

export type AnalyticsRequestOptions = AnalyticsOptions & { relativePeriodDate: unknown; displayProperty: string };

export const getRequestOptions = (visualization: D2Visualization, filters: any, displayProperty: string) => {
    const options = getOptionsForRequest().reduce((input, [option, props]) => {
        const map = input as any;

        const visualizationOption = visualization[option as keyof D2Visualization];

        // only add parameter if value !== default
        if (visualizationOption !== undefined && visualizationOption !== props.defaultValue) {
            map[option] = visualizationOption;
        }

        return map;
    }, {}) as AnalyticsOptions;

    //     // global filters
    // // userOrgUnit
    // if (filters.userOrgUnit && filters.userOrgUnit.length) {
    //     const ouIds = filters.userOrgUnit.map(ouPath => ouPath.split("/").slice(-1)[0]);

    //     options.userOrgUnit = ouIds.join(";");
    // }

    return {
        ...options,
        relativePeriodDate: filters?.relativePeriodDate,
        displayProperty: displayProperty.toUpperCase(),
    };
};
