import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { useAppContext } from "../../contexts/app-context";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";

export function useRegionalPageView(): void {
    const { countryOrRegion } = useParams<{ countryOrRegion: string }>();
    const { regions } = useAppContext();
    const { sendPageView } = useAnalytics();
    const regionName = regions.find(
        region => region.isInRegionalPage && formatCountryOrRegionParamName(region.name) === countryOrRegion
    )?.name;

    useEffect(() => {
        if (regionName) sendPageView({ title: `Regional overview - ${regionName}` });
    }, [regionName, sendPageView]);
}
