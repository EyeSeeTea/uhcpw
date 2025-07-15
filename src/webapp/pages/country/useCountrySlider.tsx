import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { SliderInfo } from "../../../domain/entities/country-page/SliderInfo";
import { useCountryInfo } from "./useCountryInfo";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { LatestAvailable } from "../../../domain/entities/Year";
import { CountrySectionInfo, EU27 } from "../../../domain/entities/Country";
import UmbrellaGreen from "../../assets/country-page/umbrellaGreen.png";
import UmbrellaRed from "../../assets/country-page/umbrella-3.svg";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import {
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
} from "../../../data/repositories/countries/CountryD2Repository";

type SliderGraph = {
    visualizationId: string;
    visualizationName?: string;
    years: string[];
    countries: string[];
    currentCountry?: string;
};

type SliderConfig = {
    tab: number;
    tabTitle: string;
};

export type SliderGraphConfig = SliderConfig & {
    kind: "graph";
    graphOne: SliderGraph;
    graphTwo: SliderGraph;
};

type SliderGraphsConfigs = SliderGraphConfig[];

export type SliderInfoConfig = SliderConfig & {
    kind: "info";
    sliderContent?: CountrySectionInfo;
    titleColor: string;
    icon: string;
};

type SliderInfoConfigs = SliderInfoConfig[];

