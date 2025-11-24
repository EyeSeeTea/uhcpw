import styled from "styled-components";
import React from "react";

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
import { ORG_UNIT_GROUP_IDS } from "../../../domain/entities/region/Region";
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

    return (
        <Layout enableRotation={isSmallScreen} disableMinHeight isOverflowVisible>
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
                        {i18n.t(
                            `${
                                ORG_UNIT_GROUP_IDS.EASTERN_EUROPE_AND_CENTRAL_ASIA === selectedRegionId ? "" : "The "
                            }{{region}} at a glance`,
                            {
                                region: selectedRegion?.name,
                                interpolation: { escapeValue: false },
                            }
                        )}
                    </SectionTitle>
                </SectionTitleDivider>

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
                    />
                )}
            </MapSection>

            {isSmallScreen ? (
                <>
                    <Section ref={refs.numbers}>
                        <SectionTitleDivider onlyTopMargin>
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
                    </Section>

                    <Section ref={refs.gapsInCoverage}>
                        <SectionTitleDivider onlyTopMargin>
                            <SectionTitle>{i18n.t("The story behind the numbers: gaps in coverage")}</SectionTitle>
                        </SectionTitleDivider>

                        <GapsInCoverageSection
                            configs={gapsInCoverage.configs}
                            tabValue={gapsInCoverage.tabValue}
                            expandedConfig={gapsInCoverage.expandedConfig}
                            handleAccordionChange={gapsInCoverage.handleAccordionChange}
                            handleTabChange={gapsInCoverage.handleTabChange}
                            isSmallScreen={isSmallScreen}
                        />
                    </Section>

                    <Section ref={refs.policyChecklist}>
                        <SectionTitleDivider onlyBottomMargin>
                            <SectionTitle>{i18n.t("Progress is possible: a policy checklist")}</SectionTitle>
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
                    </Section>

                    {!isEuropeanRegion ? (
                        <React.Fragment>
                            <Section ref={refs.resources}>
                                <SectionTitleDivider isLighter>
                                    <SectionTitle onClick={() => isEUorEuropeanRegion && goTo("/resources")}>
                                        {i18n.t("Resources")}
                                    </SectionTitle>
                                </SectionTitleDivider>

                                {!isEUorEuropeanRegion && (
                                    <CountryResources countryIds={selectedRegion?.countries || []} isRegionalPage />
                                )}
                            </Section>

                            <Section ref={refs.experts}>
                                <SectionTitleDivider isLighter>
                                    <SectionTitle onClick={() => isEUorEuropeanRegion && goTo("/about")}>
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
                            </Section>
                        </React.Fragment>
                    ) : null}
                </>
            ) : (
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

const MapSection = styled.section`
    height: 85vh;
    min-height: 620px;
    scroll-margin-top: 80px;

    .region-map {
        height: calc(100% - 65px);
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        scroll-margin-top: 101px;
        height: initial;
        min-height: initial;

        .region-map {
            height: initial;
        }
    }
`;

const Section = styled.section`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        scroll-margin-top: 101px;
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
