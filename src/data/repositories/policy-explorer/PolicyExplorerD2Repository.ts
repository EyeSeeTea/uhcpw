import _ from "lodash";
import moment from "moment";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    latestAvailableYear,
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerGeneralInfo,
    PolicyExplorerReferences,
    PolicyExplorerGeneralInfoToDownload,
    PolicyExplorerGeneralInfoToDownloadKeys,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { Tab, exportToCSVWithStyles } from "../../export/exportToCSV";
import { getTableBuilder } from "./builders/TableBuilder";
import {
    CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES,
    CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES,
} from "./builders/TableBuilderChangesInCoveragePolicy";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID,
} from "./PolicyExplorerCategoryD2Repository";
import { CategoryOption } from "../../../webapp/components/policy-explorer/category-selector/CategorySelector";
import { USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS } from "./builders/TableBuilderByTypeOfHealthcare";
import { Id } from "../../../domain/entities/Ref";

export const generalDataElements: Record<string, string> = {
    sourceUrl: "pDEHTRpRL8X",
    sourceText: "LO9Cw7DmDBY",
    countryExperts: "mCEsfMPByf5",
    editors: "iyYnyNfyrfs",
    lastUpdate: "VDRInyNx7fG",
    references: "DsWWAKomY4Z",
    reviewers: "coUVQe1snBi",
    notes: "HihKaI46iuO",
};

export const EMPTY_DATA = "";
export const COUNTRY_HEADER_NAME = "Country";
export const PERIOD_HEADER_NAME = "Year";
export const REFERENCES_HEADER_NAME = "References";
const FILE_NAME = "PolicyExplorer";

export const categoriesNameWithLessThan31Chars: Record<string, string> = {
    CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID: "Changes in coverage policy",
    u800TAhsIBY: "User charges by health care",
    e6cfI6vWYEF: "Main gaps in financed coverage",
};

export const REFERENCES_TAB_NAME = "References";
export const GENERAL_INFOMRATION_TAB_NAME = "General information";
export const DATE_OF_DOWNLOAD = "Date of download:";

const sortedPolicyExplorerCategoriesToDownload: Record<string, Id> = {
    populationCoverage: "uG2PbDfOc0w",
    serviceCoverage: "W4CqlzcDPB1",
    userCharges: "mCMVwmnGWJF",
    userChargesByHealthCare: "u800TAhsIBY",
    voluntaryHealthInsurance: "uImM4yTeeV3",
    mainGapsInFinancedCoverage: "e6cfI6vWYEF",
    changesInCoveragePolicy: "CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID",
};

const REFERENCES_REGEX = /\[.*?\]: <\/> ".*?"/g;

export class PolicyExplorerD2Repository implements PolicyExplorerRepository {
    constructor(private api: D2Api) {}

