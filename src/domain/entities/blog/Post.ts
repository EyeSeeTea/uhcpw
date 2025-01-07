import { Id } from "../Ref";

export type Post = {
    id: Id;
    title: string;
    description: string;
    date: Date;
    image: string;
    content: string;
};
