import React from "react";
import { Id, Ref } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";

export interface ChartProps {
    visualizationId: string;
    countryIds?: string[];
    periods?: string[];
}

export const Chart: React.FC<ChartProps> = React.memo(({ visualizationId, countryIds, periods }) => {
    //const { visualization, parentOrgUnit, period } = props;
    const { api, isNodeDev: isDev } = useAppContext();
    const elementId = `visualization-${visualizationId}`;

    React.useEffect(() => {
        const url = isDev ? "/dhis2" : api.baseUrl;

        debugger;

        const item: ReportItem = {
            id: visualizationId,
            el: elementId,
            columns: countryIds
                ? [{ dimension: "ou", items: countryIds?.map(countryId => ({ id: countryId })) }]
                : undefined,
            rows:
                periods && periods.length > 0
                    ? [{ dimension: "pe", items: periods?.map(period => ({ id: period })) }]
                    : undefined,
        };

        console.log({ item });

        window.chartPlugin.url = url;
        window.chartPlugin.load([item]);
    }, [visualizationId, api, elementId, isDev, countryIds, periods]);

    return <div id={elementId}></div>;
});

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
    dimension: "ou" | "pe" | "dx";
    items: Ref[];
}

type DOMSelectorId = string;
