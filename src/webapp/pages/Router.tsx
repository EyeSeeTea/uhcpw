import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import { HomePage } from "./home/HomePage";
import { IndicatorExplorerPage } from "./indicator-explorer/IndicatorExplorerPage";
import { PolicyExplorerPage } from "./policy-explorer/PolicyExplorerPage";
import { ResourcesByTypePage } from "./resources/by-type/ResourcesByTypePage";
import { ResourcesPage } from "./resources/landing/ResourcesPage";
import { CountryPage } from "./country/CountryPage";

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/about" render={() => <AboutPage />} />
                <Route path="/policy-explorer" render={() => <PolicyExplorerPage />} />
                <Route path="/indicator-explorer" render={() => <IndicatorExplorerPage />} />
                <Route
                    path="/resources/:category(news|multimedia|country-analysis|comparative-analysis)"
                    render={() => <ResourcesByTypePage />}
                />
                <Route path="/country/:name" render={() => <CountryPage />} />
                <Route path="/resources" render={() => <ResourcesPage />} />

                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </HashRouter>
    );
});
