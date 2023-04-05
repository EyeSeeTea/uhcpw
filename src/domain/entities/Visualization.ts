import { Id, Ref } from "./Ref";

export interface Visualization {
    id: Id;
    name: string;
    rows: VisualizationDimension[];
    columns: VisualizationDimension[];
    filters: VisualizationDimension[];
    dataDimensionItems: DataDimensionItem[];
}
export interface DataDimensionItem {
    dataDimensionItemType: string;
    dataElement: Ref;
}

export type Dimension = "ou" | "pe" | "dx";
export type VisualizationDimension = { id: Dimension };
