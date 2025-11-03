import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CountryPage } from "../country/CountryPage";
import { RegionalPage } from "../regional-page/RegionalPage";
import { NotFoundPage } from "../not-found/NotFoundPage";
import { useAppContext } from "../../contexts/app-context";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";

export const CountryOrRegionalPage: React.FC = () => {
    const { countryOrRegion } = useParams<{ countryOrRegion: string }>();
    const { countriesAndSubregions, regions } = useAppContext();

    const pageType = useMemo(() => {
        if (!countryOrRegion) return "none";

        const isCountry = countriesAndSubregions
            .filter(({ isInCountryPage }) => isInCountryPage)
            .some(country => formatCountryOrRegionParamName(country.name) === countryOrRegion);
        if (isCountry) return "country";

        const isRegion = regions
            .filter(region => region.isInRegionalPage)
            .some(region => formatCountryOrRegionParamName(region.name) === countryOrRegion);
        if (isRegion) return "region";

        return "none";
    }, [countryOrRegion, countriesAndSubregions, regions]);

    if (pageType === "country") {
        return <CountryPage />;
    }

    if (pageType === "region") {
        return <RegionalPage />;
    }

    return <NotFoundPage />;
};
