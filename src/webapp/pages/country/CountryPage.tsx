import { Layout } from "../../components/layout/Layout";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import { Slider } from "../../components/country-page/slider/Slider";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../../components/country-page/Header";
import { useCountryPage } from "./useCountryPage";
import { useCountryInfo } from "./useCountryInfo";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

export const CountryPage: React.FC = () => {
    const history = useHistory();
    const { countryFilter, resetTab, handleResetTab } = useCountryPage();
    const country = useCountryInfo(countryFilter.selectedCountry);
    const { sendEvent } = useAnalytics();

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const country = searchParams.get("country");

        return {
            country: country ? country : undefined,
        };
    }, [history.location.search]);

    useEffect(() => {
        if (filterInParams.country && filterInParams.country !== countryFilter?.selectedCountry) {
            const searchParams = new URLSearchParams(history.location.search);
            searchParams.set("country", filterInParams.country);
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

            if (value) {
                searchParams.set("country", value);
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
        <Layout>
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
            <Divider countryStatus={country?.status} />
            <section ref={sliderRef}>
                <Slider countryId={countryFilter.selectedCountry} resetTab={resetTab} handleResetTab={handleResetTab} />
            </section>
            <Divider countryStatus={country?.status} />
            <section ref={resourcesRef}>
                <CountryResources countryId={countryFilter.selectedCountry} />
            </section>
            <Divider countryStatus={country?.status} />
            <section ref={expertRef}>
                <CountryExpert countryId={countryFilter.selectedCountry} />
            </section>
        </Layout>
    );
};
