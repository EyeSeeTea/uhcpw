import { render, RenderResult } from "@testing-library/react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { ReactNode } from "react";
import { getCompositionRoot, Repositories } from "../CompositionRoot";
import { AppContext, AppContextState } from "../webapp/contexts/app-context";

import { Instance } from "../data/entities/Instance";
import { User } from "../domain/entities/User";
import { Route, Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory } from "history";
import { getD2APiFromInstance } from "./d2-api";
import { MuiThemeProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { muiTheme } from "../webapp/pages/app/themes/dhis2.theme";
import muiThemeLegacy from "../webapp/pages/app/themes/dhis2-legacy.theme";
import { Country } from "../domain/entities/Country";
import { ResourceTheme } from "../domain/entities/resources/ResourceTheme";
import { GeneralContent } from "../domain/entities/GeneralContent";

export function givenAnUser(): User {
    return {
        id: "xE7jOejl9FI",
        name: "John Traore",
        username: "admin",
        userGroups: [],
        userRoles: [],
    };
}

export function givenACountries(): Country[] {
    return [
        {
            id: "DVnpk4xiXGJ",
            name: "Spain",
            longName: "Kingdom of Spain",
            code: "ESP",
            status: "Weak",
            coordinates: [2982, 12] as [number, number],
            parents: [{ id: "EUR", name: "Europe" }],
            flag: "http://es.png",
            summary: "**Financial hardship (2018)**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Gaps in current expenditure",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Main gaps in financing",
                            text: "Main gaps include lack of financial help",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Financial Protection",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Why is financial protection so needed?",
                            text: "Financial protection saves families from catastrophic environment",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
        {
            id: "rqaiYTAnMC6",
            name: "Bosnia and Herzegovina",
            longName: "Bosnia and Herzegovina",
            code: "BIH",
            coordinates: [18.000095, 44.001364],
            status: "Gaps",
            parents: [
                {
                    id: "tuJjq1LSoCL",
                    name: "UHCW_Income group UMIC: Upper middle-income countries",
                },
                {
                    id: "e7I4gDX3g5k",
                    name: "UHCW_EU candidate countries",
                },
                {
                    id: "KJm1Af6dksd",
                    name: "UHCW_European Region",
                },
                {
                    id: "A1BdaIwDheX",
                    name: "UHCW_Western Balkans",
                },
            ],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=Hs9oneaS45G",
            summary:
                "**Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            sliderInfo: {
                gapsSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: false,
            children: [
                {
                    id: "j44olg405lZ",
                    name: "BIH (Federation of Bosnia and Herzegovina)",
                    longName: "BIH (Federation of Bosnia and Herzegovina)",
                    code: "BIH-F",
                    coordinates: [18.6315, 45.0505],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=rqLyMfQ48Vh",
                    summary: "Test Federation of Bosnia and Herzegovin",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
                {
                    id: "FvoXRc5cEEk",
                    name: "BIH (Republika Srpska)",
                    longName: "BIH (Republika Srpska)",
                    code: "BIH-R",
                    coordinates: [18.341, 42.993],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=J7AKOh6AZko",
                    summary: "Republika Srpska",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
            ],
        },
    ];
}

export function givenACountriesAndRegions(): Country[] {
    return [
        {
            id: "DVnpk4xiXGJ",
            name: "Spain",
            longName: "Kingdom of Spain",
            code: "ESP",
            status: "Weak",
            coordinates: [2982, 12] as [number, number],
            parents: [{ id: "EUR", name: "Europe" }],
            flag: "http://es.png",
            summary: "**Financial hardship (2018)**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Gaps in current expenditure",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Main gaps in financing",
                            text: "Main gaps include lack of financial help",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Financial Protection",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Why is financial protection so needed?",
                            text: "Financial protection saves families from catastrophic environment",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
        {
            id: "rqaiYTAnMC6",
            name: "Bosnia and Herzegovina",
            longName: "Bosnia and Herzegovina",
            code: "BIH",
            coordinates: [18.000095, 44.001364],
            status: "Gaps",
            parents: [
                {
                    id: "tuJjq1LSoCL",
                    name: "UHCW_Income group UMIC: Upper middle-income countries",
                },
                {
                    id: "e7I4gDX3g5k",
                    name: "UHCW_EU candidate countries",
                },
                {
                    id: "KJm1Af6dksd",
                    name: "UHCW_European Region",
                },
                {
                    id: "A1BdaIwDheX",
                    name: "UHCW_Western Balkans",
                },
            ],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=Hs9oneaS45G",
            summary:
                "**Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            sliderInfo: {
                gapsSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: false,
            children: [
                {
                    id: "j44olg405lZ",
                    name: "BIH (Federation of Bosnia and Herzegovina)",
                    longName: "BIH (Federation of Bosnia and Herzegovina)",
                    code: "BIH-F",
                    coordinates: [18.6315, 45.0505],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=rqLyMfQ48Vh",
                    summary: "Test Federation of Bosnia and Herzegovin",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
                {
                    id: "FvoXRc5cEEk",
                    name: "BIH (Republika Srpska)",
                    longName: "BIH (Republika Srpska)",
                    code: "BIH-R",
                    coordinates: [18.341, 42.993],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=J7AKOh6AZko",
                    summary: "Republika Srpska",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
            ],
        },
        {
            id: "FvoXRc5cEEk",
            name: "BIH (Republika Srpska)",
            longName: "BIH (Republika Srpska)",
            code: "BIH-R",
            coordinates: [18.341, 42.993],
            status: "Gaps",
            parents: [],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=J7AKOh6AZko",
            summary: "Republika Srpska",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Republika Srpska",
                    sourceText: "Republika Srpska",
                    content: [
                        {
                            title: "Republika Srpska",
                            text: "",
                        },
                        {
                            title: "",
                            text: "Republika Srpska",
                        },
                        {
                            title: "Republika Srpska",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Republika Srpska",
                    sourceText: "Republika Srpska",
                    content: [
                        {
                            title: "Republika Srpska",
                            text: "Republika Srpska",
                        },
                        {
                            title: "Republika Srpska",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
        {
            id: "j44olg405lZ",
            name: "BIH (Federation of Bosnia and Herzegovina)",
            longName: "BIH (Federation of Bosnia and Herzegovina)",
            code: "BIH-F",
            coordinates: [18.6315, 45.0505],
            status: "Gaps",
            parents: [],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=rqLyMfQ48Vh",
            summary: "Test Federation of Bosnia and Herzegovin",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Test Federation of Bosnia and Herzegovin",
                    sourceText: "Test Federation of Bosnia and Herzegovin",
                    content: [
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "Test Federation of Bosnia and Herzegovin",
                        },
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Test Federation of Bosnia and Herzegovin",
                    sourceText: "Test Federation of Bosnia and Herzegovin",
                    content: [
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "Test Federation of Bosnia and Herzegovin",
                        },
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "Test Federation of Bosnia and Herzegovin",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
    ];
}

export function givenAThemes(): ResourceTheme[] {
    return [
        { id: "QQMVsTNPJbB", name: "Spending on Health", code: "Spending on Health" },
        { id: "XtkFOVtkBtT", name: "Financial Protection", code: "Financial Protection" },
        { id: "nyzMcROMpmY", name: "Voluntary Health Insurance", code: "Voluntary Health Insurance" },
    ];
}

export function givenAGeneralContent(): GeneralContent {
    return {
        footer: {
            disclaimer:
                "* All references to Kosovo should be understood to be in the context of the United Nations Security Council resolution 1244 (1999)",
        },
    };
}

export function getTestContext(repositoriesToOverwrite?: Repositories): AppContextState {
    // Mock api was working with axios but not with fetch

    const instance = new Instance({ url: "/dhis2" });
    const api = getD2APiFromInstance(instance);
    const context = {
        api: api,
        currentUser: givenAnUser(),
        compositionRoot: getCompositionRoot(api, null, instance, repositoriesToOverwrite),
        isNodeDev: true,
        countries: givenACountries(),
        themes: givenAThemes(),
        generalContent: givenAGeneralContent(),
        countriesAndRegions: givenACountriesAndRegions(),
    };

    return context;
}

export function customRender(children: ReactNode, repositoriesToOverwrite?: Repositories): RenderResult {
    const context = getTestContext(repositoriesToOverwrite);

    return render(
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <AppContext.Provider value={context}>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </AppContext.Provider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
}

type RouterConfig = {
    path: string;
    route: string;
};

export function customRenderWithRouterMatch(
    children: ReactNode,
    config: RouterConfig,
    overwriteRepositories?: Repositories,
    memoryHistory?: MemoryHistory
) {
    const history = memoryHistory || createHistory(config);

    const node = (
        <Router history={history}>
            <Route path={config.path || ""} render={() => children} />
        </Router>
    );

    return customRender(node, overwriteRepositories);
}

export function createHistory(config: RouterConfig) {
    return createMemoryHistory({ initialEntries: [config.route] });
}
