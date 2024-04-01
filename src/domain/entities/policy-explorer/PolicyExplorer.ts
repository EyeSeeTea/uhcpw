export type PolicyExplorer = {
    tables: Record<string, PolicyExplorerCell[][]>;
    generalInfo: PolicyExplorerGeneralInfo[];
    references: PolicyExplorerReferences[];
};

export enum PolicyExplorerCellType {
    HEADER = "HEADER",
    DATA = "DATA",
}

export type PolicyExplorerCell = {
    type: PolicyExplorerCellType;
    value: string;
    references?: string;
};

export type PolicyExplorerGeneralInfo = {
    country: string;
    countryExperts: string;
    editors: string;
    lastUpdate: Date;
    source: string;
    reviewers: string;
};

export type PolicyExplorerReferences = {
    country: string;
    references: string[];
};

export type DataOrientation = "inverted" | "normal";

export type DataOrientationByTable = Record<string, DataOrientation>;
export const latestAvailableYear = "latest";
