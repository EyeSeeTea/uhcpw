import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";

export const chart_z6nPPMMbOw5_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    series: [
        {
            id: "OE8u72wcKty",
            name: "Public spending on health (HF .1)",
            color: "#00b050",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "S0rJgTIK3Gv",
            name: "Out-of-pocket payments (HF .3)",
            color: "#c00000",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "u8ZcWehUz9H",
            name: "Voluntary health insurance (HF .2)",
            color: "#ffc112",
            dataLabels: {
                enabled: false,
            },
        },
    ],
    xAxis: {
        title: { text: "" },
        categories: [
            "Outpatient Medicines (HC.5.1)",
            "Medical products (HC.5.2)",
            "Outpatient care (HC.1.3)-(HC.1.3.2)",
            "Dental care (HC.1.2.3)",
            "Diagnostic tests (HC.4)-(HC.4.3)",
            "Inpatient care (HC.1.1)+(HC.2.1)",
        ],
    },
};
