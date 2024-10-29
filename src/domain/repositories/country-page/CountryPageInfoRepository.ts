import { FutureData } from "../../entities/Future";
import { SliderInfo } from "../../entities/country-page/SliderInfo";

export interface CountryPageInfoRepository {
    getSliderInfo(countryName: string, nameBIH?: string): FutureData<SliderInfo>;
}
