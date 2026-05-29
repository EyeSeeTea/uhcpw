import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { Layout } from "../../components/layout/Layout";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { Divider } from "../../components/home/common/Divider";
import { CountryResources } from "../../components/country-page/CountryResources";
import { Hero } from "../../components/country-page/Hero";
import { Header } from "../../components/country-page/Header";
import { useCountryPage } from "./useCountryPage";
import { useCountryInfo } from "./useCountryInfo";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { CountrySlider } from "../../components/country-page/slider/CountrySlider";
import { formatCountryOrRegionParamName } from "../../utils/formatCountryOrRegionParamName";
import { SeoMetaTags } from "../../components/seo/SeoMetaTags";
import { useCountryPageSeoConfig } from "./useCountryPageSeoConfig";
import { useSidePanelWidth } from "./useSidePanelWidth";
import { RotateToLandscapeOverlay } from "../../common/hooks/screen/RotateToLandscapeOverlay";

export const CountryPage: React.FC = () => {
    const history = useHistory<{ preserveScroll?: boolean }>();
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
        }
    }, [countryFilter, filterInParams.country]);

    const selectedCountryName = useMemo(
        () => countryFilter.countryOptions.find(country => country.value === countryFilter.selectedCountry)?.text,
        [countryFilter.countryOptions, countryFilter.selectedCountry]
    );

    useEffect(() => {
        if (selectedCountryName)
            sendEvent({ name: "country_page_view", pageTitle: "Country page", country: selectedCountryName });
    }, [sendEvent, selectedCountryName]);

    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const resourcesRef = useRef<HTMLDivElement | null>(null);
    const expertRef = useRef<HTMLDivElement | null>(null);

    const wasAtBottom = useRef(false);

    const handleCountryChange = useCallback(
        (value: string) => {
            const countryName = countryFilter.countryOptions.find(option => option.value === value)?.text;
            const countryNameInFilter = countryName ? formatCountryOrRegionParamName(countryName) : undefined;

            wasAtBottom.current = isScrolledToBottom();

            if (value && countryNameInFilter) {
                history.push({
                    pathname: `/${countryNameInFilter}`,
                    state: { preserveScroll: true },
                });
            }

            countryFilter.onCountryChange(value);
        },
        [countryFilter, history]
    );

    useLayoutEffect(() => {
        if (!wasAtBottom.current) return;

        const observer = new ResizeObserver(scrollToBottom);
        observer.observe(document.body);

        const onUserScroll = () => release();
        USER_SCROLL_EVENTS.forEach(event =>
            window.addEventListener(event, onUserScroll, { passive: true, once: true })
        );

        const hardStopTimer = window.setTimeout(() => release(), SCROLL_LOCK_MAX_MS);

        const dispose = () => {
            observer.disconnect();
            window.clearTimeout(hardStopTimer);
            USER_SCROLL_EVENTS.forEach(event => window.removeEventListener(event, onUserScroll));
        };
        const release = () => {
            dispose();
            wasAtBottom.current = false;
        };

        scrollToBottom();

        return dispose;
    }, [countryFilter.selectedCountry]);

    const sidePanelWidth = useSidePanelWidth({
        ref: dashboardRef,
        countryId: countryFilter.selectedCountry,
    });

    return (
        <>
            <RotateToLandscapeOverlay />

            <Layout enableRotation={isSmallScreen} isOverflowVisible>
                <SeoMetaTags config={seoConfig} />
                <Header
                    countryId={countryFilter.selectedCountry}
                    onCountryChange={handleCountryChange}
                    countryOptions={countryFilter.countryOptions}
                    sliderRef={sliderRef}
                    resourcesRef={resourcesRef}
                    expertRef={expertRef}
                    dashboardRef={dashboardRef}
                    handleResetTab={handleResetTab}
                />

                <Section ref={dashboardRef}>
                    <Hero countryId={countryFilter.selectedCountry} />
                </Section>

                <Divider financialProtectionStatus={country?.status} />

                <Section ref={sliderRef}>
                    <CountrySlider
                        countryId={countryFilter.selectedCountry}
                        handleResetTab={handleResetTab}
                        resetTab={resetTab}
                        isSmallScreen={isSmallScreen}
                        sidePanelWidth={sidePanelWidth}
                    />
                </Section>

                <Divider financialProtectionStatus={country?.status} />

                <Section ref={resourcesRef}>
                    <CountryResources countryIds={[countryFilter.selectedCountry]} />
                </Section>

                <Divider financialProtectionStatus={country?.status} />

                <Section ref={expertRef}>
                    <CountryExpert countryIds={[countryFilter.selectedCountry]} />
                </Section>
            </Layout>
        </>
    );
};

const SCROLL_LOCK_MAX_MS = 10000;
const BOTTOM_EPSILON_PX = 330; //footer height
const USER_SCROLL_EVENTS: ReadonlyArray<keyof WindowEventMap> = ["wheel", "touchmove", "keydown"];

function isScrolledToBottom(): boolean {
    const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    return distanceFromBottom <= BOTTOM_EPSILON_PX;
}

function scrollToBottom(): void {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "auto" });
}

const Section = styled.section`
    scroll-margin-top: 80px;
`;
