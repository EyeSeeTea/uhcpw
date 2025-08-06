import { FinancialProtectionStatus } from "../FinancialProtectionStatus";

export type RegionMainMapPanelContent = {
    title: string;
    description: string;
};

export type RegionInfo = {
    financialProtectionStatus: FinancialProtectionStatus;
    mainMapPanelContent: RegionMainMapPanelContent;
};
