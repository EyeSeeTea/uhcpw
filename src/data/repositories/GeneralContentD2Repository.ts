import { Future, FutureData } from "../../domain/entities/Future";
import { GeneralContent } from "../../domain/entities/GeneralContent";
import { GeneralContentRepository } from "../../domain/repositories/GeneralContentRepository";
import { D2Api } from "../../types/d2-api";
import { DataValue, getMainPagesContent } from "./common/getMainPagesContent";
import { getMethodsProgramEvent } from "./common/getMethodsProgramEvent";
import { Maybe } from "../../types/utils";

const mainPageDataElements = {
    footerDisclaimer: "zCBDjsjnsC0",
    aboutUsTitle: "gYzFGI0mMLQ",
    aboutUsSubtitle: "aY5eSBLrOMc",
    cookiesPolicyUrl: "FQr8rUGtOVC",
} as const;

const methodProgramDataElements = {
    abbreviationsFile: "xSn2Dh8uFGT",
    glossaryFile: "PEgZ92ijQMJ",
} as const;

const regionalPageMobilePopUpDataElements = {
    disclaimer: "jp8z6xMOMh3",
    disclaimerButtonText: "IoywoGPlD3X",
    disclaimerUrl: "qj7OHq9zy30",
} as const;

export class GeneralContentD2Repository implements GeneralContentRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<GeneralContent> {
        return Future.joinObj({
            mainPageContent: getMainPagesContent(this.api),
            methodsEvent: getMethodsProgramEvent(this.api),
        }).flatMap(results => this.buildGeneralContent(results));
    }

    buildGeneralContent(results: {
        mainPageContent: DataValue[];
        methodsEvent: Maybe<D2Event>;
    }): FutureData<GeneralContent> {
        const { mainPageContent, methodsEvent } = results;

        return Future.success({
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
            abbreviations: {
                url: this.getFileUrl(methodsEvent, methodProgramDataElements.abbreviationsFile),
            },
            glossary: {
                url: this.getFileUrl(methodsEvent, methodProgramDataElements.glossaryFile),
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
        });
    }

    getFileUrl(event: Maybe<D2Event>, fieldId: string): Maybe<string> {
        if (!event) return undefined;
        const url = `${this.api.baseUrl}/api/events/files?dataElementUid=${fieldId}&eventUid=${event.event}`;

        return url;
    }
}

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}
