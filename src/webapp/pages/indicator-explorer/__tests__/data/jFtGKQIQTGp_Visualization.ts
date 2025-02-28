import { Visualization } from "../../../../../domain/entities/indicator-explorer/Visualization";

export const jFtGKQIQTGp_visualization = {
    id: "jFtGKQIQTGp",
    name: "Households with impoverishing health spending",
    rows: [
        {
            id: "pe",
            dimension: "pe",
            items: [
                {
                    id: "2000",
                },
                {
                    id: "2001",
                },
                {
                    id: "2002",
                },
                {
                    id: "2003",
                },
                {
                    id: "2004",
                },
                {
                    id: "2005",
                },
                {
                    id: "2006",
                },
                {
                    id: "2007",
                },
                {
                    id: "2008",
                },
                {
                    id: "2009",
                },
                {
                    id: "2010",
                },
                {
                    id: "2011",
                },
                {
                    id: "2012",
                },
                {
                    id: "2013",
                },
                {
                    id: "2014",
                },
                {
                    id: "2015",
                },
                {
                    id: "2016",
                },
                {
                    id: "2017",
                },
                {
                    id: "2018",
                },
                {
                    id: "2019",
                },
                {
                    id: "2020",
                },
                {
                    id: "2021",
                },
                {
                    id: "2022",
                },
                {
                    id: "2023",
                },
            ],
        },
    ],
    columns: [
        {
            id: "dx",
            dimension: "dx",
            items: [
                {
                    dimensionItem: "WsUM8TQ7cEh",
                    id: "WsUM8TQ7cEh",
                },
                {
                    dimensionItem: "yYSS1uBgnTE",
                    id: "yYSS1uBgnTE",
                },
            ],
        },
    ],
    filters: [
        {
            id: "ou",
            dimension: "ou",
            items: [
                {
                    id: "XKKI1hhyFxk",
                },
            ],
        },
    ],
    dataDimensionItems: [
        {
            dataDimensionItemType: "DATA_ELEMENT",
            dataElement: {
                id: "WsUM8TQ7cEh",
            },
        },
        {
            dataDimensionItemType: "DATA_ELEMENT",
            dataElement: {
                id: "yYSS1uBgnTE",
            },
        },
    ],
    categoryDimensions: [],
    showData: true,
    regressionType: "NONE",
    type: "STACKED_COLUMN",
    cumulativeValues: false,
    sortOrder: 0,
    fontSize: "NORMAL",
    aggregationType: "DEFAULT",
    hideSubtitle: false,
    percentStackedValues: false,
    noSpaceBetweenColumns: false,
    hideTitle: false,
    regression: false,
    skipRounding: false,
    legend: {
        showKey: false,
    },
    yearlySeries: [],
    hideEmptyRowItems: "ALL",
    axes: [
        {
            index: 0,
            type: "DOMAIN",
            title: {
                textMode: "CUSTOM",
                text: "Years",
            },
        },
        {
            index: 0,
            type: "RANGE",
            title: {
                textMode: "CUSTOM",
                text: "Households (%)",
            },
        },
    ],
    seriesKey: {
        hidden: false,
    },
    categoryName: "Financial hardship",
    showCountryTag: true,
    friendlyName: "households with impoverishing health spending",
    isComparative: false,
    subcategoryName: "Country level",
    maxCountryFilter: 1,
    allowBreaksInSeries: true,
    notes: "Source: WHO Regional Office for Europe",
    breakInSeries: {
        countries: new Map([
            [
                "DVnpk4xiXGJ",
                {
                    years: ["2015", "2018"],
                    description:
                        "During 2015 and 2018 there were some changes that affected how this is measured. Therefore, we are applying break in series.",
                },
            ],
        ]),
    },
} as unknown as Visualization;
