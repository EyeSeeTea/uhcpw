import styled from "styled-components";
import React, { useState } from "react";

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
import { AccordionPanel } from "../../components/accordion-panel/AccordionPanel";
import { GapsInCoverageSection } from "./GapsInCoverageSection";
import { useRegionalPageSeoConfig } from "./useRegionalPageSeoConfig";
import { SeoMetaTags } from "../../components/seo/SeoMetaTags";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { RegionMapPanel } from "../../components/region-map-panel/RegionMapPanel";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";

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
        gapsInCoverage,
        highlightedISO3Countries,
        isEUorEuropeanRegion,
        isEuropeanRegion,
        goTo,
        aboutPageUrl,
        expandedSectionsAccordion,
        handleAccordionChange,
        sectionsAccordionConfig,
        setPendingScrollTab,
        pendingScrollTab,
        isLoadingContent,
        sidePanelWidth,
    } = useRegionalPage();

    const { onRegionChange, regionOptions, selectedRegion, selectedRegionId } = regionFilter;
    const { markers, mainPanelContent } = regionMap;
    const mapState = useRegionalPageMap({ selectedRegionId: selectedRegionId, markers: markers });
    const seoConfig = useRegionalPageSeoConfig(selectedRegion);
    const [mapPanelHeight, setMapPanelHeight] = useState<number | undefined>(undefined);

    return (
        <Layout enableRotation={isSmallScreen} disableMinHeight isOverflowVisible>
            <SeoMetaTags config={seoConfig} />
            <Header
                selectedRegion={selectedRegionId}
                onRegionChange={onRegionChange}
                regionOptions={regionOptions}
                handleHeaderItemClick={handleHeaderItemClick}
                menuItemsConfig={menuItemsConfig}
                isSmallScreen={isSmallScreen}
            />

            <MapSection ref={refs.regionMap} $panelHeight={mapPanelHeight}>
                {isSmallScreen ? (
                    <PanelContainer>
                        <RegionMapPanel mainPanelContent={mainPanelContent} />
                    </PanelContainer>
                ) : (
                    <Map
                        mapState={mapState}
                        regionMainMapPanelContent={mainPanelContent}
                        highlightedISO3Countries={highlightedISO3Countries}
                        className="region-map"
                        isRegionPage
                        panelMaxWidth={sidePanelWidth}
                        onPanelHeightComputed={setMapPanelHeight}
                    />
                )}
            </MapSection>

            {isSmallScreen ? (
                <>
                    <MobileSection ref={refs.numbers}>
                        <SectionTitleDivider onlyTopMargin>
                            <SectionTitle>
                                {i18n.t("Numbers: financial hardship, unmet need and spending on health", {
                                    nsSeparator: false,
                                })}
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
                    </MobileSection>

                    <MobileSection ref={refs.gapsInCoverage}>
                        <SectionTitleDivider onlyTopMargin>
                            <SectionTitle>
                                {i18n.t("The story behind the numbers: gaps in coverage", {
                                    nsSeparator: false,
                                })}
                            </SectionTitle>
                        </SectionTitleDivider>

                        <GapsInCoverageSection
                            configs={gapsInCoverage.configs}
                            tabValue={gapsInCoverage.tabValue}
                            expandedConfig={gapsInCoverage.expandedConfig}
                            handleAccordionChange={gapsInCoverage.handleAccordionChange}
                            handleTabChange={gapsInCoverage.handleTabChange}
                            isSmallScreen={isSmallScreen}
                        />
                    </MobileSection>

                    <MobileSection ref={refs.policyChecklist}>
                        <SectionTitleDivider onlyBottomMargin>
                            <SectionTitle>
                                {i18n.t("Progress is possible: a coverage policy checklist", {
                                    nsSeparator: false,
                                })}
                            </SectionTitle>
                        </SectionTitleDivider>

                        <PolicyChecklistSection
                            textSectionLeft={policyChecklist.content.textSectionLeft}
                            textSectionRight={policyChecklist.content.textSectionRight}
                            checklist={policyChecklist?.checklist}
                            filteredCountryExperiences={policyChecklist?.filteredCountryExperiences}
                            selectedChecklistItem={policyChecklist.selectedChecklistItem}
                            onSelectChecklistItem={policyChecklist.onSelectChecklistItem}
                            isLoading={isLoadingContent || policyChecklist.isLoading}
                            isSmallScreen={isSmallScreen}
                            downloadFile={policyChecklist.content.downloadFile}
                            hasDownloadFile={policyChecklist.content.hasDownloadFile}
                        />
                    </MobileSection>

                    {!isEuropeanRegion ? (
                        <React.Fragment>
                            <MobileSection ref={refs.resources}>
                                <SectionTitleDivider isLighter>
                                    <SectionTitle onClick={() => isEUorEuropeanRegion && goTo("/resources")}>
                                        {i18n.t("Resources")}
                                    </SectionTitle>
                                </SectionTitleDivider>

                                {!isEUorEuropeanRegion && (
                                    <CountryResources countryIds={selectedRegion?.countries || []} isRegionalPage />
                                )}
                            </MobileSection>

                            <MobileSection ref={refs.experts}>
                                <SectionTitleDivider isLighter>
                                    <SectionTitle onClick={() => isEUorEuropeanRegion && goTo(aboutPageUrl)}>
                                        {i18n.t("Expert network")}
                                    </SectionTitle>
                                </SectionTitleDivider>

                                {!isEUorEuropeanRegion && (
                                    <CountryExpert
                                        countryIds={selectedRegion?.countries || []}
                                        isRegionalPage
                                        isSmallScreen={isSmallScreen}
                                    />
                                )}
                            </MobileSection>
                        </React.Fragment>
                    ) : null}
                </>
            ) : (
                <>
                    <AccordionPanel
                        configs={sectionsAccordionConfig}
                        expandedConfig={expandedSectionsAccordion}
                        handleAccordionChange={handleAccordionChange}
                        scrollMarginTop="80px"
                        setPendingScrollTab={setPendingScrollTab}
                        pendingScrollTab={pendingScrollTab}
                        isBold
                        bigFont
                    />
                </>
            )}

            <Backdrop open={isLoadingContent || policyChecklist.isLoading} style={{ color: "#fff", zIndex: 1001 }}>
                <CircularProgress color="primary" />
            </Backdrop>
        </Layout>
    );
};

