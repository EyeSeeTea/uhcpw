import polylabel from "polylabel";
import { Country } from "../../domain/entities/Country";
import { FutureData } from "../../domain/entities/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { D2Api, D2Geometry, MetadataPick } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Country[]> {
        return apiToFuture(
            this.api.models.organisationUnits.get({
                fields: organisationUnitsFields,
                paging: false,
                level: 3,
            })
        ).map(orgUnits => this.buildCountries(orgUnits.objects));
    }

    private buildCountries(orgUnits: D2OrgUnit[]): Country[] {
        return orgUnits.map((orgUnit, index) => {
            return {
                name: orgUnit.shortName,
                code: orgUnit.code,
                description: orgUnit.description,
                coordinates: this.buildPoint(orgUnit.geometry),
                color: index % 2 === 0 ? "orange" : index % 3 === 0 ? "red" : "green",
            };
        });
    }

    private buildPoint(geometry: D2Geometry): [number, number] {
        if (geometry.type === "Point") {
            return geometry.coordinates;
        } else if (geometry.type === "Polygon") {
            const coor = polylabel(geometry.coordinates, 1.0);

            return coor as [number, number];
        } else {
            const coor = polylabel(geometry.coordinates[0] || [], 1.0);

            return coor as [number, number];
        }
    }
}

const organisationUnitsFields = {
    id: true,
    shortName: true,
    code: true,
    description: { id: true, name: true },
    geometry: true,
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];
