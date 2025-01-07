import _ from "lodash";

import { Future, FutureData } from "../../domain/entities/Future";
import { D2Api } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";
import { BlogFilters, BlogRepository } from "../../domain/repositories/BlogRepository";
import { Post } from "../../domain/entities/blog/Post";
import { Id } from "../../domain/entities/Ref";
import { PaginatedReponse, Pagination, Sorting } from "../../domain/entities/Pagination";

export const BLOG_DATA_ELEMENTS = {
    image: "uund7zjS1Yt",
    title: "iBxOUseHUtO",
} as const;

export const BLOG_PROGRAM = "wWo0lhm5GsY";

export class BlogD2Repository implements BlogRepository {
    constructor(private api: D2Api) {}

    get(params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: BlogFilters;
    }): FutureData<PaginatedReponse<Post>> {
        const { paging, sorting, filters } = params;

        const filter = _([filters?.searchTerm ? `${BLOG_DATA_ELEMENTS.title}:like:${filters.searchTerm}` : undefined])
            .compact()
            .join(",");

        const years = filters?.years?.sort();
        const startYear = years ? years[0] : undefined;
        const endYear = years ? years[years.length - 1] : undefined;

        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: BLOG_PROGRAM,
                order: sorting ? `${sorting.field}:${sorting.order}` : "eventDate:desc",
                startDate: startYear ? `${startYear}-01-01` : undefined,
                endDate: endYear ? `${endYear}-12-31` : undefined,
                filter: filter,
                totalPages: true,
                page: paging.page,
                pageSize: paging.pageSize,
            })
        ).map(response => {
            const posts: Post[] = response.events.map(event => this.buildPost(event));

            return {
                pager: response.pager,
                objects: posts,
            };
        });
    }

    getById(id: Id): FutureData<Post> {
        return apiToFuture(
            this.api.events.get({ fields: eventsFields, program: BLOG_PROGRAM, event: id, skipPaging: true })
        ).flatMap(response => {
            if (response.events.length === 0 || !response.events[0]) {
                return Future.error("Post not found");
            } else {
                return Future.success(this.buildPost(response.events[0]));
            }
        });
    }

    private buildPost(event: D2Event): Post {
        const title = event.dataValues.find(dv => dv.dataElement === BLOG_DATA_ELEMENTS.title)?.value || "";
        const image = event.dataValues.find(dv => dv.dataElement === BLOG_DATA_ELEMENTS.image)?.value;
        const markdownContent = `
# Título en Markdown
## Subtítulo
Este es un ejemplo de **Markdown** con _React_.

- Elemento de lista 1
- Elemento de lista 2
- Elemento de lista 3

![React Logo](${this.api.baseUrl}/api/events/files?dataElementUid=${BLOG_DATA_ELEMENTS.image}&eventUid=${event.event})

> Esto es una cita en Markdown.

[Enlace a GitHub](https://github.com)

`;
        return {
            id: event.event,
            title: title,
            description: title,
            content: markdownContent,
            image: image
                ? `${this.api.baseUrl}/api/events/files?dataElementUid=${BLOG_DATA_ELEMENTS.image}&eventUid=${event.event}`
                : "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
            date: new Date(event.eventDate),
        };
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

interface DataValue {
    dataElement: string;
    value: string;
}
