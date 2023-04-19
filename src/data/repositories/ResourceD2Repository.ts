import _ from "lodash";
import { Future, FutureData } from "../../domain/entities/Future";
import { ComparativeAnalysis, Resource, ResourceCategory } from "../../domain/entities/Resource";
import { ResourceRepository } from "../../domain/repositories/ResourceRepository";
import { D2Api, D2Event } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

const resourcesProgram = "wWo0lhm5GsY";
const globalOrgUnit = "H8RixfF8ugH";
const categoryDE = "iO4ThHtWZ8M";

export class ResourceD2Repository implements ResourceRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<Resource[]> {
        return Future.success(comparativeAnalysis);
        // return apiToFuture(
        //     this.api.events.get({
        //         fields: { $all: true },
        //         skipPaging:true,
        //         program: resourcesProgram,
        //         orgUnit: globalOrgUnit,
        //         filter: `dataElement.id:eq:${categoryDE}`
        //     })
        // ).map(response => this.buildResources(response.events));
    }

    private buildResources(events: D2Event[]): Resource[] {
        return _.compact(
            events.map(event => {
                const category = event.dataValues.find(dv => dv.dataElement === categoryDE) || ("" as ResourceCategory);

                if (category === "Comparative analysis") {
                    return this.buildComparativeAnalysis(event);
                } else {
                    return undefined;
                }
            })
        );
    }

    private buildComparativeAnalysis(events: D2Event): ComparativeAnalysis {
        return {
            kind: "comparative-analysis",
            image: "",
            theme: "Financial protection",
            languages: ["English"],
            text: "",
            year: "2022",
        };
    }
}

const eventsFields = {
    id: true,
    shortName: true,
    code: true,
    description: { id: true, name: true },
    geometry: true,
} as const;

const comparativeAnalysis: Resource[] = [
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Spending on health",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
    {
        kind: "comparative-analysis",
        text: "text example 1 text example 1",
        theme: "Resilience and financial sustainability",
        image: "https://apps.who.int/iris/bitstream/handle/10665/44846/9789241564472_eng.pdf.jpg",
        languages: ["English"],
        year: "2022",
    },
];
