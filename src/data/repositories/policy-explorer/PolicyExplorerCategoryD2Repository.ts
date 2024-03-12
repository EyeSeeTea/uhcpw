import { FutureData, Future } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    PolicyExplorerCategory,
    PolicyExplorerSelectCategoryInfo,
    PolicyExplorerSubcategory,
} from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerCategoryRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
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

const selectCategoryInfoProgram = "ai5rB7mcqHH";

const selectCategoryInfoDataElements: Record<string, Id> = {
    title: "yEaMMB7MXqI",
    text: "SAzOXqrxWfI",
};

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

    getSelectCategoryInfo(): FutureData<PolicyExplorerSelectCategoryInfo> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: selectCategoryInfoProgram,
            })
        ).flatMap(response => {
            if (response.events[0]) {
                return Future.success(this.buildSelectCategoryInfo(response.events[0]));
            }
            return Future.error("An error has ocurred fetching Select Category Info");
        });
    }

    private buildSelectCategoryInfo(event: D2Event): PolicyExplorerSelectCategoryInfo {
        return {
            title: event?.dataValues?.find(dv => dv.dataElement === selectCategoryInfoDataElements.title)?.value || "",
            text: event?.dataValues?.find(dv => dv.dataElement === selectCategoryInfoDataElements.text)?.value || "",
        };
    }

    private buildCategories(data?: D2DataSet): PolicyExplorerCategory[] {
        const sections = data?.sections.filter(section => sectionsList.includes(section.id)) || [];
        return sections.map(section => ({
            id: section.id,
            name: section.displayName.replace("UHCW_", ""),
            subcategories: this.getSubcategories(section.id, section.dataElements),
            description: section.description,
        }));
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

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

type D2DataElements = MetadataPick<{
    dataElements: { fields: typeof dataElementsFields };
}>["dataElements"][number];

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

interface DataValue {
    dataElement: string;
    value: string;
}
