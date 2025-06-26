import { Future, FutureData } from "../../domain/entities/Future";
import { GeneralContent } from "../../domain/entities/GeneralContent";
import { GeneralContentRepository } from "../../domain/repositories/GeneralContentRepository";
import { D2Api } from "../../types/d2-api";
import { DataValue, getMainPagesContent } from "./common/getMainPagesContent";
import { getMethodsProgramEvent } from "./common/getMethodsProgramEvent";
import { File } from "../../domain/entities/GeneralContent";
import { apiToFuture } from "../../utils/futures";
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

        return Future.joinObj({
            abbreviationsFile: this.getFileDataFromField(methodsEvent, methodProgramDataElements.abbreviationsFile),
            glossaryFile: this.getFileDataFromField(methodsEvent, methodProgramDataElements.glossaryFile),
        }).map(
            ({ abbreviationsFile, glossaryFile }: { abbreviationsFile: Maybe<File>; glossaryFile: Maybe<File> }) => ({
                footer: {
                    disclaimer:
                        mainPageContent.find(dv => dv.dataElement === mainPageDataElements.footerDisclaimer)?.value ||
                        "",
                },
                aboutUs: {
                    title:
                        mainPageContent.find(dv => dv.dataElement === mainPageDataElements.aboutUsTitle)?.value || "",
                    subtitle:
                        mainPageContent.find(dv => dv.dataElement === mainPageDataElements.aboutUsSubtitle)?.value ||
                        "",
                },
                cookies: {
                    policyUrl:
                        mainPageContent.find(dv => dv.dataElement === mainPageDataElements.cookiesPolicyUrl)?.value ||
                        "",
                },
                abbreviations: {
                    file: abbreviationsFile,
                },
                glossary: {
                    file: glossaryFile,
                },
            })
        );
    }

    getFileDataFromField(event: Maybe<D2Event>, fieldId: string): FutureData<Maybe<File>> {
        if (!event) return Future.success(undefined);

        const fileId = event?.dataValues.find(dv => dv.dataElement === fieldId)?.value;
        if (!fileId) return Future.success(undefined);

        return Future.joinObj({
            fileResource: apiToFuture(this.api.get<D2FileResource>(`/fileResources/${fileId}`)),
            blob: apiToFuture(
                this.api.request<Blob>({
                    method: "get",
                    url: `/events/files`,
                    params: {
                        eventUid: event.event,
                        dataElementUid: fieldId,
                    },
                    responseDataType: "raw",
                })
            ),
        }).map(({ blob, fileResource }) => ({
            content: blob,
            name: fileResource.name,
            contentType: fileResource.contentType,
        }));
    }
}

type D2FileResource = {
    name: string;
    contentType: string;
};

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}
