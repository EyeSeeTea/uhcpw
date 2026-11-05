import { FutureData } from "../../domain/entities/Future";
import { GeneralContent } from "../../domain/entities/GeneralContent";
import { GeneralContentRepository } from "../../domain/repositories/GeneralContentRepository";
import { D2Api } from "../../types/d2-api";
import { getMainPagesContent } from "./common/getMainPagesContent";

const mainPageDataElements = {
    footerDisclaimer: "zCBDjsjnsC0",
    aboutUsTitle: "gYzFGI0mMLQ",
    aboutUsSubtitle: "aY5eSBLrOMc",
    cookiesPolicyUrl: "FQr8rUGtOVC",
} as const;

const regionalPageMobilePopUpDataElements = {
    disclaimer: "jp8z6xMOMh3",
    disclaimerButtonText: "IoywoGPlD3X",
    disclaimerUrl: "qj7OHq9zy30",
} as const;

export class GeneralContentD2Repository implements GeneralContentRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<GeneralContent> {
        return getMainPagesContent(this.api).map(mainPageContent => ({
            footer: {
                disclaimer:
                    mainPageContent.find(dv => dv.dataElement === mainPageDataElements.footerDisclaimer)?.value || "",
            },
            aboutUs: {
                title: mainPageContent.find(dv => dv.dataElement === mainPageDataElements.aboutUsTitle)?.value || "",
                subtitle:
                    mainPageContent.find(dv => dv.dataElement === mainPageDataElements.aboutUsSubtitle)?.value || "",
            },
            cookies: {
                policyUrl:
                    mainPageContent.find(dv => dv.dataElement === mainPageDataElements.cookiesPolicyUrl)?.value || "",
            },
            regionalPageMobilePopUp: {
                disclaimer:
                    mainPageContent.find(dv => dv.dataElement === regionalPageMobilePopUpDataElements.disclaimer)
                        ?.value || "",
                buttonText:
                    mainPageContent.find(
                        dv => dv.dataElement === regionalPageMobilePopUpDataElements.disclaimerButtonText
                    )?.value || "",
                url:
                    mainPageContent.find(dv => dv.dataElement === regionalPageMobilePopUpDataElements.disclaimerUrl)
                        ?.value || "",
            },
        }));
    }
}
