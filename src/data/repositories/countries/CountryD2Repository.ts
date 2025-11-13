import polylabel from "polylabel";
import { Country, CountryStatus } from "../../../domain/entities/Country";
import { Future, FutureData } from "../../../domain/entities/Future";
import { CountryRepository } from "../../../domain/repositories/CountryRepository";
import { Id } from "../../../domain/entities/Ref";
import { D2Api, D2Geometry, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { coordinatesFromString } from "./coordinatesFromString";
import { mapToWhoCountryCode, mapToWhoCountryName } from "./mapToWhoCountryData";
import { Maybe } from "../../../types/utils";
import { getCurrencyCodeFromCountryId } from "./getCurrencyCodeFromCountryId";
import { ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS } from "../../../domain/entities/Region";
import { policyExplorerDataSet_ID } from "../utils";
import { generate } from "../../../domain/usecases/utils/generateYears";
import _ from "lodash";
import i18n from "../../../locales";

export const countryInfoProgram = "xgaF9UtfrzK";

export const countryInfoDataElements: Record<string, string> = {
    flag: "RCQZDELfNQJ",
    summary: "B6gzpUbzpW3",
    status: "btOzN3badgN",
    geometry: "YNMHjDxsci9",
    showCountryFlag: "OKAdmIvHqGo",

    gapsSectionName: "jF3Lza5SL0X",
    gapsTitle1: "ZhoU0tnc28i",
    gapsTitle2: "EOo6KrBC8wW",
    gapsTitle3: "VV2G8k5lKuP",
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

const gapsDataElements = {
    gapsText1: "eSyCsKNBnD2",
    gapsText2: "iAgF9SHMfcB",
    gapsText3: "e8wFwCV7zsz",
} as const;
const gapElementIds = Object.values(gapsDataElements) as string[];

const gapsDataYears = {
    firstYearInFilter: 2000,
    lastYearInFilter: () => new Date().getFullYear(),
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
const COUNTRIES_NOT_SHOWN = [ORG_UNIT_IDS.EUROPEAN_UNION];

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
            additionalCountriesInfo: apiToFuture(
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
        })
            .flatMap(({ countries, bosniaAndHerzegovinaRegions, ...rest }) => {
                const countryIds = countries.objects.map(c => c.id);
                const bosniaAndHerzegovinaIds = bosniaAndHerzegovinaRegions.objects.map(r => r.id);
                return apiToFuture(
                    this.api.dataValues.getSet({
                        dataSet: [policyExplorerDataSet_ID],
                        orgUnit: countryIds.concat(bosniaAndHerzegovinaIds),
                        period: this.periodsForGap(),
                    })
                ).map(gapText => ({
                    countries,
                    bosniaAndHerzegovinaRegions,
                    ...rest,
                    gapText,
                }));
            })
            .map(
                ({
                    countries,
                    bosniaAndHerzegovinaRegions,
                    additionalCountriesInfo,
                    programMetadata,
                    sectionsEvent,
                    gapText,
                }) => {
                    const gapTextsByCountry = this.buildGapsTextByCountry(gapText.dataValues);

                    const countriesIdsInCountryPage = this.getCountriesIdsInCountryPage(
                        programMetadata.objects[0],
                        sectionsEvent.events[0]
                    );

                    return this.buildCountries(
                        countries.objects,
                        bosniaAndHerzegovinaRegions.objects,
                        additionalCountriesInfo.events,
                        countriesIdsInCountryPage,
                        gapTextsByCountry
                    );
                }
            );
    }

    private buildCountries(
        orgUnits: D2OrgUnit[],
        bosniaAndHerzegovinaRegions: D2OrgUnit[],
        additionalCountriesInfo: D2Event[],
        countriesIdsInCountryPage: Id[],
        gapTextByCountry: GapsTextMap
    ): Country[] {
        return orgUnits
            .filter(({ id }) => !COUNTRIES_NOT_SHOWN.includes(id))
            .map(orgUnit => {
                const countryId =
                    BOSNIA_AND_HERZEGOVINA_LEVEL_3 === orgUnit.id ? BOSNIA_AND_HERZEGOVINA_LEVEL_4 : orgUnit.id;

                const additionalCountryInfo: D2Event | undefined = additionalCountriesInfo.find(
                    event => event.orgUnit === countryId
                );

                const isInCountryPage = countriesIdsInCountryPage.includes(countryId);
                const country = this.buildCountry({
                    countryId,
                    orgUnit,
                    isInCountryPage,
                    additionalCountryInfo: additionalCountryInfo,
                    gapTextByCountry,
                });

                return countryId === BOSNIA_AND_HERZEGOVINA_LEVEL_4
                    ? {
                          ...country,
                          children: this.getBosniaAndHerzegovinaChildren(
                              bosniaAndHerzegovinaRegions,
                              additionalCountriesInfo,
                              countriesIdsInCountryPage,
                              gapTextByCountry
                          ),
                      }
                    : country;
            })
            .sort((countryA, countryB) => (countryA.id === KOSOVO ? 1 : countryB.id === KOSOVO ? -1 : 0));
    }

    private getBosniaAndHerzegovinaChildren(
        bosniaAndHerzegovinaRegions: D2OrgUnit[],
        additionalCountriesInfo: D2Event[],
        countriesIdsInCountryPage: Id[],
        gapTextByCountry: GapsTextMap
    ): Country[] {
        return bosniaAndHerzegovinaRegions.map(orgUnit => {
            const additionalCountryInfo: D2Event | undefined = additionalCountriesInfo.find(
                event => event.orgUnit === orgUnit.id
            );

            const isInCountryPage = countriesIdsInCountryPage.includes(orgUnit.id);
            return this.buildCountry({
                countryId: orgUnit.id,
                orgUnit,
                isInCountryPage,
                additionalCountryInfo,
                gapTextByCountry,
            });
        });
    }

    private buildCountry(props: {
        countryId: Id;
        orgUnit: D2OrgUnit;
        isInCountryPage: boolean;
        additionalCountryInfo: Maybe<D2Event>;
        gapTextByCountry: GapsTextMap;
    }): Country {
        const { countryId, orgUnit, isInCountryPage, additionalCountryInfo, gapTextByCountry } = props;
        const summary =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.summary)?.value ||
            "";

        const rawStatus =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.status)?.value ||
            "";

        const status = countryStatusMap[rawStatus] ?? "Gaps";

        const customGeometry = additionalCountryInfo?.dataValues.find(
            dv => dv.dataElement === countryInfoDataElements.geometry
        )?.value as unknown as D2Geometry;

        const showCountryFlag = additionalCountryInfo?.dataValues.find(
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
            flag: `${this.api.baseUrl}/api/events/files?dataElementUid=${countryInfoDataElements.flag}&eventUid=${additionalCountryInfo?.event}`,
            showCountryFlag: showCountryFlag === "true",
            summary,
            sliderInfo: this.buildSliderInfo(additionalCountryInfo, gapTextByCountry.get(countryId)),
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

    private buildSliderInfo(additionalCountryInfo: Maybe<D2Event>, gapText: Maybe<GapsText>) {
        const defaultGapText = i18n.t("Country Information coming soon");

        const gapsSectionName =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsSectionName)
                ?.value || "";
        const gapsTitle1 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle1)
                ?.value || "";
        const gapsText1 = gapText?.gapsText1 || defaultGapText;
        const gapsTitle2 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle2)
                ?.value || "";
        const gapsText2 = gapText?.gapsText2 || defaultGapText;
        const gapsTitle3 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle3)
                ?.value || "";
        const gapsText3 = gapText?.gapsText3 || defaultGapText;
        const gapsTitle4 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle4)
                ?.value || "";
        const gapsText4 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText4)?.value ||
            "";
        const gapsTitle5 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsTitle5)
                ?.value || "";
        const gapsText5 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsText5)?.value ||
            "";

        const gapsSourceText =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.gapsSourceText)
                ?.value || "";

        const finProtecSectionName =
            additionalCountryInfo?.dataValues.find(
                dv => dv.dataElement === countryInfoDataElements.finProtecSectionName
            )?.value || "";
        const finProtecTitle1 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle1)
                ?.value || "";
        const finProtecText1 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText1)
                ?.value || "";
        const finProtecTitle2 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle2)
                ?.value || "";
        const finProtecText2 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText2)
                ?.value || "";
        const finProtecTitle3 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle3)
                ?.value || "";
        const finProtecText3 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText3)
                ?.value || "";
        const finProtecTitle4 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle4)
                ?.value || "";
        const finProtecText4 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText4)
                ?.value || "";
        const finProtecTitle5 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecTitle5)
                ?.value || "";
        const finProtecText5 =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecText5)
                ?.value || "";

        const finProtecSourceText =
            additionalCountryInfo?.dataValues.find(dv => dv.dataElement === countryInfoDataElements.finProtecSourceText)
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

    private buildGapsTextByCountry(gapText: DataValueSetsDataValue[]): GapsTextMap {
        return new Map(
            _(gapText)
                .groupBy(dv => dv.orgUnit)
                .mapValues(countryData => {
                    const latestPeriod = _(countryData).maxBy(dv => dv.period)?.period;
                    if (!latestPeriod) return {};

                    const latestByDataElement = _(countryData)
                        .filter(dv => dv.period === latestPeriod && gapElementIds.includes(dv.dataElement))
                        .groupBy(dv => dv.dataElement)
                        .mapValues(values => _(values).maxBy(dv => dv.period))
                        .value();

                    return _.mapValues(
                        gapsDataElements,
                        dataElementId => latestByDataElement[dataElementId]?.value ?? ""
                    );
                })
                .entries()
                .value()
        );
    }

    private periodsForGap() {
        return generate(gapsDataYears.lastYearInFilter(), gapsDataYears.firstYearInFilter - 1).map(year => year.id);
    }
}

const countryStatusMap: Record<string, CountryStatus> = {
    Green: "Strong",
    Yellow: "Emerging",
    Orange: "Gaps",
    Red: "Weak",
    Dark_Red: "VeryWeak",
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

type GapsText = Partial<Record<keyof typeof gapsDataElements, string>>;

type GapsTextMap = Map<string, GapsText>;
