import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import { HomePage } from "./home/HomePage";
import { PolicyExplorerPage } from "./policy-explorer/PolicyExplorerPage";
import { ResourcesByTypePage } from "./resources/by-type/ResourcesByTypePage";
import { ResourcesPage } from "./resources/landing/ResourcesPage";
import { MethodsPage } from "./methods/MethodsPage";
import { IndicatorExplorerPage } from "./indicator-explorer/IndicatorExplorerPage";
import { CountryOrRegionalPage } from "./country-or-regional/CountryOrRegionalPage";
import { SeoMetaTags } from "../components/seo/SeoMetaTags";
import { appConfig } from "../../app-config";

const ScrollToTop = (): JSX.Element | null => {
    const { pathname, state } = useLocation<{ preserveScroll?: boolean }>();

    useEffect(() => {
        if (state?.preserveScroll) return;

        window.scrollTo(0, 0);
    }, [pathname, state?.preserveScroll]);

    return null;
};

export const Router: React.FC = React.memo(() => {
    return (
        <BrowserRouter basename={appConfig.basePath}>
            <SeoMetaTags />
            <ScrollToTop />
            <Switch>
                <Route path="/about" render={() => <AboutPage />} />
                <Route
                    path="/policy-explorer"
                    render={props => <PolicyExplorerPage searchParams={props.location.search} />}
                />
                <Route path="/indicator-explorer" render={() => <IndicatorExplorerPage />} />
                <Route
                    path="/resources/:category(news|multimedia|country-analysis|comparative-analysis)/:countriesOrTheme?/:countries?"
                    render={() => <ResourcesByTypePage />}
                />
                <Route path="/resources/:theme?" render={() => <ResourcesPage />} />
                <Route path="/methods" render={() => <MethodsPage />} />
                <Route path="/:countryOrRegion" render={() => <CountryOrRegionalPage />} />

                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </BrowserRouter>
    );
});
