import { ChartCustomization } from "../types";

export const yAxisformatNumberLabel: Pick<ChartCustomization, "yAxis"> = {
    yAxis: {
        labels: {
            formatter: function () {
                return this.value.toString();
            },
        },
    },
};
