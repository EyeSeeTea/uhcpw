import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { anything, instance, mock, when } from "ts-mockito";
import { CountryD2Repository } from "../../../../../data/repositories/CountryD2Repository";
import { ResourceCategoryD2Repository } from "../../../../../data/repositories/resources/ResourceCategoryD2Repository";
import { ResourceD2Repository } from "../../../../../data/repositories/resources/ResourceD2Repository";
import { ResourceThemeD2Repository } from "../../../../../data/repositories/resources/ResourceThemeD2Repository";
import { Country } from "../../../../../domain/entities/Country";
import { Future } from "../../../../../domain/entities/Future";
import {
    ComparativeAnalysis,
    CountryAnalysis,
    Multimedia,
    News,
    Resource,
} from "../../../../../domain/entities/resources/Resource";
import { ResourceCategory } from "../../../../../domain/entities/resources/ResourceCategory";
import { ResourceTheme } from "../../../../../domain/entities/resources/ResourceTheme";
import { customRenderWithRouterMatch } from "../../../../../utils/tests-ui";
import { ResourcesByTypePage } from "../ResourcesByTypePage";

let resourceRepository: ResourceD2Repository;
let resourceCategoryRepository: ResourceCategoryD2Repository;
let resourceThemeRepository: ResourceThemeD2Repository;
let countryRepository: CountryD2Repository;

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
});

async function verifyComparativeAnalysisItems(resources: ComparativeAnalysis[]) {
    const items = await screen.findAllByRole("listitem");

    resources.forEach((resource, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(resource.text) as HTMLImageElement;
        expect(image.src).toContain(resource.image);

        itemScope.getByText(resource.year);
        itemScope.getByText(resource.theme);

        resource.links.forEach(link => {
            expect(itemScope.getByRole("link", { name: link.language })).toHaveAttribute("href", link.url);
        });

        itemScope.getByText(resource.text);
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

        itemScope.getByText(resource.date);
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

        itemScope.getByText(resource.date);
    });
}

function renderPage(category: string) {
    customRenderWithRouterMatch(
        <ResourcesByTypePage />,
        { path: "/resources/:category", route: `/resources/${category}` },
        {
            resource: resourceRepository,
            resourceCategory: resourceCategoryRepository,
            resourceTheme: resourceThemeRepository,
            country: countryRepository,
        }
    );
}

function givenAComparativeAnalysisResources(count: number): ComparativeAnalysis[] {
    const mockedRepository = mock(ResourceD2Repository);
    const themes = givenAResourcesThemes();

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "comparative-analysis" as const,
            image: `http://image${index}.png`,
            theme: (index % 2 === 0 ? themes[0]?.name : themes[1]?.name) || "",
            links: [
                { url: `http://link${Math.random()}.pdf`, language: "English" },
                { url: `http://link${Math.random()}.pdf`, language: "Spain" },
            ],
            text: `title ${index}`,
            year: (new Date().getFullYear() - index).toString(),
        };
    });

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenACountryAnalysisResources(count: number): CountryAnalysis[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "country-analysis" as const,
        };
    });

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenANewsResources(count: number): News[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "news" as const,
            image: `http://image${index}.png`,
            title: `title ${index}`,
            date: `${index} January 2023`,
            url: `http://news-${index}.html`,
        };
    });

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}

function givenAMultimediaResources(count: number): Multimedia[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = [...Array(count).keys()].map(index => {
        return {
            kind: "multimedia" as const,
            image: `http://image${index}.png`,
            title: `title ${index}`,
            date: `${index} January 2023`,
            url: `http://news-${index}.html`,
            theme: `test theme`,
        };
    });

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
        themes: givenAResourcesThemes(),
        countries: givenACountries(),
    };
}

function givenAResourceCategories(): ResourceCategory[] {
    const mockedRepository = mock(ResourceCategoryD2Repository);

    const data = [
        { id: "bcMc7kD0M98", name: "Comparative Analysis", code: "comparative-analysis" },
        { id: "lQ4chDNdjkA", name: "news", code: "news" },
        { id: "MXKMGulj2KF", name: "multimedia", code: "multimedia" },
        { id: "bkO3SJzKQeD", name: "Country Analysis", code: "country-analysis" },
    ];

    when(mockedRepository.getAll()).thenReturn(Future.success(data));

    resourceCategoryRepository = instance(mockedRepository);

    return data;
}

function givenAResourcesThemes(): ResourceTheme[] {
    const mockedRepository = mock(ResourceThemeD2Repository);

    const data = [
        { id: "QQMVsTNPJbB", name: "Spending on Health", code: "Spending on Health" },
        { id: "XtkFOVtkBtT", name: "Financial Protection", code: "Financial Protection" },
        { id: "nyzMcROMpmY", name: "Voluntary Health Insurance", code: "Voluntary Health Insurance" },
    ];

    when(mockedRepository.getAll()).thenReturn(Future.success(data));

    resourceThemeRepository = instance(mockedRepository);

    return data;
}

function givenACountries(): Country[] {
    const mockedRepository = mock(CountryD2Repository);

    const data = [
        {
            id: "DVnpk4xiXGJ",
            name: "Spain",
            code: "ESP",
            description: "description",
            color: "color",
            coordinates: [2982, 12] as [number, number],
            parents: [{ id: "EUR", name: "Europe" }],
        },
    ];

    when(mockedRepository.get()).thenReturn(Future.success(data));

    countryRepository = instance(mockedRepository);

    return data;
}

async function selectFiltersAndSearch(theme?: string, country?: string, year?: string) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    //await selectFilter(main, "Theme", theme || "Financial Protection");

    await selectCountry(main, country || "Spain");

    await selectFilter(main, "Years", year || "2020");

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

    userEvent.click(await screen.findByText("All countries"));
    userEvent.click(await screen.findByRole("checkbox", { name: value }));

    userEvent.keyboard("{Escape}");

    await screen.findByLabelText(/countries/i);
}
