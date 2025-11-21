export const policyExplorerDataSet_ID = "asMJECXNLpV";
export const policyExplorerProgram_ID = "Ik70ZvT77Ee";

export const KOSOVO = "Kosovo*";

export function sortByCountry(countryA: string, countryB: string) {
    if (countryA === KOSOVO && countryB === KOSOVO) return 0;
    if (countryA === KOSOVO) return 1;
    if (countryB === KOSOVO) return -1;

    return countryA.localeCompare(countryB);
}
