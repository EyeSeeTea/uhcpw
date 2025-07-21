import React from "react";

import { useAppContext } from "../../../contexts/app-context";
import { useAnalytics } from "./useAnalytics";

type ReferenceLink = {
    href: string;
    target: string;
    onClick: () => void;
};

type State = {
    abbreviationsLink: ReferenceLink;
    glossaryLink: ReferenceLink;
};

export function useReferenceLinks(): State {
    const { generalContent } = useAppContext();
    const { sendPageView, redirectWithPageView } = useAnalytics();

    const abbreviationsLink = React.useMemo(() => {
        if (generalContent && generalContent?.abbreviations.file) {
            return {
                href: URL.createObjectURL(generalContent.abbreviations.file.content),
                target: "_blank",
                onClick: () => sendPageView({ title: "Abbreviations" }),
            };
        }
        return {
            href: "https://cmyn.short.gy/abbreviations",
            target: "_blank",
            onClick: () => redirectWithPageView({ title: "Abbreviations" }),
        };
    }, [generalContent, redirectWithPageView, sendPageView]);

    const glossaryLink = React.useMemo(() => {
        if (generalContent && generalContent?.glossary.file) {
            return {
                href: URL.createObjectURL(generalContent.glossary.file.content),
                target: "_blank",
                onClick: () => sendPageView({ title: "Glossary" }),
            };
        }
        return {
            href: "https://cmyn.short.gy/glossary",
            target: "_blank",
            onClick: () => redirectWithPageView({ title: "Glossary" }),
        };
    }, [generalContent, redirectWithPageView, sendPageView]);

    return {
        abbreviationsLink,
        glossaryLink,
    };
}
