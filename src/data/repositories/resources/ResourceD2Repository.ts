import _ from "lodash";
import { FutureData } from "../../../domain/entities/Future";
import {
    AnalysisResource,
    ComparativeAnalysis,
    CountryAnalysis,
    MediaResource,
    Multimedia,
    News,
    Resource,
} from "../../../domain/entities/resources/Resource";
import { ResourceFilters, ResourceRepository } from "../../../domain/repositories/resources/ResourceRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export const resourceDataElements: Record<string, string> = {
    category: "iO4ThHtWZ8M",
    theme: "TTAQLTta8JS",
    image: "uund7zjS1Yt",
    title: "iBxOUseHUtO",
    link: "WlAFwnRMskp",
    linkLanguage: "yKHkUZLIGc6",
    link2: "nVhCDkoptRC",
    link2Language: "rovY1LEqAPX",
    link3: "egYRckQrYVj",
    link3Language: "DQAOcVPEQTh",
    link4: "yfKcdYARapH",
    link4Language: "QlRpFiResvs",
    countryId: "PC9lIDo5x8m",
    relatedCountry1: "s4rejJAHkEj",
    relatedCountry2: "oQ6Qi6faNK5",
    relatedCountry3: "LpvSstI1qkv",
    relatedCountry4: "XqOzgOaLYIC",
    relatedCountry5: "W1rJkxxdsf7",
    relatedCountry6: "s9VZRkTRnok",
    relatedCountry7: "wR829irugl9",
    relatedCountry8: "x6PpqgIH0Rt",
    relatedCountry9: "wkH2AyYFqOc",
    relatedCountry10: "PF1BSn79hgT",
    relatedCountry11: "uc0QAtItg9A",
    relatedCountry12: "JypkjZAQmnM",
    relatedCountry13: "AlLQaVQtjDw",
    relatedCountry14: "Vc55KzffRaY",
    relatedCountry15: "txupFIjcJxc",
    relatedCountry16: "i51gDVomugt",
    relatedCountry17: "NrdV87QJt9S",
    relatedCountry18: "hbPjqVnjly5",
    relatedCountry19: "y74nWeCoAdH",
    relatedCountry20: "sqqJNJDwN1F",
    relatedCountry21: "QlBdXGOdz4x",
    relatedCountry22: "jc3d0ZSupHK",
    relatedCountry23: "Jh00i19RF91",
    relatedCountry24: "EJAYWps6wm0",
    relatedCountry25: "a61IrOb5leV",
    relatedCountry26: "BFFlxznLkZv",
    relatedCountry27: "vLdkDy58YqQ",
    relatedCountry28: "ffndxAozKG5",
    relatedCountry29: "tYbQcw47cQZ",
    relatedCountry30: "TVsjP1VoGsA",
    relatedCountry31: "ZEDLsKyJcib",
    relatedCountry32: "vJqqddnRCsW",
    relatedCountry33: "POJAv84qfrq",
    relatedCountry34: "HvuwOxCfiN4",
    relatedCountry35: "ZwP1hA1cpmK",
    relatedCountry36: "zxVo1DM7JnD",
    relatedCountry37: "mCH3sabJvqA",
    relatedCountry38: "yhFTBkdmwv0",
    relatedCountry39: "qQRNZQTY9VN",
    relatedCountry40: "Uyvm6flgZiw",
    favourite: "aP3GIoQRvDt",
    favouriteOrder: "G9DVX5SjoA2",
    favouriteSection: "XxXz056LMCO",
    favouriteSectionOrder: "EqiRrE4nz7c",
};

export const resourcesProgram = "wWo0lhm5GsY";

export class ResourceD2Repository implements ResourceRepository {
    constructor(private api: D2Api) {}

