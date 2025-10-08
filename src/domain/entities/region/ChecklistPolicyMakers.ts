import { Id } from "../Ref";

export type ChecklistPolicyMakers = {
    checklist: ChecklistPolicyMakersData[];
};

export type ChecklistPolicyMakersData = {
    id: Id;
    text: string;
};
