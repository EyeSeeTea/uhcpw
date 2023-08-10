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
            filters.countries && filters.countries?.length > 0
                ? `${resourceDataElements.countryId}:in:${filters.countries.join(";")}`
                : undefined,
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
            return this.buildResources(response.events);
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

        return {
            kind: "comparative-analysis",
            ...analysis,
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

    private createLink(link?: string, language?: string) {
        return link ? { url: link, language: language || "English" } : undefined;
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
