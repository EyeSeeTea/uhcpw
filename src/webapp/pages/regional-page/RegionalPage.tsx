import { Layout } from "../../components/layout/Layout";
import { useRegionalPage } from "./useRegionalPage";
import { Header } from "./Header";

export const RegionalPage: React.FC = () => {
    const { isSmallScreen, regionFilter, handleHeaderItemClick, menuItemsConfig, refs } = useRegionalPage();
    const { onRegionChange, regionOptions, selectedRegion } = regionFilter;

    return (
        <Layout enableRotation={isSmallScreen}>
            <Header
                selectedRegion={selectedRegion}
                onRegionChange={onRegionChange}
                regionOptions={regionOptions}
                handleHeaderItemClick={handleHeaderItemClick}
                menuItemsConfig={menuItemsConfig}
                isSmallScreen={isSmallScreen}
            />

            <section ref={refs.regionMap}></section>

            <section ref={refs.numbers}></section>

            <section ref={refs.coveragePolicy}></section>

            <section ref={refs.policyChecklist}></section>

            <section ref={refs.resources}></section>

            <section ref={refs.experts}></section>
        </Layout>
    );
};
