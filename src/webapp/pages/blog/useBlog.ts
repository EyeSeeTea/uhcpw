import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useAppContext } from "../../contexts/app-context";
import { Maybe } from "../../../types/utils";
import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";
import { BlogFiltersState, useBlogFilters } from "./useBlogFilter";
import { PaginatedPosts, Post } from "../../../domain/entities/blog/Post";

type State = {
    blogState: BlogLoadState;
    globalMessage: Maybe<GlobalMessage>;
    filters: BlogFiltersState;
    onGetBlogData: () => void;
    onGetBlogByPage: (_event: React.ChangeEvent<unknown>, page: number) => void;
};

type PostState = {
    id: Id;
    title: string;
    description: string;
    date: Date;
    image: string;
    content: string;
};

type BlogState = {
    paginatedPosts: {
        currentPage: number;
        totalPages: number;
        data: PostState[];
    };
};

export type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

export type BlogStateLoaded = {
    kind: "loaded";
    data: BlogState;
};

export type BlogStateLoading = {
    kind: "loading";
};

export type BlogStateError = {
    kind: "error";
    message: string;
};

export type BlogLoadState = BlogStateLoaded | BlogStateLoading | BlogStateError;

export function useBlog({ yearsFilter, currentPage }: { yearsFilter?: string[]; currentPage: number }): State {
    const { compositionRoot } = useAppContext();
    const history = useHistory();
    const location = useLocation();

    const filters = useBlogFilters({ yearsFilter });

    const [blogState, setBlogState] = useState<BlogLoadState>({ kind: "loading" });
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();

    const onGetBlogData = useCallback(
        (page?: number) => {
            setBlogState({
                kind: "loading",
            });
            const cancel = compositionRoot.blog.get
                .execute(page || currentPage, {
                    searchTerm: filters.search.term,
                    years: filters.year.selected,
                })
                .run(
                    (paginatedPosts: PaginatedPosts) => {
                        setBlogState({
                            kind: "loaded",
                            data: {
                                paginatedPosts: {
                                    currentPage: paginatedPosts.currentPage,
                                    totalPages: paginatedPosts.totalPages,
                                    data: paginatedPosts.data.map(mapPostToPostState),
                                },
                            },
                        });
                    },
                    error => {
                        console.error(error);
                        setBlogState({
                            kind: "error",
                            message: i18n.t(`Error loading blog: ${error}`),
                        });
                        setGlobalMessage({
                            text: i18n.t(`Error loading blog: ${error}`),
                            type: "error",
                        });
                    }
                );

            return cancel;
        },
        [compositionRoot.blog.get, currentPage, filters.search.term, filters.year.selected]
    );

    const onGetBlogByPage = useCallback(
        (_event: React.ChangeEvent<unknown>, page: number) => {
            const queryParameters = new URLSearchParams(location.search);

            if (page) {
                queryParameters.set("page", page.toString());
            } else {
                queryParameters.delete("page");
            }

            history.push({ search: queryParameters.toString() });
            onGetBlogData(page);
        },
        [history, location.search, onGetBlogData]
    );

    useEffect(() => onGetBlogData(), [onGetBlogData]);

    return {
        blogState: blogState,
        globalMessage: globalMessage,
        filters: filters,
        onGetBlogData: onGetBlogData,
        onGetBlogByPage: onGetBlogByPage,
    };
}

function mapPostToPostState(post: Post): PostState {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        date: post.date,
        image: post.image,
        content: post.content,
    };
}
