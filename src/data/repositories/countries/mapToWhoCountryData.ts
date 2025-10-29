import { Id } from "../../../domain/entities/Ref";
import { ORG_UNIT_IDS } from "../../../domain/entities/region/Region";

export function mapToWhoCountryCode(countryCode: string): string {
    return whoCountrycodes[countryCode] || countryCode;
}

const whoCountrycodes: Record<string, string> = {
    ALB: "ALB",
    AND: "AND",
    ARM: "ARM",
    AUT: "AUT",
    AZE: "AZE",
    BLR: "BLR",
    BEL: "BEL",
    BIH: "BIH",
    "BA-BIH": "BHI-F",
    "BA-SRP": "BHI-R",
    BGR: "BUL",
    HRV: "CRO",
    CYP: "CYP",
    CZE: "CZH",
    DNK: "DEN",
    EST: "EST",
    FIN: "FIN",
    FRA: "FRA",
    GEO: "GEO",
    DEU: "DEU",
    GRC: "GRE",
    HUN: "HUN",
    ISL: "ICE",
    IRL: "IRE",
    ISR: "ISR",
    ITA: "ITA",
    KAZ: "KAZ",
    KGZ: "KGZ",
    "RS-KM": "KOS*",
    LVA: "LVA",
    LTU: "LTU",
    LUX: "LUX",
    MLT: "MAT",
    MCO: "MON",
    MNE: "MNE",
    NLD: "NET",
    NOR: "NOR",
    POL: "POL",
    PRT: "POR",
    MDA: "MDA",
    ROU: "ROM",
    RUS: "RUS",
    SMR: "SMR",
    SRB: "SRB",
    SVK: "SVK",
    SVN: "SVN",
    ESP: "SPA",
    SWE: "SWE",
    CHE: "SWI",
    TJK: "TJK",
    MKD: "MKD",
    TUR: "TUR",
    TKM: "TKM",
    UKR: "UKR",
    GBR: "UNK",
    UZB: "UZB",
    XKX: "KOS*",
    "BIH-4-1": "BIH",
    "BIH-4-2": "BIH-F",
    "BIH-4-3": "BIH-R",
    GRL: "EU",
};

export const whoCountryNames: Record<Id, string> = {
    rEQqufy2KNi: "Netherlands (Kingdom of the)",
    NEPywTBN52g: "Kosovo*",
    j44olg405lZ: "BIH (the Federation of Bosnia and Herzegovina)",
    FvoXRc5cEEk: "BIH (the Republika Srpska)",
    [ORG_UNIT_IDS.EUROPEAN_UNION]: "EU",
    rqaiYTAnMC6: "Bosnia and Herzegovina",
};

export function mapToWhoCountryName(countryId: Id, countryName: string): string {
    return whoCountryNames[countryId] || countryName;
}

const whoCountryNameToCountryName: Record<string, string> = {
    "Netherlands (Kingdom of the)": "Netherlands",
    "Kosovo*": "Kosovo",
    "BIH (the Federation of Bosnia and Herzegovina)": "Federacija Bosne i Hercegovine",
    "BIH (the Republika Srpska)": "Republica Serpska",
    EU: "Greenland",
    "Bosnia and Herzegovina": "Brcko District",
};

export function mapFromWhoToD2CountryName(countryName: string): string {
    return whoCountryNameToCountryName[countryName] || countryName;
}
