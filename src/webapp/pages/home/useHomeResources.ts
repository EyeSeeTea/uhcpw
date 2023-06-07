import _ from "lodash";
import { useMemo } from "react";

import { useResourcesByType } from "../resources/by-type/useResourcesByType";

export function useHomeResources() {
    const { items } = useResourcesByType({});

    const resources = useMemo(() => {
        return items
            ? _.orderBy(
                  items.filter(item => item.favourite),
                  "favouriteOrder"
              ).slice(0, 6)
            : [];
    }, [items]);

    return {
        resources,
    };
}
