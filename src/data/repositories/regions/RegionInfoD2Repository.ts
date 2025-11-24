import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_IDS } from "../../../domain/entities/region/Region";
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
        panelOneGraphOneTitle: "mFzMOvYgfpC",

        panelTwoTitle: "r5eemGxoRS6",
        panelTwoGraphOneText: "WvrLV5w1ukz",
        panelTwoGraphOneTitle: "lDOzvHi3rfF",

        panelThree: "OBInDvcfyQZ",
        panelThreeGraphOneText: "nkhaDCLS2oe",
        panelThreeGraphOneTitle: "UMyEtsEZ4Wi",
        panelThreeGraphTwoText: "zvW54GZzxcJ",
        panelThreeGraphTwoTitle: "bK1xhrXlx1F",

        panelFour: "vel3QNcSAlE",
        panelFourGraphOneText: "YxXbNUMaJGt",
        panelFourGraphOneTitle: "ingg1SYAm8g",
        panelFourGraphTwoText: "VFZzHUlrL9F",
        panelFourGraphTwoTitle: "CCW5tOFUB6T",

        panelFive: "MCTHdjhXfwc",
        panelFiveGraphOneText: "Y2ZKVlVGlSQ",
        panelFiveGraphOneTitle: "OpzOMtkSvUP",
        panelFiveGraphTwoText: "vznlgYGtLgG",
        panelFiveGraphTwoTitle: "INmAzojMnE8",
        panelFiveGraphThreeText: "KRVzyf3td9q",
        panelFiveGraphThreeTitle: "WGLCeZWoTsF",

        panelSix: "Vt8NxwcFltu",
        panelSixGraphOneText: "WaMKgJ1NU9e",
        panelSixGraphOneTitle: "aR0MueVbgry",
        panelSixGraphTwoText: "cDYD3dcJjZu",
        panelSixGraphTwoTitle: "N1lBv1E1jof",
        panelSixGraphThreeText: "s8Ivd41Vvh3",
        panelSixGraphThreeTitle: "qsTvMMYXmmC",
        panelSixGraphFourText: "ZCUrjpW0fbb",
        panelSixGraphFourTitle: "mMzGV9twwi6",
    },

    gapsInCoverage: {
        panelOneTitle: "e59fFgkjhER",
        panelOneMainText: "jgwGv2n4EEV",
        panelOneChartOne: "Txk6wSYhp8a",
        panelOneChartOneTitle: "frDJbSeIvAC",
        panelOneChartOneTextAbove: "eBfqS7p4uFZ",
        panelOneChartOneTextBelow: "vKd8rPi2Cxj",
        panelOneChartOneInfoText: "rrZDKiSnDLV",
        panelOneProgressText: "B55J0e89NwS",

        panelTwoTitle: "USiuNuuWhsE",
        panelTwoMainText: "RkiDXRJWd16",
        panelTwoChartOne: "bRqNhaWOQhJ",
        panelTwoChartOneTitle: "o8tCmdKzIbK",
        panelTwoChartOneInfoText: "J6yMdOrUCwe",
        panelTwoChartOneTextAbove: "MFfCVletM43",
        panelTwoChartOneTextBelow: "uokvwINjDst",
        panelTwoProgressText: "cGZMm9LsO0A",

        panelThreeTitle: "kK1KJ3gplux",
        panelThreeMainText: "VpB8DwK3GLJ",
        panelThreeChartOneEU: "AiQgw1HTjfR",
        panelThreeChartOneER: "wzsBDjTLG7t",
        panelThreeChartOneWB: "pAqMDdCiPB6",
        panelThreeChartOneEECA: "RYh6HzIxJdI",
        panelThreeChartOneTitle: "awssReAi6Nz",
        panelThreeChartOneInfoText: "p15rbYNnCer",
        panelThreeChartOneTextBelow: "GbR7FpRyeXI",
        panelThreeChartOneTextAbove: "Mckk9OrIAGP",
        panelThreeProgressText: "AZqM9ptgmJH",

        panelFourTitle: "Dhy6vrFAc6j",
        panelFourMainText: "QlQM7KAKfZL",
        panelFourChartOneTitle: "shB6mdJzzgD",
        panelFourChartOneInfoText: "nSluLzIddRh",
        panelFourChartOneTextAbove: "ZUwP372TYKu",
        panelFourChartOneTextBelow: "hrekRC3ZaxC",
        panelFourProgressText: "KNz0kaepR0x",

        panelFiveTitle: "xRmzOo2Dqfq",
        panelFiveMainText: "X0t0vBxl9fH",
        panelFiveChartOneInfoText: "b4g0Utr2DkD",
        panelFiveChartOneTitle: "i8WHde0DSXJ",
        panelFiveChartOneTextAbove: "y8cgUDrmjSv",
        panelFiveChartOneTextBelow: "lGXxATwmcQ8",
        panelFiveChartTwo: "rbenCnH0Lyv",
        panelFiveChartTwoTextAbove: "jFTkQH2k34M",
        panelFiveChartTwoTextBelow: "JdC3MgLh7gJ",
        panelFiveChartTwoInfoText: "pgCFN1rGP5b",
        panelFiveChartTwoTitle: "aCMyqn6mYVx",
        panelFiveChartThree: "ieuaAh9kyBr",
        panelFiveChartThreeTextAbove: "EHViFM6sqnR",
        panelFiveChartThreeTextBelow: "QbyB6d6MzUz",
        panelFiveChartThreeInfoText: "WDQeN8NYbiB",
        panelFiveChartThreeTitle: "GG4gX6wwNou",
        panelFiveProgressText: "DGcHpFfH9mj",

        panelSixTitle: "iS7XZlaQotB",
        panelSixMainText: "vZXXyyImuqF",
        panelSixChartOneTitle: "R4jG2qqup3e",
        panelSixChartOneTextAbove: "CgdnY1qHXk2",
        panelSixChartOneTextBelow: "a0zCwMXV7VG",
        panelSixProgressText: "T3C9twBZ1H4",

        panelSevenTitle: "JyhAK2RHKvc",
        panelSevenMainText: "kJx7fxSvuXV",
        panelSevenChartOneTitle: "NOCCHRGKPiu",
        panelSevenChartOneTextAbove: "o20T7eYHg97",
        panelSevenChartOneTextBelow: "dbdRXagIcVP",
        panelSevenProgressText: "JlApFbAchYK",
    },

    policyChecklist: {
        textSectionLeft: "oXGUkxIIvHM",
        textSectionRight: "lLNV31zJEIZ",
        downloadFile: "FbeQI0KKwtt",
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
            const info = this.buildRegionInfo(
                response.regionalInfo.events[0],
                response.regionalContent.events[0],
                regionOrgUnitId
            );
            return Future.success(info);
        });
    }

    private buildRegionInfo(regionalInfo: D2Event, regionalContent: D2Event, regionOrgUnitId: Id): RegionInfo {
        const getDataValue = (dataElementId: Id, event: D2Event): string =>
            event.dataValues.find(dv => dv.dataElement === dataElementId)?.value || "";

        const panelThreeChartOneDEId =
            regionOrgUnitId === ORG_UNIT_IDS.EUROPEAN_UNION
                ? REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneEU
                : regionOrgUnitId === ORG_UNIT_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA
                ? REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneEECA
                : regionOrgUnitId === ORG_UNIT_IDS.WESTERN_BALKANS
                ? REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneWB
                : REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneER;

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
                panelOneGraphOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelOneGraphOneTitle,
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
                panelTwoGraphOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelTwoGraphOneTitle,
                    regionalContent
                ),

                panelThreeTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThree, regionalContent),
                panelThreeGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThreeGraphOneText,
                    regionalContent
                ),
                panelThreeGraphOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThreeGraphOneTitle,
                    regionalContent
                ),
                panelThreeGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThreeGraphTwoText,
                    regionalContent
                ),
                panelThreeGraphTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelThreeGraphTwoTitle,
                    regionalContent
                ),

                panelFourTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFour, regionalContent),
                panelFourGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFourGraphOneText,
                    regionalContent
                ),
                panelFourGraphOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFourGraphOneTitle,
                    regionalContent
                ),
                panelFourGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFourGraphTwoText,
                    regionalContent
                ),
                panelFourGraphTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFourGraphTwoTitle,
                    regionalContent
                ),

                panelFiveTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFive, regionalContent),
                panelFiveGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphOneText,
                    regionalContent
                ),
                panelFiveGraphOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphOneTitle,
                    regionalContent
                ),
                panelFiveGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphTwoText,
                    regionalContent
                ),
                panelFiveGraphTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphTwoTitle,
                    regionalContent
                ),
                panelFiveGraphThreeText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphThreeText,
                    regionalContent
                ),
                panelFiveGraphThreeTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelFiveGraphThreeTitle,
                    regionalContent
                ),

                panelSixTitle: getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSix, regionalContent),
                panelSixGraphOneText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphOneText,
                    regionalContent
                ),
                panelSixGraphOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphOneTitle,
                    regionalContent
                ),
                panelSixGraphTwoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphTwoText,
                    regionalContent
                ),
                panelSixGraphTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphTwoTitle,
                    regionalContent
                ),
                panelSixGraphThreeText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphThreeText,
                    regionalContent
                ),
                panelSixGraphThreeTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphThreeTitle,
                    regionalContent
                ),
                panelSixGraphFourText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphFourText,
                    regionalContent
                ),
                panelSixGraphFourTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.numbersPanel.panelSixGraphFourTitle,
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
                hasPanelOneChartOne:
                    getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOne, regionalContent) !==
                    "",
                panelOneChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOneTitle,
                    regionalContent
                ),
                panelOneChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOneTextAbove,
                    regionalContent
                ),
                panelOneChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOneTextBelow,
                    regionalContent
                ),
                panelOneChartOneInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelOneChartOneInfoText,
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
                hasPanelTwoChartOne:
                    getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOne, regionalContent) !==
                    "",
                panelTwoChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOneTitle,
                    regionalContent
                ),
                panelTwoChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOneTextAbove,
                    regionalContent
                ),
                panelTwoChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOneTextBelow,
                    regionalContent
                ),
                panelTwoChartOneInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelTwoChartOneInfoText,
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
                panelThreeChartOne: `${this.api.baseUrl}/api/events/files?dataElementUid=${panelThreeChartOneDEId}&eventUid=${regionalContent?.event}`,
                hasPanelThreeChartOne: getDataValue(panelThreeChartOneDEId, regionalContent) !== "",
                panelThreeChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneTitle,
                    regionalContent
                ),
                panelThreeChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneTextBelow,
                    regionalContent
                ),
                panelThreeChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneTextAbove,
                    regionalContent
                ),
                panelThreeChartOneInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelThreeChartOneInfoText,
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
                panelFourChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourChartOneTitle,
                    regionalContent
                ),
                panelFourChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourChartOneTextAbove,
                    regionalContent
                ),
                panelFourChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourChartOneTextBelow,
                    regionalContent
                ),
                panelFourChartOneInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFourChartOneInfoText,
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
                panelFiveChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartOneTitle,
                    regionalContent
                ),
                panelFiveChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartOneTextAbove,
                    regionalContent
                ),
                panelFiveChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartOneTextBelow,
                    regionalContent
                ),
                panelFiveChartOneInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartOneInfoText,
                    regionalContent
                ),
                panelFiveChartTwo: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwo}&eventUid=${regionalContent?.event}`,
                hasPanelFiveChartTwo:
                    getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwo, regionalContent) !==
                    "",
                panelFiveChartTwoTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwoTitle,
                    regionalContent
                ),
                panelFiveChartTwoTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwoTextAbove,
                    regionalContent
                ),
                panelFiveChartTwoTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwoTextBelow,
                    regionalContent
                ),
                panelFiveChartTwoInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartTwoInfoText,
                    regionalContent
                ),
                panelFiveChartThree: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThree}&eventUid=${regionalContent?.event}`,
                hasPanelFiveChartThree:
                    getDataValue(
                        REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThree,
                        regionalContent
                    ) !== "",
                panelFiveChartThreeTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThreeTitle,
                    regionalContent
                ),
                panelFiveChartThreeTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThreeTextAbove,
                    regionalContent
                ),
                panelFiveChartThreeTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThreeTextBelow,
                    regionalContent
                ),
                panelFiveChartThreeInfoText: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelFiveChartThreeInfoText,
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
                panelSixChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixChartOneTitle,
                    regionalContent
                ),
                panelSixChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixChartOneTextAbove,
                    regionalContent
                ),
                panelSixChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSixChartOneTextBelow,
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
                panelSevenChartOneTitle: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenChartOneTitle,
                    regionalContent
                ),
                panelSevenChartOneTextAbove: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenChartOneTextAbove,
                    regionalContent
                ),
                panelSevenChartOneTextBelow: getDataValue(
                    REGION_CONTENT_DATA_ELEMENT_IDS.gapsInCoverage.panelSevenChartOneTextBelow,
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
                hasDownloadFile:
                    getDataValue(REGION_CONTENT_DATA_ELEMENT_IDS.policyChecklist.downloadFile, regionalContent) !== "",
                downloadFile: `${this.api.baseUrl}/api/events/files?dataElementUid=${REGION_CONTENT_DATA_ELEMENT_IDS.policyChecklist.downloadFile}&eventUid=${regionalContent?.event}`,
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
