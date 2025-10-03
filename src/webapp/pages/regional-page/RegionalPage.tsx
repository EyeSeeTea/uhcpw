import styled from "styled-components";

import { Layout } from "../../components/layout/Layout";
import { useRegionalPage } from "./useRegionalPage";
import { Header } from "./Header";
import { Map } from "../../components/home/map/Map";
import { useRegionalPageMap } from "./useRegionalPageMap";
import { NumbersSection } from "./NumbersSection";
import { PolicyChecklistSection } from "./PolicyChecklistSection";
import { CountryResources } from "../../components/country-page/CountryResources";
import { CountryExpert } from "../../components/country-page/CountryExpert";
import { colors } from "../app/themes/dhis2.theme";
import i18n from "../../../locales";

export const RegionalPage: React.FC = () => {
    const {
        isSmallScreen,
        regionFilter,
        handleHeaderItemClick,
        menuItemsConfig,
        refs,
        regionMap,
        policyChecklist,
        regionNumbers,
        highlightedISO3Countries,
    } = useRegionalPage();
    const { onRegionChange, regionOptions, selectedRegion, selectedRegionId } = regionFilter;
    const { markers, mainPanelContent } = regionMap;
    const mapState = useRegionalPageMap({ selectedRegionId: selectedRegionId, markers: markers });

    return (
        <Layout enableRotation={isSmallScreen}>
            <Header
                selectedRegion={selectedRegionId}
                onRegionChange={onRegionChange}
                regionOptions={regionOptions}
                handleHeaderItemClick={handleHeaderItemClick}
                menuItemsConfig={menuItemsConfig}
                isSmallScreen={isSmallScreen}
            />

            <MapSection ref={refs.regionMap}>
                <SectionTitleDivider>
                    <SectionTitle>
                        {i18n.t(`{{region}} at a glance`, {
                            region: selectedRegion?.name,
                        })}
                    </SectionTitle>
                </SectionTitleDivider>

                <Map
                    mapState={mapState}
                    regionMainMapPanelContent={mainPanelContent}
                    highlightedISO3Countries={highlightedISO3Countries}
                    className="region-map"
                    isRegionalPage
                />
            </MapSection>

            <section ref={refs.numbers}>
                <SectionTitleDivider>
                    <SectionTitle>
                        {i18n.t("Numbers: financial hardship, unmet need and spending on health")}
                    </SectionTitle>
                </SectionTitleDivider>

                <NumbersSection
                    configs={regionNumbers.configs}
                    tabValue={regionNumbers.tabValue}
                    expandedConfig={regionNumbers.expandedConfig}
                    handleAccordionChange={regionNumbers.handleAccordionChange}
                    handleTabChange={regionNumbers.handleTabChange}
                    isSmallScreen={isSmallScreen}
                />
            </section>

            <section ref={refs.policyChecklist}>
                <SectionTitleDivider>
                    <SectionTitle>{i18n.t("Progress is possible: a checklist for policy-makers")}</SectionTitle>
                </SectionTitleDivider>

                <PolicyChecklistSection
                    checklist={policyChecklist?.policyChecklist?.checklist}
                    progressInfo={policyChecklist?.policyChecklist?.progressInfo}
                    onDownload={policyChecklist.onDownload}
                />
            </section>

            <section ref={refs.resources}>
                <SectionTitleDivider isLighter>
                    <SectionTitle>{i18n.t("Resources")}</SectionTitle>
                </SectionTitleDivider>

                <CountryResources countryIds={selectedRegion?.countries || []} isRegionalPage />
            </section>

            <section ref={refs.experts}>
                <SectionTitleDivider isLighter>
                    <SectionTitle>{i18n.t("Expert network")}</SectionTitle>
                </SectionTitleDivider>

                <CountryExpert countryIds={selectedRegion?.countries || []} isRegionalPage />
            </section>
        </Layout>
    );
};

const MapSection = styled.section`
    height: 80vh;
    min-height: 620px;

    .region-map {
        height: calc(100% - 65px);
    }
`;

const SectionTitle = styled.h2`
    color: ${colors.white};
    margin: 0;
    margin-left: 64px;
`;

const SectionTitleDivider = styled.div<{ isLighter?: boolean }>`
    background: ${props => (props.isLighter ? colors.gradientBlueLight2 : colors.gradientBlueLight)};
    height: 60px;
    margin-block: 5px;
    align-content: center;
`;
