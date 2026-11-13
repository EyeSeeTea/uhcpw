import { InfoBoxContent } from "../InfoBoxContent";

export type IndicatorExplorerContent = Readonly<{
    selectCategory: InfoBoxContent;
    dataSourcesAndAvailability: InfoBoxContent;
    noDataMessage: string;
}>;
