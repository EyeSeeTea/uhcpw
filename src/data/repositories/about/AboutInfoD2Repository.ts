import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { OfficeInfo } from "../../../domain/entities/about/OfficeInfo";
import { AboutInfoRepository } from "../../../domain/repositories/about/AboutInfoRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const aboutInfoProgram = "ai5rB7mcqHH";

const officeInfoDataElements: Record<string, Id> = {
    officeText: "DxSdmDJ2zZW",
    officeVideo: "m9RpeQUFCP1",
    officeImage: "fIrafA0Qbh3",
};

export class AboutInfoD2Repository implements AboutInfoRepository {
    constructor(private api: D2Api) {}

    getOfficeInfo(): FutureData<OfficeInfo> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: aboutInfoProgram,
            })
        ).flatMap(response => {
            if (response.events[0]) {
                return Future.success(this.buildOfficeInfo(response.events[0]));
            }
            return Future.error("An error has ocurred fetching office info");
        });
    }

    private buildOfficeInfo(event: D2Event): OfficeInfo {
        return {
            officeText:
                event?.dataValues?.find(dv => dv.dataElement === officeInfoDataElements.officeText)?.value || "",
            officeVideo:
                event?.dataValues?.find(dv => dv.dataElement === officeInfoDataElements.officeVideo)?.value || "",
            officeImage: `${this.api.baseUrl}/api/events/files?dataElementUid=${officeInfoDataElements.officeImage}&eventUid=${event?.event}`,
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