    get(
        policyExplorerCategories: Record<string, string[]>,
        countries: string[],
        yearsByCategory: Record<string, string[]>
    ): FutureData<PolicyExplorer> {
        return Future.joinObj({
            dataSetResponse: apiToFuture(
                this.api.models.dataSets.get({
                    fields: dataSetFields,
                    filter: { id: { eq: policyExplorerDataSet_ID } },
                })
            ),
            dataValuesResponse: apiToFuture(
                this.api.dataValues.getSet({
                    dataSet: [policyExplorerDataSet_ID],
                    orgUnit: countries,
                    period: this.getPeriods(yearsByCategory),
                })
            ),
            orgUnitsResponse: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    level: 3,
                })
            ),
        }).map(({ dataSetResponse, dataValuesResponse, orgUnitsResponse }) => {
            const dataValuesWithOrgUnitNames = this.populateDataValuesWithOrgUnitNames(
                dataValuesResponse.dataValues,
                orgUnitsResponse.objects
            );

            return {
                tables: this.buildTables({
                    policyExplorerCategories,
                    dataValuesWithOrgUnitNames,
                    organisationUnits: orgUnitsResponse.objects,
                    yearsByCategory,
                    dataSet: dataSetResponse.objects[0],
                }),
                generalInfo: this.buildGeneralInfo(dataValuesResponse.dataValues, orgUnitsResponse.objects),
                references: this.buildReferences(dataValuesResponse.dataValues, orgUnitsResponse.objects),
            };
        });
    }

    saveToFile(categories: CategoryOption[], policyExplorer: PolicyExplorer): FutureData<void> {
        const sortedCategoriesToDownload = Object.keys(policyExplorer.tables).sort((categoryIdA, categoryIdB) => {
            return (
                Object.values(sortedPolicyExplorerCategoriesToDownload).indexOf(categoryIdA) -
                Object.values(sortedPolicyExplorerCategoriesToDownload).indexOf(categoryIdB)
            );
        });
        const generalInformationTab = this.getGeneralInformationTab(policyExplorer.generalInfo);
        const referencesTab = this.getReferencesTab(policyExplorer.references);

        const tabs = sortedCategoriesToDownload.reduce((accTabs: Tab[], categoryId: string) => {
            const rows = policyExplorer.tables[categoryId];
            const category = categories.find(({ value }) => value === categoryId);

            if (rows?.length) {
                const dataRows = this.getDataFromRows(rows);
                return [
                    ...accTabs,
                    {
                        data: [[category?.text || categoryId], ...dataRows],
                        name: Object.keys(categoriesNameWithLessThan31Chars).includes(categoryId)
                            ? categoriesNameWithLessThan31Chars[categoryId] || categoryId
                            : category?.text || categoryId,
                    },
                ];
            }
            return accTabs;
        }, []);

        exportToCSVWithStyles([generalInformationTab, ...tabs, referencesTab], FILE_NAME);
        return Future.success(undefined);
    }

    private getGeneralInformationTab(generalInfo: PolicyExplorerGeneralInfo[]): Tab {
        const generalInformationTitle = GENERAL_INFOMRATION_TAB_NAME;
        const downloadDate = `${DATE_OF_DOWNLOAD} ${moment(new Date()).format("DD/MM/YYYY")}`;
        const generalInfoRowsTitles: PolicyExplorerGeneralInfoToDownload = {
            country: "Country",
            year: "Year",
            lastUpdate: "Last updated",
            countryExperts: "Country experts",
            editors: "Editors",
            reviewers: "Reviewers*",
            notes: "Notes*",
            source: "Suggested citation",
        };
        const generalInfoForDownload: PolicyExplorerGeneralInfoToDownload[] = generalInfo.map(info => ({
            country: info.country,
            year: info.year,
            lastUpdate: info.lastUpdate ? moment(info.lastUpdate).format("DD MMMM YYYY") : "",
            countryExperts: info.countryExperts,
            editors: info.editors,
            reviewers: info.reviewers,
            notes: info.notes,
            source: `${info.sourceText} ${info.sourceUrl}`,
        }));

        const generalInfoTab = generalInfoForDownload.reduce(
            (generalInfoRowsAcc, countryGeneralInfo) => {
                const generalInfoRowsTitlesKeys = Object.keys(
                    generalInfoRowsTitles
                ) as PolicyExplorerGeneralInfoToDownloadKeys[];

                return generalInfoRowsTitlesKeys.map((generalInfoKey, index) => {
                    const row: string[] = generalInfoRowsAcc[index] ?? [];
                    return [...row, countryGeneralInfo[generalInfoKey]];
                });
            },
            Object.values(generalInfoRowsTitles).map(row => [row])
        );

        return {
            data: [[generalInformationTitle], ...generalInfoTab, [downloadDate]],
            name: generalInformationTitle,
        };
    }

    private getReferencesTab(references: PolicyExplorerReferences[]): Tab {
        const referencesTitle = REFERENCES_TAB_NAME;

        const referencesTab = references.reduce(
            (referencesTabAcc, countryReferences) => {
                const cleanReferences = countryReferences.references?.map(
                    reference => reference.split("]:")[1]?.replace(/"/g, "") || reference
                );
                return [...referencesTabAcc, [countryReferences.country, cleanReferences.join("\n")]];
            },
            [[referencesTitle], ["Country", ""]]
        );

        return {
            data: referencesTab,
            name: referencesTitle,
        };
    }

    private getPeriods(yearsByCategory: Record<string, string[]>): string[] {
        const years = Object.values(yearsByCategory).reduce((accYears, years) => {
            const yearsToAdd = years.includes(latestAvailableYear) ? "2023,2024" : years;
            return accYears.concat(yearsToAdd);
        }, []);
        return _.uniq(_.sortBy(years));
    }

    private getDataFromRows(rows: PolicyExplorerCell[][]): string[][] {
        return rows.reduce((accRowsData: string[][], currentRow: PolicyExplorerCell[]) => {
            const rowData: string[] = currentRow.map(({ value }) => value);
            return [...accRowsData, rowData];
        }, []);
    }

    private buildGeneralInfo(
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[]
    ): PolicyExplorerGeneralInfo[] {
        const dataValuesByOrgUnit = _(dataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        return Object.entries(dataValuesByOrgUnit).map(([orgUnitId, dataValuesOfCountry]) => {
            const country = organisationUnits.find(ou => ou.id === orgUnitId)?.shortName || "";

            const dataValuesOfCountryOrderByYear = _.orderBy(dataValuesOfCountry, ["period"], "desc");
            const sortedYears = dataValuesOfCountryOrderByYear.map(({ period }) => period);

            const sourceUrl =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.sourceUrl || "")
                )?.value || "";
            const countryExperts =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.countryExperts || "")
                )?.value || "";
            const editors =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.editors || "")
                )?.value || "";
            const lastUpdate =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.lastUpdate || "")
                )?.value || "";
            const reviewers =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.reviewers || "")
                )?.value || "";
            const sourceText =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.sourceText || "")
                )?.value || "";

            const notes =
                dataValuesOfCountryOrderByYear.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.notes || "")
                )?.value || "";

            const year = sortedYears.length && sortedYears[0] ? sortedYears[0] : "";

            return {
                country,
                sourceText,
                sourceUrl,
                countryExperts,
                editors,
                lastUpdate: new Date(lastUpdate),
                reviewers,
                notes,
                year,
            };
        });
    }

    private buildTables(params: {
        policyExplorerCategories: Record<string, string[]>;
        dataValuesWithOrgUnitNames: DataValueSetsDataValueWithOrgUnitNames[];
        organisationUnits: D2OrgUnit[];
        yearsByCategory: Record<string, string[]>;
        dataSet?: D2DataSet;
    }): Record<string, PolicyExplorerCell[][]> {
        const { policyExplorerCategories, dataValuesWithOrgUnitNames, organisationUnits, yearsByCategory, dataSet } =
            params;

        const hasToFillAllSubcategories = Object.keys(policyExplorerCategories).some(
            categoryId =>
                CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID === categoryId ||
                CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES === categoryId
        );

        const allPolicyExplorerCategoriesAndSubcategories = hasToFillAllSubcategories
            ? this.fillAllSubcategories(policyExplorerCategories)
            : policyExplorerCategories;

        const tables = {};

        return Object.entries(allPolicyExplorerCategoriesAndSubcategories).reduce(
            (accTables, [policyExplorerCategoryId, policyExplorerSubcategoriesIds]) => {
                const tableBuilder = getTableBuilder(policyExplorerCategoryId);

                const columns = tableBuilder.buildColumns({
                    policyExplorerCategoryId,
                    policyExplorerSubcategoriesIds,
                    dataSet,
                });

                const years = yearsByCategory[policyExplorerCategoryId] || [];
                const yearsIsLatestAvailableYear = years.length === 1 && years[0] === latestAvailableYear;

                const dataValuesOrderByYear = _.orderBy(
                    dataValuesWithOrgUnitNames,
                    ["orgUnitShortName", "period"],
                    "asc"
                );

                const finalDataValues = yearsIsLatestAvailableYear
                    ? this.filterByLatestAvailableYear(dataValuesOrderByYear)
                    : dataValuesOrderByYear;

                const dataValuesByCountryAndYear = _(finalDataValues)
                    .groupBy(dataValue => `${dataValue.orgUnit}-${dataValue.period}`)
                    .value();

                const rows = Object.keys(dataValuesByCountryAndYear).reduce(
                    (accRows: PolicyExplorerCell[][], group): PolicyExplorerCell[][] => {
                        const [orgUnit, period] = group.split("-");

                        if (!orgUnit) return accRows;

                        const isPeriodNotIncludedInCategory =
                            period && !years.includes(period) && !yearsIsLatestAvailableYear;

                        if (isPeriodNotIncludedInCategory) {
                            return accRows;
                        }

                        const orgUnitNameInCell = this.isCountryAlreadyInRows(accRows, organisationUnits, orgUnit)
                            ? EMPTY_DATA
                            : organisationUnits.find(ou => ou.id === orgUnit)?.shortName || EMPTY_DATA;

                        const dataValuesByGroup = dataValuesByCountryAndYear[group] || [];

                        const references =
                            dataValuesWithOrgUnitNames.find(
                                dv =>
                                    dv.orgUnit === orgUnit &&
                                    dv.dataElement.includes(generalDataElements.references || "")
                            )?.value || EMPTY_DATA;

                        const areMarkdownReferences = references.match(REFERENCES_REGEX) as string[];

                        return tableBuilder.buildRows({
                            currentRowsInTable: accRows,
                            policyExplorerCategoryId,
                            policyExplorerSubcategoriesIds,
                            dataValuesByGroup,
                            orgUnitName: orgUnitNameInCell,
                            period,
                            references: areMarkdownReferences ? references : "",
                            dataSet,
                        });
                    },
                    []
                );

                const tableWithFilteredColumns = this.filterColumnsWithNoData(columns, rows);

                return {
                    ...accTables,
                    [policyExplorerCategoryId]: tableWithFilteredColumns,
                };
            },
            tables
        );
    }

    private isCountryAlreadyInRows(
        accRows: PolicyExplorerCell[][],
        organisationUnits: D2OrgUnit[],
        orgUnit: Id
    ): boolean {
        const orgUnitName = organisationUnits.find(ou => ou.id === orgUnit)?.shortName;
        return (
            !!orgUnitName && !!accRows?.find((row: PolicyExplorerCell[]) => !!row[0] && row[0]?.value === orgUnitName)
        );
    }

    private filterByLatestAvailableYear(
        dataValuesOrderByYear: DataValueSetsDataValueWithOrgUnitNames[]
    ): DataValueSetsDataValueWithOrgUnitNames[] {
        return _(dataValuesOrderByYear).reduce((acc, dataValue) => {
            const existedDataValuesForOrgUnit = acc.find(dv => dv.orgUnit === dataValue.orgUnit);

            if (!existedDataValuesForOrgUnit || +existedDataValuesForOrgUnit?.period === +dataValue.period) {
                return [...acc, dataValue];
            } else {
                const newAcc = acc.filter(dv => dv.orgUnit !== dataValue.orgUnit);
                return [...newAcc, dataValue];
            }
        }, [] as DataValueSetsDataValueWithOrgUnitNames[]);
    }

    private fillAllSubcategories(policyExplorerCategories: Record<string, string[]>): Record<string, string[]> {
        return Object.keys(policyExplorerCategories).reduce((acc, categoryId) => {
            switch (categoryId) {
                case CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID:
                    return {
                        ...acc,
                        [categoryId]: Object.values({
                            ...CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES,
                            ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES,
                        }).reduce((accSubcategories, subcategoryIds) => {
                            return [...accSubcategories, ...subcategoryIds];
                        }, [] as string[]),
                    };
                case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES:
                    return {
                        ...acc,
                        [categoryId]: Object.values(
                            USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS
                        ).reduce((accSubcategories, subcategoryIds) => {
                            return [...accSubcategories, ...subcategoryIds];
                        }, [] as string[]),
                    };
                default:
                    return {
                        ...acc,
                        [categoryId]: policyExplorerCategories[categoryId],
                    };
            }
        }, {});
    }

    private filterColumnsWithNoData(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]) {
        const indexesToRemove = columns.reduce((accIndexesToRemove: number[], _column, columnIndex) => {
            const hasRowsWithoutData = rows.every(row => !row[columnIndex]?.value);
            return hasRowsWithoutData ? [...accIndexesToRemove, columnIndex] : accIndexesToRemove;
        }, []);

        const filteredColumns = columns.filter((_column, index) => !indexesToRemove.includes(index));
        const filteredRows = rows.map(row => row.filter((_cell, index) => !indexesToRemove.includes(index)));

        return filteredColumns.length ? [filteredColumns, ...filteredRows] : [];
    }

    private buildReferences(
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[]
    ): PolicyExplorerReferences[] {
        const dataValuesByOrgUnit = _(dataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        return Object.keys(dataValuesByOrgUnit).map(orgUnitId => {
            const country = organisationUnits.find(ou => ou.id === orgUnitId)?.shortName || "";

            const references =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.references || "")
                )?.value || EMPTY_DATA;

            const referencesArray = references.match(REFERENCES_REGEX) as string[];

            return {
                country,
                references: referencesArray?.map(reference => reference?.replace(/<\/>/g, "")) || [references],
            };
        });
    }

    private populateDataValuesWithOrgUnitNames(
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[]
    ): DataValueSetsDataValueWithOrgUnitNames[] {
        return dataValues.map(dataValue => ({
            ...dataValue,
            orgUnitShortName: organisationUnits.find(ou => ou.id === dataValue.orgUnit)?.shortName || "",
        }));
    }
}

const dataSetFields = {
    sections: {
        id: true,
        displayName: true,
        dataElements: { id: true, formName: true, valueType: true, description: true },
    },
} as const;

export type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

const organisationUnitsFields = {
    id: true,
    shortName: true,
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];

type DataValueSetsDataValueWithOrgUnitNames = DataValueSetsDataValue & {
    orgUnitShortName: string;
};
