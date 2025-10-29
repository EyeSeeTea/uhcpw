import { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";

import { useCountrySlider } from "../../../pages/country/useCountrySlider";
import { VerticalTabsPanel } from "../../vertical-tabs-panel/VerticalTabsPanel";
import { AccordionPanel } from "../../accordion-panel/AccordionPanel";

type CountrySliderProps = {
    countryId: string;
    resetTab?: boolean;
    handleResetTab: (value: boolean) => void;
    isSmallScreen?: boolean;
};

export const CountrySlider: React.FC<CountrySliderProps> = props => {
    const { countryId, resetTab, handleResetTab, isSmallScreen = false } = props;
    const { tabValue, handleTabChange, sliderConfigs, expandedSliderConfig, handleAccordionChange, onResetSlider } =
        useCountrySlider(countryId);

    useEffect(() => {
        if (resetTab) {
            onResetSlider();
            handleResetTab(false);
        }
    }, [handleResetTab, onResetSlider, resetTab]);

    useEffect(() => {
        if (!isSmallScreen || !expandedSliderConfig) return;

        const timer = setTimeout(() => {
            const accordion = document.getElementById(
                `${expandedSliderConfig.tab}-${expandedSliderConfig.tabTitle}-header`
            );
            accordion?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 380);
        return () => {
            clearTimeout(timer);
        };
    }, [expandedSliderConfig, isSmallScreen]);

    if (!countryId || sliderConfigs.length === 0) return <CircularProgress />;

    return isSmallScreen ? (
        <AccordionPanel
            configs={sliderConfigs}
            expandedConfig={expandedSliderConfig}
            handleAccordionChange={handleAccordionChange}
        />
    ) : (
        <VerticalTabsPanel
            tabsConfig={sliderConfigs}
            tabValue={tabValue}
            onChangeTabValue={handleTabChange}
            ariaLabel="country-page-slider"
        />
    );
};
