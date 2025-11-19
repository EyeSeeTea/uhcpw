export function fillDataSourceWithEmptyData(
    dataSource: string[][],
    countriesAndYearInXaxis: string[],
    dxId: string,
    sortedCountriesAndYear: string[],
    isDescOrder?: boolean
): string[][] {
    const missingCountriesAndYear = countriesAndYearInXaxis.filter(
        countryAndYear => !sortedCountriesAndYear.includes(countryAndYear)
    );

    const sortedCountriesAndYearWithMissing = isDescOrder
        ? [...sortedCountriesAndYear, ...missingCountriesAndYear]
        : [...missingCountriesAndYear, ...sortedCountriesAndYear];

    return sortedCountriesAndYearWithMissing.reduce((acc: Array<string[]>, countryAndYear) => {
        const [countryId = "", year = ""] = countryAndYear.split("_");

        const currentDataSourceFound = dataSource.find(row => row[1] === countryId && row[2] === year);
        return currentDataSourceFound ? [...acc, currentDataSourceFound] : [...acc, [dxId, countryId, year, "0"]];
    }, []);
}
