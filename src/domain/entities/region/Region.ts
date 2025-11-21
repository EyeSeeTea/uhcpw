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

type OrgUnitId = typeof ORG_UNIT_IDS[keyof typeof ORG_UNIT_IDS];

export function isOrgUnitId(id: Id): id is OrgUnitId {
    return (Object.values(ORG_UNIT_IDS) as readonly Id[]).includes(id);
}

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

type RegionCode = typeof REGION_CODES[keyof typeof REGION_CODES];

export type RegionNameKey = keyof typeof REGION_NAMES;

export function isRegionNameKey(key: string): key is RegionNameKey {
    return key in REGION_NAMES;
}

export const REGION_CODES = {
    WESTERN_BALKANS: "WB",
    EUROPEAN_UNION: "EU",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "EECA",
    EU_CANDIDATE_COUNTRIES: "EUCC",
    EUROPEAN_REGION: "EUR",
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

const REGION_ORG_UNIT_CODE_MAP: Record<OrgUnitId, RegionCode> = {
    [ORG_UNIT_IDS.EUROPEAN_UNION]: REGION_CODES.EUROPEAN_UNION,
    [ORG_UNIT_IDS.WESTERN_BALKANS]: REGION_CODES.WESTERN_BALKANS,
    [ORG_UNIT_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA]: REGION_CODES.EASTERN_EUROPE_AND_CENTRAL_ASIA,
    [ORG_UNIT_IDS.EUROPEAN_REGION]: REGION_CODES.EUROPEAN_REGION,
    [ORG_UNIT_IDS.EU_CANDIDATE_COUNTRIES]: REGION_CODES.EU_CANDIDATE_COUNTRIES,
};

export function getRegionCodeByOrgUnitId(id: Id): RegionCode | undefined {
    return isOrgUnitId(id) ? REGION_ORG_UNIT_CODE_MAP[id] : undefined;
}
