import React from "react";
import { act, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";

const mockSendPageView = jest.fn();
jest.mock("../../../common/hooks/analytics/useAnalytics", () => ({
    useAnalytics: () => ({ sendPageView: mockSendPageView }),
}));
jest.mock("../../../components/layout/Layout", () => ({
    Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("NotFoundPage", () => {
    it("tracks the initial unknown path and navigation to a different unknown path", () => {
        const history = createMemoryHistory({ initialEntries: ["/unknown"] });
        render(
            <Router history={history}>
                <NotFoundPage />
            </Router>
        );
        expect(mockSendPageView).toHaveBeenCalledWith({ title: "Page not found" });
        act(() => history.push("/unknown?filter=1"));
        expect(mockSendPageView).toHaveBeenCalledTimes(1);
        act(() => history.push("/missing"));
        expect(mockSendPageView).toHaveBeenCalledTimes(2);
    });
});
