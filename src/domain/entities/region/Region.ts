import { Id } from "../Ref";

export type Region = {
    id: Id;
    name: string;
    code: string;
    countries?: Id[];
    linkedOrgUnitId?: Id;
    isInRegionalPage: boolean;
};

export const ORG_UNIT_GROUP_IDS = {
    WESTERN_BALKANS: "A1BdaIwDheX",
    EUROPEAN_UNION: "dqMsarWCWk6",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "FMCN2ZG9AEj",
    EU_CANDIDATE_COUNTRIES: "e7I4gDX3g5k",
    EUROPEAN_REGION: "aN3rzQZhM4i",
} as const;

export const ORG_UNIT_IDS = {
    WESTERN_BALKANS: "DtTrtbWfWJ7",
    EUROPEAN_UNION: "gIv1Z59fqHc",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "JioUmNZGlmE",
    EU_CANDIDATE_COUNTRIES: "aXlsYT9qEhB",
    EUROPEAN_REGION: "amiXPb8Q3AK",
} as const;

type OrgUnitRegionKey = keyof typeof ORG_UNIT_IDS;

export function isOrgUnitRegionKey(key: string): key is OrgUnitRegionKey {
    return key in ORG_UNIT_IDS;
}

export const REGION_NAMES = {
    WESTERN_BALKANS: "Western Balkans",
    EUROPEAN_UNION: "European Union",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "Eastern Europe & Central Asia",
    EU_CANDIDATE_COUNTRIES: "EU candidate countries",
    EUROPEAN_REGION: "European Region",
} as const;

export type RegionNameKey = keyof typeof REGION_NAMES;

export function isRegionNameKey(key: string): key is RegionNameKey {
    return key in REGION_NAMES;
}

export const REGION_CODES = {
    WESTERN_BALKANS: "WESTERN BALKANS",
    EUROPEAN_UNION: "EU",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "EECA",
    EU_CANDIDATE_COUNTRIES: "EU CANDIDATE COUNTRIES",
    EUROPEAN_REGION: "EUROPEAN REGION",
} as const;

export type RegionCodeKey = keyof typeof REGION_CODES;

export function isRegionCodeKey(key: string): key is RegionCodeKey {
    return key in REGION_CODES;
}

export const SORTED_REGIONS: Id[] = [
    ORG_UNIT_GROUP_IDS.EUROPEAN_REGION,
    ORG_UNIT_GROUP_IDS.EUROPEAN_UNION,
    ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA,
    ORG_UNIT_GROUP_IDS.WESTERN_BALKANS,
    ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES,
];
