import React from "react";
import { ResourceState } from "../../../pages/resources/by-type/ResourcesByTypeState";
import { ComparativeAnalysisItem } from "../comparative-analysis/ComparativeAnalysisItem";
import { CountryAnalysisItem } from "../country-analysis/CountryAnalysisItem";
import { SimpleResourceItem } from "./SimpleResourceItem";

export const ResourceItem: React.FC<{ resource: ResourceState }> = React.memo(({ resource }) => {
    const themeColor: Record<string, string> = {
        "Financial Protection": "#008ad7",
        Resilience: "#4fad56",
        "Spending on Health": "#0360a7",
        "Voluntary Health Insurance": "#ff8d4e",
    };

    switch (resource.kind) {
        case "comparative-analysis":
            return <ComparativeAnalysisItem comparativeAnalysis={resource} />;
        case "country-analysis":
            return <CountryAnalysisItem countryAnalysis={resource} />;
        case "news":
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.url}
                    image={resource.image}
                    date={resource.date}
                    dateFormat={"DD MMMM YYYY"}
                />
            );
        case "multimedia": {
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.url}
                    image={resource.image}
                    date={resource.date}
                    tag={resource.theme}
                    tagColor={themeColor[resource.theme]}
                />
            );
        }
    }
});
