import { FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { Region } from "../../../domain/entities/Region";
import { RegionRepository } from "../../../domain/repositories/RegionRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const orgUnitGroupIds: Record<string, Id> = {
    WESTERN_BALKANS: "A1BdaIwDheX",
    EUROPEAN_UNION_EU: "dqMsarWCWk6",
    EASTERN_EUROPE_AND_CENTRAL_ASIA_EECA: "FMCN2ZG9AEj",
    EU_CANDIDATE_COUNTRIES: "e7I4gDX3g5k",
};

export class RegionD2Repository implements RegionRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Region[]> {
        const ids: Id[] = Object.values(orgUnitGroupIds);
        return apiToFuture(
            this.api.models.organisationUnitGroups.get({
                fields: organisationUnitGroupsFields,
                paging: false,
                filter: { id: { in: ids } },
                order: "name:asc",
            })
        ).map(orgUnits => {
            if (!orgUnits || !orgUnits.objects) {
                return [];
            }
            return this.buildRegions(orgUnits.objects);
        });
    }

    private buildRegions(orgUnits: D2OrgUnitGroup[]): Region[] {
        return orgUnits.map(
            (orgUnit): Region => ({
                id: orgUnit.id,
                name: orgUnit.name,
                countries: orgUnit.organisationUnits.map(ou => ou.id),
            })
        );
    }
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
