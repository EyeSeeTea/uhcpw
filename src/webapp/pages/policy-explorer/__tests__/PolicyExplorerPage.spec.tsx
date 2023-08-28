import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { PolicyExplorerPage } from "../PolicyExplorerPage";
import policyExplorerCategoriesData from "./data/policyExplorerCategories.json";
import dataSetData from "./data/dataSet.json";
import countriesData from "./data/countries.json";
import policyExplorerData from "./data/policyExplorer.json";
import userEvent from "@testing-library/user-event";
import { DataSetD2Repository } from "../../../../data/repositories/DataSetD2Repository";
import { PolicyExplorerCategoryD2Repository } from "../../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { CountryD2Repository } from "../../../../data/repositories/CountryD2Repository";
import { PolicyExplorerD2Repository } from "../../../../data/repositories/policy-explorer/PolicyExplorerD2Repository";
import { DataSet } from "../../../../domain/entities/metadata/DataSet";
import { PolicyExplorerCategory } from "../../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { Country } from "../../../../domain/entities/Country";
import { PolicyExplorer } from "../../../../domain/entities/policy-explorer/PolicyExplorer";

let dataSetRepository: DataSetD2Repository;
let policyExplorerCategoryRepository: PolicyExplorerCategoryD2Repository;
let countryRepository: CountryD2Repository;
let policyExplorerRepository: PolicyExplorerD2Repository;

describe("PolicyExplorerPage", () => {
    describe("to load page", () => {
        it("should render policy explorer title", () => {
            getPolicyExplorerCategories();
            givenADataSet();
            givenCountries();
            givenAPolicyExplorer();

            renderPage();

            expect(screen.getByRole("heading", { name: /policy explorer/i })).toBeInTheDocument();
        });
    });

    // describe("User charges (co-payments) by type of health care category", () => {
    //     it("should render expected table", async () => {
    //         const { policyExplorerCategories } = getPolicyExplorerCategories();
    //         givenADataSet();
    //         givenCountries();
    //         givenAPolicyExplorer();

    //         renderPage();

    //         await selectFiltersAndGetTable(policyExplorerCategories[0]?.name || "", "Spain");

    //         const tableTitle = await waitFor(() =>
    //             screen.getByRole("heading", { name: policyExplorerCategories[0]?.name })
    //         );

    //         expect(tableTitle).toBeInTheDocument();
    //     });
    // });
});

function renderPage() {
    customRenderWithRouterMatch(
        <PolicyExplorerPage />,
        { path: "/policy-explorer", route: `/policy-explorer` },
        {
            dataSet: dataSetRepository,
            policyExplorerCategory: policyExplorerCategoryRepository,
            country: countryRepository,
            policyExplorer: policyExplorerRepository,
        }
    );
}

function givenADataSet(): DataSet {
    const mockedRepository = mock(DataSetD2Repository);

    const item = dataSetData;

    when(mockedRepository.getById(anything())).thenReturn(Future.success(item));

    dataSetRepository = instance(mockedRepository);

    return item;
}

function givenPolicyExplorerCategories(): PolicyExplorerCategory[] {
    const mockedRepository = mock(PolicyExplorerCategoryD2Repository);

    const items = policyExplorerCategoriesData as unknown as PolicyExplorerCategory[];

    when(mockedRepository.getAll()).thenReturn(Future.success(items));

    policyExplorerCategoryRepository = instance(mockedRepository);

    return items;
}

function givenCountries(): Country[] {
    const mockedRepository = mock(CountryD2Repository);

    const items = countriesData as Country[];

    when(mockedRepository.get()).thenReturn(Future.success(items));

    countryRepository = instance(mockedRepository);

    return items;
}

function givenAPolicyExplorer(): PolicyExplorer {
    const mockedRepository = mock(PolicyExplorerD2Repository);

    const items: PolicyExplorer = policyExplorerData as unknown as PolicyExplorer;

    when(mockedRepository.get(anything(), anything(), anything())).thenReturn(Future.success(items));

    policyExplorerRepository = instance(mockedRepository);

    return items;
}

function getPolicyExplorerCategories() {
    return {
        policyExplorerCategories: givenPolicyExplorerCategories(),
    };
}

// async function selectFiltersAndGetTable(categoryText: string, countryText: string, yearText = "2023") {
//     const mainElement = screen.getByRole("main");
//     const main = within(mainElement);

//     await selectFilter(main, "Category", categoryText);
//     await selectCountry(main, countryText);
//     await selectFilter(main, "Year", yearText);

//     const getTableButton = main.getByLabelText(/get table/i);

//     await waitFor(() => expect(getTableButton).not.toBeDisabled());

//     userEvent.click(getTableButton);
// }

// async function selectFilter(scope: BoundFunctions<typeof queries>, name: string, value: string) {
//     const autocompleteInput = scope.getByLabelText(name);

//     userEvent.click(autocompleteInput);

//     const targetItem = await waitFor(() => screen.getByRole("option", { name: value }));

//     userEvent.click(targetItem);
// }

// async function selectCountry(scope: BoundFunctions<typeof queries>, value: string) {
//     const countrySelector = scope.getByLabelText(/countries/i);

//     userEvent.click(countrySelector);

//     userEvent.click(await screen.findByText("All countries"));
//     userEvent.click(await screen.findByRole("checkbox", { name: value }));

//     userEvent.keyboard("{Escape}");

//     await screen.findByLabelText(/countries/i);
// }
