import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import userEvent from "@testing-library/user-event";
import { AboutPage } from "../AboutPage";
import { Person } from "../../../../domain/entities/Person";
import { PersonD2Repository } from "../../../../data/repositories/PersonD2Repository";
import { AboutInfoD2Repository } from "../../../../data/repositories/about/AboutInfoD2Repository";
import { OfficeInfo } from "../../../../domain/entities/about/OfficeInfo";

let personRepository: PersonD2Repository;
let aboutInfoRepository: AboutInfoD2Repository;

describe("AboutPage", () => {
    it("should render about title", () => {
        givenAPersons();
        givenOfficeInfo();

        renderPage();

        expect(
            screen.getByRole("heading", { name: /who barcelona office for health systems financing/i })
        ).toBeInTheDocument();
    });
    it("should render office description", () => {
        givenAPersons();
        givenOfficeInfo();

        renderPage();

        expect(
            screen.getByText(
                "The WHO Barcelona Office is a centre of excellence in health financing for universal health coverage (UHC). It works with Member States across WHO’s European Region to promote evidence-informed policy making and offers WHO training courses on health financing. The Office assesses country and regional progress towards UHC by monitoring financial protection – affordable access to health care. It also supports countries to strengthen financial protection through tailored technical assistance, including analysis of country-specific policy options, high-level policy dialogue and the sharing of international experience. Established in 1999, the Office is supported by the Government of the Autonomous Community of Catalonia, Spain. It is part of the Division of Country Health Policies and Systems of the WHO Regional Office for Europe."
            )
        ).toBeInTheDocument();
    });
    it("should render office header caption", () => {
        givenAPersons();
        givenOfficeInfo();

        renderPage();

        expect(screen.getByRole("caption")).toBeInTheDocument();
    });
    it("should render office team", () => {
        const { officeTeam } = givenAPersons();

        renderPage();

        expect(screen.getByText(/the who barcelona office team/i)).toBeInTheDocument();
        expect(screen.getByText(/staff and consultants/i)).toBeInTheDocument();

        verifyOfficeTeamMembers(officeTeam);
    });

    it("should render experts", () => {
        const { experts } = givenAPersons();

        renderPage();

        expect(screen.getByText(/the financial protection expert network/i)).toBeInTheDocument();
        /* expect(
            screen.getByText(
                /experts working with the who barcelona office to access financial protection and coverage policy at country level/i
            )
        ).toBeInTheDocument(); */

        verifyExpertMembers(experts);
    });

    it("should filter experts by country", async () => {
        givenAPersons();

        renderPage();

        await selectCountry("Spain");

        const scope = within(screen.getByLabelText(/experts/i));
        const items = scope.queryAllByRole("listitem");

        await waitFor(() => expect(items).toHaveLength(2));
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <AboutPage />,
        { path: "/about", route: `/about` },
        {
            person: personRepository,
            aboutInfo: aboutInfoRepository,
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
        itemScope.getByText(expert.institution || "");
        itemScope.getByText("Spain");
    });
}

function givenAPersons(): {
    officeTeam: {
        firstName: string;
        lastName: string;
        image: string;
        position: string;
        linkedin: string;
        email: string;
    }[];
    experts: {
        firstName: string;
        lastName: string;
        image: string;
        position: string;
        linkedin: string;
        email: string;
    }[];
} {
    const mockedRepository = mock(PersonD2Repository);

    const officeTeam = [
        {
            firstName: "first name 1",
            lastName: "last name 1",
            image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            position: "Position ABC",
            linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
            email: "hello@eyeseetea.com",
        },
        {
            firstName: "first name 2",
            lastName: "last name 2",
            image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            position: "Position ABC",
            linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
            email: "hello@eyeseetea.com",
        },
    ];

    const experts = [
        {
            firstName: "first name 1",
            lastName: "last name 1",
            image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            position: "Position ABC",
            linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
            email: "hello@eyeseetea.com",
            countryId: "DVnpk4xiXGJ",
            institution: "institution",
        },
        {
            firstName: "first name 2",
            lastName: "last name 2",
            image: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            position: "Position ABC",
            linkedin: "https://www.linkedin.com/company/eyeseetea-ltd",
            email: "hello@eyeseetea.com",
            countryId: "DVnpk4xiXGJ",
            institution: "institution",
        },
    ];

    when(mockedRepository.get(true)).thenReturn(Future.success(officeTeam));
    when(mockedRepository.get(false)).thenReturn(Future.success(experts));

    personRepository = instance(mockedRepository);

    return { officeTeam, experts };
}

async function selectLetterFilter(letter: string) {
    await userEvent.click(await screen.findByRole("button", { name: letter }));
}

async function selectCountry(value: string) {
    const countrySelector = screen.getByLabelText(/country selector/i);

    await userEvent.click(countrySelector);

    const treeitem = await screen.findByRole("treeitem", { expanded: true });
    const treeScope = within(treeitem);

    await userEvent.click(treeScope.getByRole("checkbox", { name: `${value} ${value}` }));

    await userEvent.keyboard("{Escape}");

    await screen.findByLabelText(/countries/i);
}

function givenOfficeInfo(): OfficeInfo {
    const mockedRepository = mock(AboutInfoD2Repository);

    const officeInfo: OfficeInfo = {
        officeText:
            "The WHO Barcelona Office is a centre of excellence in health financing for universal health coverage (UHC). It works with Member States across WHO’s European Region to promote evidence-informed policy making and offers WHO training courses on health financing. The Office assesses country and regional progress towards UHC by monitoring financial protection – affordable access to health care. It also supports countries to strengthen financial protection through tailored technical assistance, including analysis of country-specific policy options, high-level policy dialogue and the sharing of international experience. Established in 1999, the Office is supported by the Government of the Autonomous Community of Catalonia, Spain. It is part of the Division of Country Health Policies and Systems of the WHO Regional Office for Europe.",
        officeVideo: "https://www.youtube.com/watch?v=k8OQYkjgERk&t=4s",
        officeImage: "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp",
    };

    when(mockedRepository.getOfficeInfo()).thenReturn(Future.success(officeInfo));

    aboutInfoRepository = instance(mockedRepository);

    return officeInfo;
}
