import { FutureData, Future } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { isOrgUnitRegionKey, ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS, Region } from "../../../domain/entities/region/Region";
import { RegionRepository } from "../../../domain/repositories/region/RegionRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { BOSNIA_AND_HERZEGOVINA_LEVEL_3, BOSNIA_AND_HERZEGOVINA_LEVEL_4 } from "../countries/CountryD2Repository";
import { getKeyById, getRegionCodeById, getRegionNameById } from "./utils";

const REGION_INFO_PROGRAM_ID = "XAoS3zq3bZg";
const EUROPEAN_REGIONS_ORG_UNIT_ID = "CPXbH8dBIz8";

export class RegionD2Repository implements RegionRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Region[]> {
        const orgUnitGroupIds: Id[] = Object.values(ORG_UNIT_GROUP_IDS);
        const regionOrgUnitsIds: Id[] = Object.values(ORG_UNIT_IDS);

        return Future.joinObj({
            orgUnitGroups: apiToFuture(
                this.api.models.organisationUnitGroups.get({
                    fields: organisationUnitGroupsFields,
                    paging: false,
                    filter: { id: { in: orgUnitGroupIds } },
                })
            ),
            europeanRegions: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    filter: { id: { in: regionOrgUnitsIds } },
                })
            ),
        }).flatMap(({ orgUnitGroups, europeanRegions }) => {
            if (!orgUnitGroups?.objects || !europeanRegions.objects.length) {
                return Future.success([]);
            }

            return apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: REGION_INFO_PROGRAM_ID,
                    orgUnit: EUROPEAN_REGIONS_ORG_UNIT_ID,
                    ouMode: "DESCENDANTS",
                })
            ).flatMap(response => {
                return Future.success(
                    this.buildRegions(orgUnitGroups.objects, response.events, europeanRegions.objects)
                );
            });
        });
    }

    private buildRegions(orgUnitGroups: D2OrgUnitGroup[], events: D2Event[], europeanRegions: D2OrgUnit[]): Region[] {
        const regionCodeById = getRegionCodeById(ORG_UNIT_GROUP_IDS);
        const regionNameById = getRegionNameById(ORG_UNIT_GROUP_IDS);

        return orgUnitGroups.map((orgUnitGroup: D2OrgUnitGroup): Region => {
            const id = orgUnitGroup.id;
            const key = getKeyById(id, ORG_UNIT_GROUP_IDS);
            const maybeLinkedOrgUnitId = key && isOrgUnitRegionKey(key) ? ORG_UNIT_IDS[key] : undefined;
            const orgUnit: D2OrgUnit | undefined = maybeLinkedOrgUnitId
                ? europeanRegions.find(eu => eu.id === maybeLinkedOrgUnitId)
                : undefined;

            return {
                id: id,
                name: regionNameById.get(id) || orgUnit?.name || orgUnitGroup.shortName,
                code: regionCodeById.get(id) || "Unknown Region Code",
                countries: orgUnitGroup.organisationUnits.map(orgUnit => {
                    const countryId =
                        BOSNIA_AND_HERZEGOVINA_LEVEL_3 === orgUnit.id ? BOSNIA_AND_HERZEGOVINA_LEVEL_4 : orgUnit.id;
                    return countryId;
                }),
                linkedOrgUnitId: orgUnit?.id,
                isInRegionalPage: !!events.find(event => event.orgUnit === orgUnit?.id),
            };
        }, []);
    }
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

const eventsFields = {
    event: true,
    orgUnit: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export type D2Event = {
    event: string;
    orgUnit: string;
    dataValues: DataValue[];
    eventDate: string;
};

export type DataValue = {
    dataElement: string;
    value: string;
};

const organisationUnitsFields = {
    id: true,
    name: true,
    code: true,
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];
