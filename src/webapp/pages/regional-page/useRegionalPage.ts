import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { useRegionalPageFilter } from "./useRegionalPageFilter";
import i18n from "../../../locales";
import { Country } from "../../../domain/entities/Country";
import { useAppContext } from "../../contexts/app-context";
import { countriesToGeoJson } from "../../components/home/map/useMap";
import { useHistory } from "react-router-dom";
import { useRegionalPageInfo } from "./useRegionalPageInfo";
import { RegionMainMapPanelContent } from "../../../domain/entities/region/RegionInfo";
import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";

export type RegionalMenuItem = "regionMap" | "numbers" | "coveragePolicy" | "policyChecklist" | "resources" | "experts";

export type RegionalMenuItemConfig = {
    id: RegionalMenuItem;
    label: string;
    ref: MutableRefObject<HTMLElement | null>;
};

export type RegionalFilter = {
    regionOptions: Option<Id>[];
    selectedRegion: Id | undefined;
    onRegionChange: (value: Id) => void;
};

export type RegionMapState = {
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    mainPanelContent: RegionMainMapPanelContent;
};

export type RegionalPageState = {
    regionFilter: RegionalFilter;
    isSmallScreen: boolean;
    refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>>;
    menuItemsConfig: RegionalMenuItemConfig[];
    handleHeaderItemClick: (item: RegionalMenuItem) => void;
    regionMap: RegionMapState;
    financialProtectionStatus: FinancialProtectionStatus;
};

export function useRegionalPage(): RegionalPageState {
    const isSmallScreen = useIsSmallScreen();
    const history = useHistory();
    const { regions, countries } = useAppContext();
    const { regionOptions, selectedRegion, onRegionChange } = useRegionalPageFilter();
    const { mainMapPanelContent, financialProtectionStatus } = useRegionalPageInfo(selectedRegion);

    const [markers, setMarkers] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Country>>({
        type: "FeatureCollection",
        features: [],
    });

    const regionMapRef = useRef<HTMLElement | null>(null);
    const numbersRef = useRef<HTMLElement | null>(null);
    const coveragePolicyRef = useRef<HTMLElement | null>(null);
    const policyChecklistRef = useRef<HTMLElement | null>(null);
    const resourcesRef = useRef<HTMLElement | null>(null);
    const expertsRef = useRef<HTMLElement | null>(null);

    const refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>> = useMemo(
        () => ({
            regionMap: regionMapRef,
            numbers: numbersRef,
            coveragePolicy: coveragePolicyRef,
            policyChecklist: policyChecklistRef,
            resources: resourcesRef,
            experts: expertsRef,
        }),
        []
    );

    const menuItemsConfig: RegionalMenuItemConfig[] = useMemo(() => {
        return [
            { id: "regionMap", label: i18n.t("Region Map"), ref: refs.regionMap },
            { id: "numbers", label: i18n.t("Numbers"), ref: refs.numbers },
            { id: "coveragePolicy", label: i18n.t("Coverage Policy"), ref: refs.coveragePolicy },
            { id: "policyChecklist", label: i18n.t("Policy Checklist"), ref: refs.policyChecklist },
            { id: "resources", label: i18n.t("Resources"), ref: refs.resources },
            { id: "experts", label: i18n.t("Experts"), ref: refs.experts },
        ];
    }, [refs.coveragePolicy, refs.experts, refs.numbers, refs.policyChecklist, refs.regionMap, refs.resources]);

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const region = searchParams.get("region");

        return {
            region: region ? region : undefined,
        };
    }, [history.location.search]);

    const handleRegionChange = useCallback(
        (newRegion: Id) => {
            const searchParams = new URLSearchParams(history.location.search);
            searchParams.set("region", newRegion);
            history.push({ search: searchParams.toString() });

            const selectedRegion = regions.find(region => region.id === newRegion);
            const countryIdsInRegion = selectedRegion?.countries || [];

            const countriesWithSummary = countries.filter(
                country => countryIdsInRegion.includes(country.id) && country.summary
            );

            setMarkers(countriesToGeoJson(countriesWithSummary));
            onRegionChange(newRegion);
        },
        [countries, history, onRegionChange, regions]
    );

    useEffect(() => {
        if (filterInParams.region && filterInParams.region !== selectedRegion) {
            handleRegionChange(filterInParams.region);
        }
    }, [filterInParams.region, handleRegionChange, onRegionChange, selectedRegion]);

    const handleHeaderItemClick = useCallback(
        (item: RegionalMenuItem) => {
            const targetRef = refs[item];
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        [refs]
    );

    return {
        regionFilter: { regionOptions, selectedRegion, onRegionChange: handleRegionChange },
        isSmallScreen: isSmallScreen,
        menuItemsConfig: menuItemsConfig,
        refs: refs,
        handleHeaderItemClick: handleHeaderItemClick,
        regionMap: {
            markers: markers,
            mainPanelContent: mainMapPanelContent,
        },
        financialProtectionStatus: financialProtectionStatus,
    };
}
