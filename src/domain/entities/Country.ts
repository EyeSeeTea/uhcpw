export type Country = {
    id: string;
    name: string;
    code: string;
    description: string;
    color: string;
    coordinates: [number, number];
    parents: { id: string; name: string }[];
    flag: string;
    summary: string;
};
