import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerGeneralInfo,
    PolicyExplorerReferences,
    DataOrientationByTable,
    DataOrientation,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { Tab, exportToCSV } from "../../export/exportToCSV";
import { getTableBuilder } from "./builders/TableBuilder";
import {
    CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES,
    CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES,
} from "./builders/TableBuilderChangesInCoveragePolicy";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
} from "./PolicyExplorerCategoryD2Repository";
import { CategoryOption } from "../../../webapp/components/policy-explorer/category-selector/CategorySelector";

export const generalDataElements: Record<string, string> = {
    source: "pDEHTRpRL8X",
    countryExperts: "mCEsfMPByf5",
    editors: "iyYnyNfyrfs",
    lastUpdate: "VDRInyNx7fG",
    references: "DsWWAKomY4Z",
};

export const EMPTY_DATA = "";
export const COUNTRY_HEADER_NAME = "Country";
export const PERIOD_HEADER_NAME = "Period";
export const REFERENCES_HEADER_NAME = "References";
const FILE_NAME = "PolicyExplorer";

const categoriesNameWithLessThan31Chars: Record<string, string> = {
    Dg4b8bTfEIr: "Changes coverage policy",
    FtRwT2aBET4: "Changes coverage policy 2019",
    u800TAhsIBY: "User charges by health care",
};

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

    saveToFile(
        categories: CategoryOption[],
        policyExplorer: PolicyExplorer,
        dataOrientationByTable: DataOrientationByTable
    ): FutureData<void> {
        const tabs = Object.keys(policyExplorer.tables).reduce((accTabs: Tab[], categoryId: string) => {
            const rows = policyExplorer.tables[categoryId];
            const category = categories.find(({ value }) => value === categoryId);
            const normalOrientedTables = [
                ...Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID),
                ...Object.values(CATEGORY_BY_TYPE_OF_HEALTHCARE),
            ];
            const initialDataOrientation = normalOrientedTables.includes(categoryId) ? "normal" : "inverted";
            const dataOrientation = dataOrientationByTable[categoryId] || initialDataOrientation;
            const references = policyExplorer.references;

            if (rows) {
                const dataRows = this.getDataFromRows(rows);
                return [
                    ...accTabs,
                    {
                        data: this.addReferencesToDataRows(dataRows, references, dataOrientation),
                        name: Object.keys(categoriesNameWithLessThan31Chars).includes(categoryId)
                            ? categoriesNameWithLessThan31Chars[categoryId] || categoryId
                            : category?.text || categoryId,
                    },
                ];
            }
            return accTabs;
        }, []);

        exportToCSV(tabs, FILE_NAME);
        return Future.success(undefined);
    }

    private getPeriods(yearsByCategory: Record<string, string[]>): string[] {
        const years = Object.values(yearsByCategory).reduce((accYears, years) => accYears.concat(years), []);
        return _.uniq(_.sortBy(years));
    }

    private getDataFromRows(rows: PolicyExplorerCell[][]): string[][] {
        return rows.reduce((accRowsData: string[][], currentRow: PolicyExplorerCell[]) => {
            const rowData: string[] = currentRow.map(({ value }) => value);
            return [...accRowsData, rowData];
        }, []);
    }

    private addReferencesToDataRows(
        dataRows: string[][],
        references: PolicyExplorerReferences[],
        dataOrientation: DataOrientation
    ): string[][] {
        if (dataOrientation === "normal") {
            return dataRows?.map(dataRow => {
                const isHeadersRow = dataRow.includes(COUNTRY_HEADER_NAME);
                const referencesOfCountry =
                    references.find(reference => dataRow.includes(reference.country))?.references?.join(",") ||
                    EMPTY_DATA;

                return [...dataRow, isHeadersRow ? REFERENCES_HEADER_NAME : referencesOfCountry];
            });
        }
        if (dataOrientation === "inverted") {
            const countryDataRow = dataRows.find(dataRow => dataRow.includes(COUNTRY_HEADER_NAME));
            const referencesDataRowToInclude = countryDataRow?.map((data): string => {
                const referencesOfCountry =
                    references.find(reference => reference.country === data)?.references?.join(",") || EMPTY_DATA;

                return data === COUNTRY_HEADER_NAME ? REFERENCES_HEADER_NAME : referencesOfCountry;
            });
            return referencesDataRowToInclude ? [...dataRows, referencesDataRowToInclude] : dataRows;
        }
        return dataRows;
    }

    private buildGeneralInfo(
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[]
    ): PolicyExplorerGeneralInfo[] {
        const dataValuesByOrgUnit = _(dataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        return Object.keys(dataValuesByOrgUnit).map(orgUnitId => {
            const country = organisationUnits.find(ou => ou.id === orgUnitId)?.shortName || "";

            const source =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.source || "")
                )?.value || "";
            const countryExperts =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.countryExperts || "")
                )?.value || "";
            const editors =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.editors || "")
                )?.value || "";
            const lastUpdate =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.lastUpdate || "")
                )?.value || "";

            return { country, source, countryExperts, editors, lastUpdate: new Date(lastUpdate) };
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

        const hasSomeChangesInCoveragePolicyCategory = Object.keys(policyExplorerCategories).some(categoryId =>
            Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID).includes(categoryId)
        );

        const allPolicyExplorerCategories = hasSomeChangesInCoveragePolicyCategory
            ? this.fillSubcategoriesInChangesInCoveragePolicy(policyExplorerCategories)
            : policyExplorerCategories;

        const tables = {};

        return Object.entries(allPolicyExplorerCategories).reduce(
            (accTables, [policyExplorerCategoryId, policyExplorerSubcategoriesIds]) => {
                const tableBuilder = getTableBuilder(policyExplorerCategoryId);

                const columns = tableBuilder.buildColumns({
                    policyExplorerCategoryId,
                    policyExplorerSubcategoriesIds,
                    dataSet,
                });

                const countriesAlreadyInRows: string[] = [];

                const dataValuesOrderByYear = _.orderBy(
                    dataValuesWithOrgUnitNames,
                    ["orgUnitShortName", "period"],
                    "asc"
                );

                const dataValuesByCountryAndYear = _(dataValuesOrderByYear)
                    .groupBy(dataValue => `${dataValue.orgUnit}-${dataValue.period}`)
                    .value();

                const rows = Object.keys(dataValuesByCountryAndYear).reduce(
                    (accRows: PolicyExplorerCell[][], group): PolicyExplorerCell[][] => {
                        const [orgUnit, period] = group.split("-");

                        if (!orgUnit) return accRows;

                        const isPeriodNotIncludedInCategory =
                            period && !yearsByCategory[policyExplorerCategoryId]?.includes(period);
                        if (isPeriodNotIncludedInCategory) {
                            return accRows;
                        }

                        const orgUnitName = countriesAlreadyInRows.includes(orgUnit)
                            ? EMPTY_DATA
                            : organisationUnits.find(ou => ou.id === orgUnit)?.shortName || EMPTY_DATA;

                        if (!countriesAlreadyInRows.includes(orgUnit)) {
                            countriesAlreadyInRows.push(orgUnit);
                        }

                        const dataValuesByGroup = dataValuesByCountryAndYear[group] || [];

                        const references =
                            dataValuesWithOrgUnitNames.find(
                                dv =>
                                    dv.orgUnit === orgUnit &&
                                    dv.dataElement.includes(generalDataElements.references || "")
                            )?.value || EMPTY_DATA;

                        return tableBuilder.buildRows({
                            currentRowsInTable: accRows,
                            policyExplorerCategoryId,
                            policyExplorerSubcategoriesIds,
                            dataValuesByGroup,
                            orgUnitName,
                            period,
                            references,
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

    private fillSubcategoriesInChangesInCoveragePolicy(
        policyExplorerCategories: Record<string, string[]>
    ): Record<string, string[]> {
        return Object.keys(policyExplorerCategories).reduce((acc, categoryId) => {
            switch (categoryId) {
                case CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019:
                case CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.SINCE_2020:
                    return {
                        ...acc,
                        [categoryId]: this.getAllSubcategoriesOfChangesInCoveragePolicy(
                            categoryId,
                            policyExplorerCategories[categoryId] || []
                        ),
                    };
                default:
                    return {
                        ...acc,
                        [categoryId]: policyExplorerCategories[categoryId],
                    };
            }
        }, {});
    }

    private getAllSubcategoriesOfChangesInCoveragePolicy(categoryId: string, selectedSubcategories: string[]) {
        const changesInCoveragePolicyGroupedSubcategories =
            categoryId === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019
                ? CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES
                : CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES;

        return selectedSubcategories.reduce((accSubcategories, subcategory) => {
            const subcategoryIds = Object.values(changesInCoveragePolicyGroupedSubcategories).find(subcategoryIds =>
                subcategoryIds.includes(subcategory)
            );
            return subcategoryIds ? [...accSubcategories, ...subcategoryIds] : accSubcategories;
        }, [] as string[]);
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

            const referencesArray = references.match(/\[([^\]]+)\]:\s<(.*?)>([^[]+)(?=\[|$)/g) as string[];

            return { country, references: referencesArray?.map(reference => reference?.replace(/<\/>/g, "")) };
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
