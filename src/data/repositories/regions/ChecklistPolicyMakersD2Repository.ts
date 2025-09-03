import { Future, FutureData } from "../../../domain/entities/Future";
import { ChecklistPolicyMakers } from "../../../domain/entities/region/ChecklistPolicyMakers";
import { ChecklistPolicyMakersRepository } from "../../../domain/repositories/region/ChecklistPolicyMakersRepository";
import { D2Api } from "../../../types/d2-api";
import { exportToCSV, Tab } from "../../export/exportToCSV";

export class ChecklistPolicyMakersD2Repository implements ChecklistPolicyMakersRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<ChecklistPolicyMakers> {
        return Future.success({
            checklist: checklist,
        });
    }

    public saveToFile(data: string[][]): FutureData<void> {
        const tabs: Tab[] = [
            {
                data: data,
                name: "Policy Checklist",
            },
        ];

        exportToCSV(tabs, "policy_checklist");
        return Future.success(undefined);
    }
}

const checklist: string[] = [
    "Entitlement to publicly financed health care is de-linked from payment of SHI contributions",
    "The tax agency deals with non-payment of SHI contributions (not the health system)",
    "Refugees, asylum seekers and undocumented migrants are entitled to the same benefits as other residents",
    "Everyone is aware of their entitlements",
    "There are no administrative barriers to accessing entitlements",
    "User charges are applied sparingly and are carefully designed so that:",
    " - people with low incomes or chronic conditions are automatically exempt from all user charges",
    " - there is an annual income-based cap on all user charges, which works automatically",
    " - there are no percentage co-payments",
    " - there is no balance billing or extra billing for medical services",
    " - any co-payments in place are low and fixed and people know in advance exactly how much they have to pay when they see a doctor, undergo a diagnostic test, collect a prescription or are admitted to hospital",
    "Primary care coverage includes treatment, not just consultation and diagnosis, so that the following types of care are affordable for everyone:",
    " - medicines",
    " - medical products",
    " - dental care",
    "Coverage policies are supported by an adequate level of public spending on health so that:",
    " - there are no major staff shortages",
    " - there are no major issues with the quality and availability of services",
    " - there are no long waiting times for treatment",
    " - there are no informal payments",
];
