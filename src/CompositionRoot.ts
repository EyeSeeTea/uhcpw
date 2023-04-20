import { Instance } from "./data/entities/Instance";
import { CountryD2Repository } from "./data/repositories/CountryD2Repository";
import { DataSetD2Repository } from "./data/repositories/DataSetD2Repository";
import { InstanceDefaultRepository } from "./data/repositories/InstanceDefaultRepository";
import { ResourceD2Repository } from "./data/repositories/resources/ResourceD2Repository";
import { PolicyExplorerCategoryD2Repository } from "./data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { PolicyExplorerD2Repository } from "./data/repositories/policy-explorer/PolicyExplorerD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { VisualizationD2Repository } from "./data/repositories/VisualizationD2Repository";
import { GetCountriesUseCase } from "./domain/usecases/GetCountriesUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetInstanceVersionUseCase } from "./domain/usecases/GetInstanceVersionUseCase";
import { GetResourcesUseCase } from "./domain/usecases/resources/GetResourcesUseCase";
import { GetIndicatorExplorerYearsUseCase } from "./domain/usecases/indicator-explorer/GetIndicatorExplorerYearsUseCase";
import { GetVisualizationByIdUseCase } from "./domain/usecases/indicator-explorer/GetVisualizationByIdUseCase";
import { GetVisualizationsUseCase } from "./domain/usecases/indicator-explorer/GetVisualizationsUseCase";
import { DownloadPolicyExplorerUseCase } from "./domain/usecases/policy-explorer/DownloadPolicyExplorerUseCase";
import { GetPolicyExplorerCategoriesUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerCategoriesUseCase";
import { GetPolicyExplorerUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerUseCase";
import { GetPolicyExplorerYearsUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerYearsUseCase";
import { D2Api } from "./types/d2-api";
import { GetResourceCategoriesUseCase } from "./domain/usecases/resources/GetResourceCategoriesUseCase";
import { ResourceCategoryD2Repository } from "./data/repositories/resources/ResourceCategoryD2Repository";
import { ResourceThemeD2Repository } from "./data/repositories/resources/ResourceThemeD2Repository";
import { GetResourceThemesUseCase } from "./domain/usecases/resources/GetResourceThemesUseCase";

export function getCompositionRoot(api: D2Api, instance: Instance) {
    const instanceRepository = new InstanceDefaultRepository(instance);
    const usersRepository = new UserD2Repository(api);
    const countryRepository = new CountryD2Repository(api);
    const dataSetRepository = new DataSetD2Repository(api);
    const policyExplorerCategoryRepository = new PolicyExplorerCategoryD2Repository(api);
    const policyExplorerRepository = new PolicyExplorerD2Repository(api);
    const visualizationRepository = new VisualizationD2Repository(api);
    const resourceRepository = new ResourceD2Repository(api);
    const resourceCategoryD2Repository = new ResourceCategoryD2Repository(api);
    const resourceThemeD2Repository = new ResourceThemeD2Repository(api);

    return {
        instance: {
            getVersion: new GetInstanceVersionUseCase(instanceRepository),
        },
        users: {
            getCurrent: new GetCurrentUserUseCase(usersRepository),
        },
        countries: {
            get: new GetCountriesUseCase(countryRepository),
        },
        policyExplorer: {
            getYears: new GetPolicyExplorerYearsUseCase(dataSetRepository),
            getCategories: new GetPolicyExplorerCategoriesUseCase(policyExplorerCategoryRepository),
            get: new GetPolicyExplorerUseCase(policyExplorerRepository, countryRepository),
            download: new DownloadPolicyExplorerUseCase(policyExplorerRepository),
        },
        indicatorExplorer: {
            getYears: new GetIndicatorExplorerYearsUseCase(dataSetRepository),
            getVisualizations: new GetVisualizationsUseCase(visualizationRepository),
            getVisualization: new GetVisualizationByIdUseCase(visualizationRepository),
        },
        resources: {
            get: new GetResourcesUseCase(resourceRepository),
            getCategories: new GetResourceCategoriesUseCase(resourceCategoryD2Repository),
            getThemes: new GetResourceThemesUseCase(resourceThemeD2Repository),
        },
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
