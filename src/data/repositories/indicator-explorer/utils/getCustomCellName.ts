import { Id } from "../../../../domain/entities/Ref";

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
        x: "rX0nLoxvSAi",
        y: "kBOh0hUi5bW",
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

export function getCustomCellName(visualizationId: Id, axeId: Id): string | undefined {
    const axesNames = cellNameByVisualizationId[visualizationId];
    const xAxesName = isXAxes(visualizationId, axeId) && axesNames?.x ? axesNames?.x : undefined;
    const yAxesName = isYAxes(visualizationId, axeId) && axesNames?.y ? axesNames?.y : undefined;
    return xAxesName || yAxesName;
}
