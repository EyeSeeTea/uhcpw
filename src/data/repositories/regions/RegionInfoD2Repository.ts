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
    // TODO: add real data element IDs here for titles
    numbersPanelTitles: {
        panelOneTitle: "DumylnVyci4",
        panelOneGraphOneText: "DumylnVyci4",

        panelTwoTitle: "r5eemGxoRS6",
        panelTwoGraphOneText: "r5eemGxoRS6",

        panelThree: "OBInDvcfyQZ",
        panelThreeGraphOneText: "OBInDvcfyQZ",
        panelThreeGraphTwoText: "OBInDvcfyQZ",

        panelFour: "vel3QNcSAlE",
        panelFourGraphOneText: "vel3QNcSAlE",
        panelFourGraphTwoText: "vel3QNcSAlE",

        panelFive: "MCTHdjhXfwc",
        panelFiveGraphOneText: "MCTHdjhXfwc",
        panelFiveGraphTwoText: "MCTHdjhXfwc",
        panelFiveGraphThreeText: "MCTHdjhXfwc",

        panelSix: "Vt8NxwcFltu",
        panelSixGraphOneText: "Vt8NxwcFltu",
        panelSixGraphTwoText: "Vt8NxwcFltu",
        panelSixGraphThreeText: "Vt8NxwcFltu",
        panelSixGraphFourText: "Vt8NxwcFltu",
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
            numbersPanelContent: {
                panelOneTitle: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelOneTitle),
                panelOneGraphOneText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelOneGraphOneText
                ),

                panelTwoTitle: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelTwoTitle),
                panelTwoGraphOneText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelTwoGraphOneText
                ),

                panelThreeTitle: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelThree),
                panelThreeGraphOneText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelThreeGraphOneText
                ),
                panelThreeGraphTwoText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelThreeGraphTwoText
                ),

                panelFourTitle: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFour),
                panelFourGraphOneText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFourGraphOneText
                ),
                panelFourGraphTwoText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFourGraphTwoText
                ),

                panelFiveTitle: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFive),
                panelFiveGraphOneText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFiveGraphOneText
                ),
                panelFiveGraphTwoText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFiveGraphTwoText
                ),
                panelFiveGraphThreeText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelFiveGraphThreeText
                ),

                panelSixTitle: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSix),
                panelSixGraphOneText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSixGraphOneText
                ),
                panelSixGraphTwoText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSixGraphTwoText
                ),
                panelSixGraphThreeText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSixGraphThreeText
                ),
                panelSixGraphFourText: getDataValue(
                    REGION_INFO_DATA_ELEMENT_IDS.numbersPanelTitles.panelSixGraphFourText
                ),
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
