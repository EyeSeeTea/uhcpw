import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    PolicyExplorerCategory,
    PolicyExplorerSelectableCategory,
    PolicyExplorerSelectCategoryInfo,
    PolicyExplorerSubcategory,
    PolicyExplorerGroupCategory,
} from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerCategoryRepository";
import { policyExplorerProgram_ID } from "../utils";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { getMainPagesContent } from "../common/getMainPagesContent";
import { InmemoryCache } from "../../cache/InmemoryCache";
import { getInfoNotes, InfoNotes } from "../../common/getInfoNotes";
import _ from "lodash";
import { DataElementSubstitutor } from "./builders/DataElementSubstitutor";
import { TYPES_OF_HEALTH_CARE } from "./builders/TableBuilderByTypeOfHealthcare";
import { USER_CHARGES_APPLY_TYPES_OF_HEALTH_CARE } from "./builders/TableBuilderCoveredHealthcareByType";
import { Maybe } from "../../../types/utils";
import { policyExplorerDataSet_ID } from "../common/getPolicyExplorerDataValues";
import { ENTITLEMENTS_FOR_UNDOCUMENTED_DATA_ELEMENT_SECTION_IDS } from "./builders/TableBuilderEntitlementsForUndocumented";

export const CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID = "Dg4b8bTfEIr";
const CHANGES_AREA_CATEGORY_OPTIONSET = "po0HzvS3s3w";

// NOTICE: This is hardcoded because this is not a section in metadata
export const COMPARATIVE_POLICY_CHARTS_CATEGORY_GROUP_ID = "COMPARATIVE_POLICY_CHARTS_CATEGORY_GROUP_ID";

export const CATEGORY_BY_TYPE_OF_HEALTHCARE = {
    USER_CHARGES: "u800TAhsIBY",
    TYPES_OF_USER_CHARGES: "lHk8jtKonPh",
    // not a section in dataset or program event. Programmatically created and handled based on USER_CHARGES
    USER_CHARGES_APPLY: "u800TAhsIBY_Cat",
};

