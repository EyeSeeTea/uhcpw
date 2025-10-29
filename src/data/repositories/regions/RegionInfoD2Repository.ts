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
} as const;

const REGION_CONTENT_PROGRAM_ID = "ai5rB7mcqHH";
const REGION_CONTENT_OU_ID = "H8RixfF8ugH";

const REGION_CONTENT_DATA_ELEMENT_IDS = {
    numbersPanel: {
        panelOneTitle: "DumylnVyci4",
        panelOneGraphOneText: "JCZm0rnQ54f",

        panelTwoTitle: "r5eemGxoRS6",
        panelTwoGraphOneText: "WvrLV5w1ukz",

        panelThree: "OBInDvcfyQZ",
        panelThreeGraphOneText: "nkhaDCLS2oe",
        panelThreeGraphTwoText: "zvW54GZzxcJ",

        panelFour: "vel3QNcSAlE",
        panelFourGraphOneText: "YxXbNUMaJGt",
        panelFourGraphTwoText: "VFZzHUlrL9F",

        panelFive: "MCTHdjhXfwc",
        panelFiveGraphOneText: "Y2ZKVlVGlSQ",
        panelFiveGraphTwoText: "vznlgYGtLgG",
        panelFiveGraphThreeText: "KRVzyf3td9q",

        panelSix: "Vt8NxwcFltu",
        panelSixGraphOneText: "WaMKgJ1NU9e",
        panelSixGraphTwoText: "cDYD3dcJjZu",
        panelSixGraphThreeText: "s8Ivd41Vvh3",
        panelSixGraphFourText: "ZCUrjpW0fbb",
    },

    gapsInCoverage: {
        panelOneTitle: "e59fFgkjhER",
        panelOneMainText: "jgwGv2n4EEV",
        panelOneChartOne: "Txk6wSYhp8a",
        panelOneChartOneText: "rrZDKiSnDLV",
        panelOneProgressText: "B55J0e89NwS",

        panelTwoTitle: "USiuNuuWhsE",
        panelTwoMainText: "RkiDXRJWd16",
        panelTwoChartOne: "bRqNhaWOQhJ",
        panelTwoChartOneText: "J6yMdOrUCwe",
        panelTwoProgressText: "cGZMm9LsO0A",

        panelThreeTitle: "kK1KJ3gplux",
        panelThreeMainText: "VpB8DwK3GLJ",
        panelThreeChartOne: "AiQgw1HTjfR",
        panelThreeChartOneText: "p15rbYNnCer",
        panelThreeProgressText: "AZqM9ptgmJH",

        panelFourTitle: "Dhy6vrFAc6j",
        panelFourMainText: "QlQM7KAKfZL",
        panelFourChartOne: "hT7zRrbSDuC",
        panelFourChartOneText: "nSluLzIddRh",
        panelFourProgressText: "KNz0kaepR0x",

        panelFiveTitle: "xRmzOo2Dqfq",
        panelFiveMainText: "X0t0vBxl9fH",
        panelFiveChartOne: "A7tDGH1PS2k",
        panelFiveChartOneText: "b4g0Utr2DkD",
        panelFiveChartTwo: "rbenCnH0Lyv",
        panelFiveChartTwoText: "pgCFN1rGP5b",
        panelFiveChartThree: "ieuaAh9kyBr",
        panelFiveChartThreeText: "WDQeN8NYbiB",
        panelFiveProgressText: "DGcHpFfH9mj",

        panelSixTitle: "iS7XZlaQotB",
        panelSixMainText: "vZXXyyImuqF",
        panelSixChartOne: "qHQ41g7EPHB",
        panelSixChartOneText: "bpv0gDZAA1w",
        panelSixProgressText: "T3C9twBZ1H4",

        panelSevenTitle: "JyhAK2RHKvc",
        panelSevenMainText: "kJx7fxSvuXV",
        panelSevenChartOne: "CbTDJDbbGgP",
        panelSevenChartOneText: "R6yJSLJ1euk",
        panelSevenProgressText: "JlApFbAchYK",
    },

    policyChecklist: {
        textSectionLeft: "oXGUkxIIvHM",
        textSectionRight: "lLNV31zJEIZ",
    },
} as const;

export class RegionInfoD2Repository implements RegionInfoRepository {
    constructor(private api: D2Api) {}

