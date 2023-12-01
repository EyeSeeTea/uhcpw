import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";

export const chart12Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true, itemMarginTop: 20 },
    series: [
        { id: "OEK4dKvUsOe", name: "Inpatient care", color: "#00b050" },
        { id: "qgE5NJ9Nyaq", name: "Medicines", color: "#c00000" },
        { id: "ykAPKvVQusS", name: "Outpatient care", color: "#ffc000" },
        { id: "a2u2ccahVJL", name: "Dental care", color: "#0000c0" },
        { id: "OuiKmOeXUWQ", name: "Medical products", color: "#ed7d31" },
        { id: "qy4W8ZY2g5M", name: "Diagnostic tests", color: "#7030a0" },
    ],
};
