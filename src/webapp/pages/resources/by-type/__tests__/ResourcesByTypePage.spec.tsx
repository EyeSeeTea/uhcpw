import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { anything, instance, mock, when } from "ts-mockito";
import { ResourceCategoryD2Repository } from "../../../../../data/repositories/resources/ResourceCategoryD2Repository";
import { ResourceD2Repository } from "../../../../../data/repositories/resources/ResourceD2Repository";
import { Future } from "../../../../../domain/entities/Future";
import {
    ComparativeAnalysis,
    CountryAnalysis,
    Multimedia,
    News,
    Resource,
} from "../../../../../domain/entities/resources/Resource";
import { ResourceCategory } from "../../../../../domain/entities/resources/ResourceCategory";
import { customRenderWithRouterMatch, givenACountries } from "../../../../../utils/tests-ui";
import {
    createComparativeAnalysisResources,
    createCountryAnalysisResources,
    createMultimediaResources,
    createNewsResources,
    createResourceCategories,
} from "../../common/__tests__/helpers";
import { ResourcesByTypePage } from "../ResourcesByTypePage";

let resourceRepository: ResourceD2Repository;
let resourceCategoryRepository: ResourceCategoryD2Repository;

describe("ResourcesByTypePage for ", () => {
    beforeEach(() => {
        givenAFilters();
    });

    describe("comparative analysis", () => {
        it("should render comparative analysis title", async () => {
            givenAComparativeAnalysisResources(0);

            renderPage("comparative-analysis");

            expect(screen.getByRole("heading", { name: /comparative analysis/i })).toBeInTheDocument();
        });
        it("should render any items if there not resources", async () => {
            givenAComparativeAnalysisResources(0);

            renderPage("comparative-analysis");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render any items if get resources fail", async () => {
            givenAnErrorToGetResources();

            renderPage("comparative-analysis");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render expected item count", async () => {
            givenAComparativeAnalysisResources(5);

            renderPage("comparative-analysis");

            await selectFiltersAndSearch();

            await screen.findAllByRole("listitem");

            expect(await screen.findAllByRole("listitem")).toHaveLength(5);
        });
        it("should render expected items content", async () => {
            const resources = givenAComparativeAnalysisResources(5);

            renderPage("comparative-analysis");

            await selectFiltersAndSearch();

            await verifyComparativeAnalysisItems(resources);
        });
    });

    describe("news", () => {
        it("should render news title", async () => {
            givenANewsResources(0);

            renderPage("news");

            await selectFiltersAndSearch();

            expect(screen.getByRole("heading", { name: /news/i })).toBeInTheDocument();
        });
        it("should render any items if there not resources", async () => {
            givenANewsResources(0);

            renderPage("news");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render any items if get resources fail", async () => {
            givenAnErrorToGetResources();

            renderPage("news");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render expected item count", async () => {
            givenANewsResources(5);

            renderPage("news");

            await selectFiltersAndSearch();

            await screen.findAllByRole("listitem");

            expect(await screen.findAllByRole("listitem")).toHaveLength(5);
        });
        it("should render expected items content", async () => {
            const resources = givenANewsResources(5);

            renderPage("news");

            await selectFiltersAndSearch();

            await verifyNewsItems(resources);
        });
    });

    describe("multimedia", () => {
        it("should render multimedia title", async () => {
            givenAMultimediaResources(0);

            renderPage("multimedia");

            await selectFiltersAndSearch();

            expect(screen.getByRole("heading", { name: /multimedia/i })).toBeInTheDocument();
        });
        it("should render any items if there not resources", async () => {
            givenAMultimediaResources(0);

            renderPage("multimedia");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render any items if get resources fail", async () => {
            givenAnErrorToGetResources();

            renderPage("multimedia");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render expected item count", async () => {
            givenAMultimediaResources(5);

            renderPage("multimedia");

            await selectFiltersAndSearch();

            await screen.findAllByRole("listitem");

            expect(await screen.findAllByRole("listitem")).toHaveLength(5);
        });
        it("should render expected items content", async () => {
            const resources = givenAMultimediaResources(5);

            renderPage("multimedia");

            await selectFiltersAndSearch();

            await verifyMultimediaItems(resources);
        });
    });

    describe("country analysis", () => {
        it("should render comparative analysis title", async () => {
            givenACountryAnalysisResources(0);

            renderPage("country-analysis");

            await selectFiltersAndSearch();

            expect(screen.getByRole("heading", { name: /country analysis/i })).toBeInTheDocument();
        });
        it("should render any items if there not resources", async () => {
            givenACountryAnalysisResources(0);

            renderPage("country-analysis");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render any items if get resources fail", async () => {
            givenAnErrorToGetResources();

            renderPage("country-analysis");

            await selectFiltersAndSearch();

            expect(screen.queryAllByRole("listitem")).toHaveLength(0);
        });
        it("should render expected item count", async () => {
            givenACountryAnalysisResources(5);

            renderPage("country-analysis");

            await selectFiltersAndSearch();

            await screen.findAllByRole("listitem");

            expect(await screen.findAllByRole("listitem")).toHaveLength(5);
        });
        it("should render expected items content", async () => {
            const resources = givenACountryAnalysisResources(5);

            renderPage("country-analysis");

            await selectFiltersAndSearch();

            await verifyCountryAnalysisItems(resources);
        });
    });
});

