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
