import { Resource } from "../../../../domain/entities/resources/Resource";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type ResourcesByTypeState = {
    title: string;
    filters: ResourcesFiltersState;
    items: Resource[];
};
