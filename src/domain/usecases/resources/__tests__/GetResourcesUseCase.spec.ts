import { Future, FutureData } from "../../../entities/Future";
import { Resource } from "../../../entities/resources/Resource";
import { ResourceTheme } from "../../../entities/resources/ResourceTheme";
import { ResourceFilters, ResourceRepository } from "../../../repositories/resources/ResourceRepository";
import { ResourceThemeRepository } from "../../../repositories/resources/ResourceThemeRepository";
import { GetResourcesUseCase } from "../GetResourcesUseCase";

const financialProtection: ResourceTheme = {
    id: "XtkFOVtkBtT",
    code: "Financial Protection",
    name: "FP",
    displayedName: "Financial protection (FP)",
};

describe("GetResourcesUseCase", () => {
    describe("theme filter", () => {
        it("sends the code of the theme with the given name", async () => {
            const { useCase, requestedFilters } = givenAUseCase();

            await useCase.execute({ category: "news", theme: "fp" }).runAsync();

            expect(requestedFilters).toEqual([{ category: "news", themeCode: "Financial Protection" }]);
        });

        it("returns no resources without asking for them if no theme has the given name", async () => {
            const { useCase, requestedFilters } = givenAUseCase();

            const response = await useCase.execute({ theme: "Unknown" }).runAsync();

            expect(response.data).toEqual([]);
            expect(requestedFilters).toEqual([]);
        });

        it("sends no theme code without a theme", async () => {
            const { useCase, requestedFilters } = givenAUseCase();

            await useCase.execute({ category: "news" }).runAsync();

            expect(requestedFilters).toEqual([{ category: "news" }]);
        });
    });
});

function givenAUseCase() {
    const requestedFilters: ResourceFilters[] = [];

    const resourceRepository: ResourceRepository = {
        get: (filters: ResourceFilters): FutureData<Resource[]> => {
            requestedFilters.push(filters);
            return Future.success([]);
        },
    };

    const resourceThemeRepository: ResourceThemeRepository = {
        getAll: () => Future.success([financialProtection]),
    };

    return { useCase: new GetResourcesUseCase(resourceRepository, resourceThemeRepository), requestedFilters };
}
