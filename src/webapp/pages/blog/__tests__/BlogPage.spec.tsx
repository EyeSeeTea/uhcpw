import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";

import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { BlogPage } from "../BlogPage";
import { BlogD2Repository } from "../../../../data/repositories/BlogD2Repository";
import { Future } from "../../../../domain/entities/Future";
import { Post } from "../../../../domain/entities/blog/Post";
import { PaginatedReponse } from "../../../../domain/entities/Pagination";

let blogRepository: BlogD2Repository;

describe("BlogPage", () => {
    it("should render Blog title", async () => {
        givenPosts();

        renderPage();

        expect(screen.getByRole("heading", { name: /blog/i })).toBeInTheDocument();
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <BlogPage />,
        { path: "/blog", route: `/blog` },
        {
            blog: blogRepository,
        }
    );
}

function givenPosts(): PaginatedReponse<Post> {
    const mockedRepository = mock(BlogD2Repository);

    const posts: PaginatedReponse<Post> = {
        pager: {
            page: 1,
            pageCount: 1,
            total: 8,
            pageSize: 9,
        },
        objects: [
            {
                id: "QXXZpHYfIrj",
                title: "Kosovo Test",
                description: "Kosovo Test",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=QXXZpHYfIrj)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "TkKXRdXAb3N",
                title: "Bosnia and Herzegovina",
                description: "Bosnia and Herzegovina",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=TkKXRdXAb3N)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "ESI1B0zxHfk",
                title: "Test!! Can people afford to pay for health care? New evidence on financial protection in Europe: summary",
                description:
                    "Test!! Can people afford to pay for health care? New evidence on financial protection in Europe: summary",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ESI1B0zxHfk",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ESI1B0zxHfk)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "ckY8Z4ZmTDe",
                title: "New WHO report outlines concrete steps to make health care more accessible for people in Ukraine",
                description:
                    "New WHO report outlines concrete steps to make health care more accessible for people in Ukraine",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ckY8Z4ZmTDe",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=ckY8Z4ZmTDe)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "qgw0lMQo87H",
                title: "Can people afford to pay for health care? New evidence on financial protection in Belgium. Summary.",
                description:
                    "Can people afford to pay for health care? New evidence on financial protection in Belgium. Summary.",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=qgw0lMQo87H",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=qgw0lMQo87H)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "FjIHUs5IwOu",
                title: "Budget execution in health: case study: Ukraine",
                description: "Budget execution in health: case study: Ukraine",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=FjIHUs5IwOu)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "kAn748TgALi",
                title: "WHO/Europe supports countries to improve quality of data on health spending",
                description: "WHO/Europe supports countries to improve quality of data on health spending",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=kAn748TgALi)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "AMNmHHBpedc",
                title: "WHO and partners highlight way forward to improve health equity across North Macedonia",
                description: "WHO and partners highlight way forward to improve health equity across North Macedonia",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=AMNmHHBpedc)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
            {
                id: "lxQWoDTZVRl",
                title: "WHO and partners highlight way forward to improve health equity across North Macedonia",
                description: "WHO and partners highlight way forward to improve health equity across North Macedonia",
                createdDate: "2024-06-16T22:00:00.000Z",
                updatedDate: "2024-06-16T22:00:00.000Z",
                image: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
                content:
                    "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=lxQWoDTZVRl)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
            },
        ],
    };

    when(mockedRepository.get(anything())).thenReturn(Future.success(posts));

    blogRepository = instance(mockedRepository);

    return posts;
}
