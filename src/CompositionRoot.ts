import { Instance } from "./data/entities/Instance";
import { CountryD2Repository } from "./data/repositories/CountryD2Repository";
import { InstanceDefaultRepository } from "./data/repositories/InstanceDefaultRepository";
import { ResourceD2Repository } from "./data/repositories/resources/ResourceD2Repository";
import { PolicyExplorerCategoryD2Repository } from "./data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { PolicyExplorerD2Repository } from "./data/repositories/policy-explorer/PolicyExplorerD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { VisualizationD2Repository } from "./data/repositories/indicator-explorer/VisualizationD2Repository";
import { GetCountriesUseCase } from "./domain/usecases/GetCountriesUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetInstanceVersionUseCase } from "./domain/usecases/GetInstanceVersionUseCase";
import { GetResourcesUseCase } from "./domain/usecases/resources/GetResourcesUseCase";
import { GetVisualizationByIdUseCase } from "./domain/usecases/indicator-explorer/GetVisualizationByIdUseCase";
import { GetVisualizationsUseCase } from "./domain/usecases/indicator-explorer/GetVisualizationsUseCase";
import { DownloadPolicyExplorerUseCase } from "./domain/usecases/policy-explorer/DownloadPolicyExplorerUseCase";
import { GetPolicyExplorerCategoriesUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerCategoriesUseCase";
import { GetPolicyExplorerUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerUseCase";
import { D2Api } from "./types/d2-api";
import { GetResourceCategoriesUseCase } from "./domain/usecases/resources/GetResourceCategoriesUseCase";
import { ResourceCategoryD2Repository } from "./data/repositories/resources/ResourceCategoryD2Repository";
import { ResourceThemeD2Repository } from "./data/repositories/resources/ResourceThemeD2Repository";
import { GetResourceThemesUseCase } from "./domain/usecases/resources/GetResourceThemesUseCase";
import { GetAnalyticsUseCase } from "./domain/usecases/indicator-explorer/GetAnalyticsUseCase";
import { AnalyticsD2Repository } from "./data/repositories/indicator-explorer/AnalyticsD2Repository";
import { GetPersonsUseCase } from "./domain/usecases/GetPersonsUseCase";
import { PersonD2Repository } from "./data/repositories/PersonD2Repository";
import { MethodD2Repository } from "./data/repositories/MethodD2Repository";
import { GetMethodsUseCase } from "./domain/usecases/GetMethodsUseCase";
import { GetLegendSetsUseCase } from "./domain/usecases/indicator-explorer/GetLegendSets";
import { LegendSetD2Repository } from "./data/repositories/indicator-explorer/LegendSetD2Repository";
import { DownloadAnalyticsUseCase } from "./domain/usecases/indicator-explorer/DownloadAnalyticsUseCase";
import { GetSliderInfoUseCase } from "./domain/usecases/country-page/GetSliderInfoUseCase";
import { CountryPageInfoD2Repository } from "./data/repositories/country-page/CountryPageInfoD2Repository";
import { GetOfficeInfoUseCase } from "./domain/usecases/about/GetOfficeInfoUseCase";
import { AboutInfoD2Repository } from "./data/repositories/about/AboutInfoD2Repository";
import { GetPolicyExplorerSelectCategoryInfoUseCase } from "./domain/usecases/policy-explorer/GetPolicyExplorerSelectCategoryInfoUseCase";
import { GetIndicatorExplorerPageContentUseCase } from "./domain/usecases/indicator-explorer/GetIndicatorExplorerPageContentUseCase";
import { IndicatorExplorerD2Repository } from "./data/repositories/indicator-explorer/IndicatorExplorerD2Repository";
import { GetHomePageContentUseCase } from "./domain/usecases/GetHomePageContentUseCase";
import { HomePageContentD2Repository } from "./data/repositories/HomePageContentD2Repository";
import { GetEurCountriesRegionUseCase } from "./domain/usecases/GetEurCountriesRegionUseCase";

function initializeRepositories(api: D2Api, d2DataEngine: unknown, instance: Instance) {
    return {
        analytics: new AnalyticsD2Repository(api, d2DataEngine),
        instance: new InstanceDefaultRepository(instance),
        users: new UserD2Repository(api),
        country: new CountryD2Repository(api),
        policyExplorerCategory: new PolicyExplorerCategoryD2Repository(api),
        policyExplorer: new PolicyExplorerD2Repository(api),
        visualization: new VisualizationD2Repository(api),
        resource: new ResourceD2Repository(api),
        resourceCategory: new ResourceCategoryD2Repository(api),
        resourceTheme: new ResourceThemeD2Repository(api),
        person: new PersonD2Repository(api),
        method: new MethodD2Repository(api),
        legendSet: new LegendSetD2Repository(api),
        countryPageInfo: new CountryPageInfoD2Repository(api),
        aboutInfo: new AboutInfoD2Repository(api),
        indicatorExplorer: new IndicatorExplorerD2Repository(api),
        homePage: new HomePageContentD2Repository(api),
    };
}

export type Repositories = Partial<ReturnType<typeof initializeRepositories>>;

export function getCompositionRoot(
    api: D2Api,
    d2DataEngine: unknown,
    instance: Instance,
    repositoriesToOverwrite?: Repositories
) {
    const repositories = { ...initializeRepositories(api, d2DataEngine, instance), ...repositoriesToOverwrite };

    return {
        instance: {
            getVersion: new GetInstanceVersionUseCase(repositories.instance),
        },
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.users),
        },
        countries: {
            get: new GetCountriesUseCase(repositories.country),
            getEurCountriesRegion: new GetEurCountriesRegionUseCase(repositories.country),
        },
        policyExplorer: {
            getCategories: new GetPolicyExplorerCategoriesUseCase(repositories.policyExplorerCategory),
            getSelectCategoryInfo: new GetPolicyExplorerSelectCategoryInfoUseCase(repositories.policyExplorerCategory),
            get: new GetPolicyExplorerUseCase(repositories.policyExplorer, repositories.country),
            download: new DownloadPolicyExplorerUseCase(repositories.policyExplorer),
        },
        indicatorExplorer: {
            getVisualizations: new GetVisualizationsUseCase(repositories.visualization),
            getVisualization: new GetVisualizationByIdUseCase(repositories.visualization),
            getAnalytics: new GetAnalyticsUseCase(repositories.visualization, repositories.analytics),
            downloadAnalytics: new DownloadAnalyticsUseCase(repositories.visualization, repositories.analytics),
            getLegendSets: new GetLegendSetsUseCase(repositories.legendSet),
            getPageContent: new GetIndicatorExplorerPageContentUseCase(repositories.indicatorExplorer),
        },
        resources: {
            get: new GetResourcesUseCase(repositories.resource),
            getCategories: new GetResourceCategoriesUseCase(repositories.resourceCategory),
            getThemes: new GetResourceThemesUseCase(repositories.resourceTheme),
        },
        about: {
            getPersons: new GetPersonsUseCase(repositories.person),
            getOfficeInfo: new GetOfficeInfoUseCase(repositories.aboutInfo),
        },
        method: {
            get: new GetMethodsUseCase(repositories.method),
        },
        home: {
            getPageContent: new GetHomePageContentUseCase(repositories.homePage),
        },
        countryPage: {
            getSliderInfo: new GetSliderInfoUseCase(repositories.countryPageInfo),
        },
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
