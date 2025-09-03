import { FinancialProtectionStatus } from "../FinancialProtectionStatus";

export type RegionMainMapPanelContent = {
    title: string;
    description: string;
};

export type RegionNumbersPanelTitles = {
    panelOne: string;
    panelTwo: string;
    panelThree: string;
    panelFour: string;
    panelFive: string;
    panelSix: string;
    panelSeven: string;
};

export type RegionInfo = {
    financialProtectionStatus: FinancialProtectionStatus;
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelTitles: RegionNumbersPanelTitles;
};
