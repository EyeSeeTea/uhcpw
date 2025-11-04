import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";

export function ceilAnalyticsRows(analytics: Analytics): Analytics["rows"] {
    const valueIndex = analytics.headers.findIndex(h => h.name === "value");

    if (valueIndex === -1) {
        console.error("Value column not found in analytics headers");
        return analytics.rows;
    }

    return analytics.rows.map(row => {
        const value = row[valueIndex];
        if (value === undefined || value === null || value === "") {
            return row;
        }

        const val = parseFloat(value);
        if (isNaN(val)) {
            return row;
        }

        const rounded = Math.ceil(val * 100) / 100;
        const formatted = rounded.toFixed(2);

        return row.map((cell, index) => (index === valueIndex ? formatted : cell));
    });
}
