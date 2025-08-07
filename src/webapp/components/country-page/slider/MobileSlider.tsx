import React, { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";

import { useCountrySlider } from "../../../pages/country/useCountrySlider";
import { AccordionPanel } from "../../accordion-panel/AccordionPanel";

export const MobileSlider: React.FC<{
    countryId: string;
}> = ({ countryId }) => {
    const { sliderConfigs, expandedSliderConfig, handleAccordionChange } = useCountrySlider(countryId);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!expandedSliderConfig) return;
            const accordion = document.getElementById(
                `${expandedSliderConfig.tab}-${expandedSliderConfig.tabTitle}-header`
            );
            accordion?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 380);
        return () => {
            clearTimeout(timer);
        };
    }, [expandedSliderConfig]);

    if (!countryId || sliderConfigs.length === 0) return <CircularProgress />;

    return (
        <AccordionPanel
            configs={sliderConfigs}
            expandedConfig={expandedSliderConfig}
            handleAccordionChange={handleAccordionChange}
        />
    );
};
