import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    ChecklistPolicyMakers,
    ChecklistPolicyMakersData,
} from "../../../domain/entities/region/ChecklistPolicyMakers";
import { ChecklistPolicyMakersRepository } from "../../../domain/repositories/region/ChecklistPolicyMakersRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const CHECKLIST_POLICY_PROGRAM_ID = "ai5rB7mcqHH";

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
    CHECKLIST_ITEM10: "cjdT6RQi1pg",
    CHECKLIST_ITEM11: "l3sSHjFSBuF",
    CHECKLIST_ITEM12: "VUX0vOZXdX4",
    CHECKLIST_ITEM13: "rTBhZLVkzzx",
    CHECKLIST_ITEM14: "g2o9wzTIq0G",
    CHECKLIST_ITEM15: "lsboMe5mSsv",
    CHECKLIST_ITEM16: "fPKbDm0orJB",
    CHECKLIST_ITEM17: "FOv4eTdnZHa",
    CHECKLIST_ITEM18: "FMVe3jB5dzt",
    CHECKLIST_ITEM19: "I6xeinVGPJs",
    CHECKLIST_ITEM20: "Di233maIADK",
    CHECKLIST_ITEM21: "ZJUgQ10iGlc",
    CHECKLIST_ITEM22: "IY2RoU277Q7",
    CHECKLIST_ITEM23: "oK3S1qfz6vb",
    CHECKLIST_ITEM24: "VvNMez84Yxg",
    CHECKLIST_ITEM25: "ESlw3TZH9UZ",
    // Extra slots: non-sequential keys so items can be repositioned freely in this object
    // without renumbering. Replace each UID placeholder with the real DHIS2 data element UID
    // once created. The key name is stored in DHIS2 as the country-experience link identifier,
    // so once a key is in use it must not be renamed.
    CHECKLIST_ITEM_EXTRA_A: "EXTRAAEPLAC",
    CHECKLIST_ITEM_EXTRA_B: "EXTRABEPLAC",
    CHECKLIST_ITEM_EXTRA_C: "EXTRACEPLAC",
    CHECKLIST_ITEM_EXTRA_D: "EXTRADEPLAC",
    CHECKLIST_ITEM_EXTRA_E: "EXTRAEEPLAC",
} as const;

export class ChecklistPolicyMakersD2Repository implements ChecklistPolicyMakersRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<ChecklistPolicyMakers> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: CHECKLIST_POLICY_PROGRAM_ID,
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
            checklist: Object.entries(CHECKLIST_POLICY_ITEMS_IDS).reduce(
                (acc: ChecklistPolicyMakersData[], [code, dataElementId]): ChecklistPolicyMakersData[] => {
                    const value = getDataValue(dataElementId);
                    return value ? [...acc, { id: code, text: getDataValue(dataElementId) }] : acc;
                },
                []
            ),
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
