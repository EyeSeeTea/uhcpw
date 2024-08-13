import { Id } from "../../../domain/entities/Ref";

export function getCurrencyCodeFromCountryId(countryId: Id): string {
    return mapperCountryIdToCurrencyCode[countryId] || "€";
}

const mapperCountryIdToCurrencyCode: Record<string, string> = {
    VGOzFKfSazN: "ALL",
    cWrL45je7mw: "AMD",
    ST86paYjRHP: "AZN",
    Tr4i6jeDDqj: "BYN",
    rqaiYTAnMC6: "BAM",
    j44olg405lZ: "BAM",
    FvoXRc5cEEk: "BAM",
    AjeCGGb8H76: "BGN",
    fg8TSIHSGHX: "GEL",
    Bc3mYAhlY1a: "ISK",
    XebDUbuPqVx: "NIS",
    ibGsqmiVkoU: "KZT",
    tDFavWinSwr: "KGS",
    cfBaKMnsXd1: "MKD",
    oy494aJtjTB: "NOK",
    yBqy4nxuOCA: "MDL",
    i3v8r9XNls2: "RUB",
    oroMC4mMzMq: "RSD",
    IFAb1JUZ0Fz: "SEK",
    q2HqXV5OO3z: "CHF",
    xb2ezJcUoSR: "TJS",
    HwqfuL9pQz5: "TRY",
    eVEK7djdWqV: "TMT",
    VJrTuNXAg9G: "UAH",
    Gnz4lqrVEMf: "GBP",
    kpFgAwwSjCZ: "UZS",
};
