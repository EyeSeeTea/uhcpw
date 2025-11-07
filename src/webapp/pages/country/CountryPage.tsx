import { Layout } from "../../components/layout/Layout";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Header } from "../../components/country-page/Header";
import { useCountryPage } from "./useCountryPage";
import { useCountryInfo } from "./useCountryInfo";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { CountrySlider } from "../../components/country-page/slider/CountrySlider";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";
import { SeoMetaTags } from "../../components/seo/SeoMetaTags";
import { useCountryPageSeoConfig } from "./useCountryPageSeoConfig";

export const CountryPage: React.FC = () => {
    const history = useHistory();
    const { countryOrRegion } = useParams<{
        countryOrRegion?: string;
    }>();
    const { countryFilter, resetTab, handleResetTab } = useCountryPage();
    const { sendEvent } = useAnalytics();
    const isSmallScreen = useIsSmallScreen();

    const country = useCountryInfo(countryFilter.selectedCountry);
    const seoConfig = useCountryPageSeoConfig(country);

    const filterInParams = useMemo(() => {
        const countryIdInFilter = countryOrRegion
            ? countryFilter.countryOptions.find(
                  option => formatCountryOrRegionParamName(option.text) === countryOrRegion
              )?.value
            : null;

        return {
            country: countryIdInFilter ? countryIdInFilter : undefined,
        };
    }, [countryFilter.countryOptions, countryOrRegion]);

    useEffect(() => {
        if (filterInParams.country && filterInParams.country !== countryFilter?.selectedCountry) {
            countryFilter.onCountryChange(filterInParams.country);
            !resetTab && handleResetTab(true);
        }
    }, [countryFilter, filterInParams.country, handleResetTab, resetTab]);

    const selectedCountryName = useMemo(
        () => countryFilter.countryOptions.find(country => country.value === countryFilter.selectedCountry)?.text,
        [countryFilter.countryOptions, countryFilter.selectedCountry]
    );

    useEffect(() => {
        if (selectedCountryName)
            sendEvent({ name: "country_page_view", pageTitle: "Country page", country: selectedCountryName });
    }, [sendEvent, selectedCountryName]);

    const handleCountryChange = useCallback(
        (value: string) => {
            const countryName = countryFilter.countryOptions.find(option => option.value === value)?.text;
            const countryNameInFilter = countryName ? formatCountryOrRegionParamName(countryName) : undefined;

            if (value && countryNameInFilter) {
                history.push(`/${countryNameInFilter}`);
            }

            countryFilter.onCountryChange(value);
            handleResetTab(true);
        },
        [countryFilter, handleResetTab, history]
    );

    const sliderRef = useRef(null);
    const resourcesRef = useRef(null);
    const expertRef = useRef(null);

    return (
        <Layout enableRotation={isSmallScreen}>
            <SeoMetaTags config={seoConfig} />
            <Header
                countryId={countryFilter.selectedCountry}
                onCountryChange={handleCountryChange}
                countryOptions={countryFilter.countryOptions}
                sliderRef={sliderRef}
                resourcesRef={resourcesRef}
                expertRef={expertRef}
                handleResetTab={handleResetTab}
            />
            <Hero countryId={countryFilter.selectedCountry} />
            <Divider financialProtectionStatus={country?.status} />
            <section ref={sliderRef}>
                <CountrySlider
                    countryId={countryFilter.selectedCountry}
                    handleResetTab={handleResetTab}
                    resetTab={resetTab}
                    isSmallScreen={isSmallScreen}
                />
            </section>
            <Divider financialProtectionStatus={country?.status} />
            <section ref={resourcesRef}>
                <CountryResources countryIds={[countryFilter.selectedCountry]} />
            </section>
            <Divider financialProtectionStatus={country?.status} />
            <section ref={expertRef}>
                <CountryExpert countryIds={[countryFilter.selectedCountry]} />
            </section>
        </Layout>
    );
};
