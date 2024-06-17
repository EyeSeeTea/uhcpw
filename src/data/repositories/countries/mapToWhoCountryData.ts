import { Id } from "../../../domain/entities/Ref";

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
    "f5415f05-3d3a-476f-9907-c6dc5cd8003c": "BIH-F",
    "95d59331-585d-4c09-943f-46fa7b40ea88": "BIH-R",
};

const whoCountryNames: Record<Id, string> = {
    rEQqufy2KNi: "Netherlands (Kingdom of the)",
    NEPywTBN52g: "Kosovo*",
    j44olg405lZ: "BIH (Federation of Bosnia and Herzegovina)",
    FvoXRc5cEEk: "BIH (Republika Srpska)",
};

export function mapToWhoCountryName(countryId: Id, countryName: string): string {
    return whoCountryNames[countryId] || countryName;
}
