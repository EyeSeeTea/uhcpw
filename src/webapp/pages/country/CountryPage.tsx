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

export const CountryPage: React.FC = () => {
    const history = useHistory();
    const { countryFilter } = useCountryPage();

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const country = searchParams.get("country");

        return {
            country: country ? country : undefined,
        };
    }, [history.location.search]);

    useEffect(() => {
        if (filterInParams.country) {
            const searchParams = new URLSearchParams(history.location.search);
            searchParams.set("country", filterInParams.country);
            countryFilter.onCountryChange(filterInParams.country);
        }
    }, [countryFilter, filterInParams.country, history.location.search]);

    const handleCountryChange = useCallback(
        (value: string) => {
            const searchParams = new URLSearchParams(history.location.search);

            if (value) {
                searchParams.set("country", value);
            }
            countryFilter.onCountryChange(value);
            history.push({ search: searchParams.toString() });
        },
        [countryFilter, history]
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
            />
            <Hero countryId={countryFilter.selectedCountry} />
            <Divider />
            <section ref={sliderRef}>
                <Slider countryId={countryFilter.selectedCountry} />
            </section>
            <Divider isOrange={false} />
            <section ref={resourcesRef}>
                <CountryResources countryId={countryFilter.selectedCountry} />
            </section>
            <Divider />
            <section ref={expertRef}>
                <CountryExpert countryId={countryFilter.selectedCountry} />
            </section>
        </Layout>
    );
};
