import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { createHistory, customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { PolicyExplorerPage } from "../PolicyExplorerPage";
import policyExplorerCategoriesData from "./data/policyExplorerCategories.json";
import countriesData from "./data/countries.json";
import policyExplorerSimple from "./data/policyExplorerSimple.json";
import policyExplorerEmpty from "./data/policyExplorerEmpty.json";
import policyExplorerWithMultiplePeriods from "./data/policyExplorerWithMultiplePeriods.json";
import policyExplorerWithMoreThanOneTable from "./data/policyExplorerWithMoreThanOneTable.json";
import policyExplorerByTypeOfHealthcare from "./data/policyExplorerByTypeOfHealthcare.json";
import userEvent from "@testing-library/user-event";
import { PolicyExplorerCategoryD2Repository } from "../../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { CountryD2Repository } from "../../../../data/repositories/CountryD2Repository";
import { PolicyExplorerD2Repository } from "../../../../data/repositories/policy-explorer/PolicyExplorerD2Repository";
import { PolicyExplorerCategory } from "../../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { Country } from "../../../../domain/entities/Country";
import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerCellType,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";

let policyExplorerCategoryRepository: PolicyExplorerCategoryD2Repository;
let countryRepository: CountryD2Repository;
let policyExplorerRepository: PolicyExplorerD2Repository;

describe("Given PolicyExplorerPage", () => {
    describe("When loading the page", () => {
        it("Then should render policy explorer title", () => {
            getPolicyExplorerCategories();
            givenCountries();
            givenASimplePolicyExplorer();

            renderPage();

            expect(screen.getByRole("heading", { name: /policy explorer/i })).toBeInTheDocument();
        });
    });
    describe("When setting filters", () => {
        it("The URL should change accordingly", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenCountries();
            givenASimplePolicyExplorer();

            const { history } = renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");

            verifySearchParamsInUrl(history.location.search, policyExplorerCategories);
        });
    });

    describe("When get Population Coverage category table", () => {
        it("Then should render expected table title", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenCountries();
            givenASimplePolicyExplorer();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");

            const tableTitle = await waitFor(() =>
                screen.getByRole("heading", { name: policyExplorerCategories[0]?.name })
            );

            expect(tableTitle).toBeInTheDocument();
        });
        it("Then should render a table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenCountries();
            givenASimplePolicyExplorer();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");

            const table = await waitFor(() => screen.getByRole("table", { name: /simple table/i }));

            expect(table).toBeInTheDocument();
        });
        it("Then should render expected total rows in the table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenCountries();
            const policyExplorer = givenASimplePolicyExplorer();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");

            await switchToColumns();

            await verifyTotalRows(policyExplorer, policyExplorerCategories[0]?.id);
        });
        it("Then should render expected columns in the table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenCountries();
            const policyExplorer = givenASimplePolicyExplorer();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");
            await switchToColumns();

            await verifyColumns(policyExplorer, policyExplorerCategories[0]?.id);
        });
        it("Then should render expected rows in the table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();
            givenCountries();
            const policyExplorer = givenASimplePolicyExplorer();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");
            await switchToColumns();

            await verifyRows(policyExplorer, policyExplorerCategories[0]?.id);
        });
    });

    describe("When get an empty category table", () => {
        it("Then should render expected table title", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            givenASimplePolicyExplorer();

            renderPage();
            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");

            const tableTitle = await waitFor(() =>
                screen.getByRole("heading", { name: policyExplorerCategories[0]?.name })
            );

            expect(tableTitle).toBeInTheDocument();
        });
        it("Then should not render any table", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            givenAnEmptyPolicyExplorer();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[0]?.name || ""], "Spain");

            const cells = await screen.queryAllByRole("cell");
            expect(cells.length).toBe(0);
        });
        it("Then should render a message", async () => {});
    });

    describe("When get a category with multiple periods table", () => {
        it("Then should render a period column with more than one period data", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            const policyExplorer = givenAPolicyExplorerWithMultiplePeriods();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[6]?.name || ""], "Spain");

            await verifyMoreThanOnePeriodData(policyExplorer, policyExplorerCategories[8]?.id);
        });
    });

    describe("When get two categories", () => {
        it("Then should render two expected table titles", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            givenAPolicyExplorerWithMoreThanOneTable();

            renderPage();

            await selectFiltersAndGetTable(
                [policyExplorerCategories[0]?.name || "", policyExplorerCategories[1]?.name || ""],
                "Spain"
            );

            const tableTitleOne = await waitFor(() =>
                screen.getByRole("heading", { name: policyExplorerCategories[0]?.name })
            );

            const tableTitleTwo = await waitFor(() =>
                screen.getByRole("heading", { name: policyExplorerCategories[0]?.name })
            );

            expect(tableTitleOne).toBeInTheDocument();
            expect(tableTitleTwo).toBeInTheDocument();
        });
        it("Then should render two tables", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            givenAPolicyExplorerWithMoreThanOneTable();

            renderPage();

            await selectFiltersAndGetTable(
                [policyExplorerCategories[0]?.name || "", policyExplorerCategories[1]?.name || ""],
                "Spain"
            );

            const tables = await waitFor(() => screen.getAllByRole("table", { name: /simple table/i }));
            expect(tables.length).toBe(2);
        });
    });

    describe("When get a category by type of healthcare", () => {
        it("Then should render a column with the types of healthcare", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            const policyExplorer = givenAPolicyExplorerByTypeOfHealthcare();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[5]?.name || ""], "Spain");

            await verifyTypeOfHealthcareColumn(policyExplorer, policyExplorerCategories[5]?.id);
        });
        it("Then should render a column with the types of healthcare with header type style", async () => {
            const { policyExplorerCategories } = getPolicyExplorerCategories();

            givenCountries();
            const policyExplorer = givenAPolicyExplorerByTypeOfHealthcare();

            renderPage();

            await selectFiltersAndGetTable([policyExplorerCategories[5]?.name || ""], "Spain");

            await verifyTypeOfHealthcareColumnHeaderType(policyExplorer, policyExplorerCategories[5]?.id);
        });
    });
});

