import { FutureData } from "../../entities/Future";
import { ResourceTheme } from "../../entities/resources/ResourceTheme";

export interface ResourceThemeRepository {
    getAll(): FutureData<ResourceTheme[]>;
}
