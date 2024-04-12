import polylabel from "polylabel";
import { Country, CountryStatus } from "../../domain/entities/Country";
import { Future, FutureData } from "../../domain/entities/Future";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { Id } from "../../domain/entities/Ref";
import { D2Api, D2Geometry, MetadataPick } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";
import { coordinatesFromString } from "./countries/coordinatesFromString";

export const countryInfoProgram = "xgaF9UtfrzK";

export const countryInfoDataElements: Record<string, string> = {
    flag: "RCQZDELfNQJ",
    summary: "B6gzpUbzpW3",
    status: "btOzN3badgN",
    geometry: "YNMHjDxsci9",

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
};

const euroOrgUnit = "svSQSBLTVz6";

const validOrgUnitGroups = [
    "e7I4gDX3g5k",
    "FMCN2ZG9AEj",
    "KJm1Af6dksd",
    "dqMsarWCWk6",
    "yuNkB9H6l3A",
    "r3pNdEobfnS",
    "tuJjq1LSoCL",
    "A1BdaIwDheX",
];

// NOTICE: For the moment, do not show Kosovo
// const KOSOVO = "NEPywTBN52g";
const NETHERLANDS = "rEQqufy2KNi";

const countriesInCountryPageProgram = "ai5rB7mcqHH";

const countriesInCountryPageDataElements: Record<string, Id> = {
    countryOne: "TnVtPv9CtZs",
    countryTwo: "eZWjJNv8stp",
    countryThree: "LPHN04myQFr",
    countryFour: "fb6h94Fy4hO",
    countryFive: "M0MeJ4H1Sw6",
    countrySix: "MAsbPRB23yd",
    countrySeven: "KnbvNQnRcJB",
    countryEight: "h3eBaOIwlBU",
    countryNine: "jo9LfEeHxxH",
    countryTen: "ZaBZ9rfaR6b",
    countryEleven: "w41UoFFIanF",
    countryTwelve: "vCXqIEAwWR3",
    countryThirteen: "KZlaUubGGDP",
    countryFourteen: "S9bSqXTeaCv",
    countryFifteen: "LfNKBuw3lXS",
    countrySixteen: "A3siIDGWn6c",
    countrySeventeen: "cNMsoNqLB1n",
    countryEighteen: "ABHaHZo8cLw",
    countryNineteen: "CTTavmjBoll",
    countryTwenty: "w89t0SozQcf",
};

export class CountryD2Repository implements CountryRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Country[]> {
        return Future.joinObj({
            countries: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    level: 3,
                    // rootJunction: "OR",
                    // filter: { path: { like: euroOrgUnit }, id: { eq: KOSOVO } },
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
            countriesInCountryPage: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: countriesInCountryPageProgram,
                })
            ),
        }).map(({ countries, aditionalCountriesInfo, countriesInCountryPage }) => {
            return this.buildCountries(countries.objects, aditionalCountriesInfo.events, countriesInCountryPage.events);
        });
    }

    private buildCountries(
        orgUnits: D2OrgUnit[],
        aditionalCountriesInfo: D2Event[],
        countriesInCountryPageEvents: D2Event[]
    ): Country[] {
        return orgUnits.map(orgUnit => {
            const countriesInCountryPage = countriesInCountryPageEvents[0]
                ? Object.values(countriesInCountryPageDataElements)
                      .map(
                          countryDataElement =>
                              countriesInCountryPageEvents[0]?.dataValues?.find(
                                  dv => dv.dataElement === countryDataElement
                              )?.value || ""
                      )
                      .filter(Boolean)
                : [];

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

            const customGeometry = aditionalCountryInfo?.dataValues.find(
                dv => dv.dataElement === countryInfoDataElements.geometry
            )?.value as unknown as D2Geometry;

            const isNetherlands = orgUnit.id === NETHERLANDS;
            return {
                id: orgUnit.id,
                name: isNetherlands ? `${orgUnit.shortName} (Kingdom of the)` : orgUnit.shortName,
                longName: orgUnit.name,
                code: orgUnit.code,
                description: orgUnit.description,
                coordinates: this.buildPoint(customGeometry || orgUnit.geometry),
                status,
                parents: orgUnit.organisationUnitGroups
                    .map(({ id, name }) => ({ id, name }))
                    .filter(oug => validOrgUnitGroups.includes(oug.id)),
                flag: `${this.api.baseUrl}/api/events/files?dataElementUid=${countryInfoDataElements.flag}&eventUid=${aditionalCountryInfo?.event}`,
                summary,
                sliderInfo: this.buildSliderInfo(aditionalCountryInfo),
                isInCountryPage: countriesInCountryPage.includes(orgUnit.id),
            };
        });
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
        return {
            gapsSection: {
                sectionName: gapsSectionName,
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
}

const organisationUnitsFields = {
    id: true,
    name: true,
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
