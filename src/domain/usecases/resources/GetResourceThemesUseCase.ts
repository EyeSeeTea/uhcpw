import { FutureData } from "../../entities/Future";
import { ResourceTheme } from "../../entities/resources/ResourceTheme";
import { ResourceThemeRepository } from "../../repositories/resources/ResourceThemeRepository";

export class GetResourceThemesUseCase {
    constructor(private resourceThemeRepository: ResourceThemeRepository) {}

    public execute(): FutureData<ResourceTheme[]> {
        return this.resourceThemeRepository.getAll();
    }
}
