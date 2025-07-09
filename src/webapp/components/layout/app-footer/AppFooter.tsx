import React from "react";

import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { MobileAppFooter } from "./MobileAppFooter";
import { DesktopAppFooter } from "./DesktopAppFooter";

export const AppFooter: React.FC = () => {
    const isSmallScreen = useIsSmallScreen();

    return isSmallScreen ? <MobileAppFooter /> : <DesktopAppFooter />;
};
