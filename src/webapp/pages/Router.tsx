import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { HomePage } from "./home/HomePage";
import { ResourcesPage } from "./resources/ResourcesPage";

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/resources" render={() => <ResourcesPage />} />

                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </HashRouter>
    );
});
