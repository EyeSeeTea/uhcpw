import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { SliderInfo } from "../../../domain/entities/country-page/SliderInfo";
import { useCountryInfo } from "./useCountryInfo";
import { generateYears } from "../../../domain/usecases/utils/generateYears";
import { LatestAvailable } from "../../../domain/entities/Year";
import { CountrySectionInfo } from "../../../domain/entities/Country";
import UmbrellaGreen from "../../assets/country-page/umbrellaGreen.png";
import UmbrellaRed from "../../assets/country-page/umbrella-3.svg";
import { VisualizationsSeeds } from "../../../data/repositories/indicator-explorer/seed/VisualizationsSeeds";
import {
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
} from "../../../data/repositories/countries/CountryD2Repository";
import { ORG_UNIT_IDS } from "../../../domain/entities/region/Region";
import { SlideGraph } from "../../components/country-page/slider/SlideGraph";
import { VerticalTabConfig } from "../../components/vertical-tabs-panel/VerticalTabsPanel";
import { SlideInfo } from "../../components/country-page/slider/SlideInfo";
import { AccordionConfig } from "../../components/accordion-panel/AccordionPanel";

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

export type SliderInfoConfig = SliderConfig & {
    kind: "info";
    sliderContent?: CountrySectionInfo;
    titleColor: string;
    icon: string;
};

