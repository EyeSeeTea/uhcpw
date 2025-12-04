import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/app-context";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";
import { useRegionFilterOptions } from "../regional-page/useRegionFilterOptions";

export type PageType = "country" | "region" | "other";

export const usePageType = (): PageType => {
    const { countryOrRegion } = useParams<{ countryOrRegion: string }>();
    const { countriesAndSubregions } = useAppContext();
    const regionOptions = useRegionFilterOptions();

    const pageType = useMemo(() => {
        if (!countryOrRegion) return "other";

        const isCountry = countriesAndSubregions
            .filter(({ isInCountryPage }) => isInCountryPage)
            .some(country => formatCountryOrRegionParamName(country.name) === countryOrRegion);
        if (isCountry) return "country";

        const isRegion = regionOptions.some(region => formatCountryOrRegionParamName(region.text) === countryOrRegion);
        if (isRegion) return "region";

        return "other";
    }, [countryOrRegion, countriesAndSubregions, regionOptions]);

    return pageType;
};
