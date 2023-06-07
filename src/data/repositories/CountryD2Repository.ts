import polylabel from "polylabel";
import { Country, CountryStatus } from "../../domain/entities/Country";
import { Future, FutureData } from "../../domain/entities/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { D2Api, D2Geometry, MetadataPick } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export const countryInfoProgram = "xgaF9UtfrzK";

export const countryInfoDataElements: Record<string, string> = {
    flag: "RCQZDELfNQJ",
    summary: "B6gzpUbzpW3",
    status: "btOzN3badgN",
};

const euroOrgUnit = "svSQSBLTVz6";

export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Country[]> {
        return Future.joinObj({
            countries: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    level: 3,
                    filter: { path: { like: euroOrgUnit } },
                    order: "shortName:asc",
                })
            ),
            aditionalCountriesInfo: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    program: countryInfoProgram,
                })
            ),
        }).map(({ countries, aditionalCountriesInfo }) => {
            return this.buildCountries(countries.objects, aditionalCountriesInfo.events);
        });
    }

    private buildCountries(orgUnits: D2OrgUnit[], aditionalCountriesInfo: D2Event[]): Country[] {
        return orgUnits.map(orgUnit => {
            const aditionalCountryInfo: D2Event | undefined = aditionalCountriesInfo.find(
                event => event.orgUnit === orgUnit.id
            );

            const summary =
                aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.summary)
                    ?.value || "";

            const rawStatus =
                aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.status)?.value ||
                "";

            const status: CountryStatus = rawStatus === "Green" ? "Strong" : rawStatus === "Red" ? "Weak" : "Gaps";

            return {
                id: orgUnit.id,
                name: orgUnit.shortName,
                code: orgUnit.code,
                description: orgUnit.description,
                coordinates: this.buildPoint(orgUnit.geometry),
                status,
                parents: orgUnit.organisationUnitGroups.map(({ id, name }) => ({ id, name })),
                flag: `${this.api.baseUrl}/api/events/files?dataElementUid=${countryInfoDataElements.flag}&eventUid=${aditionalCountryInfo?.event}`,
                summary,
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
    organisationUnitGroups: { id: true, name: true },
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];

const eventsFields = {
    event: true,
    orgUnit: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export interface D2Event {
    event: string;
    orgUnit: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
