import Highcharts, { PointOptionsObject, SeriesColumnOptions } from "highcharts";
import _ from "lodash";

export type ColorOverrides = Record<string, Record<string, string>>;
type UsedColorsBySeries = Record<string, string[]>;

type ChartWithSwatches = Highcharts.Chart & {
    customSwatches?: Highcharts.SVGElement[];
    legend: unknown;
};

export function overrideDataSeriesColorAndUpdateLegends(
    series: SeriesColumnOptions[],
    dataSeriesColorOverrides: ColorOverrides
) {
    const usedColorsBySeries = buildUsedColorsBySeries(series, dataSeriesColorOverrides);

    return {
        events: {
            render(this: ChartWithSwatches) {
                renderLegendSwatches.call(this, usedColorsBySeries);
            },
        },
        series: applyColorOverridesToSeries(series, dataSeriesColorOverrides),
    };
}

const buildUsedColorsBySeries = (
    series: SeriesColumnOptions[],
    dataSeriesColorOverrides: ColorOverrides
): UsedColorsBySeries => {
    return series.reduce<UsedColorsBySeries>((acc, serie) => {
        if (!serie.id) return acc;

        const overrides = dataSeriesColorOverrides[serie.id];
        if (!overrides) return acc;

        const colors = (serie.data as PointOptionsObject[])?.flatMap(point =>
            point.id && overrides[point.id] ? [overrides[point.id]] : []
        );

        if (colors.length === 0) return acc;

        return { ...acc, [serie.id]: _.uniq(colors) } as UsedColorsBySeries;
    }, {});
};

function renderLegendSwatches(this: ChartWithSwatches, usedColorsBySeries: UsedColorsBySeries): void {
    if (!this.legend?.allItems) return;

    this.customSwatches?.forEach((el: Highcharts.SVGElement) => el.destroy());
    this.customSwatches = [];

    this.legend.allItems.forEach((item: any) => {
        const seriesId = String(item.userOptions?.id ?? "");
        const usedColors = usedColorsBySeries[seriesId];

        if (item._originalLabelX !== undefined) {
            item.legendItem?.attr({ x: item._originalLabelX });
        }

        if (!usedColors) return;

        const { legendSymbol, legendItem, legendGroup } = item;
        if (!legendSymbol || !legendGroup || !legendItem) return;

        const symbolX = Number(legendSymbol.attr("x"));
        const symbolY = Number(legendSymbol.attr("y"));
        const symbolWidth = Number(legendSymbol.attr("width"));
        const radius = Number(legendSymbol.attr("height")) / 2;
        const swatchSpacing = radius * 2 + 4;

        item._originalLabelX ??= Number(legendItem.attr("x"));
        legendItem.attr({ x: item._originalLabelX + usedColors.length * swatchSpacing });

        const isDisabled = item.visible === false;
        const disabledColor = "rgb(204, 204, 204)";
        legendSymbol.attr({ fill: isDisabled ? disabledColor : item.color });

        usedColors.forEach((color, i) => {
            const cx = symbolX + symbolWidth + 4 + i * swatchSpacing + radius;
            const cy = symbolY + radius;
            const swatch = this.renderer
                .circle(cx, cy, radius)
                .attr({ fill: isDisabled ? disabledColor : color, zIndex: 5 })
                .add(legendGroup);

            this.customSwatches?.push(swatch);
        });
    });
}

function applyColorOverridesToSeries(
    series: SeriesColumnOptions[],
    dataSeriesColorOverrides: ColorOverrides
): SeriesColumnOptions[] {
    return series.map(serie => {
        const overrides = serie.id ? dataSeriesColorOverrides[serie.id] : undefined;
        if (!overrides) return serie;

        return {
            ...serie,
            data: (serie.data as PointOptionsObject[]).map(point => {
                const color = point.id ? overrides[point.id] : undefined;
                return color ? { ...point, color } : point;
            }),
        };
    });
}
