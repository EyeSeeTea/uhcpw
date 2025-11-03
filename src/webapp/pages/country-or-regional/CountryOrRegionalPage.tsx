import React from "react";
import { CountryPage } from "../country/CountryPage";
import { RegionalPage } from "../regional-page/RegionalPage";
import { NotFoundPage } from "../not-found/NotFoundPage";
import { usePageType } from "./usePageType";

export const CountryOrRegionalPage: React.FC = () => {
    const pageType = usePageType();

    if (pageType === "country") {
        return <CountryPage />;
    }

    if (pageType === "region") {
        return <RegionalPage />;
    }

    return <NotFoundPage />;
};
