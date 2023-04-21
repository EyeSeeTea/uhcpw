import _ from "lodash";
import { FutureData } from "../../../domain/entities/Future";
import { ComparativeAnalysis, Resource } from "../../../domain/entities/resources/Resource";
import { ResourceRepository } from "../../../domain/repositories/resources/ResourceRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const resourceDataElements: Record<string, string> = {
    category: "iO4ThHtWZ8M",
    theme: "TTAQLTta8JS",
    image: "uund7zjS1Yt",
    title: "iBxOUseHUtO",
    link: "WlAFwnRMskp",
};

const resourcesProgram = "wWo0lhm5GsY";
const globalOrgUnit = "H8RixfF8ugH";

export class ResourceD2Repository implements ResourceRepository {
    constructor(private api: D2Api) {}

    public get(category: string, theme?: string, year?: string): FutureData<Resource[]> {
        const filter = _([
            `${resourceDataElements.category}:eq:${category.replace("-", " ")}`,
            theme ? `${resourceDataElements.theme}:eq:${theme.replace("-", " ")}` : undefined,
        ])
            .compact()
            .join(",");

        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: resourcesProgram,
                orgUnit: globalOrgUnit,
                startDate: year ? `${year}-01-01` : undefined,
                endDate: year ? `${year}-01-31` : undefined,
                filter,
            })
        ).map(response => this.buildResources(response.events));
    }

    private buildResources(events: D2Event[]): Resource[] {
        return _.compact(
            _(
                events.map(event => {
                    const category =
                        event.dataValues.find(dv => dv.dataElement === resourceDataElements.category)?.value || "";

                    if (category === "comparative-analysis") {
                        return this.buildComparativeAnalysis(event);
                    } else {
                        return undefined;
                    }
                })
            )
                .orderBy("year", "desc")
                .value()
        );
    }

    private buildComparativeAnalysis(event: D2Event): ComparativeAnalysis {
        const theme = event.dataValues.find(dv => dv.dataElement === resourceDataElements.theme)?.value || "";
        const title = event.dataValues.find(dv => dv.dataElement === resourceDataElements.title)?.value || "";
        const link = event.dataValues.find(dv => dv.dataElement === resourceDataElements.link)?.value || "";

        return {
            kind: "comparative-analysis",
            image: `${this.api.baseUrl}/api/events/files?dataElementUid=${resourceDataElements.image}&eventUid=${event.event}`,
            theme: theme,
            links: [{ language: "English", url: link }],
            text: title,
            year: new Date(event.eventDate).getFullYear().toString(),
        };
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
