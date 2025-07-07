import { useEffect, useState } from "react";

export function useViewportKey(): number {
    const [key, setKey] = useState(0);

    useEffect(() => {
        const update = () => setKey(Date.now());
        window.visualViewport?.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);
        return () => {
            window.visualViewport?.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);
        };
    }, []);

    return key;
}
