import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { HomePage } from "./home/HomePage";

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Switch>
                {/* Default route */}
                <Route render={() => <HomePage />} />
            </Switch>
        </HashRouter>
    );
});
