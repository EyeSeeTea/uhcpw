import { FutureData } from "../../entities/Future";
import { SliderInfo } from "../../entities/country-page/SliderInfo";
import { CountryPageInfoRepository } from "../../repositories/country-page/CountryPageInfoRepository";

export class GetSliderInfoUseCase {
    constructor(private countryPageInfoRepository: CountryPageInfoRepository) {}

    public execute(countryName: string, nameBIH?: string): FutureData<SliderInfo> {
        return this.countryPageInfoRepository.getSliderInfo(countryName, nameBIH);
    }
}
