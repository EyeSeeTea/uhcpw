import { useCallback, useEffect, useState } from "react";

export function useHomeMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 720);
    const [showMobileDialog, setShowMobileDialog] = useState(false);

    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= 720);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            setShowMobileDialog(true);
        } else {
            setShowMobileDialog(false);
        }
    }, [isMobile]);

    const onCloseMobileDialog = useCallback(() => {
        setShowMobileDialog(false);
    }, []);

    return { showMobileDialog, onCloseMobileDialog };
}
