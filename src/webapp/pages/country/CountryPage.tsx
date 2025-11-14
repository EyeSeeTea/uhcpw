import { Layout } from "../../components/layout/Layout";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../../components/country-page/Header";
import { useCountryPage } from "./useCountryPage";
import { useCountryInfo } from "./useCountryInfo";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { CountrySlider } from "../../components/country-page/slider/CountrySlider";
import {
    formatCountryOrRegionParamName,
    parseCountryOrRegionParamToName,
} from "../../utils/formatCountryOrRegionParamName";

export const CountryPage: React.FC = () => {
    const history = useHistory();
    const { countryFilter, resetTab, handleResetTab } = useCountryPage();
    const { sendEvent } = useAnalytics();
    const isSmallScreen = useIsSmallScreen();

    const country = useCountryInfo(countryFilter.selectedCountry);

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const countryNameInFilter = searchParams.get("country");
        const countryName = countryNameInFilter ? parseCountryOrRegionParamToName(countryNameInFilter) : undefined;

        const countryIdInFilter = countryName
            ? countryFilter.countryOptions.find(option => option.text === countryName)?.value
            : null;

        return {
            country: countryIdInFilter ? countryIdInFilter : undefined,
        };
    }, [countryFilter.countryOptions, history.location.search]);

    useEffect(() => {
        if (filterInParams.country && filterInParams.country !== countryFilter?.selectedCountry) {
            const searchParams = new URLSearchParams(history.location.search);
            const countryName = countryFilter.countryOptions.find(
                option => option.value === filterInParams.country
            )?.text;
            const countryNameInFilter = countryName ? formatCountryOrRegionParamName(countryName) : undefined;

            if (countryNameInFilter) {
                searchParams.set("country", countryNameInFilter);
            }

            countryFilter.onCountryChange(filterInParams.country);
            !resetTab && handleResetTab(true);
        }
    }, [countryFilter, filterInParams.country, handleResetTab, history.location.search, resetTab]);

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
            const searchParams = new URLSearchParams(history.location.search);
            const countryName = countryFilter.countryOptions.find(option => option.value === value)?.text;
            const countryNameInFilter = countryName ? formatCountryOrRegionParamName(countryName) : undefined;
            if (value && countryNameInFilter) {
                searchParams.set("country", countryNameInFilter);
            }

            countryFilter.onCountryChange(value);
            history.push({ search: searchParams.toString() });
            handleResetTab(true);
        },
        [countryFilter, handleResetTab, history]
    );

    const sliderRef = useRef(null);
    const resourcesRef = useRef(null);
    const expertRef = useRef(null);

    return (
        <Layout enableRotation={isSmallScreen} isOverflowVisible>
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
