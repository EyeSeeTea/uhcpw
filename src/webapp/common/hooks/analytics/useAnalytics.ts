import React from "react";
import { useAppContext } from "../../../contexts/app-context";
import { AnalyticsEvent } from "../../../../domain/entities/AnalyticsEvent";

export function useAnalytics() {
    const { compositionRoot } = useAppContext();

    const sendPageView = React.useCallback(
        (overrideProps: { location?: string; title?: string }) =>
            compositionRoot.googleAnalytics.sendPageView.execute(overrideProps),
        [compositionRoot]
    );

    const sendEvent = React.useCallback(
        (event: AnalyticsEvent) => compositionRoot.googleAnalytics.sendEvent.execute(event),
        [compositionRoot]
    );

    const redirectWithEvent = React.useCallback(
        (anlyticsEvent: AnalyticsEvent) => (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            mouseEvent.preventDefault();
            const href = mouseEvent.currentTarget.href;
            compositionRoot.googleAnalytics.sendEvent.execute(anlyticsEvent);
            window.location.href = href;
        },
        [compositionRoot.googleAnalytics.sendEvent]
    );

    const redirectWithPageView = React.useCallback(
        (overrideProps: { location?: string; title?: string }) =>
            (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                mouseEvent.preventDefault();
                const href = mouseEvent.currentTarget.href;
                compositionRoot.googleAnalytics.sendPageView.execute(overrideProps);
                window.location.href = href;
            },
        [compositionRoot.googleAnalytics.sendPageView]
    );

    const clickWithEvent = React.useCallback(
        (event: AnalyticsEvent, callback: () => void) => {
            compositionRoot.googleAnalytics.sendEvent.execute(event);
            callback();
        },
        [compositionRoot.googleAnalytics.sendEvent]
    );

    const clickWithPageView = React.useCallback(
        (overrideProps: { location?: string; title?: string }, callback: () => void) => {
            compositionRoot.googleAnalytics.sendPageView.execute(overrideProps);
            callback();
        },
        [compositionRoot.googleAnalytics.sendPageView]
    );

    return {
        sendPageView,
        sendEvent,
        redirectWithEvent,
        redirectWithPageView,
        clickWithEvent,
        clickWithPageView,
    };
}
