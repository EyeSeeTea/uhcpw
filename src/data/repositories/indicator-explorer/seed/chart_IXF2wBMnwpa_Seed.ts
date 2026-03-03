import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { LatestAvailable } from "../../../../domain/entities/Year";
import { mapToWhoCountryName } from "../../countries/mapToWhoCountryData";
import { POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT } from "../PolicyExplorerChartDataD2Repository";
import { sortedCategoryNames } from "./utils";

const dataNames: Record<"CGk1OOt70Dz_residence" | "CGk1OOt70Dz_payment" | "WmOGqGcov4f", string> = {
    CGk1OOt70Dz_residence: "Population covered (residence)",
    CGk1OOt70Dz_payment: "Population covered (payment of contributions)",
    WmOGqGcov4f: "Households with catastrophic health spending",
};

export const chart_IXF2wBMnwpa_Seed: VisualizationExtra = {
    categoryName: sortedCategoryNames.combinedIndicators,
    friendlyName:
        "Population coverage, the main basis for entitlement to publicly financed health care and catastrophic health spending",
    countryPageName:
        "Population coverage, the main basis for entitlement to publicly financed health care and catastrophic health spending, latest available year",
    allowedYears: [LatestAvailable],
    selectedYearsByDefault: [LatestAvailable],
    isComparative: true,
    splitRequestsByOrgUnitLevel: true,
    needPolicyExplorerChartData: true,
    getRowWithDataName: (row, metadata, policyExplorerChartData): string[] => {
        const isPopulationDataElement = row[0] === "WmOGqGcov4f";
        const countryId = row[1] || "";
        const year = row[2] || "";
        const value = row[3] || "";

        const orgUnit = metadata.organisationUnits?.find(orgUnit => orgUnit.id === countryId);

        const countryName = mapToWhoCountryName(countryId, orgUnit?.shortName || "");

        if (isPopulationDataElement) {
            return [dataNames.WmOGqGcov4f, countryName, year, value];
        }

        const relevantElements = !isPopulationDataElement
            ? (policyExplorerChartData || [])
                  .filter(item => item.country === countryId && item.period === year && item.value === true)
                  .map(item => item.dataElement)
            : [];

        const dataName =
            relevantElements.length > 0 && relevantElements.includes(POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT)
                ? dataNames.CGk1OOt70Dz_payment
                : dataNames.CGk1OOt70Dz_residence;

        return [dataName, countryName, year, value];
    },
};