const PROGRAM_CODE_TO_DATA_ELEMENT_CODE = {
    UHCW_PE_PopCov_A_BasisEntit_Name: "basis_entit_pub_financed",
    UHCW_PE_PopCov_B_EntitRefug_Name: "entit_asylum_refu",
    UHCW_PE_PopCov_C_CharacNumber_Name: "characteristics_noncov",
    UHCW_PE_PopCov_D_PublicFin_Name: "pub_financed_noncov",
    UHCW_PE_PopCov_E_AdminReq_Name: "admin_required_text",
    UHCW_PE_PopCov_F_InstitResp_Name: "institutions_define_entit",
    UHCW_PE_PopCov_G_InstitMonit_Name: "institutions_monitor_cover_info",
    UHCW_PE_PopCov_H_MainGaps_Name: "gaps_pop_cover_info",
    UHCW_PE_PopCov_I_VHIRole_Name: "VHI_role",
    UHCW_PE_ServCov_A_InstitProc_Name: "institutions_defining_benefits",
    UHCW_PE_ServCov_B_VariaPub_Name: "variation_pub_financed_benefits",
    UHCW_PE_ServCov_C_TypeHC_Name: "hc_not_well_cover",
    UHCW_PE_ServCov_D_RetroReimb_Name: "retrospective_reimbursem",
    UHCW_PE_ServCov_E_PathCov_Name: "pathway_covered",
    UHCW_PE_ServCov_F_WaitIssue_Name: "wait_time_issue_info_text",
    UHCW_PE_ServCov_G_WaitGaran_Name: "wait_time_target_info",
    UHCW_PE_ServCov_H_OtherPol_Name: "wait_time_policies_info",
    UHCW_PE_ServCov_I_InstitWait_Name: "institutions_monitoring_w",
    UHCW_PE_ServCov_J_InfPay_Name: "inf_pay_issue_info_text",
    UHCW_PE_ServCov_K_ReasInf_Name: "inf_pay_reasons",
    UHCW_PE_ServCov_L_PolRed_Name: "inf_pay_reduction",
    UHCW_PE_ServCov_M_InstInf_Name: "institutions_monitor_inf_pay",
    UHCW_PE_ServCov_N_OtherIss_Name: "access_issues",
    UHCW_PE_ServCov_O_MainGaps_Name: "gaps_service_cover",
    UHCW_PE_ServCov_P_VHIRole_Name: "VHI_cover_service_info",
    UHCW_PE_UserCharges_A_RoleNat_Name: "role_user_charges",
    UHCW_PE_UserCharges_B_MechProt_Name: "meachanisms_to_protect",
    UHCW_PE_UserCharges_C_ProtMechAuto_Name: "automatic_protect_mechanisms_info",
    UHCW_PE_UserCharges_D_ProtMechTarget_Name: "protect_mech_target_text",
    UHCW_PE_UserCharges_E_InstitResp_Name: "institutions_set_charges",
    UHCW_PE_UserCharges_F_VarCharges_Name: "variation_in_user",
    UHCW_PE_UserCharges_G_MainGaps_Name: "user_charges_main_gaps",
    UHCW_PE_UserCharges_H_VHIRole_Name: "VHI_cover_copay_info",
    UHCW_PE_VolHeaIns_A_VHIRole_Name: "vhi_roles",
    UHCW_PE_VolHeaIns_B_SharePop_Name: "share_pop_covered",
    UHCW_PE_VolHeaIns_C_VHIShare_Name: "share_vhi_health",
    UHCW_PE_VolHeaIns_D_InstitResp_Name: "insititutions_respons_VHI",
    UHCW_PE_VolHeaIns_E_CharacVHI_Name: "characteristics_ppl_VIH",
    UHCW_PE_VolHeaIns_F_PolicAccess_Name: "policies_vhi_accessible",
    UHCW_PE_VolHeaIns_G_PolicAfford_Name: "policies_vhi_affordable",
    UHCW_PE_VolHeaIns_H_EntitSell_Name: "entities_sell_vhi",
    UHCW_PE_VolHeaIns_I_EntitBuy_Name: "entities_buy_vhi",
    UHCW_PE_VolHeaIns_J_TaxIncent_Name: "tax_incentives_desincentives_vhi",
    UHCW_PE_MainGaps_A_PopCov_Name: "population_entitlement_main_gaps",
    UHCW_PE_MainGaps_B_ServCov_Name: "service_coverage_main_gaps",
    UHCW_PE_MainGaps_C_UserCharges_Name: "user_charges_gaps",
};

export const PROGRAM_DATA_ELEMENT_CODE_SUBSTITUTIONS = {
    [PROGRAM_CODE_TO_DATA_ELEMENT_CODE.UHCW_PE_MainGaps_A_PopCov_Name]:
        PROGRAM_CODE_TO_DATA_ELEMENT_CODE.UHCW_PE_PopCov_H_MainGaps_Name,
    [PROGRAM_CODE_TO_DATA_ELEMENT_CODE.UHCW_PE_MainGaps_B_ServCov_Name]:
        PROGRAM_CODE_TO_DATA_ELEMENT_CODE.UHCW_PE_ServCov_O_MainGaps_Name,
    [PROGRAM_CODE_TO_DATA_ELEMENT_CODE.UHCW_PE_MainGaps_C_UserCharges_Name]:
        PROGRAM_CODE_TO_DATA_ELEMENT_CODE.UHCW_PE_UserCharges_G_MainGaps_Name,
};

const DATASET_POPULATION_COVERAGE_CATEGORY = "uG2PbDfOc0w";
const DATASET_SERVICE_COVERAGE_CATEGORY = "W4CqlzcDPB1";
const DATASET_VOLUNTARY_HEALTH_INSURANCE_CATEGORY = "uImM4yTeeV3";
const DATASET_GAPS_IN_COVERAGE_CATEGORY = "e6cfI6vWYEF";
const DATASET_USER_CHARGES_COPAYMENTS_CATEGORY = "mCMVwmnGWJF";
export const DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY = "Nx6S3aQkvWe";

