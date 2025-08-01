import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    isOrgUnitGroupRegionKey,
    isOrgUnitRegionKey,
    isRegionCodeKey,
    isRegionNameKey,
    ORG_UNIT_GROUP_IDS,
    ORG_UNIT_IDS,
    OrgUnitGroupRegion,
    OrgUnitRegion,
    Region,
    REGION_CODES,
    REGION_NAMES,
    RegionCodeKey,
    RegionNameKey,
} from "../../../domain/entities/Region";
import { RegionRepository } from "../../../domain/repositories/RegionRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export class RegionD2Repository implements RegionRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Region[]> {
        const orgUnitGroupIds: Id[] = Object.values(ORG_UNIT_GROUP_IDS);
        const orgUnitIds: Id[] = Object.values(ORG_UNIT_IDS);
        return Future.joinObj({
            orgUnitGroups: apiToFuture(
                this.api.models.organisationUnitGroups.get({
                    fields: organisationUnitGroupsFields,
                    paging: false,
                    filter: { id: { in: orgUnitGroupIds } },
                })
            ),
            orgUnits: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    filter: { id: { in: orgUnitIds } },
                })
            ),
        }).map(({ orgUnitGroups, orgUnits }) => {
            if (!orgUnitGroups?.objects || !orgUnits?.objects) {
                return [];
            }

            return [
                ...this.buildRegionsFromOrgUnitGroups(orgUnitGroups.objects),
                ...this.buildRegionsFromOrgUnits(orgUnits.objects, orgUnitGroups.objects),
            ];
        });
    }

    private buildRegionsFromOrgUnitGroups(orgUnitGroups: D2OrgUnitGroup[]): OrgUnitGroupRegion[] {
        const regionNameById = getRegionNameById(ORG_UNIT_GROUP_IDS);
        const regionCodeById = getRegionCodeById(ORG_UNIT_GROUP_IDS);
        return orgUnitGroups.map((orgUnitGroup: D2OrgUnitGroup): OrgUnitGroupRegion => {
            const id = orgUnitGroup.id;
            const key = getKeyById(id, ORG_UNIT_GROUP_IDS);
            const linkedOrgUnitId = key && isOrgUnitRegionKey(key) ? ORG_UNIT_IDS[key] : undefined;
            return {
                type: "orgUnitGroup",
                id: id,
                name: regionNameById.get(id) || orgUnitGroup.name,
                code: regionCodeById.get(id) || "Unknown Region Code",
                countries: orgUnitGroup.organisationUnits.map(ou => ou.id),
                linkedOrgUnitId: linkedOrgUnitId,
            };
        }, []);
    }

    private buildRegionsFromOrgUnits(orgUnits: D2OrgUnit[], orgUnitGroups: D2OrgUnitGroup[]): OrgUnitRegion[] {
        const regionNameById = getRegionNameById(ORG_UNIT_IDS);
        const regionCodeById = getRegionCodeById(ORG_UNIT_IDS);

        return orgUnits.reduce((acc: OrgUnitRegion[], orgUnit: D2OrgUnit): OrgUnitRegion[] => {
            const id = orgUnit.id;
            const key = getKeyById(id, ORG_UNIT_IDS);
            const linkedOrgUnitGroupId = key && isOrgUnitGroupRegionKey(key) ? ORG_UNIT_GROUP_IDS[key] : undefined;
            return linkedOrgUnitGroupId
                ? [
                      ...acc,
                      {
                          type: "orgUnit",
                          id: id,
                          name: regionNameById.get(id) || "Unknown Region",
                          code: regionCodeById.get(id) || "Unknown Region Code",
                          countries: getRegionCountries(id, orgUnitGroups),
                          linkedOrgUnitGroupId: linkedOrgUnitGroupId,
                      },
                  ]
                : acc;
        }, []);
    }
}

function getKeyById<T extends Record<string, string>>(id: string, idsRecord: T): keyof T | undefined {
    return Object.entries(idsRecord).find(([, value]) => value === id)?.[0] as keyof T | undefined;
}

function getRegionCountries(orgUnitId: Id, orgUnitGroups: D2OrgUnitGroup[]): Id[] {
    const regionKey = getKeyById(orgUnitId, ORG_UNIT_IDS);
    const groupId = regionKey && isOrgUnitGroupRegionKey(regionKey) ? ORG_UNIT_GROUP_IDS[regionKey] : undefined;
    if (!groupId) {
        return [];
    }
    const group = orgUnitGroups.find(group => group.id === groupId);
    return group ? group.organisationUnits.map(ou => ou.id) : [];
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
    name: true,
    organisationUnits: {
        id: true,
    },
} as const;

type D2OrgUnitGroup = MetadataPick<{
    organisationUnitGroups: { fields: typeof organisationUnitGroupsFields };
}>["organisationUnitGroups"][number];

const organisationUnitsFields = {
    id: true,
    name: true,
    code: true,
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];
