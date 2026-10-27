import { useMemo } from "react";
import i18n from "../../../../locales";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { ResourceItemTag } from "./SimpleResourceItem";

export function useCategoryTags(
    kind: Resource["kind"],
    onTagClick: (url: string) => void
): ReadonlyArray<ResourceItemTag> {
    return useMemo(
        () => [{ name: getCategoryName(kind), onClick: () => onTagClick(`/resources/${kind}`) }],
        [kind, onTagClick]
    );
}

function getCategoryName(kind: Resource["kind"]): string {
    switch (kind) {
        case "comparative-analysis":
            return i18n.t("Comparative analysis");
        case "country-analysis":
            return i18n.t("Country or area analysis");
        case "news":
            return i18n.t("News");
        case "multimedia":
            return i18n.t("Multimedia");
    }
}
