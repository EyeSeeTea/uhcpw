import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { IndicatorExplorerContentRepository } from "../../../domain/repositories/indicator-explorer/IndicatorExplorerContentRepository";
import { D2Api } from "../../../types/d2-api";
import { DataValue, getMainPagesContent } from "../common/getMainPagesContent";

const selectCategoryInfoDataElements: Readonly<Record<"title" | "text", Id>> = {
    title: "h5A4TCDMTHM",
    text: "XVZ0MsAkYaC",
};

const dataSourcesInfoDataElements: Readonly<Record<"title" | "text", Id>> = {
    title: "UD3RlPzN605",
    text: "EVfINfwONps",
};

const noDataDataElement: Id = "KvLqwZMVyUO";

export class IndicatorExplorerD2Repository implements IndicatorExplorerContentRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<IndicatorExplorerContent> {
        return getMainPagesContent(this.api).map(dataValues => this.buildContent(dataValues));
    }

    private buildContent(dataValues: ReadonlyArray<DataValue>): IndicatorExplorerContent {
        const getValue = (dataElement: Id): string | undefined =>
            dataValues.find(dv => dv.dataElement === dataElement)?.value;

        return {
            selectCategory: {
                title: getValue(selectCategoryInfoDataElements.title) || "",
                text: getValue(selectCategoryInfoDataElements.text) || "",
            },
            dataSourcesAndAvailability: {
                title: getValue(dataSourcesInfoDataElements.title) || "",
                text: getValue(dataSourcesInfoDataElements.text) || "",
            },
            noDataMessage: getValue(noDataDataElement) || "",
        };
    }
}
