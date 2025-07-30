import { Id } from "./Ref";

export type Region = {
    id: Id;
    name: string;
    countries?: Id[];
};
