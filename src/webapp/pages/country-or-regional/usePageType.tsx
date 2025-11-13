import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/app-context";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";

export type PageType = "country" | "other";

export const usePageType = (): PageType => {
    const { countryOrRegion } = useParams<{ countryOrRegion: string }>();
    const { countriesAndSubregions } = useAppContext();

    const pageType = useMemo(() => {
        if (!countryOrRegion) return "other";

        const isCountry = countriesAndSubregions
            .filter(({ isInCountryPage }) => isInCountryPage)
            .some(country => formatCountryOrRegionParamName(country.name) === countryOrRegion);
        if (isCountry) return "country";

        return "other";
    }, [countryOrRegion, countriesAndSubregions]);

    return pageType;
};
