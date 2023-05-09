import "@testing-library/jest-dom";
import { BoundFunctions, prettyDOM, queries, screen, waitFor, within } from "@testing-library/react";
import { anything, instance, mock, when } from "ts-mockito";
import { ResourceThemeD2Repository } from "../../../../data/repositories/resources/ResourceThemeD2Repository";
import { Future } from "../../../../domain/entities/Future";
import { customRenderWithRouterMatch } from "../../../../utils/tests";
import { CountryD2Repository } from "../../../../data/repositories/CountryD2Repository";
import { IndicatorExplorerPage } from "../IndicatorExplorerPage";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { VisualizationD2Repository } from "../../../../data/repositories/indicator-explorer/VisualizationD2Repository";
import { Country } from "../../../../domain/entities/Country";
import { AnalyticsD2Repository } from "../../../../data/repositories/indicator-explorer/AnalyticsD2Repository";
import F16Visualization from "./data/F16Visualization.json";
import F16Analytics from "./data/F16Analytics.json";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import userEvent from "@testing-library/user-event";

let visualizationRepository: VisualizationD2Repository;
let analyticsRepository: AnalyticsD2Repository;
let resourceThemeRepository: ResourceThemeD2Repository;
let countryRepository: CountryD2Repository;

describe("IndicatorExplorerPage", () => {
    describe("to load page", () => {
        it("should render indicator explorer title", async () => {
            givenAFilters();
            givenAnAnalytics();

            renderPage();

            expect(screen.getByRole("heading", { name: /indicator explorer/i })).toBeInTheDocument();
        });
    });

    describe("F16 - Share of households with catastrohic spending by consumption quintile", () => {
        it("should render expected chart title", async () => {
            const { visualizations, countries } = givenAFilters();
            givenAnAnalytics();

            renderPage();

            await selectFiltersAndGetChart(visualizations[0]?.name || "", countries[0]?.name || "", "2008");

            const chartTitle = await waitFor(() => screen.getByRole("heading", { name: visualizations[0]?.name }));

            expect(chartTitle).toBeInTheDocument();
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
            resourceTheme: resourceThemeRepository,
            country: countryRepository,
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
        },
    ];

    when(mockedRepository.get()).thenReturn(Future.success(data));

    countryRepository = instance(mockedRepository);

    return data;
}

async function selectFiltersAndGetChart(visualizationText: string, countryText: string, yearText: string) {
    const mainElement = screen.getByRole("main");
    const main = within(mainElement);

    await selectFilter(main, "Category and indicator", visualizationText);
    await selectFilter(main, "Countries", countryText);
    await selectFilter(main, "Years", yearText);

    const getChartButton = main.getByRole("button", {
        name: /get chart/i,
    });

    await waitFor(() => expect(getChartButton).not.toBeDisabled());

    userEvent.click(getChartButton);
}

async function selectFilter(scope: BoundFunctions<typeof queries>, name: string, value: string) {
    const autocompleteInput = scope.getByRole("textbox", {
        name,
    });

    userEvent.click(autocompleteInput);

    const targetItem = await waitFor(() => screen.getByRole("option", { name: value }));

    userEvent.click(targetItem);
}
