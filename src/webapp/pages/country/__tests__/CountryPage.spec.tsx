import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { CountryPage } from "../CountryPage";
import { PersonD2Repository } from "../../../../data/repositories/PersonD2Repository";
import { ResourceD2Repository } from "../../../../data/repositories/resources/ResourceD2Repository";
import {
    createComparativeAnalysisResources,
    createCountryAnalysisResources,
} from "../../resources/common/__tests__/helpers";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { PersonState } from "../../about/AboutState";
import { CountryPageInfoD2Repository } from "../../../../data/repositories/country-page/CountryPageInfoD2Repository";
import { SliderInfo } from "../../../../domain/entities/country-page/SliderInfo";

let personRepository: PersonD2Repository;
let resourceRepository: ResourceD2Repository;
let countryPageInfoRepository: CountryPageInfoD2Repository;

describe("Country Page", () => {
    it("should render Navbar", () => {
        givenAPersons();
        givenSliderTitles();
        givenAResources();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-header/i));

        expect(scope.getByText(/dashboard/i)).toBeInTheDocument();
        expect(scope.getByText(/in detail/i)).toBeInTheDocument();
        expect(scope.getByText(/resources/i)).toBeInTheDocument();
        expect(scope.getByText(/experts/i)).toBeInTheDocument();
        expect(scope.getByLabelText(/country-dropdown/i)).toBeInTheDocument();
    });
    it("should render Hero", () => {
        givenAPersons();
        givenSliderTitles();
        givenAResources();

        renderPage();

        expect(screen.getByLabelText(/country-page-hero/i)).toBeInTheDocument();
    });

    it("should render slider", () => {
        givenAPersons();
        givenSliderTitles();
        givenAResources();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-slider/i));

        expect(
            scope.getByRole("heading", {
                name: /how many people experience financial hardship: impoverishing health spending\?/i,
            })
        ).toBeInTheDocument();
    });

    it("should render country resources", async () => {
        givenAPersons();
        givenSliderTitles();
        const resources = givenAResources();

        renderPage();

        const scope = within(screen.getByLabelText(/country-page-resources/i));

        expect(scope.getByRole("heading", { name: /resources/i })).toBeInTheDocument();

        await verifyResourceItems(
            resources.filter(({ kind }) => kind === "country-analysis"),
            false
        );
        await verifyResourceItems(
            resources.filter(({ kind }) => kind === "comparative-analysis"),
            true
        );
    });
    it("should render country expert", async () => {
        const { experts } = givenAPersons();
        givenSliderTitles();
        givenAResources();

        renderPage();

        const scope = within(screen.getByLabelText(/experts/i));

        expect(scope.getByRole("heading", { name: /experts/i })).toBeInTheDocument();

        await verifyExpertMembers(experts);
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <CountryPage />,
        { path: "/country-page", route: `/country-page?country=DVnpk4xiXGJ` },
        {
            person: personRepository,
            resource: resourceRepository,
            countryPageInfo: countryPageInfoRepository,
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

        itemScope.getByText(`${expert.firstName} ${expert.lastName}`);
        itemScope.getByText(expert.position);
        itemScope.getByText(expert.institution || "");
        itemScope.getByText(expert.countryName || "");
    });
}

async function verifyResourceItems(resources: Resource[], isComparative: boolean) {
    const scope = isComparative
        ? within(screen.getByLabelText(/comparative-resources/i))
        : within(screen.getByLabelText(/country-resources/i));
    const items = await scope.findAllByRole("listitem");

    resources.forEach((resource, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(resource.title) as HTMLImageElement;
        expect(image.src).toContain(resource.imageOriginal);
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
            countryName: "Spain",
        },
    ];

    when(mockedRepository.get(anything())).thenReturn(Future.success(experts));

    personRepository = instance(mockedRepository);

    return { experts };
}

function givenAResources(): Resource[] {
    const mockedRepository = mock(ResourceD2Repository);

    const data: Resource[] = [...createComparativeAnalysisResources(1), ...createCountryAnalysisResources(1)];

    when(mockedRepository.get(anything())).thenReturn(Future.success(data));

    resourceRepository = instance(mockedRepository);
    return data;
}

function givenSliderTitles(): SliderInfo {
    const mockedRepository = mock(CountryPageInfoD2Repository);

    const sliderInfo: SliderInfo = {
        sliderOne: "How many people experience financial hardship: impoverishing health spending?",
        sliderTwo: "Catastrophic health spending. How many people experience financial hardship?",
        sliderThree: "Who experiences financial hardship?",
        sliderFour: "Which health services are responsible for financial hardship?",
        sliderFive: "Which health services are responsible for financial hardship? International comparison",
        sliderSix: "How many people experience unmet need?",
        sliderSeven: "Who experiences unmet need?",
        sliderEight: "How much does Spain spend on health?",
        sliderNine: "How much does Spain spend on health? International comparison",
        sliderTen: "What are the main gaps in publicly financed coverage?",
        sliderEleven: "How can Spain strengthen financial protection?",
    };

    when(mockedRepository.getSliderInfo("Spain")).thenReturn(Future.success(sliderInfo));

    countryPageInfoRepository = instance(mockedRepository);

    return sliderInfo;
}
