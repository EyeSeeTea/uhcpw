import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";

import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { BlogD2Repository } from "../../../../data/repositories/BlogD2Repository";
import { Future } from "../../../../domain/entities/Future";
import { Post } from "../../../../domain/entities/blog/Post";
import { PostPage } from "../PostPage";

let blogRepository: BlogD2Repository;

describe("PostPage", () => {
    it("should render Blog title", async () => {
        givenAPost();

        renderPage();

        expect(screen.getByRole("heading", { name: /blog/i })).toBeInTheDocument();
    });

    it("should verify post data", async () => {
        const post = givenAPost();

        renderPage();

        verifyPost(post);
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <PostPage />,
        { path: "/blog/:id", route: `/blog/fakeId` },
        {
            blog: blogRepository,
        }
    );
}

function givenAPost(): Post {
    const mockedRepository = mock(BlogD2Repository);

    const post: Post = {
        id: "fakeId",
        title: "Can people afford to pay for health care? New evidence on financial protection in Belgium. Summary.",
        description:
            "Can people afford to pay for health care? New evidence on financial protection in Belgium. Summary.",
        date: new Date("2024-06-16T22:00:00.000Z"),
        image: "/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=qgw0lMQo87H",
        content:
            "\n# Título en Markdown\n## Subtítulo\nEste es un ejemplo de **Markdown** con _React_.\n\n- Elemento de lista 1\n- Elemento de lista 2\n- Elemento de lista 3\n\n![React Logo](/dhis2/api/events/files?dataElementUid=uund7zjS1Yt&eventUid=qgw0lMQo87H)\n\n> Esto es una cita en Markdown.\n\n[Enlace a GitHub](https://github.com)\n\n",
    };
    when(mockedRepository.getById(anything())).thenReturn(Future.success(post));

    blogRepository = instance(mockedRepository);

    return post;
}

async function verifyPost(post: Post) {
    await waitFor(() => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.description)).toBeInTheDocument();
        expect(screen.getByText(post.date.toDateString())).toBeInTheDocument();
        expect(screen.getByAltText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.content)).toBeInTheDocument();
    });
}
