import React, { useEffect } from "react";
import { HashRouter, Route, Switch, useLocation } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import { HomePage } from "./home/HomePage";
import { PolicyExplorerPage } from "./policy-explorer/PolicyExplorerPage";
import { ResourcesByTypePage } from "./resources/by-type/ResourcesByTypePage";
import { ResourcesPage } from "./resources/landing/ResourcesPage";
import { CountryPage } from "./country/CountryPage";
import { IndicatorExplorerPage } from "./indicator-explorer/IndicatorExplorerPage";

const ScrollToTop = (): JSX.Element | null => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <ScrollToTop />
            <Switch>
                <Route path="/about" render={() => <AboutPage />} />
                <Route path="/policy-explorer" render={() => <PolicyExplorerPage />} />
                <Route path="/indicator-explorer" render={() => <IndicatorExplorerPage />} />
                <Route
                    path="/resources/:category(news|multimedia|country-analysis|comparative-analysis)"
                    render={() => <ResourcesByTypePage />}
                />
                <Route path="/country-page" render={() => <CountryPage />} />
                <Route path="/resources" render={() => <ResourcesPage />} />

                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </HashRouter>
    );
});
