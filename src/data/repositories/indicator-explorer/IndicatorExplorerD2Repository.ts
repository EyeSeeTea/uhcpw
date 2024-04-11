import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { IndicatorExplorerSelectCategoryInfo } from "../../../domain/entities/indicator-explorer/IndicatorExplorer";
import { IndicatorExplorerRepository } from "../../../domain/repositories/indicator-explorer/IndicatorExplorerRepository";
import { D2Api } from "../../../types/d2-api";
import { DataValue, getMainPagesContent } from "../common/getMainPagesContent";

const selectCategoryInfoDataElements: Record<string, Id> = {
    title: "h5A4TCDMTHM",
    text: "XVZ0MsAkYaC",
};

export class IndicatorExplorerD2Repository implements IndicatorExplorerRepository {
    constructor(private api: D2Api) {}

    getSelectCategoryInfo(): FutureData<IndicatorExplorerSelectCategoryInfo> {
        return getMainPagesContent(this.api).map(dataValues => this.buildSelectCategoryInfo(dataValues));
    }

    private buildSelectCategoryInfo(dataValues: DataValue[]): IndicatorExplorerSelectCategoryInfo {
        return {
            title: dataValues.find(dv => dv.dataElement === selectCategoryInfoDataElements.title)?.value || "",
            text: dataValues.find(dv => dv.dataElement === selectCategoryInfoDataElements.text)?.value || "",
        };
    }
}
