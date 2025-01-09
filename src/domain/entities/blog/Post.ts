import { Id } from "../Ref";

export type Post = {
    id: Id;
    title: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    image: string;
    content: string;
};