    public get(filters: ResourceFilters): FutureData<Resource[]> {
        //2:38 has a bug filtering events by data element value using eq operator. Like works!
        const filter = _([
            filters.category
                ? `${resourceDataElements.category}:like:${filters.category.replace("-", " ")}`
                : undefined,
            filters.theme ? `${resourceDataElements.theme}:like:${filters.theme.replace("-", " ")}` : undefined,
            filters.searchTerm ? `${resourceDataElements.title}:like:${filters.searchTerm}` : undefined,
            filters.favourite !== undefined ? `${resourceDataElements.favourite}:eq:${filters.favourite}` : undefined,
            filters.favouriteSection !== undefined
                ? `${resourceDataElements.favouriteSection}:eq:${filters.favouriteSection}`
                : undefined,
        ])
            .compact()
            .join(",");

        const years = filters.years?.sort();
        const startYear = years ? years[0] : undefined;
        const endYear = years ? years[years.length - 1] : undefined;

        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: resourcesProgram,
                startDate: startYear ? `${startYear}-01-01` : undefined,
                endDate: endYear ? `${endYear}-12-31` : undefined,
                skipPaging: filters.count ? false : true,
                pageSize: filters.count,
                filter,
                order: "eventDate:desc",
            })
        ).map(response => {
            let events = response.events;

            if (filters.countries && filters.countries.length > 0) {
                events = this.filterCountries(response.events, filters);
            }

            return this.buildResources(events);
        });
    }

    private buildResources(events: D2Event[]): Resource[] {
        return _.compact(
            _(
                events.map(event => {
                    const category =
                        event.dataValues.find(dv => dv.dataElement === resourceDataElements.category)?.value || "";

                    if (category === "comparative-analysis") {
                        return this.buildComparativeAnalysis(event);
                    } else if (category === "news") {
                        return this.buildNews(event);
                    } else if (category === "multimedia") {
                        return this.buildMultimedia(event);
                    } else if (category === "country-analysis") {
                        return this.buildCountryAnalysis(event);
                    } else {
                        return undefined;
                    }
                })
            ).value()
        );
    }

    private buildNews(event: D2Event): News {
        const media = this.buildMedia(event);

        return {
            kind: "news",
            ...media,
        };
    }

    private buildMultimedia(event: D2Event): Multimedia {
        const media = this.buildMedia(event);

        const theme = event.dataValues.find(dv => dv.dataElement === resourceDataElements.theme)?.value || "";

        return {
            kind: "multimedia",
            ...media,
            theme,
        };
    }

    private buildMedia(event: D2Event): MediaResource {
        const title = event.dataValues.find(dv => dv.dataElement === resourceDataElements.title)?.value || "";
        const url = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link)?.value || "";

        const favouriteData = this.buildFavourite(event);

        return {
            id: event.event,
            image: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.image}&eventUid=${event.event}`,
            title,
            url,
            date: new Date(event.eventDate),
            ...favouriteData,
        };
    }

    private buildComparativeAnalysis(event: D2Event): ComparativeAnalysis {
        const analysis = this.buildAnalysis(event);

        const relatedCountry1 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry1)?.value || "";
        const relatedCountry2 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry2)?.value || "";
        const relatedCountry3 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry3)?.value || "";
        const relatedCountry4 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry4)?.value || "";
        const relatedCountry5 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry5)?.value || "";
        const relatedCountry6 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry6)?.value || "";
        const relatedCountry7 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry7)?.value || "";
        const relatedCountry8 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry8)?.value || "";
        const relatedCountry9 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry9)?.value || "";
        const relatedCountry10 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry10)?.value || "";
        const relatedCountry11 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry11)?.value || "";
        const relatedCountry12 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry12)?.value || "";
        const relatedCountry13 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry13)?.value || "";
        const relatedCountry14 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry14)?.value || "";
        const relatedCountry15 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry15)?.value || "";
        const relatedCountry16 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry16)?.value || "";
        const relatedCountry17 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry17)?.value || "";
        const relatedCountry18 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry18)?.value || "";
        const relatedCountry19 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry19)?.value || "";
        const relatedCountry20 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry20)?.value || "";
        const relatedCountry21 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry21)?.value || "";
        const relatedCountry22 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry22)?.value || "";
        const relatedCountry23 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry23)?.value || "";
        const relatedCountry24 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry24)?.value || "";
        const relatedCountry25 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry25)?.value || "";
        const relatedCountry26 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry26)?.value || "";
        const relatedCountry27 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry27)?.value || "";
        const relatedCountry28 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry28)?.value || "";
        const relatedCountry29 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry29)?.value || "";
        const relatedCountry30 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry30)?.value || "";
        const relatedCountry31 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry31)?.value || "";
        const relatedCountry32 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry32)?.value || "";
        const relatedCountry33 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry33)?.value || "";
        const relatedCountry34 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry34)?.value || "";
        const relatedCountry35 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry35)?.value || "";
        const relatedCountry36 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry36)?.value || "";
        const relatedCountry37 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry37)?.value || "";
        const relatedCountry38 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry38)?.value || "";
        const relatedCountry39 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry39)?.value || "";
        const relatedCountry40 =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.relatedCountry40)?.value || "";

        const relatedCountries: string[] = _([
            relatedCountry1,
            relatedCountry2,
            relatedCountry3,
            relatedCountry4,
            relatedCountry5,
            relatedCountry6,
            relatedCountry7,
            relatedCountry8,
            relatedCountry9,
            relatedCountry10,
            relatedCountry11,
            relatedCountry12,
            relatedCountry13,
            relatedCountry14,
            relatedCountry15,
            relatedCountry16,
            relatedCountry17,
            relatedCountry18,
            relatedCountry19,
            relatedCountry20,
            relatedCountry21,
            relatedCountry22,
            relatedCountry23,
            relatedCountry24,
            relatedCountry25,
            relatedCountry26,
            relatedCountry27,
            relatedCountry28,
            relatedCountry29,
            relatedCountry30,
            relatedCountry31,
            relatedCountry32,
            relatedCountry33,
            relatedCountry34,
            relatedCountry35,
            relatedCountry36,
            relatedCountry37,
            relatedCountry38,
            relatedCountry39,
            relatedCountry40,
        ])
            .compact()
            .value();

        return {
            kind: "comparative-analysis",
            ...analysis,
            relatedCountries,
        };
    }

    private buildCountryAnalysis(event: D2Event): CountryAnalysis {
        const analysis = this.buildAnalysis(event);

        const countryId = event.dataValues.find(dv => dv.dataElement === resourceDataElements.countryId)?.value || "";

        return {
            kind: "country-analysis",
            ...analysis,
            countryId,
        };
    }

    private buildAnalysis(event: D2Event): AnalysisResource {
        const theme = event.dataValues.find(dv => dv.dataElement === resourceDataElements.theme)?.value || "";
        const title = event.dataValues.find(dv => dv.dataElement === resourceDataElements.title)?.value || "";
        const link = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link)?.value || "";
        const linkLanguage =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.linkLanguage)?.value || "";

        const link2 = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link2)?.value || "";
        const link2Language =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.link2Language)?.value || "";
        const link3 = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link3)?.value || "";
        const link3Language =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.link3Language)?.value || "";
        const link4 = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link4)?.value || "";
        const link4Language =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.link4Language)?.value || "";

        const favouriteData = this.buildFavourite(event);

        return {
            image: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.image}&eventUid=${event.event}`,
            id: event.event,
            theme: theme,
            links: _([
                this.createLink(link, linkLanguage),
                this.createLink(link2, link2Language),
                this.createLink(link3, link3Language),
                this.createLink(link4, link4Language),
            ])
                .compact()
                .value(),
            title: title,
            date: new Date(event.eventDate),
            ...favouriteData,
        };
    }

    private buildFavourite(event: D2Event) {
        const favourite =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.favourite)?.value === "true" || false;
        const favouriteOrder =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.favouriteOrder)?.value || 0;
        const favouriteSection =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.favouriteSection)?.value === "true" ||
            false;
        const favouriteSectionOrder =
            event.dataValues.find(dv => dv.dataElement === resourceDataElements.favouriteSectionOrder)?.value || 0;

        return {
            favourite,
            favouriteOrder: +favouriteOrder,
            favouriteSection,
            favouriteSectionOrder: +favouriteSectionOrder,
        };
    }

    private filterCountries(events: D2Event[], filters: ResourceFilters) {
        if (filters.category === "comparative-analysis") {
            return events.filter(event => {
                const country = event.dataValues.find(
                    dataValue => dataValue.dataElement === resourceDataElements.countryId
                )?.value;
                const relatedCountries = this.getRelatedCountries(event);

                return (
                    (country && filters.countries?.includes(country)) ||
                    relatedCountries?.some(country => filters.countries?.includes(country))
                );
            });
        } else {
            return events.filter(el =>
                el.dataValues.some(
                    el => el.dataElement === resourceDataElements.countryId && filters.countries?.includes(el.value)
                )
            );
        }
    }

    private createLink(link?: string, language?: string) {
        return link ? { url: link, language: language || "English" } : undefined;
    }

    private getRelatedCountries(event: D2Event) {
        return event.dataValues
            .filter(
                dataValue =>
                    dataValue.dataElement === resourceDataElements.relatedCountry1 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry2 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry3 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry4 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry5 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry6 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry7 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry8 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry9 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry10 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry11 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry12 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry13 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry14 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry15 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry16 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry17 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry18 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry19 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry20 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry21 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry22 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry23 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry24 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry25 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry26 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry27 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry28 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry29 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry30 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry31 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry32 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry33 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry34 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry35 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry36 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry37 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry38 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry39 ||
                    dataValue.dataElement === resourceDataElements.relatedCountry40
            )
            .map(dataValue => dataValue.value);
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
