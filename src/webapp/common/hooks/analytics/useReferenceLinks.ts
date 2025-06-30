import { useAppContext } from "../../../contexts/app-context";
import { useAnalytics } from "./useAnalytics";
import React from "react";

export function useReferenceLinks() {
    const { generalContent } = useAppContext();
    const { sendPageView, redirectWithPageView } = useAnalytics();

    const abbreviationsLink = React.useMemo(() => {
        if (generalContent && generalContent?.abbreviations.file) {
            return {
                href: URL.createObjectURL(generalContent.abbreviations.file.content),
                download: generalContent.abbreviations.file.name,
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
                download: generalContent.glossary.file.name,
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
