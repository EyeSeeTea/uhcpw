import { render, RenderResult } from "@testing-library/react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { ReactNode } from "react";
import { getCompositionRoot, Repositories } from "../CompositionRoot";
import { AppContext, AppContextState } from "../webapp/contexts/app-context";

import { Instance } from "../data/entities/Instance";
import { User } from "../domain/entities/User";
import { Route, Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory } from "history";
import { getD2APiFromInstance } from "./d2-api";
import { MuiThemeProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { muiTheme } from "../webapp/pages/app/themes/dhis2.theme";
import muiThemeLegacy from "../webapp/pages/app/themes/dhis2-legacy.theme";
import { Country } from "../domain/entities/Country";
import { ResourceTheme } from "../domain/entities/resources/ResourceTheme";
import { GeneralContent } from "../domain/entities/GeneralContent";
import { Region } from "../domain/entities/region/Region";

export function givenAnUser(): User {
    return {
        id: "xE7jOejl9FI",
        name: "John Traore",
        username: "admin",
        userGroups: [],
        userRoles: [],
    };
}

export function givenACountries(): Country[] {
    return [
        {
            id: "DVnpk4xiXGJ",
            name: "Spain",
            currencyCode: "€",
            longName: "Kingdom of Spain",
            code: "ESP",
            iso3Code: "ESP",
            status: "Weak",
            coordinates: [2982, 12] as [number, number],
            parents: [{ id: "EUR", name: "Europe" }],
            flag: "http://es.png",
            showCountryFlag: true,
            generalSummary: "**General: Financial hardship (2018)**",
            countryPageSummary: "**Country: Financial hardship (2018)**",
            homePageSummary: "**Home: Financial hardship (2018)**",
            regionalPageSummary: "**Regional: Financial hardship (2018)**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Gaps in current expenditure",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Main gaps in financing",
                            text: "Main gaps include lack of financial help",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Financial Protection",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Why is financial protection so needed?",
                            text: "Financial protection saves families from catastrophic environment",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
        {
            id: "rqaiYTAnMC6",
            name: "Bosnia and Herzegovina",
            longName: "Bosnia and Herzegovina",
            code: "BIH",
            iso3Code: "BIH",
            currencyCode: "BAM",
            showCountryFlag: false,
            coordinates: [18.000095, 44.001364],
            status: "Gaps",
            parents: [
                {
                    id: "tuJjq1LSoCL",
                    name: "UHCW_Income group UMIC: Upper middle-income countries",
                },
                {
                    id: "e7I4gDX3g5k",
                    name: "UHCW_EU candidate countries",
                },
                {
                    id: "KJm1Af6dksd",
                    name: "UHCW_European Region",
                },
                {
                    id: "A1BdaIwDheX",
                    name: "UHCW_Western Balkans",
                },
            ],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=Hs9oneaS45G",
            generalSummary:
                "**General: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            countryPageSummary:
                "**Country: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            homePageSummary:
                "**Home: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            regionalPageSummary:
                "**Regional: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            sliderInfo: {
                gapsSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: false,
            children: [
                {
                    id: "j44olg405lZ",
                    name: "BIH (the Federation of Bosnia and Herzegovina)",
                    longName: "BIH (the Federation of Bosnia and Herzegovina)",
                    code: "BIH-F",
                    iso3Code: "BIH",
                    currencyCode: "BAM",
                    showCountryFlag: false,
                    coordinates: [18.6315, 45.0505],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=rqLyMfQ48Vh",
                    generalSummary: "**General: Test Federation of Bosnia and Herzegovin**",
                    countryPageSummary: "**Country: Test Federation of Bosnia and Herzegovin**",
                    homePageSummary: "**Home: Test Federation of Bosnia and Herzegovin**",
                    regionalPageSummary: "**Regional: Test Federation of Bosnia and Herzegovin**",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
                {
                    id: "FvoXRc5cEEk",
                    name: "BIH (the Republika Srpska)",
                    longName: "BIH (the Republika Srpska)",
                    code: "BIH-R",
                    iso3Code: "BIH",
                    currencyCode: "BAM",
                    showCountryFlag: false,
                    coordinates: [18.341, 42.993],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=J7AKOh6AZko",
                    generalSummary: "**General: Republika Srpska**",
                    countryPageSummary: "**Country: Republika Srpska**",
                    homePageSummary: "**Home: Republika Srpska**",
                    regionalPageSummary: "**Regional: Republika Srpska**",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
            ],
        },
        {
            id: "Rmy6DbwekE1",
            name: "Andorra",
            longName: "Principality of Andorra",
            code: "AND",
            iso3Code: "AND",
            status: "Gaps",
            parents: [
                {
                    id: "yuNkB9H6l3A",
                    name: "UHCW_Income group HIC: High income countries",
                },
            ],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=undefined",
            showCountryFlag: false,
            generalSummary: "**General**",
            countryPageSummary: "**Country**",
            homePageSummary: "**Home**",
            regionalPageSummary: "**Regional**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "",
                    sourceText: "",
                    content: [
                        {
                            title: "",
                            text: "Country Information coming soon",
                        },
                        {
                            title: "",
                            text: "Country Information coming soon",
                        },
                        {
                            title: "",
                            text: "Country Information coming soon",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "",
                    sourceText: "",
                    content: [
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: false,
            currencyCode: "€",
        },
    ];
}

export function givenACountriesAndSubregions(): Country[] {
    return [
        {
            id: "DVnpk4xiXGJ",
            name: "Spain",
            currencyCode: "€",
            longName: "Kingdom of Spain",
            code: "ESP",
            iso3Code: "ESP",
            status: "Weak",
            showCountryFlag: true,
            coordinates: [2982, 12] as [number, number],
            parents: [{ id: "EUR", name: "Europe" }],
            flag: "http://es.png",
            generalSummary: "**General: Financial hardship (2018)**",
            countryPageSummary: "**Country: Financial hardship (2018)**",
            homePageSummary: "**Home: Financial hardship (2018)**",
            regionalPageSummary: "**Regional: Financial hardship (2018)**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Gaps in current expenditure",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Main gaps in financing",
                            text: "Main gaps include lack of financial help",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Financial Protection",
                    sourceText: "Source: WHO",
                    content: [
                        {
                            title: "Why is financial protection so needed?",
                            text: "Financial protection saves families from catastrophic environment",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
        {
            id: "rqaiYTAnMC6",
            name: "Bosnia and Herzegovina",
            longName: "Bosnia and Herzegovina",
            code: "BIH",
            iso3Code: "BIH",
            currencyCode: "BAM",
            showCountryFlag: false,
            coordinates: [18.000095, 44.001364],
            status: "Gaps",
            parents: [
                {
                    id: "tuJjq1LSoCL",
                    name: "UHCW_Income group UMIC: Upper middle-income countries",
                },
                {
                    id: "e7I4gDX3g5k",
                    name: "UHCW_EU candidate countries",
                },
                {
                    id: "KJm1Af6dksd",
                    name: "UHCW_European Region",
                },
                {
                    id: "A1BdaIwDheX",
                    name: "UHCW_Western Balkans",
                },
            ],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=Hs9oneaS45G",
            generalSummary:
                "**General: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            countryPageSummary:
                "**Country: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            homePageSummary:
                "**Home: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            regionalPageSummary:
                "**Regional: Financial hardship (2015)** * Impoverishing health spending: 4.3% of households * Catastrophic health spending: 8.8% of households * Main drivers: outpatient medicines and diagnostic tests on average; outpatient medicines for low-income households **Unmet need** Internationally comparable data on unmet need are not available for Bosnia and Herzegovina",
            sliderInfo: {
                gapsSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "test B&H",
                    sourceText: "test B&H",
                    content: [
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "test B&H",
                            text: "test B&H",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: false,
            children: [
                {
                    id: "j44olg405lZ",
                    name: "BIH (the Federation of Bosnia and Herzegovina)",
                    longName: "BIH (the Federation of Bosnia and Herzegovina)",
                    code: "BIH-F",
                    iso3Code: "BIH",
                    showCountryFlag: false,
                    currencyCode: "BAM",
                    coordinates: [18.6315, 45.0505],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=rqLyMfQ48Vh",
                    generalSummary: "**General: Test Federation of Bosnia and Herzegovin**",
                    countryPageSummary: "**Country: Test Federation of Bosnia and Herzegovin**",
                    homePageSummary: "**Home: Test Federation of Bosnia and Herzegovin**",
                    regionalPageSummary: "**Regional: Test Federation of Bosnia and Herzegovin**",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Test Federation of Bosnia and Herzegovin",
                            sourceText: "Test Federation of Bosnia and Herzegovin",
                            content: [
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "Test Federation of Bosnia and Herzegovin",
                                    text: "Test Federation of Bosnia and Herzegovin",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
                {
                    id: "FvoXRc5cEEk",
                    name: "BIH (the Republika Srpska)",
                    longName: "BIH (the Republika Srpska)",
                    code: "BIH-R",
                    iso3Code: "BIH",
                    showCountryFlag: false,
                    currencyCode: "BAM",
                    coordinates: [18.341, 42.993],
                    status: "Gaps",
                    parents: [],
                    flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=J7AKOh6AZko",
                    generalSummary: "**General: Republika Srpska**",
                    countryPageSummary: "**Country: Republika Srpska**",
                    homePageSummary: "**Home: Republika Srpska**",
                    regionalPageSummary: "**Regional: Republika Srpska**",
                    sliderInfo: {
                        gapsSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                        finProtecSection: {
                            sectionName: "Republika Srpska",
                            sourceText: "Republika Srpska",
                            content: [
                                {
                                    title: "Republika Srpska",
                                    text: "Republika Srpska",
                                },
                                {
                                    title: "Republika Srpska",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                                {
                                    title: "",
                                    text: "",
                                },
                            ],
                        },
                    },
                    isInCountryPage: true,
                },
            ],
        },
        {
            id: "FvoXRc5cEEk",
            name: "BIH (the Republika Srpska)",
            longName: "BIH (the Republika Srpska)",
            code: "BIH-R",
            iso3Code: "BIH",
            currencyCode: "BAM",
            showCountryFlag: false,
            coordinates: [18.341, 42.993],
            status: "Gaps",
            parents: [],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=J7AKOh6AZko",
            generalSummary: "**General: Republika Srpska**",
            countryPageSummary: "**Country: Republika Srpska**",
            homePageSummary: "**Home: Republika Srpska**",
            regionalPageSummary: "**Regional: Republika Srpska**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Republika Srpska",
                    sourceText: "Republika Srpska",
                    content: [
                        {
                            title: "Republika Srpska",
                            text: "",
                        },
                        {
                            title: "",
                            text: "Republika Srpska",
                        },
                        {
                            title: "Republika Srpska",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Republika Srpska",
                    sourceText: "Republika Srpska",
                    content: [
                        {
                            title: "Republika Srpska",
                            text: "Republika Srpska",
                        },
                        {
                            title: "Republika Srpska",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
        {
            id: "j44olg405lZ",
            name: "BIH (the Federation of Bosnia and Herzegovina)",
            longName: "BIH (the Federation of Bosnia and Herzegovina)",
            code: "BIH-F",
            iso3Code: "BIH",
            currencyCode: "BAM",
            showCountryFlag: false,
            coordinates: [18.6315, 45.0505],
            status: "Gaps",
            parents: [],
            flag: "/dhis2/api/events/files?dataElementUid=RCQZDELfNQJ&eventUid=rqLyMfQ48Vh",
            generalSummary: "**General: Test Federation of Bosnia and Herzegovin**",
            countryPageSummary: "**Country: Test Federation of Bosnia and Herzegovin**",
            homePageSummary: "**Home: Test Federation of Bosnia and Herzegovin**",
            regionalPageSummary: "**Regional: Test Federation of Bosnia and Herzegovin**",
            sliderInfo: {
                gapsSection: {
                    sectionName: "Test Federation of Bosnia and Herzegovin",
                    sourceText: "Test Federation of Bosnia and Herzegovin",
                    content: [
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "Test Federation of Bosnia and Herzegovin",
                        },
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
                finProtecSection: {
                    sectionName: "Test Federation of Bosnia and Herzegovin",
                    sourceText: "Test Federation of Bosnia and Herzegovin",
                    content: [
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "Test Federation of Bosnia and Herzegovin",
                        },
                        {
                            title: "Test Federation of Bosnia and Herzegovin",
                            text: "Test Federation of Bosnia and Herzegovin",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                        {
                            title: "",
                            text: "",
                        },
                    ],
                },
            },
            isInCountryPage: true,
        },
    ];
}

export function givenAThemes(): ResourceTheme[] {
    return [
        {
            id: "QQMVsTNPJbB",
            name: "Spending on Health",
            code: "Spending on Health",
            displayedName: "Spending on Health",
        },
        {
            id: "XtkFOVtkBtT",
            name: "Financial Protection",
            code: "Financial Protection",
            displayedName: "Financial Protection",
        },
        {
            id: "nyzMcROMpmY",
            name: "Voluntary Health Insurance",
            code: "Voluntary Health Insurance",
            displayedName: "Voluntary Health Insurance",
        },
    ];
}

export function givenAGeneralContent(): GeneralContent {
    return {
        footer: {
            disclaimer:
                "* All references to Kosovo should be understood to be in the context of the United Nations Security Council resolution 1244 (1999)",
        },
        aboutUs: {
            title: "The Financial Protection Expert Network",
            subtitle:
                "Experts working with the WHO Barcelona Office to assess financial protection at country or area level",
        },
        cookies: {
            policyUrl: "https://www.who.int/about/policies/privacy",
        },
        abbreviations: { url: undefined },
        glossary: { url: undefined },
        regionalPageMobilePopUp: {
            disclaimer: "This is the regional page mobile pop-up disclaimer.",
            buttonText: "Learn More",
            url: "",
        },
    };
}

export function getRegions(): Region[] {
    return [];
}

export function getTestContext(repositoriesToOverwrite?: Repositories): AppContextState {
    // Mock api was working with axios but not with fetch

    const instance = new Instance({ url: "/dhis2" });
    const api = getD2APiFromInstance(instance);
    const context = {
        api: api,
        currentUser: givenAnUser(),
        compositionRoot: getCompositionRoot(api, null, instance, repositoriesToOverwrite),
        isNodeDev: true,
        countries: givenACountries(),
        themes: givenAThemes(),
        generalContent: givenAGeneralContent(),
        countriesAndSubregions: givenACountriesAndSubregions(),
        regions: getRegions(),
    };

    return context;
}

export function customRender(children: ReactNode, repositoriesToOverwrite?: Repositories): RenderResult {
    const context = getTestContext(repositoriesToOverwrite);

    return render(
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <AppContext.Provider value={context}>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </AppContext.Provider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
}

type RouterConfig = {
    path: string;
    route: string;
};

export function customRenderWithRouterMatch(
    children: ReactNode,
    config: RouterConfig,
    overwriteRepositories?: Repositories,
    memoryHistory?: MemoryHistory
) {
    const history = memoryHistory || createHistory(config);

    const node = (
        <Router history={history}>
            <Route path={config.path || ""} render={() => children} />
        </Router>
    );

    return customRender(node, overwriteRepositories);
}

export function createHistory(config: RouterConfig) {
    return createMemoryHistory({ initialEntries: [config.route] });
}
