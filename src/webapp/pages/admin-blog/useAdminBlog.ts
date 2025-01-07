import { useCallback, useMemo, useState } from "react";

import { useAppContext } from "../../contexts/app-context";

import { Pagination, Sorting } from "../../../domain/entities/Pagination";
import { GlobalMessage, AdminBlogState } from "./AdminBlogState";
import { Post } from "../../../domain/entities/blog/Post";
import { useReload } from "../../common/hooks/useReload";
import { useHistory } from "react-router-dom";
import i18n from "../../../locales";

const pagination = {
    pageSizeOptions: [10, 20, 50],
    pageSizeInitialValue: 10,
};

const initialSorting = {
    field: "date" as const,
    order: "desc" as const,
};

export function useAdminBlog(): AdminBlogState {
    const { compositionRoot } = useAppContext();
    const history = useHistory();
    const [reloadKey, reload] = useReload();
    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>(undefined);
    const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined);

    const getPosts = useMemo(
        () => (_search: string, paging: Pagination, sorting: Sorting<Post>) => {
            console.debug("Reloading", reloadKey);

            return compositionRoot.blog.get.execute({ paging, sorting }).toPromise();
        },
        [compositionRoot.blog.get, reloadKey]
    );

    const onClickEditPost = useCallback(
        (id: string) => {
            if (id) {
                history.push(`/edit-blog/${id}`);
            }
        },
        [history]
    );

    const onClickCreatePost = useCallback(() => {
        history.push(`/create-blog`);
    }, [history]);

    const onClickDeletePost = useCallback(
        async (id: string) => {
            if (id) {
                compositionRoot.blog.getById.execute(id).run(
                    (postData: Post) => {
                        setCurrentPost(postData);
                    },
                    error => {
                        console.error(error);
                        setCurrentPost(undefined);
                        setGlobalMessage({
                            text: i18n.t(`Error loading post: ${error}`),
                            type: "error",
                        });
                    }
                );
            }
        },
        [compositionRoot.blog.getById]
    );

    const onCancelDeletePost = useCallback(() => {
        setCurrentPost(undefined);
    }, []);

    const onDeletePost = useCallback(() => {
        setCurrentPost(undefined);
    }, []);

    return {
        getPosts,
        onClickDeletePost,
        onClickEditPost,
        onClickCreatePost,
        onCancelDeletePost,
        onDeletePost,
        currentPostToDelete: currentPost,
        pagination,
        initialSorting,
        globalMessage,
    };
}