    public get(regionOrgUnitId: Id): FutureData<RegionInfo> {
        return Future.joinObj({
            regionalInfo: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: REGION_INFO_PROGRAM_ID,
                    orgUnit: regionOrgUnitId,
                })
            ),
            regionalContent: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: REGION_CONTENT_PROGRAM_ID,
                    orgUnit: REGION_CONTENT_OU_ID,
                })
            ),
        }).flatMap(response => {
            if (!response.regionalInfo.events[0] || !response.regionalContent.events[0]) {
                return Future.error("An error has ocurred fetching region info and content");
            }
            const info = this.buildRegionInfo(response.regionalInfo.events[0], response.regionalContent.events[0]);
            return Future.success(info);
        });
    }

    private buildRegionInfo(regionalInfo: D2Event, regionalContent: D2Event): RegionInfo {
        const getDataValue = (dataElementId: Id, event: D2Event): string =>
            event.dataValues.find(dv => dv.dataElement === dataElementId)?.value || "";

        return {
            mainMapPanelContent: {
                title: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.mainMapPanel.title, regionalInfo),
                description: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.mainMapPanel.description, regionalInfo),
            },
            numbersPanelContent: {
                panelOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelOneTitle,
                    regionalContent
                ),
                panelOneGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelOneGraphOneText,
                    regionalContent
                ),

                panelTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelTwoTitle,
                    regionalContent
                ),
                panelTwoGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelTwoGraphOneText,
                    regionalContent
                ),

                panelThreeTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThree, regionalContent),
                panelThreeGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThreeGraphOneText,
                    regionalContent
                ),
                panelThreeGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThreeGraphTwoText,
                    regionalContent
                ),

                panelFourTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFour, regionalContent),
                panelFourGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFourGraphOneText,
                    regionalContent
                ),
                panelFourGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFourGraphTwoText,
                    regionalContent
                ),

                panelFiveTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFive, regionalContent),
                panelFiveGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphOneText,
                    regionalContent
                ),
                panelFiveGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphTwoText,
                    regionalContent
                ),
                panelFiveGraphThreeText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphThreeText,
                    regionalContent
                ),

                panelSixTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSix, regionalContent),
                panelSixGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphOneText,
                    regionalContent
                ),
                panelSixGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphTwoText,
                    regionalContent
                ),
                panelSixGraphThreeText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphThreeText,
                    regionalContent
                ),
                panelSixGraphFourText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphFourText,
                    regionalContent
                ),
            },
            gapsInCoverageContent: {
                panelOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneTitle,
                    regionalContent
                ),
                panelOneMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneMainText,
                    regionalContent
                ),
                panelOneChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOne}&eventUid=${regionalContent?.event}`,
                panelOneChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOneText,
                    regionalContent
                ),
                panelOneProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneProgressText,
                    regionalContent
                ),

                panelTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoTitle,
                    regionalContent
                ),
                panelTwoMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoMainText,
                    regionalContent
                ),
                panelTwoChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOne}&eventUid=${regionalContent?.event}`,
                panelTwoChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOneText,
                    regionalContent
                ),
                panelTwoProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoProgressText,
                    regionalContent
                ),

                panelThreeTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeTitle,
                    regionalContent
                ),
                panelThreeMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeMainText,
                    regionalContent
                ),
                panelThreeChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOne}&eventUid=${regionalContent?.event}`,
                panelThreeChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneText,
                    regionalContent
                ),
                panelThreeProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeProgressText,
                    regionalContent
                ),

                panelFourTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourTitle,
                    regionalContent
                ),
                panelFourMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourMainText,
                    regionalContent
                ),
                panelFourChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourChartOne}&eventUid=${regionalContent?.event}`,
                panelFourChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourChartOneText,
                    regionalContent
                ),
                panelFourProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourProgressText,
                    regionalContent
                ),
                panelFiveTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveTitle,
                    regionalContent
                ),
                panelFiveMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveMainText,
                    regionalContent
                ),
                panelFiveChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartOne}&eventUid=${regionalContent?.event}`,
                panelFiveChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartOneText,
                    regionalContent
                ),
                panelFiveChartTwo: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwo}&eventUid=${regionalContent?.event}`,
                panelFiveChartTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwoText,
                    regionalContent
                ),
                panelFiveChartThree: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThree}&eventUid=${regionalContent?.event}`,
                panelFiveChartThreeText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThreeText,
                    regionalContent
                ),
                panelFiveProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveProgressText,
                    regionalContent
                ),

                panelSixTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixTitle,
                    regionalContent
                ),
                panelSixMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixMainText,
                    regionalContent
                ),
                panelSixChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixChartOne}&eventUid=${regionalContent?.event}`,
                panelSixChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixChartOneText,
                    regionalContent
                ),
                panelSixProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixProgressText,
                    regionalContent
                ),

                panelSevenTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenTitle,
                    regionalContent
                ),
                panelSevenMainText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenMainText,
                    regionalContent
                ),
                panelSevenChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenChartOne}&eventUid=${regionalContent?.event}`,
                panelSevenChartOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenChartOneText,
                    regionalContent
                ),
                panelSevenProgressText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenProgressText,
                    regionalContent
                ),
            },

            policyChecklistContent: {
                textSectionLeft: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.policyChecklist.textSectionLeft,
                    regionalContent
                ),
                textSectionRight: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.policyChecklist.textSectionRight,
                    regionalContent
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
