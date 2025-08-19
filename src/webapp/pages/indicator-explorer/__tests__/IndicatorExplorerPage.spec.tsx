import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { IndicatorExplorerPage } from "../IndicatorExplorerPage";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { VisualizationD2Repository } from "../../../../data/repositories/indicator-explorer/VisualizationD2Repository";
import { AnalyticsD2Repository } from "../../../../data/repositories/indicator-explorer/AnalyticsD2Repository";
import { jFtGKQIQTGp_visualization } from "./data/jFtGKQIQTGp_Visualization";
import jFtGKQIQTGp_Analytics from "./data/jFtGKQIQTGp_Analytics.json";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import userEvent from "@testing-library/user-event";

let visualizationRepository: VisualizationD2Repository;
let analyticsRepository: AnalyticsD2Repository;

describe("IndicatorExplorerPage", () => {
    describe("to load page", () => {
        it("should render indicator explorer title", () => {
            givenAFilters();
            givenAnAnalytics();

            renderPage();

            expect(screen.getByRole("heading", { name: /indicator explorer/i })).toBeInTheDocument();
        });
    });

    describe("Get chart: financial hardship -> country level -> households with impoverishing health spending", () => {
        it("should render expected chart", async () => {
            const { visualizations } = givenAFilters();
            givenAnAnalytics();

            renderPage();

            await selectFiltersAndGetChart(visualizations[0]?.name || "", "Spain");

            const chartTitle = await waitFor(() => screen.getByRole("heading", { name: visualizations[0]?.name }));
            expect(chartTitle).toBeInTheDocument();

            const chartContainerElement = screen.getByLabelText(`chart-${visualizations[0]?.friendlyName}`);
            expect(chartContainerElement).toBeInTheDocument();
            const chartContainer = within(chartContainerElement);

            // Y-axis label
            expect(chartContainer.getByText("Households (%)")).toBeInTheDocument();

            // X-axis
            expect(chartContainer.getByText(/2006/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2007/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2008/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2009/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2010/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2011/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2012/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2013/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2014/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2015/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2016/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2017/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2018/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2019/i)).toBeInTheDocument();
            expect(chartContainer.getByText(/2020/i)).toBeInTheDocument();

            // Legend
            expect(chartContainer.getByText("Impoverished")).toBeInTheDocument();
            expect(chartContainer.getByText("Further impoverished")).toBeInTheDocument();
        });
    });
});

function renderPage() {
    customRenderWithRouterMatch(
        <IndicatorExplorerPage />,
        { path: "/indicator-explorer", route: `/indicator-explorer` },
        {
            visualization: visualizationRepository,
            analytics: analyticsRepository,
        }
    );
}

function givenAVisualizations(): Visualization[] {
    const mockedRepository = mock(VisualizationD2Repository);

    const dataItems = [jFtGKQIQTGp_visualization];

    when(mockedRepository.getAll()).thenReturn(Future.success(dataItems));
    when(mockedRepository.getById(anything())).thenReturn(Future.success(jFtGKQIQTGp_visualization));

    visualizationRepository = instance(mockedRepository);

    return dataItems;
}

function givenAnAnalytics(): Analytics {
    const mockedRepository = mock(AnalyticsD2Repository);

    const item: Analytics = jFtGKQIQTGp_Analytics as unknown as Analytics;

    when(mockedRepository.get(anything(), anything(), anything(), anything())).thenReturn(Future.success(item));

    analyticsRepository = instance(mockedRepository);

    return item;
}

function givenAFilters() {
    return {
        visualizations: givenAVisualizations(),
    };
}

async function selectFiltersAndGetChart(
    visualizationText: string,
    countryText: string,
    yearOptions?: { year: string; allYears: false } | { allYears: true; year: undefined }
) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    await selectIndicatorsFilter(main, visualizationText);
    await selectCountry(main, countryText);
    if (yearOptions) {
        await selectYearsFilter(main, yearOptions);
    }

    const getChartButton = main.getByRole("button", {
        name: /get chart/i,
    });

    await waitFor(() => expect(getChartButton).not.toBeDisabled());

    await userEvent.click(getChartButton);
}

async function selectIndicatorsFilter(scope: BoundFunctions<typeof queries>, value: string) {
    const inputElement = await scope.findByPlaceholderText("Select category and indicator");

    await userEvent.click(inputElement);
    await waitFor(() => expect(inputElement).toHaveFocus());

    const categoryOption = await scope.findByText(/financial hardship/i);
    await userEvent.click(categoryOption);

    const subcategoryOption = await scope.findByText(/country level/i);
    await userEvent.click(subcategoryOption);

    const treeitem = scope.getByRole("treeitem", {
        name: /financial hardship country level households with impoverishing health spending/i,
    });

    const targetItem = within(treeitem).getByText(value);
    await userEvent.click(targetItem);

    await waitFor(() => expect(inputElement).toHaveValue(value));
}

async function selectCountry(scope: BoundFunctions<typeof queries>, value: string) {
    const countrySelectorTextBox = await scope.findByLabelText(/expand-tree-Select country or area/i);
    await userEvent.click(countrySelectorTextBox);

    const menu = screen.getByRole("menu");
    const openedMenuElement = within(menu).getByRole("listbox");
    await waitFor(() => expect(openedMenuElement).toBeInTheDocument());

    const checkbox = within(openedMenuElement).getByRole("checkbox", { name: value });
    await userEvent.click(checkbox);
    await userEvent.keyboard("{Escape}");

    const chip = scope.getByRole("button", {
        name: value,
    });
    await waitFor(() => expect(chip).toBeInTheDocument());
}

async function selectYearsFilter(
    scope: BoundFunctions<typeof queries>,
    yearOptions: { year: string; allYears: false } | { allYears: true; year: undefined }
) {
    const selectAllYears = yearOptions?.allYears;
    const autocompleteInput = scope.getByRole("textbox", {
        name: /input select year/i,
    });
    await userEvent.click(autocompleteInput);

    const menu = screen.getByRole("menu");
    const openedMenuElement = within(menu).getByRole("listbox");
    expect(openedMenuElement).toBeInTheDocument();
    await waitFor(() => expect(openedMenuElement).toBeInTheDocument());

    const checkbox = screen.getByRole("checkbox", {
        name: selectAllYears ? /select all all years/i : yearOptions.year,
    });
    await userEvent.click(checkbox);
    await userEvent.keyboard("{Escape}");

    const chip = scope.getByRole("button", {
        name: selectAllYears ? /all years/i : yearOptions.year,
    });
    await waitFor(() => expect(chip).toBeInTheDocument());
}
