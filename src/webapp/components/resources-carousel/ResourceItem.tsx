import { useCallback, useMemo } from "react";
import i18n from "../../../locales";
import { SimpleResourceItem } from "../resources/common/SimpleResourceItem";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { ResourceState } from "../../pages/resources/by-type/ResourcesByTypeState";
import React from "react";

type ResourceItemProps = {
    resource: ResourceState;
    handleOnTagClick: (url: string) => void;
    disableMainPadding?: boolean;
    hideTag?: boolean;
};

export const ResourceItem: React.FC<ResourceItemProps> = React.memo(props => {
    const { resource, handleOnTagClick, disableMainPadding = false, hideTag = false } = props;
    const { redirectWithEvent } = useAnalytics();

    const analyticsEvent = useMemo(() => {
        const common = {
            name: "resource" as const,
            pageTitle: "Homepage",
            year: resource.date.getFullYear(),
            resourceName: resource.title,
            category: resource.kind,
        };

        switch (resource.kind) {
            case "comparative-analysis":
                return redirectWithEvent({
                    ...common,
                    theme: resource.themeName,
                    language: resource.links[0]?.language,
                });
            case "country-analysis":
                return redirectWithEvent({
                    ...common,
                    theme: resource.themeName,
                    country: resource.countryName,
                    language: resource.links[0]?.language,
                });
            case "news":
                return redirectWithEvent(common);
            case "multimedia":
                return redirectWithEvent({
                    ...common,
                    theme: resource.themeName,
                });
        }
    }, [redirectWithEvent, resource]);

    const goToCategory = useCallback(
        () => handleOnTagClick(`/resources/${resource.kind}`),
        [handleOnTagClick, resource.kind]
    );

    switch (resource.kind) {
        case "comparative-analysis":
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.links[0]?.url || ""}
                    image={resource.imageOriginal}
                    fallbackImage={resource.imageOriginal}
                    date={resource.date}
                    redirectWithEvent={analyticsEvent}
                    tag={i18n.t("Comparative analysis")}
                    onTagClick={goToCategory}
                    maintainAspectRatio
                    disableMainPadding={disableMainPadding}
                    hideTag={hideTag}
                />
            );
        case "country-analysis":
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.links[0]?.url || ""}
                    image={resource.imageOriginal}
                    fallbackImage={resource.imageOriginal}
                    date={resource.date}
                    redirectWithEvent={analyticsEvent}
                    tag={i18n.t("Country or area analysis")}
                    onTagClick={goToCategory}
                    maintainAspectRatio
                    disableMainPadding={disableMainPadding}
                    hideTag={hideTag}
                />
            );
        case "news":
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.url}
                    image={resource.imageOriginal}
                    fallbackImage={resource.imageOriginal}
                    date={resource.date}
                    redirectWithEvent={analyticsEvent}
                    tag={i18n.t("News")}
                    onTagClick={goToCategory}
                    maintainAspectRatio
                    disableMainPadding={disableMainPadding}
                    hideTag={hideTag}
                />
            );
        case "multimedia": {
            return (
                <SimpleResourceItem
                    title={resource.title}
                    url={resource.url}
                    image={resource.imageOriginal}
                    fallbackImage={resource.imageOriginal}
                    date={resource.date}
                    redirectWithEvent={analyticsEvent}
                    tag={i18n.t("Multimedia")}
                    onTagClick={goToCategory}
                    maintainAspectRatio
                    disableMainPadding={disableMainPadding}
                    hideTag={hideTag}
                />
            );
        }
    }
});
