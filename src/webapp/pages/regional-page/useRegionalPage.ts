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
import { ChecklistPolicyMakersState, useRegionalPageInfo } from "./useRegionalPageInfo";
import { RegionMainMapPanelContent } from "../../../domain/entities/region/RegionInfo";
import { Region } from "../../../domain/entities/region/Region";
import { RegionNumbersState, useRegionNumbers } from "./useRegionNumbers";

export type RegionalMenuItem = "regionMap" | "numbers" | "policyChecklist" | "resources" | "experts";

export type RegionalMenuItemConfig = {
    id: RegionalMenuItem;
    label: string;
    ref: MutableRefObject<HTMLElement | null>;
};

export type RegionalFilter = {
    regionOptions: Option<Id>[];
    selectedRegionId: Id | undefined;
    selectedRegion: Region | undefined;
    onRegionChange: (value: Id) => void;
};

export type RegionMapState = {
    markers: GeoJSON.FeatureCollection<GeoJSON.Point, Country>;
    mainPanelContent: RegionMainMapPanelContent | undefined;
};

export type RegionalPageState = {
    regionFilter: RegionalFilter;
    isSmallScreen: boolean;
    refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>>;
    menuItemsConfig: RegionalMenuItemConfig[];
    handleHeaderItemClick: (item: RegionalMenuItem) => void;
    regionMap: RegionMapState;
    policyChecklist: {
        policyChecklist: ChecklistPolicyMakersState | undefined;
        isLoading: boolean;
        onDownload: (checklist: string[], selections: boolean[]) => void;
    };
    regionNumbers: RegionNumbersState;
    highlightedISO3Countries: string[];
};

export function useRegionalPage(): RegionalPageState {
    const isSmallScreen = useIsSmallScreen();
    const history = useHistory();
    const { regions, countries } = useAppContext();
    const { regionOptions, selectedRegion: selectedRegionId, onRegionChange } = useRegionalPageFilter();
    const { info, isLoading, onDownloadPolicyChecklist } = useRegionalPageInfo(selectedRegionId);
    const regionNumbers = useRegionNumbers(selectedRegionId, info?.numbersPanelContent);

    const [markers, setMarkers] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Country>>({
        type: "FeatureCollection",
        features: [],
    });
    const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
    const [highlightedISO3Countries, setHighlightedISO3Countries] = useState<string[]>([]);

    const regionMapRef = useRef<HTMLElement | null>(null);
    const numbersRef = useRef<HTMLElement | null>(null);
    const policyChecklistRef = useRef<HTMLElement | null>(null);
    const resourcesRef = useRef<HTMLElement | null>(null);
    const expertsRef = useRef<HTMLElement | null>(null);

    const refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>> = useMemo(
        () => ({
            regionMap: regionMapRef,
            numbers: numbersRef,
            policyChecklist: policyChecklistRef,
            resources: resourcesRef,
            experts: expertsRef,
        }),
        []
    );

    const menuItemsConfig: RegionalMenuItemConfig[] = useMemo(() => {
        return [
            { id: "regionMap", label: i18n.t("The region at a glance"), ref: refs.regionMap },
            { id: "numbers", label: i18n.t("Numbers"), ref: refs.numbers },
            { id: "policyChecklist", label: i18n.t("Policy checklist"), ref: refs.policyChecklist },
            { id: "resources", label: i18n.t("Resources"), ref: refs.resources },
            { id: "experts", label: i18n.t("Experts"), ref: refs.experts },
        ];
    }, [refs.experts, refs.numbers, refs.policyChecklist, refs.regionMap, refs.resources]);

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

            const region = regions.find(region => region.id === newRegion);
            const countryIdsInRegion = region?.countries || [];

            const countriesWithSummary = countries.filter(
                country => countryIdsInRegion.includes(country.id) && country.summary
            );

            const iso3CountriesInRegion = countries
                .filter(country => countryIdsInRegion.includes(country.id) && country.iso3Code)
                .map(country => country.iso3Code);

            setMarkers(countriesToGeoJson(countriesWithSummary));
            setHighlightedISO3Countries(iso3CountriesInRegion);
            setSelectedRegion(region);
            onRegionChange(newRegion);
        },
        [countries, history, onRegionChange, regions]
    );

    useEffect(() => {
        if (filterInParams.region && filterInParams.region !== selectedRegionId) {
            handleRegionChange(filterInParams.region);
        }
    }, [filterInParams.region, handleRegionChange, onRegionChange, selectedRegionId]);

    const handleHeaderItemClick = useCallback(
        (item: RegionalMenuItem) => {
            const targetRef = refs[item];
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        [refs]
    );

    return {
        isSmallScreen: isSmallScreen,
        menuItemsConfig: menuItemsConfig,
        refs: refs,
        regionFilter: {
            regionOptions: regionOptions,
            selectedRegionId: selectedRegionId,
            onRegionChange: handleRegionChange,
            selectedRegion: selectedRegion,
        },
        handleHeaderItemClick: handleHeaderItemClick,
        regionMap: {
            markers: markers,
            mainPanelContent: info?.mainMapPanelContent,
        },
        policyChecklist: {
            policyChecklist: info?.checklistPolicyMakers,
            isLoading: isLoading,
            onDownload: onDownloadPolicyChecklist,
        },
        regionNumbers: regionNumbers,
        highlightedISO3Countries: highlightedISO3Countries,
    };
}
