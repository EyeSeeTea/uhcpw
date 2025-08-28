import polylabel from "polylabel";
import { Country, CountryStatus } from "../../../domain/entities/Country";
import { Future, FutureData } from "../../../domain/entities/Future";
import { CountryRepository } from "../../../domain/repositories/CountryRepository";
import { Id } from "../../../domain/entities/Ref";
import { D2Api, D2Geometry, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { coordinatesFromString } from "./coordinatesFromString";
import { mapToWhoCountryCode, mapToWhoCountryName } from "./mapToWhoCountryData";
import { Maybe } from "../../../types/utils";
import { getCurrencyCodeFromCountryId } from "./getCurrencyCodeFromCountryId";
import { ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS } from "../../../domain/entities/Region";

export const countryInfoProgram = "xgaF9UtfrzK";

export const countryInfoDataElements: Record<string, string> = {
    flag: "RCQZDELfNQJ",
    summary: "B6gzpUbzpW3",
    status: "btOzN3badgN",
    geometry: "YNMHjDxsci9",
    showCountryFlag: "OKAdmIvHqGo",

    gapsSectionName: "jF3Lza5SL0X",
    gapsTitle1: "ZhoU0tnc28i",
    gapsText1: "QQ4PUBNw9Pm",
    gapsTitle2: "EOo6KrBC8wW",
    gapsText2: "tVgCJBa0kN2",
    gapsTitle3: "VV2G8k5lKuP",
    gapsText3: "WnzKABQ71eP",
    gapsTitle4: "k8yVKLAvZOj",
    gapsText4: "bk0MT2IwI4A",
    gapsTitle5: "Oamhir4XiOb",
    gapsText5: "FoT0oW4J3x2",
    gapsSourceText: "M4prpRjUZQn",

    finProtecSectionName: "GIDvgdxhc9x",
    finProtecTitle1: "boyf1aD01Ar",
    finProtecText1: "FOQaNQKW2R3",
    finProtecTitle2: "YOyOghIBBbf",
    finProtecText2: "aO1dJuM6e4W",
    finProtecTitle3: "XwVuawKTrFA",
    finProtecText3: "HDjkxkaOrT8",
    finProtecTitle4: "m6ku09AXbMy",
    finProtecText4: "LyhjBnSS8tf",
    finProtecTitle5: "D4kbP5uMvYC",
    finProtecText5: "qF3rhM9dieb",
    finProtecSourceText: "AzNWXx1JPip",
};

const euroOrgUnit = "svSQSBLTVz6";

export const SORTED_COUNTRY_GROUPINGS = [
    ORG_UNIT_GROUP_IDS.EUROPEAN_UNION,
    ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA,
    ORG_UNIT_GROUP_IDS.WESTERN_BALKANS,
    ORG_UNIT_GROUP_IDS.EU_CANDIDATE_COUNTRIES,
    "KJm1Af6dksd",
    "yuNkB9H6l3A",
    "r3pNdEobfnS",
    "tuJjq1LSoCL",
];

export const KOSOVO = "NEPywTBN52g";
const COUNTRIES_NOT_SHOWN = [ORG_UNIT_IDS.EUROPEAN_UNION, KOSOVO];

const countriesInCountryPageProgram = "ai5rB7mcqHH";
const COUNTRY_TOP_MENU_SECTION_ID = "Uk2hcFxYZcI";

const BOSNIA_AND_HERZEGOVINA_LEVEL_3 = "n8iofJiiX4T";
export const BOSNIA_AND_HERZEGOVINA_LEVEL_4 = "rqaiYTAnMC6"; // Brcko District
export const FEDERACIJA_BOSNE_I_HERCEGOVINE = "j44olg405lZ";
export const REPUBLICA_SERPSKA = "FvoXRc5cEEk";

export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Country[]> {
        return Future.joinObj({
            countries: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    level: 3,
                    rootJunction: "OR",
                    filter: { path: { like: euroOrgUnit }, id: { eq: KOSOVO } },
                    order: "shortName:asc",
                })
            ),
            bosniaAndHerzegovinaRegions: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    level: 4,
                    filter: {
                        id: { in: [FEDERACIJA_BOSNE_I_HERCEGOVINE, REPUBLICA_SERPSKA] },
                    },
                    order: "shortName:asc",
                })
            ),
            aditionalCountriesInfo: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    program: countryInfoProgram,
                    skipPaging: true,
                })
            ),
            programMetadata: apiToFuture(
                this.api.models.programs.get({
                    fields: programFields,
                    filter: { id: { eq: countriesInCountryPageProgram } },
                })
            ),
            sectionsEvent: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: countriesInCountryPageProgram,
                })
            ),
        }).map(({ countries, bosniaAndHerzegovinaRegions, aditionalCountriesInfo, programMetadata, sectionsEvent }) => {
            const countriesIdsInCountryPage = this.getCountriesIdsInCountryPage(
                programMetadata.objects[0],
                sectionsEvent.events[0]
            );

            return this.buildCountries(
                countries.objects,
                bosniaAndHerzegovinaRegions.objects,
                aditionalCountriesInfo.events,
                countriesIdsInCountryPage
            );
        });
    }

    private buildCountries(
        orgUnits: D2OrgUnit[],
        bosniaAndHerzegovinaRegions: D2OrgUnit[],
        aditionalCountriesInfo: D2Event[],
        countriesIdsInCountryPage: Id[]
    ): Country[] {
        return orgUnits
            .filter(({ id }) => !COUNTRIES_NOT_SHOWN.includes(id))
            .map(orgUnit => {
                const countryId =
                    BOSNIA_AND_HERZEGOVINA_LEVEL_3 === orgUnit.id ? BOSNIA_AND_HERZEGOVINA_LEVEL_4 : orgUnit.id;

                const aditionalCountryInfo: D2Event | undefined = aditionalCountriesInfo.find(
                    event => event.orgUnit === countryId
                );

                const isInCountryPage = countriesIdsInCountryPage.includes(countryId);
                const country = this.buildCountry(countryId, orgUnit, isInCountryPage, aditionalCountryInfo);

                return countryId === BOSNIA_AND_HERZEGOVINA_LEVEL_4
                    ? {
                          ...country,
                          children: this.getBosniaAndHerzegovinaChildren(
                              bosniaAndHerzegovinaRegions,
                              aditionalCountriesInfo,
                              countriesIdsInCountryPage
                          ),
                      }
                    : country;
            })
            .sort((countryA, countryB) => (countryA.id === KOSOVO ? 1 : countryB.id === KOSOVO ? -1 : 0));
    }

    private getBosniaAndHerzegovinaChildren(
        bosniaAndHerzegovinaRegions: D2OrgUnit[],
        aditionalCountriesInfo: D2Event[],
        countriesIdsInCountryPage: Id[]
    ): Country[] {
        return bosniaAndHerzegovinaRegions.map(orgUnit => {
            const aditionalCountryInfo: D2Event | undefined = aditionalCountriesInfo.find(
                event => event.orgUnit === orgUnit.id
            );

            const isInCountryPage = countriesIdsInCountryPage.includes(orgUnit.id);
            return this.buildCountry(orgUnit.id, orgUnit, isInCountryPage, aditionalCountryInfo);
        });
    }

    private buildCountry(
        countryId: Id,
        orgUnit: D2OrgUnit,
        isInCountryPage: boolean,
        aditionalCountryInfo: Maybe<D2Event>
    ): Country {
        const summary =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.summary)?.value ||
            "";

        const rawStatus =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.status)?.value || "";

        const status = countryStatusMap[rawStatus] ?? "Gaps";

        const customGeometry = aditionalCountryInfo?.dataValues.find(
            dv => dv.dataElement === countryInfoDataElements.geometry
        )?.value as unknown as D2Geometry;

        const showCountryFlag = aditionalCountryInfo?.dataValues.find(
            dv => dv.dataElement === countryInfoDataElements.showCountryFlag
        )?.value;

        return {
            id: countryId,
            name: mapToWhoCountryName(orgUnit.id, orgUnit.shortName),
            longName: mapToWhoCountryName(orgUnit.id, orgUnit.name),
            code: mapToWhoCountryCode(orgUnit.code),
            coordinates: customGeometry ? this.buildPoint(customGeometry) : undefined,
            status,
            parents: orgUnit.organisationUnitGroups
                .map(({ id, name }) => ({ id, name }))
                .filter(oug => SORTED_COUNTRY_GROUPINGS.includes(oug.id)),
            flag: `${this.api.baseUrl}/api/events/files?dataElementUid=${countryInfoDataElements.flag}&eventUid=${aditionalCountryInfo?.event}`,
            showCountryFlag: showCountryFlag === "true",
            summary,
            sliderInfo: this.buildSliderInfo(aditionalCountryInfo),
            isInCountryPage: isInCountryPage,
            currencyCode: getCurrencyCodeFromCountryId(countryId),
        };
    }

    private buildPoint(geometry: D2Geometry | string): [number, number] {
        if (typeof geometry === "string") {
            return coordinatesFromString(geometry);
        } else if (geometry.type === "Point") {
            return geometry.coordinates;
        } else if (geometry.type === "Polygon") {
            const coor = polylabel(geometry.coordinates, 1.0);

            return coor as [number, number];
        } else {
            const coor = polylabel(geometry.coordinates[0] || [], 1.0);

            return coor as [number, number];
        }
    }

    private buildSliderInfo(aditionalCountryInfo: D2Event | undefined) {
        const gapsSectionName =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsSectionName)
                ?.value || "";
        const gapsTitle1 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle1)?.value ||
            "";
        const gapsText1 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText1)?.value ||
            "";
        const gapsTitle2 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle2)?.value ||
            "";
        const gapsText2 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText2)?.value ||
            "";
        const gapsTitle3 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle3)?.value ||
            "";
        const gapsText3 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText3)?.value ||
            "";
        const gapsTitle4 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle4)?.value ||
            "";
        const gapsText4 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText4)?.value ||
            "";
        const gapsTitle5 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle5)?.value ||
            "";
        const gapsText5 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText5)?.value ||
            "";

        const gapsSourceText =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsSourceText)
                ?.value || "";

        const finProtecSectionName =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecSectionName)
                ?.value || "";
        const finProtecTitle1 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle1)
                ?.value || "";
        const finProtecText1 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText1)
                ?.value || "";
        const finProtecTitle2 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle2)
                ?.value || "";
        const finProtecText2 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText2)
                ?.value || "";
        const finProtecTitle3 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle3)
                ?.value || "";
        const finProtecText3 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText3)
                ?.value || "";
        const finProtecTitle4 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle4)
                ?.value || "";
        const finProtecText4 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText4)
                ?.value || "";
        const finProtecTitle5 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle5)
                ?.value || "";
        const finProtecText5 =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText5)
                ?.value || "";

        const finProtecSourceText =
            aditionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecSourceText)
                ?.value || "";

        return {
            gapsSection: {
                sectionName: gapsSectionName,
                sourceText: gapsSourceText,
                content: [
                    {
                        title: gapsTitle1,
                        text: gapsText1,
                    },
                    {
                        title: gapsTitle2,
                        text: gapsText2,
                    },
                    {
                        title: gapsTitle3,
                        text: gapsText3,
                    },
                    {
                        title: gapsTitle4,
                        text: gapsText4,
                    },
                    {
                        title: gapsTitle5,
                        text: gapsText5,
                    },
                ],
            },
            finProtecSection: {
                sectionName: finProtecSectionName,
                sourceText: finProtecSourceText,
                content: [
                    {
                        title: finProtecTitle1,
                        text: finProtecText1,
                    },
                    {
                        title: finProtecTitle2,
                        text: finProtecText2,
                    },
                    {
                        title: finProtecTitle3,
                        text: finProtecText3,
                    },
                    {
                        title: finProtecTitle4,
                        text: finProtecText4,
                    },
                    {
                        title: finProtecTitle5,
                        text: finProtecText5,
                    },
                ],
            },
        };
    }

    private getCountriesIdsInCountryPage(
        programMetadata: D2Program | undefined,
        sectionsEvent: D2Event | undefined
    ): Id[] {
        const dataElementsInCountryPage = programMetadata?.programStages[0]?.programStageSections.find(
            ({ id }) => id === COUNTRY_TOP_MENU_SECTION_ID
        )?.dataElements;

        if (dataElementsInCountryPage?.length && sectionsEvent) {
            const dataElementsInCountryPageIds = dataElementsInCountryPage.map(({ id }) => id);
            return sectionsEvent.dataValues
                ?.filter(({ dataElement }) => dataElementsInCountryPageIds.includes(dataElement))
                ?.map(({ value }) => value);
        }

        return [];
    }
}

const countryStatusMap: Record<string, CountryStatus> = {
    Green: "Strong",
    Red: "Weak",
    Orange: "Gaps",
    Gray: "InsufficientData",
};

const organisationUnitsFields = {
    id: true,
    name: true,
    shortName: true,
    code: true,
    description: { id: true, name: true },
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

const programFields = {
    id: true,
    programStages: {
        id: true,
        name: true,
        programStageSections: {
            id: true,
            dataElements: {
                id: true,
                code: true,
            },
        },
    },
} as const;

type D2Program = MetadataPick<{
    programs: { fields: typeof programFields };
}>["programs"][number];
