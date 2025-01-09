import { useEffect, useState } from "react";

import { useAppContext } from "../../contexts/app-context";
import { Maybe } from "../../../types/utils";
import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";
import { Post } from "../../../domain/entities/blog/Post";

type State = {
    postState: PostLoadState;
    globalMessage: Maybe<GlobalMessage>;
};

type PostState = {
    id: Id;
    title: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    image: string;
    content: string;
};

export type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

export type PostStateLoaded = {
    kind: "loaded";
    data: PostState;
};

export type PostStateLoading = {
    kind: "loading";
};

export type PostStateError = {
    kind: "error";
    message: string;
};

export type PostLoadState = PostStateLoaded | PostStateLoading | PostStateError;

export function usePost(id: Id): State {
    const { compositionRoot } = useAppContext();

    const [postState, setPostState] = useState<PostLoadState>({ kind: "loading" });
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();

    useEffect(() => {
        compositionRoot.blog.getById.execute(id).run(
            (postData: Post) => {
                setPostState({
                    kind: "loaded",
                    data: mapPostToPostState(postData),
                });
            },
            error => {
                console.error(error);
                setPostState({
                    kind: "error",
                    message: i18n.t(`Error loading post: ${error}`),
                });
                setGlobalMessage({
                    text: i18n.t(`Error loading post: ${error}`),
                    type: "error",
                });
            }
        );
    }, [compositionRoot.blog.getById, id]);

    return {
        postState: postState,
        globalMessage: globalMessage,
    };
}

function mapPostToPostState(post: Post): PostState {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        createdDate: post.createdDate,
        updatedDate: post.updatedDate,
        image: post.image,
        content: post.content,
    };
}