type CountrySlider = {
    sliderConfigs: (VerticalTabConfig | AccordionConfig)[];
    tabValue: number;
    expandedSliderConfig?: VerticalTabConfig | AccordionConfig;
    handleAccordionChange: (event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => void;
    handleTabChange: (_event: React.ChangeEvent<{}>, newValue: number) => void;
    onResetTab: () => void;
};

export function useCountrySlider(countryId: string): CountrySlider {
    const { compositionRoot, countriesAndSubregions } = useAppContext();
    const country = useCountryInfo(countryId);

    const [tabValue, setTabValue] = useState(0);
    const [sliderInfo, setSliderInfo] = useState<SliderInfo | undefined>(undefined);
    const [expandedSliderConfig, setExpandedSliderConfig] = useState<VerticalTabConfig | AccordionConfig | undefined>(
        undefined
    );

    const countrySelected = useMemo(() => {
        if (countryId === FEDERACIJA_BOSNE_I_HERCEGOVINE || countryId === REPUBLICA_SERPSKA) {
            return countriesAndSubregions.find(({ id }) => id === BOSNIA_AND_HERZEGOVINA_LEVEL_4)?.id || countryId;
        } else {
            return countryId;
        }
    }, [countriesAndSubregions, countryId]);

    useEffect(() => {
        if (country?.name) {
            const nameBIH =
                countryId === FEDERACIJA_BOSNE_I_HERCEGOVINE || countryId === REPUBLICA_SERPSKA
                    ? countriesAndSubregions.find(({ id }) => id === BOSNIA_AND_HERZEGOVINA_LEVEL_4)?.name
                    : undefined;
            compositionRoot.countryPage.getSliderInfo.execute(country?.name, nameBIH).run(
                info => {
                    setSliderInfo(info);
                },
                () => setSliderInfo(undefined)
            );
        }
    }, [compositionRoot.countryPage.getSliderInfo, countriesAndSubregions, country?.name, countryId]);

    const handleTabChange = useCallback((_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }, []);

    const onResetTab = useCallback(() => {
        if (tabValue !== 0) {
            setTabValue(0);
        }
    }, [tabValue]);

    const sliderGraphsConfig: (VerticalTabConfig | AccordionConfig)[] = useMemo(
        () =>
            sliderInfo
                ? [
                      {
                          tab: 0,
                          tabTitle: sliderInfo?.sliderOne || "",
                          Component: SlideGraph,
                          props: {
                              kind: "graph",
                              countryId: countryId,
                              title: sliderInfo?.sliderOne || "",
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
                                  countries: countriesAndSubregions.map(({ id }) => id),
                              },
                          },
                      },
                      {
                          tab: 1,
                          tabTitle: sliderInfo?.sliderTwo || "",
                          Component: SlideGraph,
                          props: {
                              countryId: countryId,
                              kind: "graph",
                              title: sliderInfo?.sliderTwo || "",
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
                                  countries: countriesAndSubregions.map(({ id }) => id),
                              },
                          },
                      },
                      {
                          tab: 2,
                          tabTitle: sliderInfo?.sliderThree || "",
                          Component: SlideGraph,
                          props: {
                              countryId: countryId,
                              kind: "graph",
                              title: sliderInfo?.sliderThree || "",
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
                                  countries: countriesAndSubregions.map(({ id }) => id),
                              },
                          },
                      },
                      {
                          tab: 3,
                          tabTitle: sliderInfo?.sliderFour || "",
                          Component: SlideGraph,
                          props: {
                              countryId: countryId,
                              kind: "graph",
                              title: sliderInfo?.sliderFour || "",
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
                      },
                      {
                          tab: 4,
                          tabTitle: sliderInfo?.sliderFive || "",
                          Component: SlideGraph,
                          props: {
                              countryId: countryId,
                              kind: "graph",
                              title: sliderInfo?.sliderFive || "",
                              graphOne: {
                                  visualizationId: "VB7bdJ8ZXya",
                                  visualizationName:
                                      VisualizationsSeeds["VB7bdJ8ZXya"]?.countryPageName ||
                                      VisualizationsSeeds["VB7bdJ8ZXya"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: countriesAndSubregions.map(({ id }) => id),
                              },
                              graphTwo: {
                                  visualizationId: "mcNfvQaVbfy",
                                  visualizationName:
                                      VisualizationsSeeds["mcNfvQaVbfy"]?.countryPageName ||
                                      VisualizationsSeeds["mcNfvQaVbfy"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: countriesAndSubregions.map(({ id }) => id),
                              },
                          },
                      },
                      {
                          tab: 5,
                          Component: SlideGraph,
                          tabTitle: sliderInfo?.sliderSix || "",
                          props: {
                              countryId: countryId,
                              kind: "graph",
                              title: sliderInfo?.sliderSix || "",
                              graphOne: {
                                  visualizationId: "xJhFIBuwGVC",
                                  visualizationName:
                                      VisualizationsSeeds["xJhFIBuwGVC"]?.countryPageName ||
                                      VisualizationsSeeds["xJhFIBuwGVC"]?.friendlyName,
                                  years: generateYears().map(year => year.id),
                                  countries: [countryId, ORG_UNIT_IDS.EUROPEAN_UNION],
                              },
                              graphTwo: {
                                  visualizationId: "zkEtsohZTTf",
                                  visualizationName:
                                      VisualizationsSeeds["zkEtsohZTTf"]?.countryPageName ||
                                      VisualizationsSeeds["zkEtsohZTTf"]?.friendlyName,
                                  years: generateYears().map(year => year.id),
                                  countries: [countryId, ORG_UNIT_IDS.EUROPEAN_UNION],
                              },
                          },
                      },
                      {
                          tab: 6,
                          Component: SlideGraph,
                          tabTitle: sliderInfo?.sliderSeven || "",
                          props: {
                              countryId: countryId,
                              kind: "graph",
                              title: sliderInfo?.sliderSeven || "",
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
                      },
                      {
                          tab: 7,
                          Component: SlideGraph,
                          tabTitle: sliderInfo?.sliderEight || "",
                          props: {
                              countryId: countrySelected,
                              kind: "graph",
                              title: sliderInfo?.sliderEight || "",
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
                                  countries: [countrySelected, ORG_UNIT_IDS.EUROPEAN_UNION],
                              },
                          },
                      },
                      {
                          tab: 8,
                          Component: SlideGraph,
                          tabTitle: sliderInfo?.sliderNine || "",
                          props: {
                              countryId: countrySelected,
                              kind: "graph",
                              title: sliderInfo?.sliderNine || "",
                              graphOne: {
                                  visualizationId: "B4CnzUqVR3n",
                                  visualizationName:
                                      VisualizationsSeeds["B4CnzUqVR3n"]?.countryPageName ||
                                      VisualizationsSeeds["B4CnzUqVR3n"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: countriesAndSubregions.map(({ id }) => id),
                                  currentCountry: countrySelected,
                              },
                              graphTwo: {
                                  visualizationId: "BYAT5Woc9EJ",
                                  visualizationName:
                                      VisualizationsSeeds["BYAT5Woc9EJ"]?.countryPageName ||
                                      VisualizationsSeeds["BYAT5Woc9EJ"]?.friendlyName,
                                  years: [LatestAvailable.id],
                                  countries: [countrySelected, ORG_UNIT_IDS.EUROPEAN_UNION],
                              },
                          },
                      },
                  ]
                : [],
        [countriesAndSubregions, countryId, countrySelected, sliderInfo]
    );

    const sliderInfoConfig: (VerticalTabConfig | AccordionConfig)[] = useMemo(
        () =>
            sliderInfo
                ? [
                      {
                          tab: 9,
                          tabTitle: sliderInfo?.sliderTen || "",
                          Component: SlideInfo,
                          props: {
                              countryId: countryId,
                              kind: "info",
                              sliderInfo: country?.sliderInfo?.gapsSection,
                              titleColor: "#b20101",
                              icon: UmbrellaRed,
                          },
                      },
                      {
                          tab: 10,
                          tabTitle: sliderInfo?.sliderEleven || "",
                          Component: SlideInfo,
                          props: {
                              countryId: countryId,
                              kind: "info",
                              sliderInfo: country?.sliderInfo?.finProtecSection,
                              titleColor: "#4fad56",
                              icon: UmbrellaGreen,
                          },
                      },
                  ]
                : [],
        [country, countryId, sliderInfo]
    );

    const sliderConfigs: (VerticalTabConfig | AccordionConfig)[] = useMemo(
        () => [...sliderGraphsConfig, ...sliderInfoConfig],
        [sliderGraphsConfig, sliderInfoConfig]
    );

    const handleAccordionChange = useCallback(
        (_event: React.ChangeEvent<{}>, tabId: number, isExpanded: boolean) => {
            const sliderConfigSelected = isExpanded
                ? [...sliderGraphsConfig, ...sliderInfoConfig].find(config => config.tab === tabId)
                : undefined;
            setExpandedSliderConfig(sliderConfigSelected);
        },
        [sliderGraphsConfig, sliderInfoConfig]
    );

    return {
        sliderConfigs: sliderConfigs,
        tabValue,
        expandedSliderConfig,
        handleAccordionChange,
        handleTabChange,
        onResetTab,
    };
}
