import { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";

import { useCountrySlider } from "../../../pages/country/useCountrySlider";
import { VerticalTabsPanel } from "../../vertical-tabs-panel/VerticalTabsPanel";

export const DesktopSlider: React.FC<{
    countryId: string;
    resetTab?: boolean;
    handleResetTab: (value: boolean) => void;
}> = ({ countryId, handleResetTab, resetTab = false }) => {
    const { tabValue, handleTabChange, onResetTab, sliderConfigs } = useCountrySlider(countryId);

    useEffect(() => {
        if (resetTab) {
            onResetTab();
            handleResetTab(false);
        }
    }, [handleResetTab, onResetTab, resetTab]);

    if (!countryId || sliderConfigs.length === 0) return <CircularProgress />;

    return (
        <VerticalTabsPanel
            tabsConfig={sliderConfigs}
            tabValue={tabValue}
            onChangeTabValue={handleTabChange}
            ariaLabel="country-page-slider"
        />
    );
};
