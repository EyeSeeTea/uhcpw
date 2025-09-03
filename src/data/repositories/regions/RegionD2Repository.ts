import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    isOrgUnitRegionKey,
    isRegionCodeKey,
    isRegionNameKey,
    ORG_UNIT_GROUP_IDS,
    ORG_UNIT_IDS,
    Region,
    REGION_CODES,
    REGION_NAMES,
    RegionCodeKey,
    RegionNameKey,
} from "../../../domain/entities/region/Region";
import { RegionRepository } from "../../../domain/repositories/region/RegionRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export class RegionD2Repository implements RegionRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Region[]> {
        const orgUnitGroupIds: Id[] = Object.values(ORG_UNIT_GROUP_IDS);
        return apiToFuture(
            this.api.models.organisationUnitGroups.get({
                fields: organisationUnitGroupsFields,
                paging: false,
                filter: { id: { in: orgUnitGroupIds } },
            })
        ).map(orgUnitGroups => {
            if (!orgUnitGroups?.objects) {
                return [];
            }

            return this.buildRegions(orgUnitGroups.objects);
        });
    }

    private buildRegions(orgUnitGroups: D2OrgUnitGroup[]): Region[] {
        const regionNameById = getRegionNameById(ORG_UNIT_GROUP_IDS);
        const regionCodeById = getRegionCodeById(ORG_UNIT_GROUP_IDS);
        return orgUnitGroups.map((orgUnitGroup: D2OrgUnitGroup): Region => {
            const id = orgUnitGroup.id;
            const key = getKeyById(id, ORG_UNIT_GROUP_IDS);
            const linkedOrgUnitId = key && isOrgUnitRegionKey(key) ? ORG_UNIT_IDS[key] : undefined;
            return {
                id: id,
                name: regionNameById.get(id) || orgUnitGroup.shortName,
                code: regionCodeById.get(id) || "Unknown Region Code",
                countries: orgUnitGroup.organisationUnits.map(ou => ou.id),
                linkedOrgUnitId: linkedOrgUnitId,
            };
        }, []);
    }
}

function getKeyById<T extends Record<string, string>>(id: string, idsRecord: T): keyof T | undefined {
    return Object.entries(idsRecord).find(([, value]) => value === id)?.[0] as keyof T | undefined;
}

function getRegionNameById(idsRecord: Partial<Record<RegionNameKey, Id>>): Map<Id, string> {
    return new Map(
        Object.entries(idsRecord).reduce<[Id, string][]>(
            (acc, [key, id]) => (id && isRegionNameKey(key) ? [...acc, [id, REGION_NAMES[key]]] : acc),
            []
        )
    );
}
function getRegionCodeById(idsRecord: Partial<Record<RegionCodeKey, Id>>): Map<Id, string> {
    return new Map(
        Object.entries(idsRecord).reduce<[Id, string][]>(
            (acc, [key, id]) => (id && isRegionCodeKey(key) ? [...acc, [id, REGION_CODES[key]]] : acc),
            []
        )
    );
}
const organisationUnitGroupsFields = {
    id: true,
    shortName: true,
    organisationUnits: {
        id: true,
    },
} as const;

type D2OrgUnitGroup = MetadataPick<{
    organisationUnitGroups: { fields: typeof organisationUnitGroupsFields };
}>["organisationUnitGroups"][number];
