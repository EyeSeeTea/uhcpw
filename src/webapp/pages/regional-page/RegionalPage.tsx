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
import { AccordionConfig, AccordionPanel } from "../../components/accordion-panel/AccordionPanel";
import { useCallback, useMemo } from "react";

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
        isEUorEuropeanRegion,
        goTo,
        expandedSectionsAccordion,
        handleAccordionChange,
    } = useRegionalPage();
    const { onRegionChange, regionOptions, selectedRegion, selectedRegionId } = regionFilter;
    const { markers, mainPanelContent } = regionMap;
    const mapState = useRegionalPageMap({ selectedRegionId: selectedRegionId, markers: markers });

    const sectionsAccordionConfig: AccordionConfig[] = useMemo(
        () => [
            {
                tab: 0,
                tabTitle: i18n.t("Numbers: financial hardship, unmet need and spending on health"),
                isGradientColor: true,
                hasExpandIcon: true,
                Component: NumbersSection,
                props: {
                    configs: regionNumbers.configs,
                    tabValue: regionNumbers.tabValue,
                    expandedConfig: regionNumbers.expandedConfig,
                    handleAccordionChange: regionNumbers.handleAccordionChange,
                    handleTabChange: regionNumbers.handleTabChange,
                    isSmallScreen: isSmallScreen,
                },
            },
            {
                tab: 1,
                tabTitle: i18n.t("Progress is possible: a checklist for policy-makers"),
                isGradientColor: true,
                hasExpandIcon: true,
                Component: PolicyChecklistSection,
                props: {
                    textSectionLeft: policyChecklist.content.textSectionLeft,
                    textSectionRight: policyChecklist.content.textSectionRight,
                    checklist: policyChecklist?.checklist,
                    filteredCountryExperiences: policyChecklist?.filteredCountryExperiences,
                    selectedChecklistItem: policyChecklist.selectedChecklistItem,
                    onSelectChecklistItem: policyChecklist.onSelectChecklistItem,
                    isLoading: policyChecklist.isLoading,
                    isSmallScreen: isSmallScreen,
                },
            },
            {
                tab: 2,
                tabTitle: <div onClick={() => isEUorEuropeanRegion && goTo("/resources")}>{i18n.t("Resources")}</div>,
                isSecondaryGradientColor: true,
                hasExpandIcon: !isEUorEuropeanRegion,
                Component: isEUorEuropeanRegion ? null : CountryResources,
                disabled: isEUorEuropeanRegion,
                props: { countryIds: selectedRegion?.countries || [], isRegionalPage: true },
            },
            {
                tab: 3,
                tabTitle: <div onClick={() => isEUorEuropeanRegion && goTo("/about")}>{i18n.t("Expert network")}</div>,
                isSecondaryGradientColor: true,
                hasExpandIcon: !isEUorEuropeanRegion,
                Component: isEUorEuropeanRegion ? null : CountryExpert,
                disabled: isEUorEuropeanRegion,
                props: { countryIds: selectedRegion?.countries || [], isRegionalPage: true },
            },
        ],
        [
            goTo,
            isEUorEuropeanRegion,
            isSmallScreen,
            policyChecklist?.checklist,
            policyChecklist.content.textSectionLeft,
            policyChecklist.content.textSectionRight,
            policyChecklist?.filteredCountryExperiences,
            policyChecklist.isLoading,
            policyChecklist.onSelectChecklistItem,
            policyChecklist.selectedChecklistItem,
            regionNumbers.configs,
            regionNumbers.expandedConfig,
            regionNumbers.handleAccordionChange,
            regionNumbers.handleTabChange,
            regionNumbers.tabValue,
            selectedRegion?.countries,
        ]
    );

    const onAccordionChange = useCallback(
        (_event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => {
            handleAccordionChange(_event, tabId, isExpanded, sectionsAccordionConfig);
        },
        [handleAccordionChange, sectionsAccordionConfig]
    );

    return (
        <Layout enableRotation={isSmallScreen} disableMinHeight>
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
                />
            </MapSection>

            {isSmallScreen ? (
                <>
                    <section ref={refs.numbers}>
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
                    </section>

                    <section ref={refs.policyChecklist}>
                        <SectionTitleDivider onlyBottomMargin>
                            <SectionTitle>{i18n.t("Progress is possible: a checklist for policy-makers")}</SectionTitle>
                        </SectionTitleDivider>

                        <PolicyChecklistSection
                            textSectionLeft={policyChecklist.content.textSectionLeft}
                            textSectionRight={policyChecklist.content.textSectionRight}
                            checklist={policyChecklist?.checklist}
                            filteredCountryExperiences={policyChecklist?.filteredCountryExperiences}
                            selectedChecklistItem={policyChecklist.selectedChecklistItem}
                            onSelectChecklistItem={policyChecklist.onSelectChecklistItem}
                            isLoading={policyChecklist.isLoading}
                            isSmallScreen={isSmallScreen}
                        />
                    </section>

                    <section ref={refs.resources}>
                        <SectionTitleDivider isLighter>
                            <SectionTitle onClick={() => isEUorEuropeanRegion && goTo("/resources")}>
                                {i18n.t("Resources")}
                            </SectionTitle>
                        </SectionTitleDivider>

                        {!isEUorEuropeanRegion && (
                            <CountryResources countryIds={selectedRegion?.countries || []} isRegionalPage />
                        )}
                    </section>

                    <section ref={refs.experts}>
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
                    </section>
                </>
            ) : (
                <AccordionPanel
                    configs={sectionsAccordionConfig}
                    expandedConfig={expandedSectionsAccordion}
                    handleAccordionChange={(_event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) =>
                        onAccordionChange(_event, tabId, isExpanded)
                    }
                    isBold
                    bigFont
                />
            )}
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

const SectionTitle = styled.h2<{ $smallFont?: boolean }>`
    color: ${colors.white};
    margin: 0;
    margin-left: 64px;
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
