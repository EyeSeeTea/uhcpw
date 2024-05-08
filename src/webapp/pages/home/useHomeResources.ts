import _ from "lodash";
import { useMemo } from "react";

import { useResourcesByType } from "../resources/by-type/useResourcesByType";
import { ResourceState } from "../resources/by-type/ResourcesByTypeState";

const RESOURCES_PRIORITY_TO_BE_SHOWN: Record<
    "country-analysis" | "comparative-analysis" | "news" | "multimedia",
    number
> = {
    "comparative-analysis": 1,
    "country-analysis": 2,
    news: 3,
    multimedia: 4,
};

export function useHomeResources() {
    const { items } = useResourcesByType({ favourite: true });

    const resources = useMemo(() => {
        const uniqueResources = items?.reduce((acc: ResourceState[], resource: ResourceState): ResourceState[] => {
            const sameResourcesSortedByPriorityToBeShown = items
                .filter(({ id }) => resource.id === id)
                .sort((resourceA, resourceB) => {
                    return (
                        RESOURCES_PRIORITY_TO_BE_SHOWN[resourceA.kind] - RESOURCES_PRIORITY_TO_BE_SHOWN[resourceB.kind]
                    );
                });

            const isAlready = acc.find(({ id }) => resource.id === id);

            return isAlready || !sameResourcesSortedByPriorityToBeShown[0]
                ? acc
                : [...acc, sameResourcesSortedByPriorityToBeShown[0]];
        }, []);

        return uniqueResources?.length ? _.orderBy(uniqueResources, "favouriteOrder").slice(0, 6) : [];
    }, [items]);

    return {
        resources,
    };
}
