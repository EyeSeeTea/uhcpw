import { Post } from "../../../domain/entities/blog/Post";
import { PaginatedReponse, Pagination, Sorting } from "../../../domain/entities/Pagination";

export interface AdminBlogState {
    getPosts: (_search: string, paging: Pagination, sorting: Sorting<Post>) => Promise<PaginatedReponse<Post>>;
    onClickDeletePost: (id: string) => Promise<void>;
    onClickEditPost: (id: string) => void;
    onClickCreatePost: () => void;
    onCancelDeletePost: () => void;
    onDeletePost: () => void;
    currentPostToDelete?: Post;
    pagination: {
        pageSizeOptions: number[];
        pageSizeInitialValue: number;
    };
    initialSorting: Sorting<Post>;
    globalMessage?: GlobalMessage;
}

export interface GlobalMessage {
    text: string;
    type: "success" | "error";
}