function renderPage(category: string) {
    customRenderWithRouterMatch(
        <ResourcesByTypePage />,
        { path: "/resources/:category", route: `/resources/${category}` },
        {
            resource: resourceRepository,
            resourceCategory: resourceCategoryRepository,
        }
    );
}

async function verifyComparativeAnalysisItems(resources: ComparativeAnalysis[]) {
    const items = await screen.findAllByRole("listitem");

    resources.forEach((resource, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(resource.title) as HTMLImageElement;
        expect(image.src).toContain(resource.image);

        itemScope.getByText(resource.date.getFullYear());
        itemScope.getByText(resource.theme);

        resource.links.forEach(link => {
            expect(itemScope.getByRole("link", { name: link.language })).toHaveAttribute("href", link.url);
        });

        itemScope.getByText(resource.title);
    });
}

async function verifyNewsItems(resources: News[]) {
    const items = await screen.findAllByRole("listitem");

    resources.forEach((resource, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(resource.title) as HTMLImageElement;
        expect(image.src).toContain(resource.image);

        const links = itemScope.queryAllByRole("link");
        expect(itemScope.queryAllByRole("link").length).toBeGreaterThan(0);

        links.forEach(link => {
            expect(link).toHaveAttribute("href", resource.url);
        });

        itemScope.getByText(moment(resource.date).format("DD MMMM YYYY"));
    });
}

async function verifyMultimediaItems(resources: Multimedia[]) {
    const items = await screen.findAllByRole("listitem");

    resources.forEach((resource, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(resource.title) as HTMLImageElement;
        expect(image.src).toContain(resource.image);

        const links = itemScope.queryAllByRole("link");
        expect(itemScope.queryAllByRole("link").length).toBeGreaterThan(0);

        links.forEach(link => {
            expect(link).toHaveAttribute("href", resource.url);
        });

        itemScope.getByText(resource.date.getFullYear());
    });
}

async function verifyCountryAnalysisItems(resources: CountryAnalysis[]) {
    const items = await screen.findAllByRole("listitem");

    const countries = givenACountries();
    const country = countries[0];

    resources.forEach((resource, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const flag = itemScope.getByAltText(country?.name || "") as HTMLImageElement;
        expect(flag.src).toContain(country?.flag);
        itemScope.getByText(country?.name || "", { exact: true });

        const image = itemScope.getByAltText(resource.title) as HTMLImageElement;
        expect(image.src).toContain(resource.image);

        itemScope.getByText(resource.date.getFullYear());
        itemScope.getByText(resource.theme);

        resource.links.forEach(link => {
            expect(itemScope.getByRole("link", { name: link.language })).toHaveAttribute("href", link.url);
        });

        itemScope.getByText(resource.title);
    });
}

function givenAComparativeAnalysisResources(count: number): ComparativeAnalysis[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = createComparativeAnalysisResources(count);

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenACountryAnalysisResources(count: number): CountryAnalysis[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = createCountryAnalysisResources(count);

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenANewsResources(count: number): News[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = createNewsResources(count);

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenAMultimediaResources(count: number): Multimedia[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = createMultimediaResources(count);

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenAnErrorToGetResources(): Resource[] {
    const mockedRepository = mock(ResourceD2Repository);

    when(mockedRepository.get(anything())).thenReturn(Future.error("An error has ocurred retrieving resources"));

    resourceRepository = instance(mockedRepository);

    return [];
}

function givenAFilters() {
    return {
        categories: givenAResourceCategories(),
    };
}

function givenAResourceCategories(): ResourceCategory[] {
    const mockedRepository = mock(ResourceCategoryD2Repository);

    const data = createResourceCategories();

    when(mockedRepository.getAll()).thenReturn(Future.success(data));

    resourceCategoryRepository = instance(mockedRepository);

    return data;
}

async function selectFiltersAndSearch(theme?: string, country?: string, year?: string) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    //await selectFilter(main, "Theme", theme || "Financial Protection");

    //await selectCountry(main, country || "Spain");

    //await selectFilter(main, "Years", year || "2020");

    const searchButton = main.getByLabelText(/search/i);

    userEvent.click(searchButton);
}

async function selectFilter(scope: BoundFunctions<typeof queries>, name: string, value: string) {
    const autocompleteInput = scope.getByLabelText(name);

    userEvent.click(autocompleteInput);

    const targetItem = await waitFor(() => screen.getByRole("option", { name: value }));

    userEvent.click(targetItem);
}

async function selectCountry(scope: BoundFunctions<typeof queries>, value: string) {
    const countrySelector = scope.getByLabelText(/countries/i);

    userEvent.click(countrySelector);

    userEvent.click(await screen.findByRole("checkbox", { name: value }));

    userEvent.keyboard("{Escape}");

    await screen.findByLabelText(/countries/i);
}
