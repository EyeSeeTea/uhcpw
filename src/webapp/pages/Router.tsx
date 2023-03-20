import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import { HomePage } from "./home/HomePage";
import { PolicyExplorerPage } from "./policy-explorer/PolicyExplorerPage";
import { ResourcesPage } from "./resources/ResourcesPage";

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/resources" render={() => <ResourcesPage />} />
                <Route path="/about" render={() => <AboutPage />} />
                <Route path="/policy-explorer" render={() => <PolicyExplorerPage />} />

                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </HashRouter>
    );
});
