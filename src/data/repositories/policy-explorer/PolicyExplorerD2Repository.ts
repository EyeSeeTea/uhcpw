import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerGeneralInfo,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { exportToCSV } from "../../export/exportToCSV";
import { getTableBuilder } from "./builders/TableBuilder";

export const generalDataElements: Record<string, string> = {
    source: "pDEHTRpRL8X",
    countryExperts: "mCEsfMPByf5",
    editors: "iyYnyNfyrfs",
    lastUpdate: "VDRInyNx7fG",
    references: "DsWWAKomY4Z",
};

export const EMPTY_DATA = "";

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
            return {
                tables: this.buildTables({
                    policyExplorerCategories,
                    dataValues: dataValuesResponse.dataValues,
                    organisationUnits: orgUnitsResponse.objects,
                    yearsByCategory,
                    dataSet: dataSetResponse.objects[0],
                }),
                generalInfo: this.buildGeneralInfo(dataValuesResponse.dataValues, orgUnitsResponse.objects),
            };
        });
    }

    saveToFile(policyExplorer: PolicyExplorer, categoryId: string): FutureData<void> {
        const rows = policyExplorer.tables[categoryId];
        if (rows) {
            exportToCSV(
                [
                    {
                        data: this.getDataFromRows(rows),
                        name: "Policy Explorer",
                    },
                ],
                "PolicyExplorer"
            );
        }
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
        dataValues: DataValueSetsDataValue[];
        organisationUnits: D2OrgUnit[];
        yearsByCategory: Record<string, string[]>;
        dataSet?: D2DataSet;
    }): Record<string, PolicyExplorerCell[][]> {
        const { policyExplorerCategories, dataValues, organisationUnits, yearsByCategory, dataSet } = params;
        const tables = {};

        return Object.entries(policyExplorerCategories).reduce(
            (accTables, [policyExplorerCategoryId, policyExplorerSubcategoriesIds]) => {
                const tableBuilder = getTableBuilder(policyExplorerCategoryId);

                const columns = tableBuilder.buildColumns(
                    policyExplorerCategoryId,
                    policyExplorerSubcategoriesIds,
                    dataSet
                );

                const countriesAlreadyInRows: string[] = [];

                const dataValuesOrderByYear = _.orderBy(dataValues, ["orgUnit", "period"], "asc");
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
                            dataValues.find(
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

    private filterColumnsWithNoData(columns: PolicyExplorerCell[], rows: PolicyExplorerCell[][]) {
        const indexesToRemove = columns.reduce((accIndexesToRemove: number[], _column, columnIndex) => {
            const hasRowsWithoutData = rows.every(row => !row[columnIndex]?.value);
            return hasRowsWithoutData ? [...accIndexesToRemove, columnIndex] : accIndexesToRemove;
        }, []);

        const filteredColumns = columns.filter((_column, index) => !indexesToRemove.includes(index));
        const filteredRows = rows.map(row => row.filter((_cell, index) => !indexesToRemove.includes(index)));

        return filteredColumns.length ? [filteredColumns, ...filteredRows] : [];
    }
}

const dataSetFields = {
    sections: { id: true, displayName: true, dataElements: { id: true, formName: true, valueType: true } },
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