const PanelContainer = styled.div`
    font-size: 16px;
    padding: 16px;
    background: ${colors.accentPrimary};
    color: ${colors.white};
`;

const MapSection = styled.section<{ $panelHeight?: number }>`
    margin-top: 5px;
    height: ${props => (props.$panelHeight ? `max(85vh, ${props.$panelHeight}px)` : "85vh")};
    min-height: 620px;
    scroll-margin-top: 80px;

    .region-map {
        height: 100%;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        scroll-margin-top: 115px;
        height: initial;
        min-height: initial;

        .region-map {
            height: initial;
        }
    }
`;

const MobileSection = styled.section`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        scroll-margin-top: 115px;
    }
`;

const SectionTitle = styled.h2<{ $smallFont?: boolean }>`
    color: ${colors.white};
    margin: 0;
    margin-left: 32px;
    font-size: ${props => (props.$smallFont ? "16px" : "24px")};
`;

const SectionTitleDivider = styled.div<{ isLighter?: boolean; onlyTopMargin?: boolean; onlyBottomMargin?: boolean }>`
    display: flex;
    align-items: center;
    background: ${props => (props.isLighter ? colors.gradientBlueLight2 : colors.gradientBlueLight)};
    height: 60px;
    margin: ${props => (props.onlyTopMargin ? "5px 0 0 0" : props.onlyBottomMargin ? "0 0 5px 0" : "5px 0")};
    align-content: center;
`;
