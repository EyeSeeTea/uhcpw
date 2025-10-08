import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { ChecklistPolicyMakers } from "../../../domain/entities/region/ChecklistPolicyMakers";
import { ChecklistPolicyMakersRepository } from "../../../domain/repositories/region/ChecklistPolicyMakersRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const CHECKLIST_POLICY_PROGRAM_ID = "ai5rB7mcqHH";
const CHECKLIST_OU_ID = "H8RixfF8ugH";

const CHECKLIST_POLICY_ITEMS_IDS = {
    CHECKLIST_ITEM1: "oPhocZVsULJ",
    CHECKLIST_ITEM2: "q8C5L1sPfWN",
    CHECKLIST_ITEM3: "KDTN3RtdU2M",
    CHECKLIST_ITEM4: "DeXrWddXOWt",
    CHECKLIST_ITEM5: "hgdRUOCGabx",
    CHECKLIST_ITEM6: "dLhrvXo4qgq",
    CHECKLIST_ITEM7: "tIesxIqS4E6",
    CHECKLIST_ITEM8: "HQP4hNamavA",
    CHECKLIST_ITEM9: "GdxtrTpw17w",
    CHECKLIST_ITEM10: "VvNMez84Yxg",
    CHECKLIST_ITEM11: "I6xeinVGPJs",
    CHECKLIST_ITEM12: "FMVe3jB5dzt",
    CHECKLIST_ITEM13: "rTBhZLVkzzx",
    CHECKLIST_ITEM14: "g2o9wzTIq0G",
    CHECKLIST_ITEM15: "FOv4eTdnZHa",
} as const;

export class ChecklistPolicyMakersD2Repository implements ChecklistPolicyMakersRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<ChecklistPolicyMakers> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: CHECKLIST_POLICY_PROGRAM_ID,
                orgUnit: CHECKLIST_OU_ID,
            })
        ).flatMap(response => {
            if (!response.events[0]) {
                return Future.error("An error has ocurred fetching checklist policy makers");
            }
            const info = this.buildChecklistPolicyMakers(response.events[0]);
            return Future.success(info);
        });
    }

    private buildChecklistPolicyMakers(event: D2Event): ChecklistPolicyMakers {
        const getDataValue = (dataElementId: Id): string =>
            event.dataValues.find(dv => dv.dataElement === dataElementId)?.value || "";

        return {
            checklist: Object.entries(CHECKLIST_POLICY_ITEMS_IDS).map(([code, dataElementId]) => ({
                id: code,
                text: getDataValue(dataElementId),
            })),
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
