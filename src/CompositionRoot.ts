import { Instance } from "./data/entities/Instance";
import { CountryD2Repository } from "./data/repositories/countries/CountryD2Repository";
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
import { ExplainerD2Repository } from "./data/repositories/explainers/ExplainerD2Repository";
import { GetExplainerUseCase } from "./domain/usecases/explainers/GetExplainerUseCase";
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
import { GeneralContentD2Repository } from "./data/repositories/GeneralContentD2Repository";
import { GetGeneralContentUseCase } from "./domain/usecases/GetGeneralContentUseCase";
import { GoogleAnalyticsRepository } from "./data/repositories/GoogleAnalyticsRepository";
import { SendPageViewUseCase } from "./domain/usecases/SendPageViewUseCase";
import { SendEventUseCase } from "./domain/usecases/SendEventUseCase";
import { DataStoreClient } from "./data/DataStoreClient";
import { GetIndicatorsUseCase } from "./domain/usecases/indicator-explorer/GetIndicatorsUseCase";
import { IndicatorSeedsRepository } from "./data/repositories/indicator-explorer/IndicatorSeedsRepository";
import { RegionD2Repository } from "./data/repositories/regions/RegionD2Repository";
import { GetRegionsUseCase } from "./domain/usecases/region/GetRegionsUseCase";
import { GetRegionInfoUseCase } from "./domain/usecases/region/GetRegionInfoUseCase";
import { RegionInfoD2Repository } from "./data/repositories/regions/RegionInfoD2Repository";
import { GetChecklistPolicyMakersUseCase } from "./domain/usecases/region/GetChecklistPolicyMakersUseCase";
import { ChecklistPolicyMakersD2Repository } from "./data/repositories/regions/ChecklistPolicyMakersD2Repository";
import { GetCountryExperiencesUseCase } from "./domain/usecases/region/GetCountryExperiencesUseCase";
import { CountryExperienceD2Repository } from "./data/repositories/regions/CountryExperienceD2Repository";
import { GetPolicyExplorerChartDataUseCase } from "./domain/usecases/indicator-explorer/GetPolicyExplorerChartDataUseCase";
import { PolicyExplorerChartDataD2Repository } from "./data/repositories/indicator-explorer/PolicyExplorerChartDataD2Repository";

function initializeRepositories(api: D2Api, d2DataEngine: unknown, instance: Instance) {
    const dataStoreClient = new DataStoreClient(api);
    return {
        analytics: new AnalyticsD2Repository(api, d2DataEngine, dataStoreClient),
        instance: new InstanceDefaultRepository(instance),
        users: new UserD2Repository(api),
        country: new CountryD2Repository(api),
        policyExplorerCategory: new PolicyExplorerCategoryD2Repository(api),
        policyExplorer: new PolicyExplorerD2Repository(api),
        visualization: new VisualizationD2Repository(api),
        resource: new ResourceD2Repository(api),
        resourceCategory: new ResourceCategoryD2Repository(api),
        resourceTheme: new ResourceThemeD2Repository(api),
        explainer: new ExplainerD2Repository(api),
        person: new PersonD2Repository(api),
        method: new MethodD2Repository(api),
        legendSet: new LegendSetD2Repository(api),
        countryPageInfo: new CountryPageInfoD2Repository(api),
        aboutInfo: new AboutInfoD2Repository(api),
        indicatorExplorer: new IndicatorExplorerD2Repository(api),
        homePage: new HomePageContentD2Repository(api),
        generalContent: new GeneralContentD2Repository(api),
        googleAnalytics: new GoogleAnalyticsRepository(),
        indicator: new IndicatorSeedsRepository(),
        region: new RegionD2Repository(api),
        regionInfo: new RegionInfoD2Repository(api),
        checklistPolicyMakers: new ChecklistPolicyMakersD2Repository(api),
        countryExperience: new CountryExperienceD2Repository(api),
        policyExplorerChartData: new PolicyExplorerChartDataD2Repository(api),
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
        },
        regions: {
            get: new GetRegionsUseCase(repositories.region),
            getInfo: new GetRegionInfoUseCase(repositories.regionInfo),
            getChecklistPolicyMakers: new GetChecklistPolicyMakersUseCase(repositories.checklistPolicyMakers),
            getCountryExperiences: new GetCountryExperiencesUseCase(repositories.countryExperience),
        },
        policyExplorer: {
            getCategories: new GetPolicyExplorerCategoriesUseCase(repositories.policyExplorerCategory),
            getSelectCategoryInfo: new GetPolicyExplorerSelectCategoryInfoUseCase(repositories.policyExplorerCategory),
            get: new GetPolicyExplorerUseCase(repositories.policyExplorer),
            download: new DownloadPolicyExplorerUseCase(repositories.policyExplorer),
        },
        indicatorExplorer: {
            getIndicators: new GetIndicatorsUseCase(repositories.indicator),
            getVisualizations: new GetVisualizationsUseCase(repositories.visualization),
            getVisualization: new GetVisualizationByIdUseCase(repositories.visualization),
            getAnalytics: new GetAnalyticsUseCase(repositories.visualization, repositories.analytics),
            downloadAnalytics: new DownloadAnalyticsUseCase(
                repositories.visualization,
                repositories.analytics,
                repositories.policyExplorerChartData
            ),
            getLegendSets: new GetLegendSetsUseCase(repositories.legendSet),
            getPageContent: new GetIndicatorExplorerPageContentUseCase(repositories.indicatorExplorer),
            getPolicyExplorerChartData: new GetPolicyExplorerChartDataUseCase(repositories.policyExplorerChartData),
        },
        resources: {
            get: new GetResourcesUseCase(repositories.resource),
            getCategories: new GetResourceCategoriesUseCase(repositories.resourceCategory),
            getThemes: new GetResourceThemesUseCase(repositories.resourceTheme),
        },
        explainers: {
            get: new GetExplainerUseCase(repositories.explainer),
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
        general: {
            getContent: new GetGeneralContentUseCase(repositories.generalContent),
        },
        googleAnalytics: {
            sendPageView: new SendPageViewUseCase(repositories.googleAnalytics),
            sendEvent: new SendEventUseCase(repositories.googleAnalytics),
        },
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
