import { HealthCoverage } from "../HealthCoverage";

export type PolicyExplorer = {
    tables: Record<string, PolicyExplorerCell[][]>;
    generalInfo: PolicyExplorerGeneralInfo[];
    references: PolicyExplorerReferences[];
};

export enum PolicyExplorerCellType {
    HEADER = "HEADER",
    DATA = "DATA",
}

export type PolicyExplorerCell = PolicyExplorerCellHeader | PolicyExplorerCellTextData;
type BasePolicyExplorerCell = {
    references?: string;
};
export type PolicyExplorerCellHeader = BasePolicyExplorerCell & { type: PolicyExplorerCellType.HEADER; value: string };
export type PolicyExplorerCellTextData = BasePolicyExplorerCell & { type: PolicyExplorerCellType.DATA; value: string };
type PolicyExplorerCellTypedData = PolicyExplorerCellCoverage;
export type PolicyExplorerCellCoverage = BasePolicyExplorerCell & {
    type: PolicyExplorerCellType.DATA;
    value: HealthCoverage;
    dataType: "coverage";
    columnName: string;
};

export type PolicyExplorerGeneralInfo = {
    year: string;
    country: string;
    countryExperts: string;
    editors: string;
    lastUpdate: Date;
    sourceText: string;
    sourceUrl: string;
    reviewers: string;
    notes: string;
};

export type PolicyExplorerGeneralInfoToDownload = {
    country: string;
    year: string;
    lastUpdate: string;
    countryExperts: string;
    editors: string;
    reviewers: string;
    notes: string;
    source: string;
};

export type PolicyExplorerGeneralInfoToDownloadKeys = keyof PolicyExplorerGeneralInfoToDownload;

export type PolicyExplorerReferences = {
    country: string;
    references: string[];
};

export type DataOrientation = "inverted" | "normal";

export type DataOrientationByTable = Record<string, DataOrientation>;
export const latestAvailableYear = "latest";
export const firstYearInFilter = 2023;

export function isCellTypedData(cell: PolicyExplorerCell): cell is PolicyExplorerCellTypedData {
    return cell.type === PolicyExplorerCellType.DATA && "dataType" in cell;
}
