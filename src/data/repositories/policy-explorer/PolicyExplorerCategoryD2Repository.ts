import { FutureData } from "../../../domain/entities/Future";
import {
    PolicyExplorerCategory,
    PolicyExplorerSubcategory,
} from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerCategoryRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, D2SectionSchema, MetadataPick, SelectedPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export const CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID = {
    UP_TO_AND_INCLUDING_2019: "FtRwT2aBET4",
    SINCE_2020: "Dg4b8bTfEIr",
};

export const CATEGORY_BY_TYPE_OF_HEALTHCARE = {
    USER_CHARGES: "u800TAhsIBY",
    TYPES_OF_USER_CHARGES: "lHk8jtKonPh",
};

const POPULATION_COVERAGE_CATEGORY = "uG2PbDfOc0w";
const SERVICE_COVERAGE_CATEGORY = "W4CqlzcDPB1";
const VOLUNTARY_HEALTH_INSURANCE_CATEGORY = "uImM4yTeeV3";
const GAPS_IN_COVERAGE_CATEGORY = "e6cfI6vWYEF";
const USER_CHARGES_COPAYMENTS_CATEGORY = "mCMVwmnGWJF";

const sectionsList = [
    POPULATION_COVERAGE_CATEGORY,
    SERVICE_COVERAGE_CATEGORY,
    USER_CHARGES_COPAYMENTS_CATEGORY,
    GAPS_IN_COVERAGE_CATEGORY,
    VOLUNTARY_HEALTH_INSURANCE_CATEGORY,
    CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES,
    // CATEGORY_BY_TYPE_OF_HEALTHCARE.TYPES_OF_USER_CHARGES,
    ...Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID),
];

export const CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID = "CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID";

export class PolicyExplorerCategoryD2Repository implements PolicyExplorerCategoryRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<PolicyExplorerCategory[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { eq: policyExplorerDataSet_ID } },
            })
        ).map(response => {
            return this.buildCategories(response.objects[0]);
        });
    }

    private buildCategories(data?: D2DataSet): PolicyExplorerCategory[] {
        const sections = data?.sections.filter(section => sectionsList.includes(section.id)) || [];
        const changesInCoveragePolicyMergedCategory = this.getChangesInCoveragePolicyMergedCategory(sections);

        return [
            ...sections
                .filter(({ id }) => !Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID).includes(id))
                .map(section => ({
                    id: section.id,
                    name: section.displayName.replace("UHCW_", ""),
                    subcategories:
                        CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES === section.id
                            ? []
                            : this.getSubcategories(section.id, section.dataElements),
                    description: section.description,
                })),
            changesInCoveragePolicyMergedCategory,
        ];
    }

    private getChangesInCoveragePolicyMergedCategory(sections: Sections): PolicyExplorerCategory {
        const changesInCoveragePolicyMergedCategory: PolicyExplorerCategory = {
            id: CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID,
            name: "Changes in coverage policy",
            subcategories: [],
            description:
                sections.find(({ id }) => id === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019)
                    ?.description || "",
        };
        return changesInCoveragePolicyMergedCategory;
    }

    private getSubcategories(sectionId: string, dataElements?: D2DataElements[]): PolicyExplorerSubcategory[] {
        const subcategories = dataElements
            ?.filter(de => de.valueType === "LONG_TEXT")
            .map(subcategory => {
                return {
                    id: subcategory.id,
                    name: subcategory.description || subcategory.formName,
                };
            })
            .filter(Boolean);
        return (subcategories as PolicyExplorerSubcategory[]) || [];
    }
}

const dataElementsFields = {
    id: true,
    formName: true,
    valueType: true,
    description: true,
} as const;

const dataSetFields = {
    sections: { id: true, displayName: true, dataElements: dataElementsFields, description: true },
} as const;

type D2DataElements = MetadataPick<{
    dataElements: { fields: typeof dataElementsFields };
}>["dataElements"][number];

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

type Sections = SelectedPick<
    D2SectionSchema,
    {
        readonly id: true;
        readonly displayName: true;
        readonly dataElements: {
            readonly id: true;
            readonly formName: true;
            readonly valueType: true;
            readonly description: true;
        };
        readonly description: true;
    }
>[];
