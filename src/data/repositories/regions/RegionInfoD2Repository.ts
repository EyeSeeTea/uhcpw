import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { RegionInfo } from "../../../domain/entities/region/RegionInfo";
import { RegionInfoRepository } from "../../../domain/repositories/region/RegionInfoRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const REGION_INFO_PROGRAM_ID = "XAoS3zq3bZg";

const REGION_INFO_DATA_ELEMENT_IDS = {
    mainMapPanel: {
        title: "SfkPMilMktT",
        description: "sOtI7SGMhsT",
    },
    numbersPanelTitles: {
        panelOne: "DumylnVyci4",
        panelTwo: "r5eemGxoRS6",
        panelThree: "OBInDvcfyQZ",
        panelFour: "vel3QNcSAlE",
        panelFive: "MCTHdjhXfwc",
        panelSix: "Vt8NxwcFltu",
        panelSeven: "vfTkIQpg9hq",
    },
} as const;

export class RegionInfoD2Repository implements RegionInfoRepository {
    constructor(private api: D2Api) {}

    public get(regionOrgUnitId: Id): FutureData<RegionInfo> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: REGION_INFO_PROGRAM_ID,
                orgUnit: regionOrgUnitId,
            })
        ).flatMap(response => {
            if (!response.events[0]) {
                return Future.error("An error has ocurred fetching region info");
            }
            const info = this.buildRegionInfo(response.events[0]);
            return Future.success(info);
        });
    }

    private buildRegionInfo(event: D2Event): RegionInfo {
        const getDataValue = (dataElementId: Id): string =>
            event.dataValues.find(dv => dv.dataElement === dataElementId)?.value || "";

        return {
            mainMapPanelContent: {
                title: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.mainMapPanel.title),
                description: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.mainMapPanel.description),
            },
            numbersPanelTitles: {
                panelOne: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelOne),
                panelTwo: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelTwo),
                panelThree: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelThree),
                panelFour: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFour),
                panelFive: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFive),
                panelSix: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSix),
                panelSeven: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSeven),
            },
        };
    }
}

const eventsFields = {
    event: true,
    orgUnit: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export type D2Event = {
    event: string;
    orgUnit: string;
    dataValues: DataValue[];
    eventDate: string;
};

export type DataValue = {
    dataElement: string;
    value: string;
};
