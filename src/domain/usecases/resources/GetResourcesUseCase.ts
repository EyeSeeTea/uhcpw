import { Future, FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";
import { ResourceFilters, ResourceRepository } from "../../repositories/resources/ResourceRepository";
import { ResourceThemeRepository } from "../../repositories/resources/ResourceThemeRepository";

export type GetResourcesFilters = Omit<ResourceFilters, "themeCode"> & {
    /** Theme name, as the theme filter shows it */
    theme?: string;
};

export class GetResourcesUseCase {
    constructor(
        private resourceRepository: ResourceRepository,
        private resourceThemeRepository: ResourceThemeRepository
    ) {}

    public execute(filters: GetResourcesFilters): FutureData<Resource[]> {
        const { theme: themeName, ...otherFilters } = filters;

        if (!themeName) return this.resourceRepository.get(otherFilters);

        return this.resourceThemeRepository.getAll().flatMap(themes => {
            const theme = themes.find(theme => theme.name.toLowerCase() === themeName.toLowerCase());

            return theme
                ? this.resourceRepository.get({ ...otherFilters, themeCode: theme.code })
                : Future.success<Resource[], string>([]);
        });
    }
}
