import { Id } from "./Ref";

export type Country = {
    id: string;
    name: string;
    longName: string;
    code: string;
    status: CountryStatus;
    coordinates?: [number, number];
    parents: { id: string; name: string }[];
    children?: Country[];
    flag: string;
    showCountryFlag: boolean;
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

export type CountryStatus = "Strong" | "Gaps" | "Weak" | "InsufficientData";

// included in countries list
export const BosniaAndHerzegovina: Id = "rqaiYTAnMC6";
export const FederationOfBosniaAndHerzegovina: Id = "j44olg405lZ";
export const RepublikaSrpska: Id = "FvoXRc5cEEk";
