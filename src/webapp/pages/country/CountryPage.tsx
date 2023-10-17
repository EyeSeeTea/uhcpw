import { Layout } from "../../components/layout/Layout";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import { Slider } from "../../components/country-page/slider/Slider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../../components/country-page/Header";

export const CountryPage: React.FC = () => {
    const history = useHistory();
    const [selectedCountry, setSelectedCountry] = useState("");

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
            setSelectedCountry(filterInParams.country);
        }
    }, [filterInParams.country, history.location.search, selectedCountry]);

    const onCountryChange = useCallback(
        (value: string) => {
            const searchParams = new URLSearchParams(history.location.search);

            if (value) {
                searchParams.set("country", value);
            }
            setSelectedCountry(value);
            history.push({ search: searchParams.toString() });
        },
        [history]
    );

    const sliderRef = useRef(null);
    const resourcesRef = useRef(null);
    const expertRef = useRef(null);

    return (
        <Layout>
            <Header
                countryId={selectedCountry}
                onCountryChange={onCountryChange}
                sliderRef={sliderRef}
                resourcesRef={resourcesRef}
                expertRef={expertRef}
            />
            <Hero countryId={selectedCountry} />
            <Divider />
            <div ref={sliderRef}>
                <Slider />
            </div>
            <Divider isOrange={false} />
            <div ref={resourcesRef}>
                <CountryResources countryId={selectedCountry} />
            </div>
            <Divider />
            <div ref={expertRef}>
                <CountryExpert countryId={selectedCountry} />
            </div>
        </Layout>
    );
};
