import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { chart2Options } from "./chart2Options";
import { chart3Options } from "./chart3Options";

export const chartOptions: Record<
    string,
    (analiticsResponse: Analytics, visualization: Visualization) => Highcharts.Options
> = {
    dbc87Ljw8uN: (analiticsResponse: Analytics, visualization: Visualization) =>
        chart2Options(analiticsResponse, visualization),
    NOukqSxCI63: (analiticsResponse: Analytics, visualization: Visualization) =>
        chart3Options(analiticsResponse, visualization),
};
