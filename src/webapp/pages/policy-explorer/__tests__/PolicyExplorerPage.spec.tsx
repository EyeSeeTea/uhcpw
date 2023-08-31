import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { PolicyExplorerPage } from "../PolicyExplorerPage";
import policyExplorerCategoriesData from "./data/policyExplorerCategories.json";
import dataSetData from "./data/dataSet.json";
import countriesData from "./data/countries.json";
import policyExplorerSimple from "./data/policyExplorerSimple.json";
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
            givenASimplePolicyExplorer();

            renderPage();

            expect(screen.getByRole("heading", { name: /policy explorer/i })).toBeInTheDocument();
        });
    });

    describe("Population Coverage category table", () => {
        it("should render expected table title", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenADataSet();
            givenCountries();
            givenASimplePolicyExplorer();

            renderPage();
            await selectFiltersAndGetTable(policyExplorerCategories[0]?.name || "", "Spain");

            const tableTitle = await waitFor(() =>
                screen.getByRole("heading", { name: policyExplorerCategories[0]?.name })
            );

            expect(tableTitle).toBeInTheDocument();
        });
        it("should render a table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenADataSet();
            givenCountries();
            givenASimplePolicyExplorer();

            renderPage();
            await selectFiltersAndGetTable(policyExplorerCategories[0]?.name || "", "Spain");

            const table = await waitFor(() => screen.getByRole("table", { name: /simple table/i }));

            expect(table).toBeInTheDocument();
        });
        it("should render expected total rows in the table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenADataSet();
            givenCountries();
            const policyExplorer = givenASimplePolicyExplorer();

            renderPage();
            await selectFiltersAndGetTable(policyExplorerCategories[0]?.name || "", "Spain");
            await switchToColumns();

            await verifyTotalRows(policyExplorer, policyExplorerCategories[0]?.id);
        });
        it("should render expected columns in the table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenADataSet();
            givenCountries();
            const policyExplorer = givenASimplePolicyExplorer();

            renderPage();
            await selectFiltersAndGetTable(policyExplorerCategories[0]?.name || "", "Spain");
            await switchToColumns();

            await verifyColumns(policyExplorer, policyExplorerCategories[0]?.id);
        });
    });
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

function givenASimplePolicyExplorer(): PolicyExplorer {
    const mockedRepository = mock(PolicyExplorerD2Repository);

    const items: PolicyExplorer = policyExplorerSimple as unknown as PolicyExplorer;

    when(mockedRepository.get(anything(), anything(), anything())).thenReturn(Future.success(items));

    policyExplorerRepository = instance(mockedRepository);

    return items;
}

function getPolicyExplorerCategories() {
    return {
        policyExplorerCategories: givenPolicyExplorerCategories(),
    };
}

async function selectFiltersAndGetTable(categoryText: string, countryText: string) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    await selectCategoryFilter(categoryText);
    await selectCountry(main, countryText);

    const getTableButton = main.getByText(/get table/i);

    await waitFor(() => expect(getTableButton).not.toBeDisabled());

    await userEvent.click(getTableButton);
}

async function expandCategoryByName(name: string) {
    return userEvent.click(await screen.findByText(name));
}

async function selectCategoryByName(name: string) {
    const categoryCheckbox = await screen.getByLabelText(`Select all ${name}`);

    return userEvent.click(categoryCheckbox);
}

async function selectCategoryFilter(categoryName: string) {
    const categorySelectorToFocus = screen.getByRole("textbox", {
        name: /categories/i,
    });
    userEvent.click(categorySelectorToFocus);

    await expandCategoryByName(categoryName);
    await selectCategoryByName(categoryName);
    await userEvent.keyboard("{Escape}");

    await screen.findByRole("textbox", {
        name: /categories/i,
    });
}

async function selectCountry(scope: BoundFunctions<typeof queries>, value: string) {
    const countrySelector = scope.getByLabelText(/expand/i);

    await userEvent.click(countrySelector);

    userEvent.click(await screen.findByText("All countries"));
    userEvent.click(await screen.findByRole("checkbox", { name: value }));
    await userEvent.keyboard("{Escape}");

    await scope.findByLabelText(/countries/i);
}

async function switchToColumns() {
    const switchRowColumnButton = await screen.getByRole("button", {
        name: /switch row\/column/i,
    });
    await userEvent.click(switchRowColumnButton);
}

function getTableByPolicyExplorerCategoryId(policyExplorer: PolicyExplorer, categoryId?: string) {
    return categoryId ? policyExplorer.tables[categoryId] : [];
}

function getTableColumnsByPolicyExplorerCategoryId(policyExplorer: PolicyExplorer, categoryId?: string) {
    const table = getTableByPolicyExplorerCategoryId(policyExplorer, categoryId);
    return table ? table[0] : [];
}

async function verifyTotalRows(policyExplorer: PolicyExplorer, categoryId?: string) {
    const rows = await screen.findAllByRole("row");

    const table = getTableByPolicyExplorerCategoryId(policyExplorer, categoryId);
    expect(rows.length).toBe(table?.length);
}

async function verifyCell(cellName: string) {
    const cell = await screen.getByRole("cell", {
        name: cellName,
    });
    expect(cell).toBeInTheDocument();
}

async function verifyColumns(policyExplorer: PolicyExplorer, categoryId?: string) {
    const tableColumns = getTableColumnsByPolicyExplorerCategoryId(policyExplorer, categoryId);

    if (tableColumns === undefined) {
        throw new Error(`Table columns not found`);
    }

    for (const column of tableColumns) {
        await verifyCell(column.value);
    }
}
