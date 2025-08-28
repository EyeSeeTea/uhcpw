import { SlideGraph } from "./SlideGraph";
import { SliderGraphConfig, SliderInfoConfig } from "../../../pages/country/useCountrySlider";
import { SlideInfo } from "./SlideInfo";
import { Id } from "../../../../domain/entities/Ref";

type MobileSliderProps = {
    countryId: Id;
    config: SliderGraphConfig | SliderInfoConfig;
};

export const MobileSliderContent: React.FC<MobileSliderProps> = props => {
    const { config, countryId } = props;

    switch (config.kind) {
        case "graph":
            return (
                <SlideGraph
                    title={config.tabTitle}
                    graphOne={config.graphOne}
                    graphTwo={config.graphTwo}
                    countryId={countryId}
                    isMobile
                />
            );
        case "info":
            return config?.sliderContent ? (
                <SlideInfo sliderInfo={config?.sliderContent} titleColor={config.titleColor} icon={config.icon} />
            ) : null;
    }
};
