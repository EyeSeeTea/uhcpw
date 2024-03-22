import { Future, FutureData } from "../../../domain/entities/Future";
import {
    PolicyExplorerCategory,
    PolicyExplorerSubcategory,
} from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerCategoryRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { InmemoryCache } from "../../cache/InmemoryCache";
import { getInfoNotes, InfoNotes } from "../../common/getInfoNotes";
import {
    CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES,
    CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES,
} from "./builders/TableBuilderChangesInCoveragePolicy";

export const CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID = {
    UP_TO_AND_INCLUDING_2019: "FtRwT2aBET4",
    SINCE_2020: "Dg4b8bTfEIr",
};

const sectionsWithValueTypeText = [
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.SINCE_2020,
];

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

export class PolicyExplorerCategoryD2Repository implements PolicyExplorerCategoryRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    getAll(): FutureData<PolicyExplorerCategory[]> {
        return Future.joinObj({
            datasets: apiToFuture(
                this.api.models.dataSets.get({
                    fields: dataSetFields,
                    filter: { id: { eq: policyExplorerDataSet_ID } },
                })
            ),
            infoNotes: this.cache.getOrFuture("infoNotes", getInfoNotes(this.api)),
        }).flatMap(({ datasets, infoNotes }) => {
            const dataSet = datasets.objects[0];

            if (dataSet) {
                return Future.success(this.buildCategories(dataSet, infoNotes));
            } else {
                return Future.error("No categories found");
            }
        });
    }

    private buildCategories(data: D2DataSet, infoNotes: InfoNotes): PolicyExplorerCategory[] {
        const sections = data?.sections.filter(section => sectionsList.includes(section.id)) || [];
        return sections.map(section => {
            const notes = infoNotes ? infoNotes[section.id] || "" : "";

            return {
                id: section.id,
                name: section.displayName.replace("UHCW_", ""),
                subcategories: this.getSubcategories(section.id, section.dataElements),
                description: notes,
            };
        });
    }

    private getSubcategories(sectionId: string, dataElements?: D2DataElements[]): PolicyExplorerSubcategory[] {
        const subcategories = dataElements
            ?.filter(
                de =>
                    de.valueType === "LONG_TEXT" ||
                    (sectionsWithValueTypeText.includes(sectionId) && de.valueType === "TEXT")
            )
            .map(subcategory => {
                return sectionId === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019 ||
                    sectionId === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.SINCE_2020
                    ? this.getFirstSubcategoryOfGroup(sectionId, subcategory)
                    : {
                          id: subcategory.id,
                          name: subcategory.description || subcategory.formName,
                      };
            })
            .filter(Boolean);
        return (subcategories as PolicyExplorerSubcategory[]) || [];
    }

    private getFirstSubcategoryOfGroup(
        sectionId: string,
        subcategory: D2DataElements
    ): PolicyExplorerSubcategory | undefined {
        const changesInCoveragePolicyGroupedSubcategories =
            sectionId === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019
                ? CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES
                : CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES;

        const subcategoryFound = Object.values(changesInCoveragePolicyGroupedSubcategories).some(
            subcategoryIds => subcategoryIds.includes(subcategory.id) && subcategoryIds[0] === subcategory.id
        );
        if (subcategoryFound) {
            return {
                id: subcategory.id,
                name: subcategory.description || subcategory.formName,
            };
        }
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
