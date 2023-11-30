import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { chart3Options } from "./chart3Options";

export const chartOptions: Record<
    string,
    (analiticsResponse: Analytics, visualization: Visualization) => Highcharts.Options
> = {
    NOukqSxCI63: (analiticsResponse: Analytics, visualization: Visualization) =>
        chart3Options(analiticsResponse, visualization),
};
