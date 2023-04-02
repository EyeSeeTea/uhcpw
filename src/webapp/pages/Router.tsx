import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import { HomePage } from "./home/HomePage";
import { IndicatorExplorerPage } from "./indicator-explorer/IndicatorExplorerPage";
import { PolicyExplorerPage } from "./policy-explorer/PolicyExplorerPage";
import { ResourcesPage } from "./resources/ResourcesPage";

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/resources" render={() => <ResourcesPage />} />
                <Route path="/about" render={() => <AboutPage />} />
                <Route path="/policy-explorer" render={() => <PolicyExplorerPage />} />
                <Route path="/indicator-explorer" render={() => <IndicatorExplorerPage />} />

                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </HashRouter>
    );
});