// Program is used to get text and order of each sections
const PROGRAM_POPULATION_COVERAGE_CATEGORY = "r2HbF3XTeMG";
const PROGRAM_SERVICE_COVERAGE_CATEGORY = "j53ZTUutgtC";
const PROGRAM_VOLUNTARY_HEALTH_INSURANCE_CATEGORY = "fqYkOLq51CG";
const PROGRAM_GAPS_IN_COVERAGE_CATEGORY = "Ex9yvYNHvC4";
const PROGRAM_USER_CHARGES_COPAYMENTS_CATEGORY = "R09wRQllQ4m";

const CATEGORY_DATASET_TO_PROGRAM = {
    [DATASET_POPULATION_COVERAGE_CATEGORY]: PROGRAM_POPULATION_COVERAGE_CATEGORY,
    [DATASET_SERVICE_COVERAGE_CATEGORY]: PROGRAM_SERVICE_COVERAGE_CATEGORY,
    [DATASET_VOLUNTARY_HEALTH_INSURANCE_CATEGORY]: PROGRAM_VOLUNTARY_HEALTH_INSURANCE_CATEGORY,
    [DATASET_GAPS_IN_COVERAGE_CATEGORY]: PROGRAM_GAPS_IN_COVERAGE_CATEGORY,
    [DATASET_USER_CHARGES_COPAYMENTS_CATEGORY]: PROGRAM_USER_CHARGES_COPAYMENTS_CATEGORY,
};

const sectionsList = [
    DATASET_POPULATION_COVERAGE_CATEGORY,
    DATASET_SERVICE_COVERAGE_CATEGORY,
    DATASET_USER_CHARGES_COPAYMENTS_CATEGORY,
    DATASET_GAPS_IN_COVERAGE_CATEGORY,
    DATASET_VOLUNTARY_HEALTH_INSURANCE_CATEGORY,
    CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES,
    // CATEGORY_BY_TYPE_OF_HEALTHCARE.TYPES_OF_USER_CHARGES,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
];

const selectCategoryInfoDataElements: Record<string, Id> = {
    title: "yEaMMB7MXqI",
    text: "SAzOXqrxWfI",
};

const CATEGORIES_ONLY_IN_REGIONAL_PAGE: string[] = [];

const CATEGORIES_ALSO_IN_REGIONAL_PAGE: string[] = [
    CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
];

