import styled from "styled-components";

import { Layout } from "../../components/layout/Layout";
import { useRegionalPage } from "./useRegionalPage";
import { Header } from "./Header";
import { Map } from "../../components/home/map/Map";
import { useRegionalPageMap } from "./useRegionalPageMap";
import { Divider } from "../../components/home/common/Divider";

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
    const { onRegionChange, regionOptions, selectedRegion } = regionFilter;
    const { markers, mainPanelContent } = regionMap;
    const mapState = useRegionalPageMap({ selectedRegionId: selectedRegion, markers: markers });

    return (
        <Layout>
            <Header
                selectedRegion={selectedRegion}
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

            <section ref={refs.numbers}></section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.coveragePolicy}></section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.policyChecklist}></section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.resources}></section>

            <Divider financialProtectionStatus={financialProtectionStatus} />

            <section ref={refs.experts}></section>
        </Layout>
    );
};

const MapSection = styled.section`
    height: 80vh;
    min-height: 620px;
`;
