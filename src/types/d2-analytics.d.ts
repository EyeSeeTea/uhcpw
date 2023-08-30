declare module "@dhis2/analytics" {
    import { Chart } from "highcharts";
    import HE from "highcharts/modules/exporting";

    export function isSingleValue(type: any): boolean;

    export function createVisualization(
        data: AnalyticsResponse[],
        layout: Visualization,
        el: MutableRefObject,
        extraOptions: { dashboard: boolean; animation: number; legendSets: []; onToggleContextualMenu: any },
        error?: (error: any) => never,
        warning?: (warning: any) => void,
        outputFormat: "dhis" | "highcharts"
    ): {
        store: Store;
        config: Config;
        visualization: Chart;
    };

    export type AnalyticsResponse = {
        response: {
            headers: AnalyticsResponseHeader[];
            metaData: AnalyticsResponseMetadata;
            rows: Array<string[]>;
        };
        headers: AnalyticsResponseHeader[];
        metaData: AnalyticsResponseMetadata;
        rows: Array<string[]>;
    };

    export type AnalyticsResponseHeader = {
        name: string;
        column: string;
        valueType: "TEXT" | "NUMBER";
        type: "java.lang.String" | "java.lang.Double";
        hidden: boolean;
        meta: boolean;
        isPrefix?: boolean;
        isCollect?: boolean;
        index?: number;
    };

    export type AnalyticsResponseMetadata = {
        items: Record<string, AnalyticsMetadataItem>;
        dimensions: Record<string, string[]>;
    };

    export type AnalyticsMetadataItem = {
        uid?: string;
        code?: string;
        name: string;
        description?: string;
        dimensionItemType?: "PERIOD" | "ORGANISATION_UNIT" | "CATEGORY_OPTION" | "DATA_ELEMENT" | "INDICATOR";
        dimensionType?: "PERIOD" | "ORGANISATION_UNIT" | "CATEGORY_OPTION" | "DATA_ELEMENT" | "INDICATOR" | "DATA_X";
        legendSet?: string;
        valueType?: string;
        totalAggregationType?: "SUM" | "AVERAGE";
        indicatorType?: unknown;
        startDate?: string;
        endDate?: string;
    };

    export type Layout = {
        rows: LayoutDimension[];
        columns: LayoutDimension[];
        filters: LayoutDimension[];
    };

    export type LayoutDimension = { id: Dimension; items: DimensionItem };
    export type Dimension = "ou" | "pe" | "dx" | string;
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
}
