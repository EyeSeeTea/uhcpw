import { SlideGraph } from "./SlideGraph";
import { SliderGraphConfig, SliderInfoConfig } from "../../../pages/country/useCountrySlider";
import { SlideInfo } from "./SlideInfo";
import { Id } from "../../../../domain/entities/Ref";

type MobileSliderProps = {
    countryId: Id;
    expandedSliderConfig: SliderGraphConfig | SliderInfoConfig;
};

export const MobileSliderContent: React.FC<MobileSliderProps> = props => {
    const { expandedSliderConfig, countryId } = props;

    switch (expandedSliderConfig.kind) {
        case "graph":
            return (
                <SlideGraph
                    title={expandedSliderConfig.tabTitle}
                    graphOne={expandedSliderConfig.graphOne}
                    graphTwo={expandedSliderConfig.graphTwo}
                    countryId={countryId}
                    isMobile
                />
            );
        case "info":
            return expandedSliderConfig?.sliderContent ? (
                <SlideInfo
                    sliderInfo={expandedSliderConfig?.sliderContent}
                    titleColor={expandedSliderConfig.titleColor}
                    icon={expandedSliderConfig.icon}
                />
            ) : null;
    }
};
