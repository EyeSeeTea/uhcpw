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
    firstYearInFilter,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID } from "../utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { Tab, exportToCSVWithStyles } from "../../export/exportToCSV";
import { getTableBuilder } from "./builders/TableBuilder";
import { CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES } from "./builders/TableBuilderChangesInCoveragePolicy";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
} from "./PolicyExplorerCategoryD2Repository";
import { USER_CHARGE_BY_TYPE_OF_HEALTHCARE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS } from "./builders/TableBuilderByTypeOfHealthcare";
import { Id } from "../../../domain/entities/Ref";
import { Country } from "../../../domain/entities/Country";
import { FEDERACIJA_BOSNE_I_HERCEGOVINE, REPUBLICA_SERPSKA } from "../countries/CountryD2Repository";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { generate } from "../../../domain/usecases/utils/generateYears";

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
    Dg4b8bTfEIr: "Changes in coverage policy",
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
    changesInCoveragePolicy: "Dg4b8bTfEIr",
};

const REFERENCES_REGEX = /\[.*?\]: <\/> ".*?"/g;
const REGEX_INSIDE_PARENTHESIS = /BIH \(([^)]+)\)/;

export class PolicyExplorerD2Repository implements PolicyExplorerRepository {
    constructor(private api: D2Api) {}

