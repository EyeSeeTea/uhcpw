export type VisualizationBreakInSeries = {
    countries: Map<string, CountryBreakInSeries>;
};

export type CountryBreakInSeries = {
    years: string[];
    description: string;
};

export class BreakInSeries {
    private data: Map<string, VisualizationBreakInSeries>;

    constructor() {
        this.data = new Map();
    }
    public addVisualization(visualizationId: string): void {
        this.data.set(visualizationId, { countries: new Map() });
    }

    public addCountry(
        visualizationId: string,
        countryId: string,
        countryBreakInSeriesData: CountryBreakInSeries
    ): void {
        const visualization = this.data.get(visualizationId);
        if (visualization) {
            visualization.countries.set(countryId, countryBreakInSeriesData);
        }
    }

    public getVisualization(visualizationId: string): VisualizationBreakInSeries | undefined {
        return this.data.get(visualizationId);
    }

    public getCountry(visualizationId: string, countryId: string): CountryBreakInSeries | undefined {
        const visualization = this.data.get(visualizationId);
        if (visualization) {
            return visualization.countries.get(countryId);
        }
        return undefined;
    }
}
