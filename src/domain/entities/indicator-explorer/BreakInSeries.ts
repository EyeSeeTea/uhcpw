import { Maybe } from "../../../types/utils";
import { Id } from "../Ref";

export type VisualizationBreakInSeries = {
    countries: Map<Id, CountryBreakInSeries>;
};

export type CountryBreakInSeries = {
    years: string[];
    description: string;
};

export class BreakInSeries {
    private data: Map<Id, VisualizationBreakInSeries>;

    constructor() {
        this.data = new Map();
    }
    public addVisualization(visualizationId: Id): void {
        this.data.set(visualizationId, { countries: new Map() });
    }

    public addCountry(visualizationId: Id, countryId: Id, countryBreakInSeriesData: CountryBreakInSeries): void {
        const visualization = this.data.get(visualizationId);
        if (visualization) {
            visualization.countries.set(countryId, countryBreakInSeriesData);
        }
    }

    public getVisualization(visualizationId: Id): VisualizationBreakInSeries | undefined {
        return this.data.get(visualizationId);
    }

    public getCountry(visualizationId: Id, countryId: Id): CountryBreakInSeries | undefined {
        const visualization = this.data.get(visualizationId);
        if (visualization) {
            return visualization.countries.get(countryId);
        }
        return undefined;
    }
}

export function getBreakYearsOrNearestYearsAfterBreak(
    years: string[],
    breakYears: CountryBreakInSeries["years"]
): CountryBreakInSeries["years"] {
    const yearsNumbers = years.map(Number);
    const newBreakYears = breakYears.map(Number).reduce((nearestYears: number[], breakYear: number) => {
        if (yearsNumbers.includes(breakYear)) {
            return [...nearestYears, breakYear];
        }
        const nearestYear = yearsNumbers.reduce((nearest: number | undefined, year: number) => {
            if (year > breakYear && (!nearest || year < nearest)) {
                return year;
            }
            return nearest;
        }, undefined);

        return nearestYear ? [...nearestYears, nearestYear] : nearestYears;
    }, []);

    return newBreakYears.map(String);
}

export function getBreakInSeriesCountryDescription(
    visualizationBreakInSeries: Maybe<VisualizationBreakInSeries>,
    allYearsInData: string[],
    countryId: Id
): CountryBreakInSeries["description"] | undefined {
    const breakYears = visualizationBreakInSeries?.countries.get(countryId)?.years || [];
    const newBreakYears = getBreakYearsOrNearestYearsAfterBreak(allYearsInData, breakYears);

    const areYearsBeforABreak = allYearsInData.some(year => {
        return newBreakYears.some(breakYear => year < breakYear);
    });

    if (areYearsBeforABreak && visualizationBreakInSeries?.countries.get(countryId)?.description) {
        return visualizationBreakInSeries?.countries.get(countryId)?.description;
    }
}
