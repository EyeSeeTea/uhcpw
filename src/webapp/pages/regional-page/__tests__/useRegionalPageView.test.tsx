import React from "react";
import { act, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import { useRegionalPageView } from "../useRegionalPageView";

const mockSendPageView = jest.fn();
jest.mock("../../../common/hooks/analytics/useAnalytics", () => ({
    useAnalytics: () => ({ sendPageView: mockSendPageView }),
}));
jest.mock("../../../contexts/app-context", () => ({
    useAppContext: () => ({
        regions: [
            { name: "European Union", isInRegionalPage: true },
            { name: "Western Balkans", isInRegionalPage: true },
        ],
    }),
}));

function Page() {
    useRegionalPageView();
    return null;
}

describe("useRegionalPageView", () => {
    it("tracks initial regional page, region changes and back navigation", () => {
        const history = createMemoryHistory({ initialEntries: ["/EuropeanUnion"] });
        render(
            <Router history={history}>
                <Route path="/:countryOrRegion">
                    <Page />
                </Route>
            </Router>
        );
        expect(mockSendPageView).toHaveBeenLastCalledWith({ title: "Regional overview - European Union" });
        act(() => history.push("/WesternBalkans"));
        expect(mockSendPageView).toHaveBeenLastCalledWith({ title: "Regional overview - Western Balkans" });
        act(() => history.goBack());
        expect(mockSendPageView).toHaveBeenCalledTimes(3);
        expect(mockSendPageView).toHaveBeenLastCalledWith({ title: "Regional overview - European Union" });
    });

    it("does not track an unrecognized region", () => {
        mockSendPageView.mockClear();
        const history = createMemoryHistory({ initialEntries: ["/unknown"] });
        render(
            <Router history={history}>
                <Route path="/:countryOrRegion">
                    <Page />
                </Route>
            </Router>
        );
        expect(mockSendPageView).not.toHaveBeenCalled();
    });
});
