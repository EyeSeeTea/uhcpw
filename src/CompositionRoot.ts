import { Instance } from "./data/entities/Instance";
import { CountryD2Repository } from "./data/repositories/CountryD2Repository";
import { DataSetD2Repository } from "./data/repositories/DataSetD2Repository";
import { InstanceDefaultRepository } from "./data/repositories/InstanceDefaultRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { GetCountriesUseCase } from "./domain/usecases/GetCountriesUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetInstanceVersionUseCase } from "./domain/usecases/GetInstanceVersionUseCase";
import { GetPolicyExplorerYearsUseCase } from "./domain/usecases/GetPolicyExplorerYearsUseCase";
import { D2Api } from "./types/d2-api";

export function getCompositionRoot(api: D2Api, instance: Instance) {
    const instanceRepository = new InstanceDefaultRepository(instance);
    const usersRepository = new UserD2Repository(api);
    const countryRepository = new CountryD2Repository(api);
    const dataSetRepository = new DataSetD2Repository(api);

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
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
