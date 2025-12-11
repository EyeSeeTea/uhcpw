import React, { MutableRefObject, useState } from "react";
import { Maybe } from "../../../types/utils";

type UseSidePanelWidthProps = {
    ref: MutableRefObject<HTMLDivElement | null>;
    countryId: Maybe<string>;
};

export function useSidePanelWidth(props: UseSidePanelWidthProps) {
    const { ref, countryId } = props;
    const [sidePanelWidth, setSidePanelWidth] = useState<Maybe<number>>(undefined);

    React.useEffect(() => {
        if (!ref.current && !countryId) return;

        const refElement = ref.current;
        const firstDiv = refElement?.children[0];
        const element = firstDiv?.children[0];
        if (!(element instanceof HTMLElement)) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.borderBoxSize[0]?.inlineSize;
                setSidePanelWidth(width);
            }
        });

        observer.observe(element);

        setSidePanelWidth(element.offsetWidth);

        return () => {
            observer.disconnect();
        };
    }, [ref, countryId]);

    return sidePanelWidth;
}
