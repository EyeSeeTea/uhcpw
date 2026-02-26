import _ from "lodash";
import moment from "moment";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    LATEST_AVAILABLE_YEAR_CODE,
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerGeneralInfo,
    PolicyExplorerReferences,
    PolicyExplorerGeneralInfoToDownload,
    PolicyExplorerGeneralInfoToDownloadKeys,
    firstYearInFilter,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import {
    PolicyExplorerCategories,
    PolicyExplorerRepository,
} from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID, sortByCountry } from "../utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { Tab, exportToCSVWithStyles } from "../../export/exportToCSV";
import { getTableBuilder } from "./builders/TableBuilder";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
    PROGRAM_DATA_ELEMENT_CODE_SUBSTITUTIONS,
} from "./PolicyExplorerCategoryD2Repository";
import { TableBuilderByTypeOfHealthcare } from "./builders/TableBuilderByTypeOfHealthcare";
import { Id } from "../../../domain/entities/Ref";
import { Country } from "../../../domain/entities/Country";
import { FEDERACIJA_BOSNE_I_HERCEGOVINE, REPUBLICA_SERPSKA } from "../countries/CountryD2Repository";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { generate } from "../../../domain/usecases/utils/generateYears";
import { DataElementSubstitutor } from "./builders/DataElementSubstitutor";
import { TableBuilderCoveredHealthcareByType } from "./builders/TableBuilderCoveredHealthcareByType";
import { getTableSorter } from "./sorters/TableSorter";
import { getTableLegends, getTabType, mapCellToExportedValue } from "./utils";
import { TableBuilderEntitlementsForUndocumented } from "./builders/TableBuilderEntitlementsForUndocumented";
import { mapToWhoCountryCode } from "../countries/mapToWhoCountryData";

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
    u800TAhsIBY_Cat: "User charges for covered health",
    Nx6S3aQkvWe: "Entitlements for undocumented",
};

export const REFERENCES_TAB_NAME = "References";
export const GENERAL_INFOMRATION_TAB_NAME = "General information";
export const DATE_OF_DOWNLOAD = "Date of download:";

const sortedPolicyExplorerCategoriesToDownload: Record<string, Id> = {
    populationCoverage: "uG2PbDfOc0w",
    entitlementsForUndocumented: "Nx6S3aQkvWe",
    serviceCoverage: "W4CqlzcDPB1",
    userCharges: "mCMVwmnGWJF",
    userChargesByHealthCare: "u800TAhsIBY",
    userChargesApplyByHealthCare: "u800TAhsIBY_Cat",
    voluntaryHealthInsurance: "uImM4yTeeV3",
    mainGapsInFinancedCoverage: "e6cfI6vWYEF",
    changesInCoveragePolicy: "Dg4b8bTfEIr",
};

const REFERENCES_REGEX = /\[.*?\]: <\/> ".*?"/g;
const REGEX_INSIDE_PARENTHESIS = /BIH \(([^)]+)\)/;

//DE: Basis for entitlement to publicly financed health services
const BASIS_FOR_LATEST_YEAR_AVAILABLE_DE_ID = "SQQ3ZDRbxGT";

export class PolicyExplorerD2Repository implements PolicyExplorerRepository {
    constructor(private api: D2Api) {}