type CountrySlider = {
    tabValue: number;
    sliderGraphsConfig: SliderGraphsConfigs;
    sliderInfoConfig: SliderInfoConfigs;
    expandedSliderConfig?: SliderGraphConfig | SliderInfoConfig;
    handleAccordionChange: (tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    onWheel: (event: React.WheelEvent<HTMLButtonElement>) => void;
    disableScroll: () => void;
    enableScroll: () => void;
    onResetTab: () => void;
};

export function useCountrySlider(countryId: string): CountrySlider {
    const { compositionRoot, countriesAndRegions } = useAppContext();
    const country = useCountryInfo(countryId);

    const [tabValue, setTabValue] = useState(0);
    const [sliderInfo, setSliderInfo] = useState<SliderInfo | undefined>(undefined);
    const [expandedSliderConfig, setExpandedSliderConfig] = useState<SliderGraphConfig | SliderInfoConfig | undefined>(
        undefined
    );

    const countrySelected = useMemo(() => {
        if (countryId === FEDERACIJA_BOSNE_I_HERCEGOVINE || countryId === REPUBLICA_SERPSKA) {
            return countriesAndRegions.find(({ id }) => id === BOSNIA_AND_HERZEGOVINA_LEVEL_4)?.id || countryId;
        } else {
            return countryId;
        }
    }, [countriesAndRegions, countryId]);

    useEffect(() => {
        if (country?.name) {
            const nameBIH =
                countryId === FEDERACIJA_BOSNE_I_HERCEGOVINE || countryId === REPUBLICA_SERPSKA
                    ? countriesAndRegions.find(({ id }) => id === BOSNIA_AND_HERZEGOVINA_LEVEL_4)?.name
                    : undefined;
            compositionRoot.countryPage.getSliderInfo.execute(country?.name, nameBIH).run(
                info => {
                    setSliderInfo(info);
                },
                () => setSliderInfo(undefined)
            );
        }
    }, [compositionRoot.countryPage.getSliderInfo, countriesAndRegions, country?.name, countryId]);

    const handleTabChange = useCallback((_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }, []);

    const onResetTab = useCallback(() => {
        if (tabValue !== 0) {
            setTabValue(0);
        }
    }, [tabValue]);

    const preventDefault = useCallback((event: Event) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = true;
    }, []);

    const enableScroll = useCallback(() => {
        const options: AddEventListenerOptions = { passive: false };
        document.removeEventListener("wheel", preventDefault, options);
    }, [preventDefault]);

    const disableScroll = useCallback(() => {
        document.addEventListener("wheel", preventDefault, { passive: false });
    }, [preventDefault]);

    const onWheel = useCallback(
        (event: React.WheelEvent<HTMLButtonElement>) => {
            if (event.deltaY > 10 && tabValue < 10) {
                setTimeout(() => setTabValue(tabValue + 1), 800);
            } else if (event.deltaY < -10 && tabValue > 0) {
                setTimeout(() => setTabValue(tabValue - 1), 800);
            }
        },
        [tabValue]
    );

    const sliderGraphsConfig: SliderGraphsConfigs = useMemo(
        () => [
            {
                tab: 0,
                kind: "graph",
                tabTitle: sliderInfo?.sliderOne || "",
                graphOne: {
                    visualizationId: "jFtGKQIQTGp",
                    visualizationName:
                        VisualizationsSeeds["jFtGKQIQTGp"]?.countryPageName ||
                        VisualizationsSeeds["jFtGKQIQTGp"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "dbc87Ljw8uN",
                    visualizationName:
                        VisualizationsSeeds["dbc87Ljw8uN"]?.countryPageName ||
                        VisualizationsSeeds["dbc87Ljw8uN"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: countriesAndRegions.map(({ id }) => id),
                },
            },
            {
                tab: 1,
                kind: "graph",
                tabTitle: sliderInfo?.sliderTwo || "",
                graphOne: {
                    visualizationId: "Y31jQX5PVdI",
                    visualizationName:
                        VisualizationsSeeds["Y31jQX5PVdI"]?.countryPageName ||
                        VisualizationsSeeds["Y31jQX5PVdI"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "NOukqSxCI63",
                    visualizationName:
                        VisualizationsSeeds["NOukqSxCI63"]?.countryPageName ||
                        VisualizationsSeeds["NOukqSxCI63"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: countriesAndRegions.map(({ id }) => id),
                },
            },
            {
                tab: 2,
                kind: "graph",
                tabTitle: sliderInfo?.sliderThree || "",
                graphOne: {
                    visualizationId: "geNXcoXc3mf",
                    visualizationName:
                        VisualizationsSeeds["geNXcoXc3mf"]?.countryPageName ||
                        VisualizationsSeeds["geNXcoXc3mf"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "GimM6ANOKhd",
                    visualizationName:
                        VisualizationsSeeds["GimM6ANOKhd"]?.countryPageName ||
                        VisualizationsSeeds["GimM6ANOKhd"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: countriesAndRegions.map(({ id }) => id),
                },
            },
            {
                tab: 3,
                kind: "graph",
                tabTitle: sliderInfo?.sliderFour || "",
                graphOne: {
                    visualizationId: "hpO1ZyFXpCz",
                    visualizationName:
                        VisualizationsSeeds["hpO1ZyFXpCz"]?.countryPageName ||
                        VisualizationsSeeds["hpO1ZyFXpCz"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "q5ldoFcgkSn",
                    visualizationName:
                        VisualizationsSeeds["q5ldoFcgkSn"]?.countryPageName ||
                        VisualizationsSeeds["q5ldoFcgkSn"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: [countryId],
                },
            },
            {
                tab: 4,
                kind: "graph",
                tabTitle: sliderInfo?.sliderFive || "",
                graphOne: {
                    visualizationId: "VB7bdJ8ZXya",
                    visualizationName:
                        VisualizationsSeeds["VB7bdJ8ZXya"]?.countryPageName ||
                        VisualizationsSeeds["VB7bdJ8ZXya"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: countriesAndRegions.map(({ id }) => id),
                },
                graphTwo: {
                    visualizationId: "mcNfvQaVbfy",
                    visualizationName:
                        VisualizationsSeeds["mcNfvQaVbfy"]?.countryPageName ||
                        VisualizationsSeeds["mcNfvQaVbfy"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: countriesAndRegions.map(({ id }) => id),
                },
            },
            {
                tab: 5,
                kind: "graph",
                tabTitle: sliderInfo?.sliderSix || "",
                graphOne: {
                    visualizationId: "xJhFIBuwGVC",
                    visualizationName:
                        VisualizationsSeeds["xJhFIBuwGVC"]?.countryPageName ||
                        VisualizationsSeeds["xJhFIBuwGVC"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId, EU27],
                },
                graphTwo: {
                    visualizationId: "zkEtsohZTTf",
                    visualizationName:
                        VisualizationsSeeds["zkEtsohZTTf"]?.countryPageName ||
                        VisualizationsSeeds["zkEtsohZTTf"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId, EU27],
                },
            },
            {
                tab: 6,
                kind: "graph",
                tabTitle: sliderInfo?.sliderSeven || "",
                graphOne: {
                    visualizationId: "rT39aStYqI3",
                    visualizationName:
                        VisualizationsSeeds["rT39aStYqI3"]?.countryPageName ||
                        VisualizationsSeeds["rT39aStYqI3"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "nhaxK33nlhb",
                    visualizationName:
                        VisualizationsSeeds["nhaxK33nlhb"]?.countryPageName ||
                        VisualizationsSeeds["nhaxK33nlhb"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
            },
            {
                tab: 7,
                kind: "graph",
                tabTitle: sliderInfo?.sliderEight || "",
                graphOne: {
                    visualizationId: "OB4SCQfCzwz",
                    visualizationName:
                        VisualizationsSeeds["OB4SCQfCzwz"]?.countryPageName ||
                        VisualizationsSeeds["OB4SCQfCzwz"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countrySelected],
                },
                graphTwo: {
                    visualizationId: "d3kq9OCv8tH",
                    visualizationName:
                        VisualizationsSeeds["d3kq9OCv8tH"]?.countryPageName ||
                        VisualizationsSeeds["d3kq9OCv8tH"]?.friendlyName,
                    years: generateYears().map(year => year.id),
                    countries: [countrySelected, EU27],
                },
            },
            {
                tab: 8,
                kind: "graph",
                tabTitle: sliderInfo?.sliderNine || "",
                graphOne: {
                    visualizationId: "B4CnzUqVR3n",
                    visualizationName:
                        VisualizationsSeeds["B4CnzUqVR3n"]?.countryPageName ||
                        VisualizationsSeeds["B4CnzUqVR3n"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: countriesAndRegions.map(({ id }) => id),
                    currentCountry: countrySelected,
                },
                graphTwo: {
                    visualizationId: "BYAT5Woc9EJ",
                    visualizationName:
                        VisualizationsSeeds["BYAT5Woc9EJ"]?.countryPageName ||
                        VisualizationsSeeds["BYAT5Woc9EJ"]?.friendlyName,
                    years: [LatestAvailable.id],
                    countries: [countrySelected, EU27],
                },
            },
        ],
        [
            countriesAndRegions,
            countryId,
            countrySelected,
            sliderInfo?.sliderEight,
            sliderInfo?.sliderFive,
            sliderInfo?.sliderFour,
            sliderInfo?.sliderNine,
            sliderInfo?.sliderOne,
            sliderInfo?.sliderSeven,
            sliderInfo?.sliderSix,
            sliderInfo?.sliderThree,
            sliderInfo?.sliderTwo,
        ]
    );

    const sliderInfoConfig: SliderInfoConfigs = useMemo(
        () => [
            {
                tab: 9,
                kind: "info",
                tabTitle: sliderInfo?.sliderTen || "",
                sliderContent: country?.sliderInfo?.gapsSection,
                titleColor: "#b20101",
                icon: UmbrellaRed,
            },
            {
                tab: 10,
                kind: "info",
                tabTitle: sliderInfo?.sliderEleven || "",
                sliderContent: country?.sliderInfo?.finProtecSection,
                titleColor: "#4fad56",
                icon: UmbrellaGreen,
            },
        ],
        [
            country?.sliderInfo?.finProtecSection,
            country?.sliderInfo?.gapsSection,
            sliderInfo?.sliderEleven,
            sliderInfo?.sliderTen,
        ]
    );

    const handleAccordionChange = useCallback(
        (tabId: number, isExpanded: boolean) => {
            setExpandedSliderConfig(undefined);
            const sliderConfigSelected = isExpanded
                ? [...sliderGraphsConfig, ...sliderInfoConfig].find(config => config.tab === tabId)
                : undefined;
            setExpandedSliderConfig(sliderConfigSelected);
        },
        [sliderGraphsConfig, sliderInfoConfig]
    );

    return {
        tabValue,
        sliderGraphsConfig,
        sliderInfoConfig,
        expandedSliderConfig,
        handleAccordionChange,
        handleTabChange,
        onResetTab,
        onWheel,
        disableScroll,
        enableScroll,
    };
}
