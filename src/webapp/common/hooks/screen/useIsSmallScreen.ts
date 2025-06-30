import { useEffect, useState } from "react";

export const BREAKPOINT_WIDTH_SMALL_SCREEN = 960;

export function useIsSmallScreen(): boolean {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < BREAKPOINT_WIDTH_SMALL_SCREEN);

    const handleWindowSizeChange = () => {
        setIsSmallScreen(window.innerWidth < BREAKPOINT_WIDTH_SMALL_SCREEN);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    return isSmallScreen;
}
