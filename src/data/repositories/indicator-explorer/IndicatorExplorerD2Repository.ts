import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { IndicatorExplorerContentRepository } from "../../../domain/repositories/indicator-explorer/IndicatorExplorerContentRepository";
import { D2Api } from "../../../types/d2-api";
import { DataValue, getMainPagesContent } from "../common/getMainPagesContent";

const selectCategoryInfoDataElements: Record<string, Id> = {
    title: "h5A4TCDMTHM",
    text: "XVZ0MsAkYaC",
};

const noDataDataElement: Id = "KvLqwZMVyUO";

export class IndicatorExplorerD2Repository implements IndicatorExplorerContentRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<IndicatorExplorerContent> {
        return getMainPagesContent(this.api).map(dataValues => this.buildContent(dataValues));
    }

    private buildContent(dataValues: DataValue[]): IndicatorExplorerContent {
        return {
            selectCategory: {
                title: dataValues.find(dv => dv.dataElement === selectCategoryInfoDataElements.title)?.value || "",
                text: dataValues.find(dv => dv.dataElement === selectCategoryInfoDataElements.text)?.value || "",
            },
            noDataMessage: dataValues.find(dv => dv.dataElement === noDataDataElement)?.value || "",
        };
    }
}
