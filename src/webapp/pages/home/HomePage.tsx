import React from "react";

import { Layout } from "../../components/layout/Layout";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { MobileHomePage } from "./MobileHomePage";
import { DesktopHomePage } from "./DesktopHomePage";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";

export const HomePage: React.FC = React.memo(() => {
    const { sendPageView } = useAnalytics();
    const isSmallScreen = useIsSmallScreen();

    React.useEffect(() => {
        sendPageView({ title: "Homepage" });
    }, [sendPageView]);

    return <Layout>{isSmallScreen ? <MobileHomePage /> : <DesktopHomePage />}</Layout>;
});
