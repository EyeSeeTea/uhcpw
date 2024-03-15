import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";

export const chart12Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        { id: "OEK4dKvUsOe", name: "Inpatient care", color: "#00b050", dataLabels: { enabled: false } },
        { id: "qgE5NJ9Nyaq", name: "Medicines", color: "#c00000", dataLabels: { enabled: false } },
        { id: "ykAPKvVQusS", name: "Outpatient care", color: "#ffc000", dataLabels: { enabled: false } },
        { id: "a2u2ccahVJL", name: "Dental care", color: "#0070c0", dataLabels: { enabled: false } },
        { id: "OuiKmOeXUWQ", name: "Medical products", color: "#ed7d31", dataLabels: { enabled: false } },
        { id: "qy4W8ZY2g5M", name: "Diagnostic tests", color: "#7030a0", dataLabels: { enabled: false } },
    ],
};