    get(
        policyExplorerCategories: PolicyExplorerCategories,
        selectedCountriesIds: Id[],
        yearsByCategory: Record<string, string[]>,
        countriesAndSubregions: Country[],
        programCategories: PolicyExplorerCategory[],
        useCountryCodes?: boolean
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
            const dataSet: D2DataSet | undefined = dataSetResponse.objects[0];

            const dataValuesWithOrgUnitNames = this.populateDataValuesWithOrgUnitNames(
                dataValuesResponse.dataValues,
                countriesAndSubregions
            );

            const lastAvailableYearByCountry = this.getLastAvailableYearByCountry(
                dataSet,
                dataValuesResponse.dataValues,
                policyExplorerCategories
            );

            const dataValuesByOrgUnit = _(dataValuesWithOrgUnitNames)
                .groupBy(dataValue => dataValue.orgUnit)
                .value();

            return {
                tables: this.buildTables({
                    policyExplorerCategories,
                    dataValuesWithOrgUnitNames,
                    countriesAndSubregions: countriesAndSubregions,
                    yearsByCategory,
                    dataSet: dataSet,
                    programCategories,
                    useCountryCodes,
                    lastAvailableYearByCountry: lastAvailableYearByCountry,
                }),
                generalInfo: this.buildGeneralInfo(
                    dataValuesByOrgUnit,
                    countriesAndSubregions,
                    lastAvailableYearByCountry
                ),
                references: this.buildReferences(
                    dataValuesByOrgUnit,
                    countriesAndSubregions,
                    lastAvailableYearByCountry
                ),
            };
        });
    }

    private getLastAvailableYearByCountry(
        dataSet: D2DataSet | undefined,
        allDataValues: DataValueSetsDataValue[],
        selectedPolicyExplorerCategories: Record<string, Id[]>
    ): Map<Id, string> {
        const basisDataElementIdsForLastAvailableYear = Object.keys(selectedPolicyExplorerCategories).reduce(
            (acc: Id[], policyExplorerCategoryId: Id) => {
                const basisDataElementIdsForLatestYear = this.getBasisDataElementIdsForLatestYear(
                    policyExplorerCategoryId,
                    dataSet
                ).filter(deId => !acc.includes(deId));

                return [...acc, ...basisDataElementIdsForLatestYear];
            },
            []
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
                basisDataElementIdsForLastAvailableYear.includes(dataValue.dataElement)
            );

            return map.set(orgUnitId, dataValueWithLastYear?.period || "");
        }, new Map<Id, string>());

        return periodByOrgUnitMap;
    }

    saveToFile(
        categories: PolicyExplorerCategory[],
        policyExplorer: PolicyExplorer,
        fileName?: string
    ): FutureData<void> {
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
            const type: Tab["type"] = getTabType(category);

            if (rows?.length) {
                const dataRows = this.getDataFromRows(rows);
                return [
                    ...accTabs,
                    {
                        data: [[category?.name || categoryId], ...dataRows],
                        name: Object.keys(categoriesNameWithLessThan31Chars).includes(categoryId)
                            ? categoriesNameWithLessThan31Chars[categoryId] || categoryId
                            : category?.name || categoryId,
                        type: type,
                        legendsRow: getTableLegends(category),
                    },
                ];
            }
            return accTabs;
        }, []);

        exportToCSVWithStyles([generalInformationTab, ...tabs, referencesTab], fileName ?? FILE_NAME);
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
        const generalInfoForDownload: PolicyExplorerGeneralInfoToDownload[] = generalInfo
            .map(info => ({
                country: info.country,
                year: info.year,
                lastUpdate: info.lastUpdate ? moment(info.lastUpdate).format("D MMMM YYYY") : "",
                countryExperts: info.countryExperts,
                editors: info.editors,
                reviewers: info.reviewers,
                notes: info.notes,
                source: `${info.sourceText} ${info.sourceUrl}`,
            }))
            .sort((genA, genB) => sortByCountry(genA.country, genB.country));

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

        const referencesTab = references
            .sort((refA, refB) => sortByCountry(refA.country, refB.country))
            .reduce(
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
            const yearsToAdd = years.includes(LATEST_AVAILABLE_YEAR_CODE) ? yearsFrom2023UntilCurrent.join(",") : years;
            return accYears.concat(yearsToAdd);
        }, []);
        return _.uniq(_.sortBy(years));
    }

    private getDataFromRows(rows: PolicyExplorerCell[][]): string[][] {
        return rows.reduce((accRowsData: string[][], currentRow: PolicyExplorerCell[]) => {
            const rowData: string[] = currentRow.map(cell => mapCellToExportedValue(cell));
            return [...accRowsData, rowData];
        }, []);
    }

    private buildGeneralInfo(
        dataValuesByOrgUnit: Record<Id, DataValueSetsDataValue[]>,
        countriesAndSubregions: Country[],
        lastAvailableYearByCountry: Map<Id, string>
    ): PolicyExplorerGeneralInfo[] {
        return Object.entries(dataValuesByOrgUnit)
            .map(([orgUnitId, dataValuesOfCountry]) => {
                const countryName = this.getCountryName(orgUnitId, countriesAndSubregions);

                const latestYear = lastAvailableYearByCountry.get(orgUnitId) || "";

                const dataValuesOfCountryFilterByYear = dataValuesOfCountry.filter(dv => dv.period === latestYear);

                const sourceUrl =
                    dataValuesOfCountryFilterByYear.find(
                        dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.sourceUrl || "")
                    )?.value || "";
                const countryExperts =
                    dataValuesOfCountryFilterByYear.find(
                        dv =>
                            dv.orgUnit === orgUnitId &&
                            dv.dataElement.includes(generalDataElements.countryExperts || "")
                    )?.value || "";
                const editors =
                    dataValuesOfCountryFilterByYear.find(
                        dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.editors || "")
                    )?.value || "";
                const lastUpdate =
                    dataValuesOfCountryFilterByYear.find(
                        dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.lastUpdate || "")
                    )?.value || "";
                const reviewers =
                    dataValuesOfCountryFilterByYear.find(
                        dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.reviewers || "")
                    )?.value || "";
                const sourceText =
                    dataValuesOfCountryFilterByYear.find(
                        dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.sourceText || "")
                    )?.value || "";

                const notes =
                    dataValuesOfCountryFilterByYear.find(
                        dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.notes || "")
                    )?.value || "";

                return {
                    country: countryName,
                    sourceText,
                    sourceUrl,
                    countryExperts,
                    editors,
                    lastUpdate: lastUpdate ? new Date(lastUpdate) : undefined,
                    reviewers,
                    notes,
                    year: latestYear,
                };
            })
            .sort((genA, genB) => sortByCountry(genA.country, genB.country));
    }

    private buildTables(params: {
        policyExplorerCategories: Record<string, string[]>;
        dataValuesWithOrgUnitNames: DataValueSetsDataValueWithOrgUnitNames[];
        countriesAndSubregions: Country[];
        yearsByCategory: Record<string, string[]>;
        dataSet?: D2DataSet;
        programCategories: PolicyExplorerCategory[];
        useCountryCodes?: boolean;
        lastAvailableYearByCountry: Map<string, string>;
    }): Record<string, PolicyExplorerCell[][]> {
        const {
            policyExplorerCategories,
            dataValuesWithOrgUnitNames,
            countriesAndSubregions,
            yearsByCategory,
            dataSet,
            programCategories,
            useCountryCodes = false,
            lastAvailableYearByCountry,
        } = params;

        const deSubstitutor = dataSet
            ? new DataElementSubstitutor(dataSet.sections, PROGRAM_DATA_ELEMENT_CODE_SUBSTITUTIONS)
            : undefined;
        const substitutedDataSet =
            deSubstitutor && dataSet
                ? {
                      ...dataSet,
                      sections: dataSet.sections.map(section => ({
                          ...section,
                          dataElements: deSubstitutor.substituteSource(section.dataElements),
                      })),
                  }
                : dataSet;

        const hasToFillSubcategories = Object.keys(policyExplorerCategories).some(categoryId =>
            [
                CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES,
                CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY,
                DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
            ].includes(categoryId)
        );

        const allPolicyExplorerCategoriesAndSubcategories = hasToFillSubcategories
            ? this.fillSubcategories(policyExplorerCategories)
            : policyExplorerCategories;

        const tables = {};

        return Object.entries(allPolicyExplorerCategoriesAndSubcategories).reduce(
            (accTables, [policyExplorerCategoryId, policyExplorerSubcategoriesIds]) => {
                const tableBuilder = getTableBuilder(policyExplorerCategoryId);
                const tableSorter = getTableSorter(policyExplorerCategoryId);

                const columns = tableBuilder.buildColumns({
                    policyExplorerCategoryId,
                    policyExplorerSubcategoriesIds,
                    programCategories,
                    dataSet,
                });

                const years = yearsByCategory[policyExplorerCategoryId] || [];
                const yearsIsLatestAvailableYear = years.length === 1 && years[0] === LATEST_AVAILABLE_YEAR_CODE;

                const finalDataValues = yearsIsLatestAvailableYear
                    ? this.filterDataValuesByPeriod(lastAvailableYearByCountry, dataValuesWithOrgUnitNames)
                    : _.orderBy(
                          dataValuesWithOrgUnitNames,
                          ["orgUnitShortName", "period"],
                          ["asc", policyExplorerCategoryId === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID ? "desc" : "asc"]
                      );

                const sortedDataValues = finalDataValues.sort((dvA, dvB) =>
                    sortByCountry(dvA.orgUnitShortName, dvB.orgUnitShortName)
                );

                const dataValuesByCountryAndYear = _(sortedDataValues)
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

                        const orgUnitNameInCell = this.isCountryAlreadyInRows(
                            accRows,
                            countriesAndSubregions,
                            orgUnit,
                            useCountryCodes
                        )
                            ? EMPTY_DATA
                            : this.getCountryName(orgUnit, countriesAndSubregions, useCountryCodes);
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
                            dataSet: substitutedDataSet,
                        });
                    },
                    []
                );

                const tableWithFilteredColumns = tableSorter.cleanAndSort(columns, rows);

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
        countriesAndSubregions: Country[],
        orgUnit: Id,
        useCountryCodes = false
    ): boolean {
        const orgUnitName = this.getCountryName(orgUnit, countriesAndSubregions, useCountryCodes);
        return (
            !!orgUnitName && !!accRows?.find((row: PolicyExplorerCell[]) => !!row[0] && row[0]?.value === orgUnitName)
        );
    }

    private fillSubcategories(policyExplorerCategories: Record<string, string[]>): Record<string, string[]> {
        return Object.keys(policyExplorerCategories).reduce((acc, categoryId) => {
            switch (categoryId) {
                case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES:
                    return {
                        ...acc,
                        [categoryId]: TableBuilderByTypeOfHealthcare.fillSubcategories(
                            policyExplorerCategories[categoryId]
                        ),
                    };
                case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY:
                    return {
                        ...acc,
                        [categoryId]: TableBuilderCoveredHealthcareByType.fillSubcategories(
                            policyExplorerCategories[categoryId]
                        ),
                    };
                case DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY:
                    return {
                        ...acc,
                        [categoryId]: TableBuilderEntitlementsForUndocumented.fillSubcategories(
                            policyExplorerCategories[categoryId]
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

    private buildReferences(
        dataValuesByOrgUnit: Record<Id, DataValueSetsDataValue[]>,
        countriesAndSubregions: Country[],
        lastAvailableYearByCountry: Map<Id, string>
    ): PolicyExplorerReferences[] {
        return Object.entries(dataValuesByOrgUnit).map(([orgUnitId, dataValues]) => {
            const country = this.getCountryName(orgUnitId, countriesAndSubregions);
            const references =
                dataValues.find(
                    dv =>
                        dv.dataElement.includes(generalDataElements.references || "") &&
                        dv.period === (lastAvailableYearByCountry.get(orgUnitId) || "")
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
        countriesAndSubregions: Country[]
    ): DataValueSetsDataValueWithOrgUnitNames[] {
        return dataValues.map(dataValue => ({
            ...dataValue,
            orgUnitShortName: this.getCountryName(dataValue.orgUnit, countriesAndSubregions),
        }));
    }

    private getCountryName(orgUnitId: Id, countriesAndSubregions: Country[], useCountryCodes = false): string {
        const orgUnit = countriesAndSubregions.find(country => country.id === orgUnitId);
        const orgUnitName = useCountryCodes ? orgUnit?.code : orgUnit?.name;
        const orgUnitNameBIH =
            useCountryCodes && orgUnit?.code
                ? mapToWhoCountryCode(orgUnit?.code)
                : `Bosnia and Herzegovina (${orgUnitName?.match(REGEX_INSIDE_PARENTHESIS)?.[1]})` || "";
        return orgUnitId === REPUBLICA_SERPSKA || orgUnitId === FEDERACIJA_BOSNE_I_HERCEGOVINE
            ? orgUnitNameBIH
            : orgUnitName || EMPTY_DATA;
    }

    private _filterDataValuesByLatestAvailableYear<T extends DataValueSetsDataValue>(
        basisDataElementIdsForLatestYear: Id[],
        dataValues: T[]
    ): T[] {
        const byOrgUnit = _(dataValues).groupBy("orgUnit").value();

        return _(byOrgUnit)
            .flatMap(orgUnitDataValues => {
                const latestPeriod = _(orgUnitDataValues)
                    .filter(dv => basisDataElementIdsForLatestYear.includes(dv.dataElement))
                    .map(dv => +dv.period)
                    .max();

                if (!latestPeriod) {
                    return orgUnitDataValues;
                }
                return orgUnitDataValues.filter(dv => +dv.period === latestPeriod);
            })
            .value();
    }

    private filterDataValuesByPeriod<T extends DataValueSetsDataValue>(
        lastAvailableYearByCountry: Map<string, string>,
        dataValues: T[]
    ): T[] {
        const byOrgUnit = _(dataValues).groupBy("orgUnit").value();

        return _(byOrgUnit)
            .flatMap(orgUnitDataValues => {
                return orgUnitDataValues.filter(dv => {
                    const lastAvailableYear = lastAvailableYearByCountry.get(dv.orgUnit);
                    return dv.period === lastAvailableYear;
                });
            })
            .value();
    }

    private getBasisDataElementIdsForLatestYear(policyExplorerCategoryId: string, dataSet?: D2DataSet): Id[] {
        switch (policyExplorerCategoryId) {
            //specific basis for last year is only applicable to regional page for the following tables
            //following categories are only visible in regional page
            case CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY:
                return (
                    dataSet?.sections
                        .find(section => section.id === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES)
                        ?.dataElements.map(de => de.id) || []
                );
            case DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY:
                return (
                    dataSet?.sections
                        .find(section => section.id === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY)
                        ?.dataElements.map(de => de.id) || []
                );
            default:
                return [BASIS_FOR_LATEST_YEAR_AVAILABLE_DE_ID];
        }
    }
}

const dataSetFields = {
    sections: {
        id: true,
        displayName: true,
        dataElements: { id: true, code: true, formName: true, valueType: true, description: true },
    },
} as const;

export type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

type DataValueSetsDataValueWithOrgUnitNames = DataValueSetsDataValue & {
    orgUnitShortName: string;
};