    get(
        policyExplorerCategories: Record<string, string[]>,
        selectedCountriesIds: Id[],
        yearsByCategory: Record<string, string[]>,
        countriesAndRegions: Country[],
        programCategories: PolicyExplorerCategory[]
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
                    orgUnit: selectedCountriesIds,
                    period: this.getPeriods(yearsByCategory),
                })
            ),
        }).map(({ dataSetResponse, dataValuesResponse }) => {
            const dataValuesWithOrgUnitNames = this.populateDataValuesWithOrgUnitNames(
                dataValuesResponse.dataValues,
                countriesAndRegions
            );

            const lastPeriodWithDataByCountry = this.getLastPeriodWithDataByCountry(
                dataValuesResponse.dataValues,
                policyExplorerCategories
            );

            return {
                tables: this.buildTables({
                    policyExplorerCategories,
                    dataValuesWithOrgUnitNames,
                    countriesAndRegions: countriesAndRegions,
                    yearsByCategory,
                    dataSet: dataSetResponse.objects[0],
                    programCategories,
                }),
                generalInfo: this.buildGeneralInfo(dataValuesResponse.dataValues, countriesAndRegions),
                references: this.buildReferences(
                    dataValuesResponse.dataValues,
                    countriesAndRegions,
                    lastPeriodWithDataByCountry
                ),
            };
        });
    }

    private getLastPeriodWithDataByCountry(
        allDataValues: DataValueSetsDataValue[],
        selectedPolicyExplorerCategories: Record<string, Id[]>
    ): Map<Id, string> {
        const changesInCoveragePolicyDataElementIds = Object.values(CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES).reduce(
            (acc, dataElementIds) => [...acc, ...dataElementIds],
            []
        );

        const allDataElementIdsSelected: string[] = Object.values(selectedPolicyExplorerCategories).reduce(
            (acc, dataElementIds) => [...acc, ...dataElementIds],
            [...changesInCoveragePolicyDataElementIds]
        );

        const dataValuesByOrgUnit = _(allDataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        const periodByOrgUnitMap = Object.entries(dataValuesByOrgUnit).reduce((map, [orgUnitId, dataValues]) => {
            const dataValuesOrderedByPeriod = [...dataValues].sort((a, b) => {
                if (a.period > b.period) return -1;
                if (a.period < b.period) return 1;
                return 0;
            });

            const dataValueWithLastYear = dataValuesOrderedByPeriod.find(dataValue =>
                allDataElementIdsSelected.includes(dataValue.dataElement)
            );

            return map.set(orgUnitId, dataValueWithLastYear?.period || "");
        }, new Map<Id, string>());

        return periodByOrgUnitMap;
    }

    saveToFile(categories: PolicyExplorerCategory[], policyExplorer: PolicyExplorer): FutureData<void> {
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
            const category = categories.find(({ id }) => id === categoryId);

            if (rows?.length) {
                const dataRows = this.getDataFromRows(rows);
                return [
                    ...accTabs,
                    {
                        data: [[category?.name || categoryId], ...dataRows],
                        name: Object.keys(categoriesNameWithLessThan31Chars).includes(categoryId)
                            ? categoriesNameWithLessThan31Chars[categoryId] || categoryId
                            : category?.name || categoryId,
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
            lastUpdate: info.lastUpdate ? moment(info.lastUpdate).format("D MMMM YYYY") : "",
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
            const yearsFrom2023UntilCurrent = generate(new Date().getFullYear(), firstYearInFilter - 1).map(
                year => year.id
            );
            const yearsToAdd = years.includes(latestAvailableYear) ? yearsFrom2023UntilCurrent.join(",") : years;
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
        countriesAndRegions: Country[]
    ): PolicyExplorerGeneralInfo[] {
        const dataValuesByOrgUnit = _(dataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        return Object.entries(dataValuesByOrgUnit).map(([orgUnitId, dataValuesOfCountry]) => {
            const countryName = this.getCountryName(orgUnitId, countriesAndRegions);

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
                country: countryName,
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
        countriesAndRegions: Country[];
        yearsByCategory: Record<string, string[]>;
        dataSet?: D2DataSet;
        programCategories: PolicyExplorerCategory[];
    }): Record<string, PolicyExplorerCell[][]> {
        const {
            policyExplorerCategories,
            dataValuesWithOrgUnitNames,
            countriesAndRegions,
            yearsByCategory,
            dataSet,
            programCategories,
        } = params;

        const hasToFillSubcategories = Object.keys(policyExplorerCategories).some(
            categoryId =>
                CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID === categoryId ||
                CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES === categoryId
        );

        const allPolicyExplorerCategoriesAndSubcategories = hasToFillSubcategories
            ? this.fillSubcategories(policyExplorerCategories)
            : policyExplorerCategories;

        const tables = {};

        return Object.entries(allPolicyExplorerCategoriesAndSubcategories).reduce(
            (accTables, [policyExplorerCategoryId, policyExplorerSubcategoriesIds]) => {
                const tableBuilder = getTableBuilder(policyExplorerCategoryId);

                const columns = tableBuilder.buildColumns({
                    policyExplorerCategoryId,
                    policyExplorerSubcategoriesIds,
                    programCategories,
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

                        const orgUnitNameInCell = this.isCountryAlreadyInRows(accRows, countriesAndRegions, orgUnit)
                            ? EMPTY_DATA
                            : this.getCountryName(orgUnit, countriesAndRegions);
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
        countriesAndRegions: Country[],
        orgUnit: Id
    ): boolean {
        const orgUnitName = this.getCountryName(orgUnit, countriesAndRegions);
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

    private fillSubcategories(policyExplorerCategories: Record<string, string[]>): Record<string, string[]> {
        return Object.keys(policyExplorerCategories).reduce((acc, categoryId) => {
            switch (categoryId) {
                case CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID:
                    return {
                        ...acc,
                        [categoryId]: Object.values({
                            ...CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES,
                        }).reduce((accSubcategories, subcategoryIds) => {
                            return [...accSubcategories, ...subcategoryIds];
                        }, [] as string[]),
                    };
                case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES:
                    return {
                        ...acc,
                        [categoryId]: Object.entries(
                            USER_CHARGE_BY_TYPE_OF_HEALTHCARE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS
                        ).reduce((accSubcategories, subcategories) => {
                            const subcategoriesSelected = policyExplorerCategories[categoryId];
                            const [typeOfHealthCare, subcategoriesOfHealthCareIds] = subcategories;
                            return subcategoriesSelected?.includes(typeOfHealthCare)
                                ? [...accSubcategories, ...subcategoriesOfHealthCareIds]
                                : accSubcategories;
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
        countriesAndRegions: Country[],
        lastPeriodWithDataByCountry: Map<Id, string>
    ): PolicyExplorerReferences[] {
        const dataValuesByOrgUnit = _(dataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        return Object.keys(dataValuesByOrgUnit).map(orgUnitId => {
            const country = this.getCountryName(orgUnitId, countriesAndRegions);
            const references =
                dataValues.find(
                    dv =>
                        dv.orgUnit === orgUnitId &&
                        dv.dataElement.includes(generalDataElements.references || "") &&
                        dv.period === (lastPeriodWithDataByCountry.get(orgUnitId) || "")
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
        countriesAndRegions: Country[]
    ): DataValueSetsDataValueWithOrgUnitNames[] {
        return dataValues.map(dataValue => ({
            ...dataValue,
            orgUnitShortName: this.getCountryName(dataValue.orgUnit, countriesAndRegions),
        }));
    }

    private getCountryName(orgUnitId: Id, countriesAndRegions: Country[]): string {
        const orgUnitName = countriesAndRegions.find(country => country.id === orgUnitId)?.name || EMPTY_DATA;
        return orgUnitId === REPUBLICA_SERPSKA || orgUnitId === FEDERACIJA_BOSNE_I_HERCEGOVINE
            ? `Bosnia and Herzegovina (${orgUnitName.match(REGEX_INSIDE_PARENTHESIS)?.[1]})` || ""
            : orgUnitName || "";
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

type DataValueSetsDataValueWithOrgUnitNames = DataValueSetsDataValue & {
    orgUnitShortName: string;
};
