import { Id } from "./Ref";

export type Country = {
    id: string;
    name: string;
    longName: string;
    code: string;
    status: CountryStatus;
    coordinates: [number, number];
    parents: { id: string; name: string }[];
    children?: Country[];
    flag: string;
    summary: string;
    sliderInfo: {
        gapsSection: CountrySectionInfo;
        finProtecSection: CountrySectionInfo;
    };
    isInCountryPage: boolean;
    currencyCode: string;
};

export type CountrySectionInfo = {
    sectionName: string;
    sourceText: string;
    content: {
        title: string;
        text: string;
    }[];
};

export type CountryStatus = "Strong" | "Gaps" | "Weak";

export type CountriesRegion = {
    id: string;
    name: string;
    longName: string;
    code: string;
    description: string;
    parents: { id: string; name: string }[];
};

// WORKAROUND: EU27 data is added in Greenland because we cannot use EUR
// no included in countries list. manually added
export const EU27: Id = "IZy3ESdFnp5";

// included in countries list
export const FederationOfBosniaAndHerzegovina: Id = "j44olg405lZ";
export const RepublikaSrpska: Id = "FvoXRc5cEEk";
