import { Id } from "../../../../domain/entities/Ref";
import {
    hNU4Lj1xLYO_xAxisOutOfPocket,
    hNU4Lj1xLYO_yAxisHouseholds,
} from "../../../../webapp/components/visualization/manual/chart_hNU4Lj1xLYO_Options";

type CellNames = {
    x: string;
    y: string;
};

type AxesIds = {
    x: Id;
    y: Id;
};

const cellNameByVisualizationId: Record<Id, CellNames> = {
    hNU4Lj1xLYO: {
        x: "Out-of-pocket payments as a share of current spending on health",
        y: "Households with catastrophic health spending",
    },
};

const axesIdsByVisualizationId: Record<Id, AxesIds> = {
    hNU4Lj1xLYO: {
        x: hNU4Lj1xLYO_xAxisOutOfPocket,
        y: hNU4Lj1xLYO_yAxisHouseholds,
    },
};

type CellNamesByCellId = {
    [cellId: string]: string;
};

const cellNameByVisualizationAndCellId: Record<Id, CellNamesByCellId> = {
    MfLZYD6QCPy: {
        f3t7eoXUzn8: "Poorest",
        dVcHTdCFpNv: "Richest",
        GyiW7dS7BIl: "Average",
    },
};

function isXAxes(visualizationId: Id, axeId: Id): boolean {
    const axes = axesIdsByVisualizationId[visualizationId];
    return !!axes && axes.x === axeId;
}

function isYAxes(visualizationId: Id, axeId: Id): boolean {
    const axes = axesIdsByVisualizationId[visualizationId];
    return !!axes && axes.y === axeId;
}

export function getCustomCellName(
    visualizationId: Id,
    seriesIdAndName: {
        id: string | undefined;
        name: string | undefined;
    }[],
    cell: string
): string | undefined {
    const cellNamesInVisualization = cellNameByVisualizationAndCellId[visualizationId];
    const cellName = cellNamesInVisualization?.[cell];
    if (cellName) {
        return cellName;
    }

    const axesNames = cellNameByVisualizationId[visualizationId];
    if (axesNames) {
        const xAxesName = isXAxes(visualizationId, cell) && axesNames?.x ? axesNames?.x : undefined;
        const yAxesName = isYAxes(visualizationId, cell) && axesNames?.y ? axesNames?.y : undefined;
        return xAxesName || yAxesName;
    }

    return seriesIdAndName.find(({ id }) => id === cell)?.name;
}
