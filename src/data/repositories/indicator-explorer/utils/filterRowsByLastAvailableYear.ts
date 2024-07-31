export function filterRowsByLastAvailableYear(rows: Array<string[]>): Array<string[]> {
    const lastAvailableYearByCountry = rows.reduce((acc: Record<string, string>, row) => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";

        return !acc[countryId] || (acc[countryId] !== undefined && Number(acc[countryId]) < Number(year))
            ? { ...acc, [countryId]: year }
            : acc;
    }, {});

    return rows.filter(row => {
        const countryId = row[1]?.toString() || "";
        const year = row[2] || "";
        return lastAvailableYearByCountry[countryId] === year;
    });
}
