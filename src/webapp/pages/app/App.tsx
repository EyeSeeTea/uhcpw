import { useDataEngine } from "@dhis2/app-runtime";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { Feedback } from "@eyeseetea/feedback-component";
import { MuiThemeProvider } from "@material-ui/core/styles";
//@ts-ignore
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import { appConfig } from "../../../app-config";
import { getCompositionRoot } from "../../../CompositionRoot";
import { Instance } from "../../../data/entities/Instance";
import { D2Api } from "../../../types/d2-api";
import { AppContext, AppContextState } from "../../contexts/app-context";
import { Router } from "../Router";
import "./App.css";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";

export interface AppProps {
    api: D2Api;
    d2: D2;
    instance: Instance;
}

export const App: React.FC<AppProps> = React.memo(function App({ api, d2, instance }) {
    const [loading, setLoading] = useState(true);
    const [appContext, setAppContext] = useState<AppContextState | null>(null);
    const dataEngine = useDataEngine();

    useEffect(() => {
        async function setup() {
            const compositionRoot = getCompositionRoot(api, dataEngine, instance);
            const currentUser = (await compositionRoot.users.getCurrent.execute().runAsync()).data;
            if (!currentUser) throw new Error("User not logged in");
            const isNodeDev = process.env.NODE_ENV === "development";

            const countries = (await compositionRoot.countries.get.execute().runAsync()).data || [];

            setAppContext({ api, currentUser, compositionRoot, isNodeDev, countries });
            setLoading(false);
        }
        setup();
    }, [d2, api, instance, dataEngine]);

    if (loading) return null;

    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <SnackbarProvider>
                    {appConfig.feedback && appContext && (
                        <Feedback options={appConfig.feedback} username={appContext.currentUser.username} />
                    )}

                    <div id="app" className="content">
                        <AppContext.Provider value={appContext}>
                            <Router />
                        </AppContext.Provider>
                    </div>
                </SnackbarProvider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
});

type D2 = object;
