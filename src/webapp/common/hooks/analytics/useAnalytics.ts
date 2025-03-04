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

    const handleRedirect = (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>, callback: () => void) => {
        mouseEvent.preventDefault();
        const href = mouseEvent.currentTarget.href;
        const isBlank = mouseEvent.currentTarget.target === "_blank";
        callback();
        window.open(href, isBlank ? "_blank" : undefined);
    };

    const redirectWithEvent = React.useCallback(
        (anlyticsEvent: AnalyticsEvent) => (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            handleRedirect(mouseEvent, () => compositionRoot.googleAnalytics.sendEvent.execute(anlyticsEvent));
        },
        [compositionRoot.googleAnalytics.sendEvent]
    );

    const redirectWithExternalLink = React.useCallback(
        (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            handleRedirect(mouseEvent, () =>
                compositionRoot.googleAnalytics.sendEvent.execute({
                    name: "external_link",
                    href: mouseEvent.currentTarget.href,
                    text: mouseEvent.currentTarget.innerText,
                })
            );
        },
        [compositionRoot.googleAnalytics.sendEvent]
    );

    const redirectWithPageView = React.useCallback(
        (overrideProps: { location?: string; title?: string }) =>
            (mouseEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                handleRedirect(mouseEvent, () => compositionRoot.googleAnalytics.sendPageView.execute(overrideProps));
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
        redirectWithExternalLink,
        clickWithPageView,
    };
}
