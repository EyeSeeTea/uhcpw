import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    IndicatorExplorerContent,
    InfoBoxContent,
} from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
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

const dataSourcesInfoFallback: InfoBoxContent = {
    title: "Data sources and availability",
    text: [
        "Data on financial hardship are calculated using microdata from national household budget surveys. We update these indicators as regularly as we can, but please note that not all national statistical offices conduct annual surveys, share microdata or share them with international researchers. Also, microdata are usually only available 1-2 years after a survey has been completed. _Sign up for updates or contact us by email if you’re interested in data availability for a particular country or area_.",
        "Data on unmet need are from Eurostat.",
        "Data on health spending (health accounts) are from the WHO Global Health Expenditure Database and OECD Health Statistics.",
    ].join("\n\n"),
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
                title: getValue(dataSourcesInfoDataElements.title) || dataSourcesInfoFallback.title,
                text: getValue(dataSourcesInfoDataElements.text) || dataSourcesInfoFallback.text,
            },
            noDataMessage: getValue(noDataDataElement) || "",
        };
    }
}
