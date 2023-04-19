import { Instance } from "./data/entities/Instance";
import { CountryD2Repository } from "./data/repositories/CountryD2Repository";
import { DataSetD2Repository } from "./data/repositories/DataSetD2Repository";
import { InstanceDefaultRepository } from "./data/repositories/InstanceDefaultRepository";
import { ResourceD2Repository } from "./data/repositories/ResourceD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { VisualizationD2Repository } from "./data/repositories/VisualizationD2Repository";
import { GetCountriesUseCase } from "./domain/usecases/GetCountriesUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetInstanceVersionUseCase } from "./domain/usecases/GetInstanceVersionUseCase";
import { GetResourcesUseCase } from "./domain/usecases/GetResourcesUseCase";
import { GetIndicatorExplorerYearsUseCase } from "./domain/usecases/indicator-explorer/GetIndicatorExplorerYearsUseCase";
import { GetVisualizationByIdUseCase } from "./domain/usecases/indicator-explorer/GetVisualizationByIdUseCase";
import { GetVisualizationsUseCase } from "./domain/usecases/indicator-explorer/GetVisualizationsUseCase";
import { GetPolicyExplorerYearsUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerYearsUseCase";
import { D2Api } from "./types/d2-api";

export function getCompositionRoot(api: D2Api, instance: Instance) {
    const instanceRepository = new InstanceDefaultRepository(instance);
    const usersRepository = new UserD2Repository(api);
    const countryRepository = new CountryD2Repository(api);
    const dataSetRepository = new DataSetD2Repository(api);
    const visualizationRepository = new VisualizationD2Repository(api);
    const resourceRepository = new ResourceD2Repository(api);

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
        },
        indicatorExplorer: {
            getYears: new GetIndicatorExplorerYearsUseCase(dataSetRepository),
            getVisualizations: new GetVisualizationsUseCase(visualizationRepository),
            getVisualization: new GetVisualizationByIdUseCase(visualizationRepository),
        },
        resources: {
            get: new GetResourcesUseCase(resourceRepository),
        },
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
