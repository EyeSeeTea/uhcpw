export type PolicyExplorer = {
    rows: string[][];
    generalInfo: PolicyExplorerGeneralInfo[];
};

export type PolicyExplorerGeneralInfo = {
    country: string;
    countryExperts: string;
    editors: string;
    lastUpdate: Date;
    source: string;
};
