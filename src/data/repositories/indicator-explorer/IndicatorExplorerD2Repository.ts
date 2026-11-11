import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { IndicatorExplorerContentRepository } from "../../../domain/repositories/indicator-explorer/IndicatorExplorerContentRepository";
import { D2Api } from "../../../types/d2-api";
import {
    buildInfoBoxContent,
    DataValue,
    getMainPagesContent,
    InfoBoxDataElements,
} from "../common/getMainPagesContent";

const selectCategoryInfoDataElements: InfoBoxDataElements = {
    title: "h5A4TCDMTHM",
    text: "XVZ0MsAkYaC",
};

const dataSourcesInfoDataElements: InfoBoxDataElements = {
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
        return {
            selectCategory: buildInfoBoxContent(dataValues, selectCategoryInfoDataElements),
            dataSourcesAndAvailability: buildInfoBoxContent(dataValues, dataSourcesInfoDataElements),
            noDataMessage: dataValues.find(dv => dv.dataElement === noDataDataElement)?.value || "",
        };
    }
}
