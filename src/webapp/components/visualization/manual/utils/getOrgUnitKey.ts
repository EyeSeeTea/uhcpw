import { ChartSource } from "../chartOptions";

export function getOrgUnitKey(chartSource: ChartSource, orgUnitId: string) {
    const metadataOrgUnit = chartSource.analyticsResponse.metaData.items[orgUnitId];
    return metadataOrgUnit?.code || metadataOrgUnit?.name || "";
}
