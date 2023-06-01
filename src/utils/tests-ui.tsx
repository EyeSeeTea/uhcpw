import { render, RenderResult } from "@testing-library/react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { ReactNode } from "react";
import { getCompositionRoot, Repositories } from "../CompositionRoot";
import { AppContext, AppContextState } from "../webapp/contexts/app-context";

import { Instance } from "../data/entities/Instance";
import { User } from "../domain/entities/User";
import { Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { getD2APiFromInstance } from "./d2-api";
import { MuiThemeProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { muiTheme } from "../webapp/pages/app/themes/dhis2.theme";
import muiThemeLegacy from "../webapp/pages/app/themes/dhis2-legacy.theme";
import { Country } from "../domain/entities/Country";

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
            code: "ESP",
            description: "description",
            color: "color",
            coordinates: [2982, 12] as [number, number],
            parents: [{ id: "EUR", name: "Europe" }],
            flag: "http://es.png",
            summary: "**Financial hardship (2018)**",
        },
    ];
}

export function getTestContext(repositoriesToOverwrite?: Repositories): AppContextState {
    // Mock api was working with axios but not with fetch

    const instance = new Instance({ url: "/dhis2" });
    const api = getD2APiFromInstance(instance);
    const context = {
        api: api,
        currentUser: givenAnUser(),
        compositionRoot: getCompositionRoot(api, instance, repositoriesToOverwrite),
        isNodeDev: true,
        countries: givenACountries(),
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
    overwriteRepositories?: Repositories
) {
    const node = (
        <Router history={createMemoryHistory({ initialEntries: [config.route] })}>
            <Route path={config.path || ""} render={() => children} />
        </Router>
    );

    return customRender(node, overwriteRepositories);
}
