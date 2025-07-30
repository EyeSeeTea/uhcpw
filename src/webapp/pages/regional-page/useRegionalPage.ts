import { MutableRefObject, useCallback, useMemo, useRef } from "react";

import { Option } from "../../components/dropdown/Option";
import { Id } from "../../../domain/entities/Ref";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { useRegionalPageFilter } from "./useRegionalPageFilter";
import i18n from "../../../locales";

export type RegionalMenuItem = "regionMap" | "numbers" | "coveragePolicy" | "policyChecklist" | "resources" | "experts";

export type RegionalMenuItemConfig = {
    id: RegionalMenuItem;
    label: string;
    ref: MutableRefObject<HTMLElement | null>;
};

export type RegionalPageState = {
    regionFilter: {
        regionOptions: Option<Id>[];
        selectedRegion: Id | undefined;
        onRegionChange: (value: Id) => void;
    };
    isSmallScreen: boolean;
    refs: Record<RegionalMenuItem, MutableRefObject<HTMLElement | null>>;
    menuItemsConfig: RegionalMenuItemConfig[];
    handleHeaderItemClick: (item: RegionalMenuItem) => void;
};

export function useRegionalPage(): RegionalPageState {
    const { regionOptions, selectedRegion, onRegionChange } = useRegionalPageFilter();
    const isSmallScreen = useIsSmallScreen();
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

    const handleHeaderItemClick = useCallback(
        (item: RegionalMenuItem) => {
            const targetRef = refs[item];
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        [refs]
    );

    return {
        regionFilter: { regionOptions, selectedRegion, onRegionChange },
        isSmallScreen: isSmallScreen,
        menuItemsConfig: menuItemsConfig,
        refs: refs,
        handleHeaderItemClick: handleHeaderItemClick,
    };
}
