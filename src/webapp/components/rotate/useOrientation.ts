import { useEffect, useState } from "react";

const getOrientation = (): "portrait" | "landscape" =>
    window.innerWidth > window.innerHeight ? "landscape" : "portrait";

export function useOrientation(): "portrait" | "landscape" {
    const [orientation, setOrientation] = useState(getOrientation());

    useEffect(() => {
        const handleResize = () => setOrientation(getOrientation());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return orientation;
}
