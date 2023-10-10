import { Layout } from "../../components/layout/Layout";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import { Slider } from "../../components/country-page/slider/Slider";
import { useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../../components/country-page/Header";

export const CountryPage: React.FC = () => {
    const history = useHistory();
    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const country = searchParams.get("country");

        return {
            country: country ? [country] : undefined,
        };
    }, [history]);
    const sliderRef = useRef(null);
    const resourcesRef = useRef(null);
    const expertRef = useRef(null);

    return (
        <Layout>
            <Header sliderRef={sliderRef} resourcesRef={resourcesRef} expertRef={expertRef} />
            <Hero />
            <Divider />
            <section ref={sliderRef}>
                <Slider />
            </section>
            <Divider isOrange={false} />
            <div ref={resourcesRef}>
                <CountryResources country={filterInParams.country} />
            </div>
            <Divider />
            <div ref={expertRef}>
                <CountryExpert country={filterInParams.country} />
            </div>
        </Layout>
    );
};
