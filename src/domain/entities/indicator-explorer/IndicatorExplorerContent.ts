export type IndicatorExplorerContent = Readonly<{
    selectCategory: InfoBoxContent;
    dataSourcesAndAvailability: InfoBoxContent;
    noDataMessage: string;
}>;

export type InfoBoxContent = Readonly<{
    title: string;
    text: string;
}>;
