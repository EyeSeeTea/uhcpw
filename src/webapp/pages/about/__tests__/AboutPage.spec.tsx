import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests";
import { CountryD2Repository } from "../../../../data/repositories/CountryD2Repository";
import { Country } from "../../../../domain/entities/Country";
import userEvent from "@testing-library/user-event";
import { AboutPage } from "../AboutPage";
import { expertsMembers, teamMembers } from "../useAbout";
import { Person } from "../../../../domain/entities/Person";

let countryRepository: CountryD2Repository;

describe("AboutPage", () => {
    it("should render about title", () => {
        givenAFilters();
        givenAnOfficeTeam();
        givenAnExperts();

        renderPage();

        expect(
            screen.getByRole("heading", { name: /who barcelona office for health systems financing/i })
        ).toBeInTheDocument();
    });
    it("should render office description", () => {
        givenAFilters();
        givenAnOfficeTeam();
        givenAnExperts();

        renderPage();

        expect(
            screen.getByText(
                "The WHO Barcelona Office is a centre of excellence in health financing for universal health coverage. It works with Member State across WHO's European Region to promote evidence-informed policy making"
            )
        ).toBeInTheDocument();
    });
    it("should render office header caption", () => {
        givenAFilters();
        givenAnOfficeTeam();
        givenAnExperts();

        renderPage();

        expect(screen.getByText(/who Barcelona office for health systems stengthening/i)).toBeInTheDocument();
    });
    it("should render office team", () => {
        givenAFilters();
        const officeTeam = givenAnOfficeTeam();
        givenAnExperts();

        renderPage();

        expect(screen.getByText(/the who barcelona office team/i)).toBeInTheDocument();
        expect(screen.getByText(/staff and consultants/i)).toBeInTheDocument();

        verifyOfficeTeamMembers(officeTeam);
    });

    it("should render experts", () => {
        givenAFilters();
        givenAnOfficeTeam();
        const expertsMembers = givenAnExperts();

        renderPage();

        expect(screen.getByText(/financial protection expert network/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /experts working with the who barcelona office to access finantial protection and coverage policy at country level/i
            )
        ).toBeInTheDocument();

        verifyExpertMembers(expertsMembers);
    });

    it("should filter experts by country", async () => {
        givenAFilters();
        givenAnOfficeTeam();
        givenAnExperts();

        renderPage();

        await selectCountry("Spain");

        const scope = within(screen.getByLabelText(/experts/i));
        const items = scope.queryAllByRole("listitem");

        await waitFor(() => expect(items).toHaveLength(2));
    });

    it("should filter experts by inicial letter name", async () => {
        givenAFilters();
        givenAnOfficeTeam();
        givenAnExperts();

        renderPage();

        await selectLetterFilter("F");

        const scope = within(screen.getByLabelText(/experts/i));
        const items = scope.queryAllByRole("listitem");

        await waitFor(() => expect(items).toHaveLength(6));
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <AboutPage />,
        { path: "/about", route: `/about` },
        {
            country: countryRepository,
        }
    );
}

function verifyOfficeTeamMembers(officeTeam: Person[]) {
    const scope = within(screen.getByLabelText(/office team/i));
    const items = scope.queryAllByRole("listitem");

    expect(items).toHaveLength(officeTeam.length);

    officeTeam.forEach((teamMember, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        const image = itemScope.getByAltText(`${teamMember.firstName} ${teamMember.lastName}`) as HTMLImageElement;
        expect(image.src).toContain(teamMember.image);

        itemScope.getByText(teamMember.firstName);
        itemScope.getByText(teamMember.lastName);
        itemScope.getByText(teamMember.position);
    });
}

function verifyExpertMembers(experts: Person[]) {
    const scope = within(screen.getByLabelText(/experts/i));
    const items = scope.queryAllByRole("listitem");

    expect(items).toHaveLength(experts.length);

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
        itemScope.getByText(expert.country || "");
    });
}

function givenAFilters() {
    return {
        countries: givenACountries(),
    };
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

function givenAnOfficeTeam(): Person[] {
    return teamMembers;
}

function givenAnExperts(): Person[] {
    return expertsMembers;
}

async function selectLetterFilter(letter: string) {
    userEvent.click(await screen.findByRole("button", { name: letter }));
}

async function selectCountry(value: string) {
    const countrySelector = screen.getByLabelText(/countries/i);

    userEvent.click(countrySelector);

    userEvent.click(await screen.findByText("All countries"));
    userEvent.click(await screen.findByRole("checkbox", { name: value }));

    userEvent.keyboard("{Escape}");

    await screen.findByLabelText(/countries/i);
}
