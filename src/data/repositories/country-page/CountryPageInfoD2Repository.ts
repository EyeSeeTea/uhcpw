import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { SliderInfo } from "../../../domain/entities/country-page/SliderInfo";
import { CountryPageInfoRepository } from "../../../domain/repositories/country-page/CountryPageInfoRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const sliderInfoProgram = "ai5rB7mcqHH";

const sliderInfoDataElements: Record<string, Id> = {
    sliderOne: "AM4wvFj31yu",
    sliderTwo: "Ifdsw5JqjzJ",
    sliderThree: "YYxAoMDpCp8",
    sliderFour: "cdRt1CWMZUY",
    sliderFive: "sICvMAAy9SS",
    sliderSix: "zrRiDQtns3m",
    sliderSeven: "sCobTF9m297",
    sliderEight: "zZ2s2fZv3x8",
    sliderNine: "E5k0QrzhOC1",
    sliderTen: "VPK5gfA0gZS",
    sliderEleven: "Br8gF2la6Sq",
};

export class CountryPageInfoD2Repository implements CountryPageInfoRepository {
    constructor(private api: D2Api) {}

    getSliderInfo(countryName: string): FutureData<SliderInfo> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: sliderInfoProgram,
            })
        ).flatMap(response => {
            if (response.events[0]) {
                return Future.success(this.buildSliderInfo(countryName, response.events[0]));
            }
            return Future.error("An error has ocurred fetching slider info");
        });
    }

    private buildSliderInfo(countryName: string, event: D2Event): SliderInfo {
        return {
            sliderOne:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderOne)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderTwo:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderTwo)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderThree:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderThree)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderFour:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderFour)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderFive:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderFive)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderSix:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderSix)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderSeven:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderSeven)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderEight:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderEight)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderNine:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderNine)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderTen:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderTen)
                    ?.value.replace(/<country>/g, countryName) || "",
            sliderEleven:
                event?.dataValues
                    ?.find(dv => dv.dataElement === sliderInfoDataElements.sliderEleven)
                    ?.value.replace(/<country>/g, countryName) || "",
        };
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

interface DataValue {
    dataElement: string;
    value: string;
}
