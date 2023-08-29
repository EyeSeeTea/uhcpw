import { Id, Ref } from "../Ref";

export interface Visualization {
    id: Id;
    name: string;
    rows: VisualizationDimension[];
    columns: VisualizationDimension[];
    filters: VisualizationDimension[];
    dataDimensionItems: DataDimensionItem[];
    categoryDimensions: CategoryDimensionItem[];
    showData: boolean;
    regressionType: "NONE" | "LINEAR" | "POLYNOMIAL" | "LOESS";
    type:
        | "COLUMN"
        | "STACKED_COLUMN"
        | "BAR"
        | "STACKED_BAR"
        | "LINE"
        | "AREA"
        | "STACKED_AREA"
        | "PIE"
        | "RADAR"
        | "GAUGE"
        | "YEAR_OVER_YEAR_LINE"
        | "YEAR_OVER_YEAR_COLUMN"
        | "SINGLE_VALUE"
        | "PIVOT_TABLE"
        | "SCATTER"
        | "BUBBLE";
    cumulativeValues: boolean;
    sortOrder: number;
    fontSize: "LARGE" | "NORMAL" | "SMALL";
    aggregationType:
        | "SUM"
        | "AVERAGE"
        | "AVERAGE_SUM_ORG_UNIT"
        | "LAST"
        | "LAST_AVERAGE_ORG_UNIT"
        | "LAST_IN_PERIOD"
        | "LAST_IN_PERIOD_AVERAGE_ORG_UNIT"
        | "FIRST"
        | "FIRST_AVERAGE_ORG_UNIT"
        | "COUNT"
        | "STDDEV"
        | "VARIANCE"
        | "MIN"
        | "MAX"
        | "NONE"
        | "CUSTOM"
        | "DEFAULT";
    hideSubtitle: boolean;
    percentStackedValues: boolean;
    noSpaceBetweenColumns: boolean;
    hideTitle: boolean;
    regression: boolean;
    skipRounding: boolean;
    legend: LegendOptions;
    yearlySeries: string[];
}
export interface DataDimensionItem {
    dataDimensionItemType: string;
    dataElement: Ref;
}

export interface CategoryDimensionItem {
    category: Ref;
    categoryOptions: Ref[];
}

export type Dimension = "ou" | "pe" | "dx" | string;
export type VisualizationDimension = { id: Dimension; items: DimensionItem };
export type DimensionItem = {
    name: string;
    id: string;
    dimensionItemType:
        | "DATA_ELEMENT"
        | "DATA_ELEMENT_OPERAND"
        | "INDICATOR"
        | "REPORTING_RATE"
        | "PROGRAM_DATA_ELEMENT"
        | "PROGRAM_ATTRIBUTE"
        | "PROGRAM_INDICATOR"
        | "PERIOD"
        | "ORGANISATION_UNIT"
        | "CATEGORY_OPTION"
        | "OPTION_GROUP"
        | "DATA_ELEMENT_GROUP"
        | "ORGANISATION_UNIT_GROUP"
        | "CATEGORY_OPTION_GROUP";
};

export type LegendOptions = {
    showKey: boolean;
};
