import { useEffect } from "react";

export function useRealViewportHeight() {
    useEffect(() => {
        const setVH = () => {
            const vh = window.visualViewport?.height || window.innerHeight;
            const vw = window.visualViewport?.width || window.innerWidth;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
            document.documentElement.style.setProperty("--vw", `${vw}px`);
        };

        setVH();

        window.visualViewport?.addEventListener("resize", setVH);
        window.visualViewport?.addEventListener("scroll", setVH);
        window.addEventListener("orientationchange", setVH);

        return () => {
            window.visualViewport?.removeEventListener("resize", setVH);
            window.visualViewport?.removeEventListener("scroll", setVH);
            window.removeEventListener("orientationchange", setVH);
        };
    }, []);
}
