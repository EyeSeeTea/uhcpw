import { Id } from "../../../../domain/entities/Ref";
import { whoCountryNames } from "../../countries/mapToWhoCountryData";
import { kIpnMBaBvZ9_xAxisOutOfPocket, kIpnMBaBvZ9_yAxisHouseholds } from "../seed/chart_kIpnMBaBvZ9_Seed";

type CellNames = {
    x: string;
    y: string;
};

type AxesIds = {
    x: Id;
    y: Id;
};

export const cellNameByVisualizationId: Record<Id, CellNames> = {
    kIpnMBaBvZ9: {
        x: "Out-of-pocket payments as a share of current spending on health",
        y: "Households with catastrophic health spending",
    },
};

const axesIdsByVisualizationId: Record<Id, AxesIds> = {
    kIpnMBaBvZ9: {
        x: kIpnMBaBvZ9_xAxisOutOfPocket,
        y: kIpnMBaBvZ9_yAxisHouseholds,
    },
};

type CellNamesByCellId = {
    [cellId: string]: string;
};

const cellNameByVisualizationAndCellId: Record<Id, CellNamesByCellId> = {
    MfLZYD6QCPy: {
        f3t7eoXUzn8: "Poorest",
        dVcHTdCFpNv: "Richest",
        GyiW7dS7BIl: "Total",
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
    const countryName = whoCountryNames[cell];
    if (countryName) {
        return countryName;
    }

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
