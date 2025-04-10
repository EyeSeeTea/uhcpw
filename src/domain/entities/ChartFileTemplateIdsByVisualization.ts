import { Id } from "./Ref";

type VisualizationId = string;

export type ChartFileTemplateIdsByVisualization = {
    [key: VisualizationId]: Id;
};
