import { Analytics } from "../Analytics";

export function filterZeroValuesAnalytics(analytics: Analytics[]): Analytics[] {
    return analytics.map(analytic => {
        const valueIndexColumn = analytic.headers.findIndex(header => header.name === "value");
        const filteredRows = analytic.rows.filter(row => {
            const valueString = row[valueIndexColumn];
            const value = valueString ? parseFloat(valueString) : 0;
            return !isNaN(value) && value !== 0;
        });
        return {
            ...analytic,
            rows: filteredRows,
        };
    });
}
