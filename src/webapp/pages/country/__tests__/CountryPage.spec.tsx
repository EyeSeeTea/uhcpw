import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import userEvent from "@testing-library/user-event";
import { CountryPage } from "../CountryPage";
import { Person } from "../../../../domain/entities/Person";
import { PersonD2Repository } from "../../../../data/repositories/PersonD2Repository";
import { ResourceD2Repository } from "../../../../data/repositories/resources/ResourceD2Repository";
import {
    createComparativeAnalysisResources,
    createCountryAnalysisResources,
    createMultimediaResources,
    createNewsResources,
} from "../../resources/common/__tests__/helpers";
import { ComparativeAnalysis, CountryAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { PersonState } from "../../about/AboutState";

let personRepository: PersonD2Repository;
let resourceRepository: ResourceD2Repository;

describe("Country Page", () => {
    it("should render Navbar", () => {
        givenAPersons();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-header/i));

        expect(scope.getByText(/dashboard/i)).toBeInTheDocument();
        expect(scope.getByText(/in detail/i)).toBeInTheDocument();
        expect(scope.getByText(/country resources/i)).toBeInTheDocument();
        expect(scope.getByText(/country expert/i)).toBeInTheDocument();
        expect(scope.getByLabelText(/country-dropdown/i)).toBeInTheDocument();
    });
    it("should render Hero", () => {
        givenAPersons();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-hero/i));

        expect(
            scope.getByText(
                "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19"
            )
        ).toBeInTheDocument();
    });

    it("should render slider", () => {
        givenAPersons();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-slider/i));

        expect(
            scope.getByRole("heading", {
                name: /How many people experience financial hardship: impoverishing health spending?/i,
            })
        ).toBeInTheDocument();
        expect(scope.getByText("Households with impoverishing health spending")).toBeInTheDocument();
        expect(
            scope.getByText(
                "Households with impoverishing health spending, 2019 or latest available year before COVID-19"
            )
        ).toBeInTheDocument();
    });

    it("should render country resources", () => {
        givenAPersons();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-resources/i));

        expect(scope.getByRole("heading", { name: /country resources/i })).toBeInTheDocument();

        const resources = givenAResources();

        verifyResourceItems(resources);
    });
    it("should render country expert", () => {
        const { experts } = givenAPersons();

        renderPage();

        const scope = within(screen.getByLabelText(/experts/i));

        expect(scope.getByRole("heading", { name: /country expert/i })).toBeInTheDocument();

        verifyExpertMembers(experts);
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <CountryPage />,
        { path: "/country-page", route: `/country-page` },
        {
            person: personRepository,
        }
    );
}

async function verifyExpertMembers(experts: PersonState[]) {
    const scope = within(screen.getByLabelText(/experts/i));
    const items = scope.queryAllByRole("listitem");

    await waitFor(() => expect(items).toHaveLength(experts.length));

    experts.forEach((expert, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(`${expert.firstName} ${expert.lastName}`) as HTMLImageElement;
        expect(image.src).toContain(expert.image);

        itemScope.getByText(expert.firstName);
        itemScope.getByText(expert.lastName);
        itemScope.getByText(expert.position);
        itemScope.getByText(expert.institution || "");
        itemScope.getByText(expert.countryName || "");
    });
}

async function verifyResourceItems(resources: any[]) {
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

function givenAPersons(): {
    experts: {
        firstName: string;
        lastName: string;
        image: string;
        position: string;
        countryName: string;
    }[];
} {
    const mockedRepository = mock(PersonD2Repository);

    const experts = [
        {
            firstName: "first name 1",
            lastName: "last name 1",
            image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            position: "Position ABC",
            countryId: "DVnpk4xiXGJ",
            institution: "institution",
            countryName: "Bulgaria",
        },
    ];

    when(mockedRepository.get(anything())).thenReturn(Future.success(experts));

    personRepository = instance(mockedRepository);

    return { experts };
}

function givenAResources(): (ComparativeAnalysis | CountryAnalysis | News | Multimedia)[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data = [
        ...createComparativeAnalysisResources(1),
        ...createCountryAnalysisResources(1),
        ...createNewsResources(1),
        ...createMultimediaResources(1),
    ];

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);

    return data;
}
