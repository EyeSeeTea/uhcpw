import { useState, useEffect, useCallback } from "react";

function useWindowSize(ignoreScrollbar = false) {
    const getWidth = useCallback(
        () => (ignoreScrollbar ? document.documentElement.clientWidth : window.innerWidth),
        [ignoreScrollbar]
    );

    const [windowSize, setWindowSize] = useState(() => ({
        width: getWidth(),
        height: window.innerHeight,
    }));

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: getWidth(),
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [getWidth]);

    return windowSize;
}

export default useWindowSize;
