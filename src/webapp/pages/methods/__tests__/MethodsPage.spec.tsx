import "@testing-library/jest-dom";
import { fireEvent, screen, within } from "@testing-library/react";
import { instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { MethodD2Repository } from "../../../../data/repositories/MethodD2Repository";
import { MethodsPage } from "../MethodsPage";
import { Method } from "../../../../domain/entities/Method";

let methodRepository: MethodD2Repository;

describe("Methods Page", () => {
    it("should render Header", () => {
        givenAMethods();

        renderPage();

        const scope = within(screen.getByLabelText(/methods-page-header/i));

        expect(scope.getByText(/methods/i)).toBeInTheDocument();
    });
    it("should render Methods", () => {
        const { methods } = givenAMethods();

        renderPage();

        verifyMethods(methods);
    });
    it("should render Buttons", () => {
        givenAMethods();

        renderPage();

        const scope = within(screen.getByLabelText(/methods-buttons/i));

        const glossaryButton = scope.getByRole("button", { name: /glossary/i });
        const countryAbbreviationsButton = scope.getByRole("button", { name: /abbreviations/i });

        expect(glossaryButton).toBeInTheDocument();
        expect(countryAbbreviationsButton).toBeInTheDocument();
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <MethodsPage />,
        { path: "/methods", route: `/methods` },
        {
            method: methodRepository,
        }
    );
}

function verifyMethods(methods: Method[]) {
    const scope = within(screen.getByLabelText(/methods-container/i));
    const items = scope.queryAllByLabelText(/method-item/i);

    expect(items).toHaveLength(methods.length);

    methods.forEach((method, index) => {
        const item = items[index];

        if (item === undefined) {
            throw new Error(`Index ${index} not found in items`);
        }

        const itemScope = within(item);

        itemScope.getByText(method.sectionName);
        itemScope.getByText(method.shortText.concat("..."));

        const readMoreButton = itemScope.getByRole("button", { name: /read more/i });

        expect(readMoreButton).toBeInTheDocument();

        fireEvent.click(readMoreButton);

        itemScope.getByText(method.text);
    });
}

function givenAMethods(): {
    methods: {
        sectionName: string;
        shortText: string;
        text: string;
    }[];
} {
    const mockedRepository = mock(MethodD2Repository);

    const methods = [
        {
            sectionName: "section name 1",
            shortText: "short text 1",
            text: "long text 1",
        },
        {
            sectionName: "section name 2",
            shortText: "short text 2",
            text: "long text 2",
        },
    ];

    when(mockedRepository.get()).thenReturn(Future.success(methods));

    methodRepository = instance(mockedRepository);

    return { methods };
}
