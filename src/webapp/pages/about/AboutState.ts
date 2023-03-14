export type ResourcesState = {
    team: Person[];
    experts: Person[];
};

export type Person = {
    image: string;
    name: string;
    position: string;
    linkedin: string;
    email: string;
    twitter?: string;
    country?: string;
};
