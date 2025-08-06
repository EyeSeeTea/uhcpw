import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";
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
    financialProtectionStatus: "btOzN3badgN",
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

        const rawfinancialProtectionStatus = getDataValue(REGION_INFO_DATA_ELEMENT_IDS.financialProtectionStatus);

        const financialProtectionStatus: FinancialProtectionStatus =
            rawfinancialProtectionStatus === "Green"
                ? "Strong"
                : rawfinancialProtectionStatus === "Red"
                ? "Weak"
                : "Gaps";

        return {
            mainMapPanelContent: {
                title: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.mainMapPanel.title),
                description: getDataValue(REGION_INFO_DATA_ELEMENT_IDS.mainMapPanel.description),
            },
            financialProtectionStatus: financialProtectionStatus,
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
