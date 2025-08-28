import { useEffect, useState } from "react";

export const BREAKPOINT_WIDTH_SMALL_SCREEN = 960;
export const BREAKPOINT_WIDTH_MOBILE_SCREEN = 600;
const mediaQuery = `(max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px)`;

export function useIsSmallScreen(): boolean {
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia(mediaQuery).matches);

    useEffect(() => {
        const mql = window.matchMedia(mediaQuery);

        const handler = (event: MediaQueryListEvent) => {
            setIsSmallScreen(event.matches);
        };

        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return isSmallScreen;
}
