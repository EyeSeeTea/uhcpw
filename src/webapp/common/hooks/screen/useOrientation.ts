import * as React from "react";

type Orientation = "portrait" | "landscape";
type MediaQueryListWithListener = MediaQueryList & {
    addListener: (cb: () => void) => void;
    removeListener: (cb: () => void) => void;
};

function getOrientation(): Orientation {
    if (typeof window === "undefined") return "portrait";
    return window.matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait";
}

export function useOrientation() {
    const [orientation, setOrientation] = React.useState<Orientation>(() => getOrientation());

    React.useEffect(() => {
        const update = () => setOrientation(getOrientation());

        window.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);

        const mql = window.matchMedia("(orientation: landscape)");
        const onMqlChange = () => update();

        // Modern browsers
        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", onMqlChange);
        } else {
            // Legacy Safari / older browsers
            (mql as MediaQueryListWithListener).addListener(onMqlChange);
        }

        update();

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);

            if (typeof mql.removeEventListener === "function") {
                mql.removeEventListener("change", onMqlChange);
            } else {
                (mql as MediaQueryListWithListener).removeListener(onMqlChange);
            }
        };
    }, []);

    return orientation;
}
