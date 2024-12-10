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

    return {
        sendPageView,
        sendEvent,
    };
}
