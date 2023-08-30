export type Analytics = {
    headers: Array<{
        name: string;
        column: string;
        valueType: "TEXT" | "NUMBER";
        type: "java.lang.String" | "java.lang.Double";
        hidden: boolean;
        meta: boolean;
        isPrefix?: boolean;
        isCollect?: boolean;
        index?: number;
    }>;
    metaData: {
        items: Record<string, AnalyticsMetadataItem>;
        dimensions: Record<string, string[]>;
    };
    rows: Array<string[]>;
};

export type AnalyticsMetadataItem = {
    uid: string;
    code?: string;
    name: string;
    dimensionItemType: "PERIOD" | "ORGANISATION_UNIT" | "CATEGORY_OPTION" | "DATA_ELEMENT";
    valueType: string;
    totalAggregationType: "SUM";
    startDate?: string;
    endDate?: string;
};