function verifySearchParamsInUrl(search: string, policyExplorerCategories: PolicyExplorerCategory[]) {
    const searchParams = new URLSearchParams(search);
    const categoryParam = searchParams.get("category");
    const countryParam = searchParams.get("country");

    expect(categoryParam).toBe(
        `{"${policyExplorerCategories[0]?.id}":[${policyExplorerCategories[0]?.subcategories
            .map(sub => `"${sub.id}"`)
            .join(",")}]}`
    );
    expect(countryParam).toBe("DVnpk4xiXGJ");
}

function renderPage() {
    const config = { path: "/policy-explorer", route: `/policy-explorer` };

    const history = createHistory(config);

    customRenderWithRouterMatch(
        <PolicyExplorerPage />,
        config,
        {
            policyExplorerCategory: policyExplorerCategoryRepository,
            country: countryRepository,
            policyExplorer: policyExplorerRepository,
        },
        history
    );

    return { history };
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

function givenAnEmptyPolicyExplorer(): PolicyExplorer {
    const mockedRepository = mock(PolicyExplorerD2Repository);

    const items: PolicyExplorer = policyExplorerEmpty as unknown as PolicyExplorer;

    when(mockedRepository.get(anything(), anything(), anything())).thenReturn(Future.success(items));

    policyExplorerRepository = instance(mockedRepository);

    return items;
}

function givenAPolicyExplorerWithMultiplePeriods(): PolicyExplorer {
    const mockedRepository = mock(PolicyExplorerD2Repository);

    const items: PolicyExplorer = policyExplorerWithMultiplePeriods as unknown as PolicyExplorer;

    when(mockedRepository.get(anything(), anything(), anything())).thenReturn(Future.success(items));

    policyExplorerRepository = instance(mockedRepository);

    return items;
}

function givenAPolicyExplorerWithMoreThanOneTable(): PolicyExplorer {
    const mockedRepository = mock(PolicyExplorerD2Repository);

    const items: PolicyExplorer = policyExplorerWithMoreThanOneTable as unknown as PolicyExplorer;

    when(mockedRepository.get(anything(), anything(), anything())).thenReturn(Future.success(items));

    policyExplorerRepository = instance(mockedRepository);

    return items;
}

function givenAPolicyExplorerByTypeOfHealthcare(): PolicyExplorer {
    const mockedRepository = mock(PolicyExplorerD2Repository);

    const items: PolicyExplorer = policyExplorerByTypeOfHealthcare as unknown as PolicyExplorer;

    when(mockedRepository.get(anything(), anything(), anything())).thenReturn(Future.success(items));

    policyExplorerRepository = instance(mockedRepository);

    return items;
}

function getPolicyExplorerCategories() {
    return {
        policyExplorerCategories: givenPolicyExplorerCategories(),
    };
}

async function selectFiltersAndGetTable(categoryriesNames: string[], countryText: string) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    await selectCategoryFilter(categoryriesNames);
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

async function selectCategoryFilter(categoryriesNames: string[]) {
    const categorySelectorToFocus = screen.getByRole("textbox", {
        name: /categories/i,
    });
    userEvent.click(categorySelectorToFocus);

    for (const name of categoryriesNames) {
        await expandCategoryByName(name);
        await selectCategoryByName(name);
    }
    await userEvent.keyboard("{Escape}");

    await screen.findByRole("textbox", {
        name: /categories/i,
    });
}

async function selectCountry(scope: BoundFunctions<typeof queries>, value: string) {
    const countrySelector = scope.getByLabelText(/expand/i);

    await userEvent.click(countrySelector);

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

function getTableRowsByPolicyExplorerCategoryId(policyExplorer: PolicyExplorer, categoryId?: string) {
    const table = getTableByPolicyExplorerCategoryId(policyExplorer, categoryId);

    if (table) {
        const [_columns, ...rows] = table;
        return rows;
    }

    return [];
}

function getPeriodColumnValuesByPolicyExplorerCategoryId(policyExplorer: PolicyExplorer, categoryId?: string) {
    const table = getTableByPolicyExplorerCategoryId(policyExplorer, categoryId);
    const periodRowsIndex = table && table[0] ? table[0].findIndex(column => column.value === "Period") : -1;
    if (periodRowsIndex !== -1) {
        return table
            ?.reduce((acc, row) => {
                return row[periodRowsIndex] ? ([...acc, row[periodRowsIndex]] as PolicyExplorerCell[]) : acc;
            }, [])
            .filter(row => row.type !== PolicyExplorerCellType.HEADER);
    } else {
        throw new Error(`Period column not found`);
    }
}

function getTypeOfHealthcareColumnByPolicyExplorerCategoryId(policyExplorer: PolicyExplorer, categoryId?: string) {
    const table = getTableByPolicyExplorerCategoryId(policyExplorer, categoryId);
    const periodRowsIndex =
        table && table[0] ? table[0].findIndex(column => column.value === "Type of health care") : -1;
    if (periodRowsIndex !== -1) {
        return table?.reduce((acc, row) => {
            return row[periodRowsIndex] ? ([...acc, row[periodRowsIndex]] as PolicyExplorerCell[]) : acc;
        }, []);
    } else {
        throw new Error(`Type of healthcare column not found`);
    }
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

    if (!tableColumns) {
        throw new Error(`Table columns not found`);
    }

    for (const column of tableColumns) {
        await verifyCell(column.value);
    }
}

async function verifyRow(row: PolicyExplorerCell[]) {
    for (const cell of row) {
        await verifyCell(cell.value);
    }
}

async function verifyRows(policyExplorer: PolicyExplorer, categoryId?: string) {
    const tableRows = getTableRowsByPolicyExplorerCategoryId(policyExplorer, categoryId);

    if (!tableRows) {
        throw new Error(`Table rows not found`);
    }

    for (const row of tableRows) {
        await verifyRow(row);
    }
}

async function verifyMoreThanOnePeriodData(policyExplorer: PolicyExplorer, categoryId?: string) {
    const periodColumn = getPeriodColumnValuesByPolicyExplorerCategoryId(policyExplorer, categoryId);

    expect(periodColumn?.length).toBeGreaterThan(1);
}

async function verifyTypeOfHealthcareColumn(policyExplorer: PolicyExplorer, categoryId?: string) {
    const typeOfHealthcareColumn = getTypeOfHealthcareColumnByPolicyExplorerCategoryId(policyExplorer, categoryId);

    if (!typeOfHealthcareColumn) {
        throw new Error(`Type of healthcare column not found`);
    }

    for (const cell of typeOfHealthcareColumn) {
        await verifyCell(cell.value);
    }
}

async function verifyTypeOfHealthcareColumnHeaderType(policyExplorer: PolicyExplorer, categoryId?: string) {
    const typeOfHealthcareColumn = getTypeOfHealthcareColumnByPolicyExplorerCategoryId(policyExplorer, categoryId);

    if (!typeOfHealthcareColumn) {
        throw new Error(`Type of healthcare column not found`);
    }

    expect(typeOfHealthcareColumn?.every(cell => cell.type === PolicyExplorerCellType.HEADER)).toBe(true);
}
