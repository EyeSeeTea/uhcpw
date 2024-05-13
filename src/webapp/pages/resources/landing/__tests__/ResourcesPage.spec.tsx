import "@testing-library/jest-dom";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { anything, instance, mock, when } from "ts-mockito";
import { ResourceCategoryD2Repository } from "../../../../../data/repositories/resources/ResourceCategoryD2Repository";
import { ResourceD2Repository } from "../../../../../data/repositories/resources/ResourceD2Repository";
import { Future } from "../../../../../domain/entities/Future";
import { Resource } from "../../../../../domain/entities/resources/Resource";
import { ResourceCategory } from "../../../../../domain/entities/resources/ResourceCategory";
import { customRenderWithRouterMatch } from "../../../../../utils/tests-ui";
import {
    createComparativeAnalysisResources,
    createCountryAnalysisResources,
    createMultimediaResources,
    createNewsResources,
    createResourceCategories,
} from "../../common/__tests__/helpers";
import { ResourcesPage } from "../ResourcesPage";

let resourceRepository: ResourceD2Repository;
let resourceCategoryRepository: ResourceCategoryD2Repository;

describe("ResourcesPage", () => {
    beforeEach(() => {
        givenAFilters();
    });

    it("should render comparative analysis title", async () => {
        givenAResources(0);

        renderPage();

        expect(screen.getByRole("heading", { name: /resources/i })).toBeInTheDocument();
    });
    it("should render any items if there not resources", async () => {
        givenAResources(0);

        renderPage();

        search();

        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
    it("should render any items if get resources fail", async () => {
        givenAnErrorToGetResources();

        renderPage();

        search();

        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
    it("should render expected items content", async () => {
        givenAResources(7);

        renderPage();

        search();

        await verifyElementsInGroup("News", 1);
        await verifyElementsInGroup("Multimedia", 1);
        await verifyElementsInGroup("Country analysis", 1);
        await verifyElementsInGroup("Comparative analysis", 6);
    });
    it("should render enabled category filter", async () => {
        renderPage();

        expect(screen.getByRole("textbox", { name: /select category/i })).not.toBeDisabled();
    });
    it("should render disabled theme filter", async () => {
        renderPage();

        expect(screen.getByRole("textbox", { name: /select theme/i })).toBeDisabled();
    });
    it("should render disabled country filter", async () => {
        renderPage();

        expect(screen.getByRole("textbox", { name: /input select country/i })).toBeDisabled();
    });
    it("should render disabled years filter", async () => {
        renderPage();

        expect(screen.getByRole("textbox", { name: /select years/i })).toBeDisabled();
    });
});

function renderPage(queryString?: string) {
    customRenderWithRouterMatch(
        <ResourcesPage />,
        { path: "/resources", route: `/resources/${queryString}` },
        {
            resource: resourceRepository,
            resourceCategory: resourceCategoryRepository,
        }
    );
}

function givenAFilters() {
    return {
        categories: givenAResourceCategories(),
    };
}

function givenAResources(countByType: number): Resource[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = [
        ...createMultimediaResources(countByType),
        ...createNewsResources(countByType),
        ...createComparativeAnalysisResources(countByType),
        ...createCountryAnalysisResources(countByType),
    ];

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

function givenAResourceCategories(): ResourceCategory[] {
    const mockedRepository = mock(ResourceCategoryD2Repository);

    const data = createResourceCategories();

    when(mockedRepository.getAll()).thenReturn(Future.success(data));

    resourceCategoryRepository = instance(mockedRepository);

    return data;
}

function search() {
    const searchButton = screen.getByLabelText(/search/i);

    userEvent.click(searchButton);
}

async function verifyElementsInGroup(groupName: string, count: number) {
    const group = await screen.findByLabelText(groupName);

    const scope = within(group);

    const items = await scope.findAllByRole("listitem");

    expect(items.length).toBe(count);
}
