import { Id } from "./Ref";

export type RegionType = "orgUnitGroup" | "orgUnit";

type BaseRegion = {
    id: Id;
    name: string;
    code: string;
    countries?: Id[];
};

export type OrgUnitGroupRegion = BaseRegion & {
    type: "orgUnitGroup";
    linkedOrgUnitId?: Id;
};

export type OrgUnitRegion = BaseRegion & {
    type: "orgUnit";
    linkedOrgUnitGroupId: Id;
};

export type Region = OrgUnitRegion | OrgUnitGroupRegion;

export function isOrgUnitGroupRegion(region: Region): region is OrgUnitGroupRegion {
    return region.type === "orgUnitGroup";
}

export function isOrgUnitRegion(region: Region): region is OrgUnitRegion {
    return region.type === "orgUnit";
}

export const ORG_UNIT_GROUP_IDS = {
    WESTERN_BALKANS: "A1BdaIwDheX",
    EUROPEAN_UNION: "dqMsarWCWk6",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "FMCN2ZG9AEj",
    EU_CANDIDATE_COUNTRIES: "e7I4gDX3g5k",
} as const;

export type OrgUnitGroupRegionKey = keyof typeof ORG_UNIT_GROUP_IDS;

export function isOrgUnitGroupRegionKey(key: string): key is OrgUnitGroupRegionKey {
    return key in ORG_UNIT_GROUP_IDS;
}

// WORKAROUND: EU27 data is added in Greenland because we cannot use EUR
const EUROPEAN_UNION_ORG_UNIT_ID: Id = "IZy3ESdFnp5";

export const ORG_UNIT_IDS = {
    EUROPEAN_UNION: EUROPEAN_UNION_ORG_UNIT_ID,
} as const;

export type OrgUnitRegionKey = keyof typeof ORG_UNIT_IDS;

export function isOrgUnitRegionKey(key: string): key is OrgUnitRegionKey {
    return key in ORG_UNIT_IDS;
}

export const REGION_CODES = {
    WESTERN_BALKANS: "WESTERN BALKANS",
    EUROPEAN_UNION: "EU",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "EECA",
    EU_CANDIDATE_COUNTRIES: "EU CANDIDATE COUNTRIES",
} as const;

export type RegionCodeKey = keyof typeof REGION_CODES;

export function isRegionCodeKey(key: string): key is RegionCodeKey {
    return key in REGION_CODES;
}
export const REGION_NAMES = {
    WESTERN_BALKANS: "Western Balkans",
    EUROPEAN_UNION: "EU",
    EASTERN_EUROPE_AND_CENTRAL_ASIA: "Eastern Europe and central Asia",
    EU_CANDIDATE_COUNTRIES: "EU candidate countries",
} as const;

export type RegionNameKey = keyof typeof REGION_NAMES;

export function isRegionNameKey(key: string): key is RegionNameKey {
    return key in REGION_NAMES;
}
