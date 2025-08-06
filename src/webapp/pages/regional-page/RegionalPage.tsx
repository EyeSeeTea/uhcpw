import styled from "styled-components";

import { Layout } from "../../components/layout/Layout";
import { useRegionalPage } from "./useRegionalPage";
import { Header } from "./Header";
import { Map } from "../../components/home/map/Map";
import { useRegionalPageMap } from "./useRegionalPageMap";
import { Divider } from "../../components/home/common/Divider";
import { NumbersSection } from "./NumbersSection";
import { CoveragePolicySection } from "./CoveragePolicySection";
import { PolicyChecklistSection } from "./PolicyChecklistSection";
import { CountryResources } from "../../components/country-page/CountryResources";
import { CountryExpert } from "../../components/country-page/CountryExpert";

export const RegionalPage: React.FC = () => {
    const {
        isSmallScreen,
        regionFilter,
        handleHeaderItemClick,
        menuItemsConfig,
        refs,
        regionMap,
        financialProtectionStatus,
    } = useRegionalPage();
    const { onRegionChange, regionOptions, selectedRegion, selectedRegionId } = regionFilter;
    const { markers, mainPanelContent } = regionMap;
    const mapState = useRegionalPageMap({ selectedRegionId: selectedRegionId, markers: markers });

    return (
        <Layout>
            <Header
                selectedRegion={selectedRegionId}
                onRegionChange={onRegionChange}
                regionOptions={regionOptions}
                handleHeaderItemClick={handleHeaderItemClick}
                menuItemsConfig={menuItemsConfig}
                regionStatus={financialProtectionStatus}
                isSmallScreen={isSmallScreen}
            />

            <MapSection ref={refs.regionMap}>
                <Map mapState={mapState} regionMainMapPanelContent={mainPanelContent} />
            </MapSection>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.numbers}>
                <NumbersSection />
            </section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.coveragePolicy}>
                <CoveragePolicySection />
            </section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.policyChecklist}>
                <PolicyChecklistSection />
            </section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.resources}>
                <CountryResources countryIds={selectedRegion?.countries || []} />
            </section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.experts}>
                <CountryExpert countryIds={selectedRegion?.countries || []} />
            </section>
        </Layout>
    );
};

const MapSection = styled.section`
    height: 80vh;
    min-height: 620px;
`;
