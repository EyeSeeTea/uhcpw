import { useCallback, useEffect, useState } from "react";

import { useAppContext } from "../../contexts/app-context";
import { Maybe } from "../../../types/utils";
import i18n from "../../../locales";
import { BlogFiltersState, useBlogFilters } from "./useBlogFilter";
import { Post } from "../../../domain/entities/blog/Post";
import { PaginatedReponse, Pagination } from "../../../domain/entities/Pagination";

type State = {
    blogState: BlogLoadState;
    globalMessage: Maybe<GlobalMessage>;
    filters: BlogFiltersState;
    onGetPosts: () => void;
    onGetPostsByPage: (_event: React.ChangeEvent<unknown>, page: number) => void;
};

type BlogState = {
    paginatedPosts: PaginatedReponse<Post>;
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

const PAGE_SIZE = 9;
const INITIAL_PAGINATION: Pagination = {
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
};

export function useBlog({ yearsFilter }: { yearsFilter?: string[] }): State {
    const { compositionRoot } = useAppContext();

    const filters = useBlogFilters({ yearsFilter });

    const [blogState, setBlogState] = useState<BlogLoadState>({ kind: "loading" });
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();

    const onGetPosts = useCallback(
        (paging?: Pagination) => {
            setBlogState({
                kind: "loading",
            });

            const params = {
                paging: paging || INITIAL_PAGINATION,
                filters: {
                    searchTerm: filters.search.term,
                    years: filters.year.selected,
                },
            };

            const cancel = compositionRoot.blog.get.execute(params).run(
                paginatedPosts => {
                    setBlogState({
                        kind: "loaded",
                        data: {
                            paginatedPosts: paginatedPosts,
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
        [compositionRoot.blog.get, filters.search.term, filters.year.selected]
    );

    const onGetPostsByPage = useCallback(
        (_event: React.ChangeEvent<unknown>, page: number) => {
            if (blogState.kind === "loaded") {
                onGetPosts({
                    page: page,
                    pageSize: blogState.data.paginatedPosts.pager.pageSize,
                    total: blogState.data.paginatedPosts.pager.total,
                });
            }
        },
        [blogState, onGetPosts]
    );

    useEffect(() => onGetPosts(), [onGetPosts]);

    return {
        blogState: blogState,
        globalMessage: globalMessage,
        filters: filters,
        onGetPosts: onGetPosts,
        onGetPostsByPage: onGetPostsByPage,
    };
}
