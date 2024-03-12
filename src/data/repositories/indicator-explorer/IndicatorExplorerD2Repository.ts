import { FutureData, Future } from "../../../domain/entities/Future";
import { IndicatorExplorerSelectCategoryInfo } from "../../../domain/entities/indicator-explorer/IndicatorExplorer";
import { IndicatorExplorerRepository } from "../../../domain/repositories/indicator-explorer/IndicatorExplorerRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const selectCategoryInfoProgram = "ai5rB7mcqHH";

const selectCategoryInfoDataElements: IndicatorExplorerSelectCategoryInfo = {
    title: "h5A4TCDMTHM",
    text: "XVZ0MsAkYaC",
};

export class IndicatorExplorerD2Repository implements IndicatorExplorerRepository {
    constructor(private api: D2Api) {}

    getSelectCategoryInfo(): FutureData<IndicatorExplorerSelectCategoryInfo> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: selectCategoryInfoProgram,
            })
        ).flatMap(response => {
            if (response.events[0]) {
                return Future.success(this.buildSelectCategoryInfo(response.events[0]));
            }
            return Future.error("An error has ocurred fetching Select Category Info");
        });
    }

    private buildSelectCategoryInfo(event: D2Event): IndicatorExplorerSelectCategoryInfo {
        return {
            title: event?.dataValues?.find(dv => dv.dataElement === selectCategoryInfoDataElements.title)?.value || "",
            text: event?.dataValues?.find(dv => dv.dataElement === selectCategoryInfoDataElements.text)?.value || "",
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
