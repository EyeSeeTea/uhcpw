import "@testing-library/jest-dom";
import { BoundFunctions, queries, screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { ResourceThemeD2Repository } from "../../../../data/repositories/resources/ResourceThemeD2Repository";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests-ui";
import { IndicatorExplorerPage } from "../IndicatorExplorerPage";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { VisualizationD2Repository } from "../../../../data/repositories/indicator-explorer/VisualizationD2Repository";
import { AnalyticsD2Repository } from "../../../../data/repositories/indicator-explorer/AnalyticsD2Repository";
import F16Visualization from "./data/F16Visualization.json";
import F16Analytics from "./data/F16Analytics.json";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import userEvent from "@testing-library/user-event";
import Highcharts from "highcharts";

let visualizationRepository: VisualizationD2Repository;
let analyticsRepository: AnalyticsD2Repository;
let resourceThemeRepository: ResourceThemeD2Repository;

describe("IndicatorExplorerPage", () => {
    it("should render indicator explorer title", () => {
        expect(true).toBe(true);
    });
});

// describe("IndicatorExplorerPage", () => {
//     describe("to load page", () => {
//         it("should render indicator explorer title", () => {
//             givenAFilters();
//             givenAnAnalytics();

//             renderPage();

//             expect(screen.getByRole("heading", { name: /indicator explorer/i })).toBeInTheDocument();
//         });
//     });

//     describe("F16 - Share of households with catastrohic spending by consumption quintile", () => {
//         it("should render expected chart", async () => {
//             const { visualizations } = givenAFilters();
//             givenAnAnalytics();

//             renderPage();

//             await selectFiltersAndGetChart(visualizations[0]?.name || "", "Spain", "2008");

//             const chartTitle = await waitFor(() => screen.getByRole("heading", { name: visualizations[0]?.name }));

//             expect(chartTitle).toBeInTheDocument();

//             expect(screen.getByText("Richest")).toBeInTheDocument();
//             expect(screen.getByText("4th")).toBeInTheDocument();
//             expect(screen.getByText("3rd")).toBeInTheDocument();
//             expect(screen.getByText("2nd")).toBeInTheDocument();
//             expect(screen.getByText("Poorest")).toBeInTheDocument();

//             expect(screen.getByText("Tambor and Pavlova (2020)")).toBeInTheDocument();
//             expect(screen.getByText("15 June 2020")).toBeInTheDocument();

//             const stackedBarsPerBar = Highcharts.charts[0]?.series.length;
//             expect(stackedBarsPerBar).toBe(5);

//             const bars = Highcharts.charts[0]?.series[0]?.data.length;
//             expect(bars).toBe(3);
//         });
//     });
// });

function renderPage() {
    customRenderWithRouterMatch(
        <IndicatorExplorerPage />,
        { path: "/indicator-explorer", route: `/indicator-explorer` },
        {
            visualization: visualizationRepository,
            analytics: analyticsRepository,
            resourceTheme: resourceThemeRepository,
        }
    );
}

function givenAVisualizations(): Visualization[] {
    const mockedRepository = mock(VisualizationD2Repository);

    const dataItems = [F16Visualization];

    when(mockedRepository.getAll()).thenReturn(Future.success(dataItems));
    when(mockedRepository.getById(anything())).thenReturn(Future.success(F16Visualization));

    visualizationRepository = instance(mockedRepository);

    return dataItems;
}

function givenAnAnalytics(): Analytics {
    const mockedRepository = mock(AnalyticsD2Repository);

    const item: Analytics = F16Analytics as unknown as Analytics;

    when(mockedRepository.get(anything(), anything())).thenReturn(Future.success(item));

    analyticsRepository = instance(mockedRepository);

    return item;
}

function givenAFilters() {
    return {
        visualizations: givenAVisualizations(),
    };
}

async function selectFiltersAndGetChart(visualizationText: string, countryText: string, yearText: string) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    await selectFilter(main, "Category and indicator", visualizationText);
    await selectCountry(main, countryText);
    await selectFilter(main, "Years", yearText);

    const getChartButton = main.getByLabelText(/get chart/i);

    await waitFor(() => expect(getChartButton).not.toBeDisabled());

    userEvent.click(getChartButton);
}

async function selectFilter(scope: BoundFunctions<typeof queries>, name: string, value: string) {
    const autocompleteInput = scope.getByLabelText(name);

    userEvent.click(autocompleteInput);

    const targetItem = await waitFor(() => screen.getByRole("option", { name: value }));

    userEvent.click(targetItem);
}

async function selectCountry(scope: BoundFunctions<typeof queries>, value: string) {
    const countrySelector = scope.getByLabelText(/countries/i);

    userEvent.click(countrySelector);

    userEvent.click(await screen.findByText("All countries"));
    userEvent.click(await screen.findByRole("checkbox", { name: value }));

    userEvent.keyboard("{Escape}");

    await screen.findByLabelText(/countries/i);
}