export class PolicyExplorerCategoryD2Repository implements PolicyExplorerCategoryRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    getAll(isRegionalPage?: boolean): FutureData<PolicyExplorerCategory[]> {
        return Future.joinObj({
            datasets: apiToFuture(
                this.api.models.dataSets.get({
                    fields: dataSetFields,
                    filter: { id: { eq: policyExplorerDataSet_ID } },
                })
            ),
            infoNotes: this.cache.getOrFuture("infoNotes", getInfoNotes(this.api)),
            programMetadata: apiToFuture(
                this.api.models.programs.get({
                    fields: programFields,
                    filter: { id: { eq: policyExplorerProgram_ID } },
                })
            ),
            sectionsEvent: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: policyExplorerProgram_ID,
                })
            ),
            changesAreaCategoryOptionSet: apiToFuture(
                this.api.models.optionSets.get({
                    fields: optionSetFields,
                    filter: { id: { eq: CHANGES_AREA_CATEGORY_OPTIONSET } },
                })
            ),
        }).flatMap(({ datasets, infoNotes, programMetadata, sectionsEvent, changesAreaCategoryOptionSet }) => {
            const dataSet = datasets.objects[0];
            const programs = programMetadata.objects[0];
            const events = sectionsEvent.events[0];
            const changesAreaTypeOptions = changesAreaCategoryOptionSet?.objects[0];

            if (dataSet && programs && events) {
                const categories = this.buildCategories(programs, events, dataSet, infoNotes, changesAreaTypeOptions);
                return Future.success(this.filterCategoriesByPage(categories, isRegionalPage));
            } else {
                return Future.error("No categories found");
            }
        });
    }

    getSelectCategoryInfo(): FutureData<PolicyExplorerSelectCategoryInfo> {
        return getMainPagesContent(this.api).map(dataValues => this.buildSelectCategoryInfo(dataValues));
    }

    private buildSelectCategoryInfo(dataValues: DataValue[]): PolicyExplorerSelectCategoryInfo {
        return {
            title: dataValues.find(dv => dv.dataElement === selectCategoryInfoDataElements.title)?.value || "",
            text: dataValues.find(dv => dv.dataElement === selectCategoryInfoDataElements.text)?.value || "",
        };
    }

    private sortSubcategories(
        sectionDataElements: { id: string; code: string }[],
        sectionsEvent: D2Event | undefined,
        dataSetSections: { id: string; code: string }[]
    ): PolicyExplorerSubcategory[] {
        const subcategories = _(sectionsEvent?.dataValues)
            .map(subcategory => {
                const sectionDataElement = _(sectionDataElements).find({ id: subcategory.dataElement });
                if (!sectionDataElement) {
                    return undefined;
                }
                return { ...sectionDataElement, name: subcategory.value };
            })
            .compact()
            .value();

        // Find the order object and extract the order
        const orderArray = subcategories?.find(subcategorie => subcategorie.code?.endsWith("_Order"))?.name.split(";");
        if (!orderArray) {
            throw new Error("Order object not found");
        }

        // Sort the data according to the custom order
        const sortedSubcategories = _(subcategories)
            .filter(subcategory => !subcategory.code?.endsWith("_Order")) // Exclude sectionData ending with "_Order"
            .sortBy(subcategory => {
                const match = subcategory.code?.match(/_([A-Z])_/);
                if (match && match[1]) {
                    return orderArray.indexOf(match[1]);
                }
                return Number.MAX_SAFE_INTEGER; // Place objects without a match at the end
            })
            .map(subcategory => {
                const id = _.find(dataSetSections, {
                    code: PROGRAM_CODE_TO_DATA_ELEMENT_CODE[subcategory.code as DataElementCode],
                })?.id;

                if (!id) {
                    return undefined;
                }
                return {
                    id,
                    name: subcategory.name,
                };
            })
            .compact()
            .value();

        return sortedSubcategories;
    }

    private buildCategories(
        programMetadata: D2Program | undefined,
        sectionsEvent: D2Event | undefined,
        dataSet: D2DataSet | undefined,
        infoNotes: InfoNotes,
        changesAreaTypeOptions: D2OptionSet | undefined
    ): PolicyExplorerCategory[] {
        const dataSetSections = dataSet?.sections.filter(section => sectionsList.includes(section.id)) || [];
        const programSections = programMetadata?.programStages[0]?.programStageSections || [];

        const changesInCoveragePolicyMergedCategory = this.getChangesInCoveragePolicyMergedCategory(
            infoNotes,
            changesAreaTypeOptions
        );
        const comparativePolicyChartsCategory = this.getComparativePolicyChartsCategories(infoNotes);

        const deSubstitutor = new DataElementSubstitutor(dataSetSections, PROGRAM_DATA_ELEMENT_CODE_SUBSTITUTIONS);

        return [
            comparativePolicyChartsCategory,
            ...dataSetSections
                .filter(({ id }) => CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID !== id)
                .flatMap((section): PolicyExplorerCategory[] => {
                    const notes = infoNotes[section.id] || "";

                    // To prevent fallback on dataSet if section is not in program
                    const sectionFallback = {
                        displayName: section.displayName.replace("UHCW_", ""),
                        dataElements: section.dataElements,
                    };

                    const { displayName, dataElements } =
                        _.find(programSections, {
                            id: CATEGORY_DATASET_TO_PROGRAM[section.id as keyof typeof CATEGORY_DATASET_TO_PROGRAM],
                        }) || sectionFallback;

                    const subDataElements = deSubstitutor.substituteSource(section.dataElements);

                    if (section.id === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES) {
                        return [
                            {
                                id: section.id,
                                name: displayName.replace("Policy Explorer - ", ""),
                                subcategories: TYPES_OF_HEALTH_CARE.map(type => ({ id: type, name: type })),
                                description: notes,
                                type: "selectable",
                            },
                        ];
                    }

                    return [
                        {
                            id: section.id,
                            name: displayName.replace("Policy Explorer - ", ""),
                            subcategories: this.sortSubcategories(dataElements, sectionsEvent, subDataElements),
                            description: notes,
                            type: "selectable",
                        },
                    ];
                }),
            changesInCoveragePolicyMergedCategory,
        ];
    }

    private getChangesInCoveragePolicyMergedCategory(
        infoNotes: InfoNotes,
        changesAreaTypeOptions: Maybe<D2OptionSet>
    ): PolicyExplorerCategory {
        const notes = infoNotes ? infoNotes[CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID] || "" : "";

        const changesInCoveragePolicyMergedCategory: PolicyExplorerCategory = {
            id: CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
            name: "Changes in coverage policy",
            subcategories:
                changesAreaTypeOptions?.options.map(({ name, code }) => ({
                    id: code,
                    name: name,
                })) ?? [],
            description: notes,
            type: "selectable",
        };
        return changesInCoveragePolicyMergedCategory;
    }

    private getComparativePolicyChartsCategories(infoNotes: InfoNotes): PolicyExplorerGroupCategory {
        const categories: PolicyExplorerSelectableCategory[] = [
            {
                id: DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
                name: "Entitlements for undocumented migrants",
                subcategories: Object.entries(ENTITLEMENTS_FOR_UNDOCUMENTED_DATA_ELEMENT_SECTION_IDS).map(
                    ([title, id]) => ({
                        id: id,
                        name: title,
                    })
                ),
                description: infoNotes[DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY] || "",
                type: "selectable",
            },
            {
                id: CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY,
                name: "User charges (co-payments) for covered health care by type of care",
                subcategories: USER_CHARGES_APPLY_TYPES_OF_HEALTH_CARE.map(type => ({
                    id: type,
                    name: type,
                })),
                description: infoNotes[CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY] || "",
                type: "selectable",
            },
        ];

        const comparativePolicyChartsCategory: PolicyExplorerGroupCategory = {
            id: COMPARATIVE_POLICY_CHARTS_CATEGORY_GROUP_ID,
            name: "Comparative policy charts",
            categories: categories,
            description: "",
            type: "group",
        };
        return comparativePolicyChartsCategory;
    }

    private filterCategoriesByPage(
        categories: PolicyExplorerCategory[],
        isRegionalPage?: boolean
    ): PolicyExplorerCategory[] {
        const allowedRegionalCategories = [...CATEGORIES_ALSO_IN_REGIONAL_PAGE, ...CATEGORIES_ONLY_IN_REGIONAL_PAGE];

        return categories
            .map(category => {
                if (category.type === "group") {
                    const filteredChildren = category.categories.filter(child =>
                        isRegionalPage
                            ? allowedRegionalCategories.includes(child.id)
                            : !CATEGORIES_ONLY_IN_REGIONAL_PAGE.includes(child.id)
                    );

                    if (filteredChildren.length === 0) {
                        return undefined;
                    }

                    return {
                        ...category,
                        categories: filteredChildren,
                    };
                }

                const shouldInclude = isRegionalPage
                    ? allowedRegionalCategories.includes(category.id)
                    : !CATEGORIES_ONLY_IN_REGIONAL_PAGE.includes(category.id);

                return shouldInclude ? category : undefined;
            })
            .filter((category): category is PolicyExplorerCategory => category !== undefined);
    }
}

const dataElementsFields = {
    id: true,
    formName: true,
    valueType: true,
    description: true,
    code: true,
} as const;

const dataSetFields = {
    sections: { id: true, displayName: true, dataElements: dataElementsFields, description: true },
} as const;

const programFields = {
    id: true,
    programStages: {
        id: true,
        programStageSections: {
            id: true,
            displayName: true,
            dataElements: {
                id: true,
                code: true,
            },
        },
    },
} as const;

const eventsFields = {
    event: true,
    orgUnit: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

const optionSetFields = { options: { code: true, name: true } } as const;

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

type D2Program = MetadataPick<{
    programs: { fields: typeof programFields };
}>["programs"][number];

export interface D2Event {
    event: string;
    orgUnit: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}

type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetFields };
}>["optionSets"][number];

type DataElementCode = keyof typeof PROGRAM_CODE_TO_DATA_ELEMENT_CODE;
