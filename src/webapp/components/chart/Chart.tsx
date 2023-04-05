import _ from "lodash";
import React from "react";
import { Id, Ref } from "../../../domain/entities/Ref";
import { Dimension, Visualization } from "../../../domain/entities/Visualization";
import { useAppContext } from "../../contexts/app-context";

export interface ChartProps {
    visualization: Visualization;
    countryIds?: string[];
    periods?: string[];
}

export const Chart: React.FC<ChartProps> = React.memo(({ visualization, countryIds, periods }) => {
    const { api, isNodeDev: isDev } = useAppContext();
    const elementId = `visualization-${visualization.id}`;

    React.useEffect(() => {
        const url = isDev ? "/dhis2" : api.baseUrl;

        const item: ReportItem = {
            id: visualization.id,
            el: elementId,
            columns: getDimensions(visualization, "columns", countryIds, periods),
            rows: getDimensions(visualization, "rows", countryIds, periods),
            filters: getDimensions(visualization, "filters", countryIds, periods),
        };

        window.chartPlugin.url = url;
        window.chartPlugin.load([item]);
    }, [visualization, api, elementId, isDev, countryIds, periods]);

    return <div id={elementId}></div>;
});

const getDimensions = (
    visualization: Visualization,
    prop: VisualizationProp,
    countryIds?: string[],
    periods?: string[]
): ItemRef[] | undefined => {
    debugger;
    const existsOu = visualization[prop].some(vd => vd.id === "ou");
    const existsPe = visualization[prop].some(vd => vd.id === "pe");
    const existsDx = visualization[prop].some(vd => vd.id === "dx");

    if (existsOu || existsPe || existsDx) {
        const dimensionsOu =
            existsOu && countryIds && countryIds.length > 0
                ? [{ dimension: "ou" as const, items: countryIds?.map(countryId => ({ id: countryId })) }]
                : [];

        const dimensionsPe =
            existsPe && periods && periods.length > 0
                ? [{ dimension: "pe" as const, items: periods?.map(period => ({ id: period })) }]
                : [];

        const dimensionsDx =
            (dimensionsOu.length > 0 || dimensionsPe.length > 0) &&
            existsDx &&
            visualization.dataDimensionItems &&
            visualization.dataDimensionItems.length > 0
                ? [
                      {
                          dimension: "dx" as const,
                          items: visualization.dataDimensionItems?.map(
                              dataDimensionItem => dataDimensionItem.dataElement
                          ),
                      },
                  ]
                : [undefined];

        const dimensions = _.compact([...dimensionsOu, ...dimensionsPe, ...dimensionsDx]);

        return dimensions.length > 0 ? dimensions : undefined;
    } else {
        return undefined;
    }
};

export type VisualizationProp = "filters" | "rows" | "columns";

declare global {
    interface Window {
        chartPlugin: {
            url: string;
            username: string;
            password: string;
            load(reports: ReportItem[]): void;
        };
    }
}

interface ReportItem {
    id: Id;
    el: DOMSelectorId;
    rows?: ItemRef[];
    filters?: ItemRef[];
    columns?: ItemRef[];
}

interface ItemRef {
    dimension: Dimension;
    items: Ref[];
}

type DOMSelectorId = string;
