import _ from "lodash";
import { useEffect, useMemo, useState } from "react";

import { ResourceState } from "../resources/by-type/ResourcesByTypeState";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { useAppContext } from "../../contexts/app-context";
import { buildResourcesBySection } from "../resources/by-type/useResourcesByType";

const RESOURCES_PRIORITY_TO_BE_SHOWN: Record<
    "country-analysis" | "comparative-analysis" | "news" | "multimedia",
    number
> = {
    "comparative-analysis": 1,
    "country-analysis": 2,
    multimedia: 3,
    news: 4,
};

export function useHomeResources() {
    const { compositionRoot, countries, themes } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    const isSmallScreen = useIsSmallScreen();

    useEffect(() => {
        setLoading(true);

        compositionRoot.resources.get
            .execute({
                isFavouriteHome: true,
            })
            .run(
                normalResponse => {
                    setLoading(false);
                    setItems(buildResourcesBySection(normalResponse, countries, themes));
                },
                () => {
                    setLoading(false);
                    setItems([]);
                }
            );
    }, [compositionRoot.resources.get, countries, themes]);

    const resources = useMemo(() => {
        const uniqueResources = items
            ?.filter(item => !!item.favouriteHome && (isSmallScreen ? item.kind !== "news" : true))
            .reduce((acc: ResourceState[], resource: ResourceState): ResourceState[] => {
                const sameResourcesSortedByPriorityToBeShown = items
                    .filter(({ id }) => resource.id === id)
                    .sort((resourceA, resourceB) => {
                        return (
                            RESOURCES_PRIORITY_TO_BE_SHOWN[resourceA.kind] -
                            RESOURCES_PRIORITY_TO_BE_SHOWN[resourceB.kind]
                        );
                    });

                const isAlready = acc.find(({ id }) => resource.id === id);

                return isAlready || !sameResourcesSortedByPriorityToBeShown[0]
                    ? acc
                    : [...acc, sameResourcesSortedByPriorityToBeShown[0]];
            }, []);

        return uniqueResources?.length ? _.orderBy(uniqueResources, "favouriteHomeOrder").slice(0, 6) : [];
    }, [items, isSmallScreen]);

    const news = useMemo(() => {
        const filteredNews = items?.filter(item => item.kind === "news" && !!item.favouriteSection);

        return filteredNews?.length ? _.orderBy(filteredNews, "favouriteSectionOrder").slice(0, 6) : [];
    }, [items]);

    return {
        resources,
        news,
        loading,
    };
}
