import { Future, FutureData } from "../../../domain/entities/Future";
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
import { getMainPagesContent } from "../common/getMainPagesContent";
import { InmemoryCache } from "../../cache/InmemoryCache";
import { getInfoNotes, InfoNotes } from "../../common/getInfoNotes";
import _ from "lodash";

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

const selectCategoryInfoDataElements: Record<string, Id> = {
    title: "yEaMMB7MXqI",
    text: "SAzOXqrxWfI",
};

// TODO id
export const policyExplorerProgram = "Ik70ZvT77Ee";
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
            programMetadata: apiToFuture(
                this.api.models.programs.get({
                    fields: programFields,
                    filter: { id: { eq: policyExplorerProgram } },
                })
            ),

            sectionsEvent: apiToFuture(
                this.api.events.get({
                    fields: eventsFields,
                    skipPaging: true,
                    program: policyExplorerProgram,
                })
            ),
        }).flatMap(({ datasets, infoNotes, programMetadata, sectionsEvent }) => {
            const dataSet = datasets.objects[0];
            const programs = programMetadata.objects[0];
            const events = sectionsEvent.events[0];
            console.log({ dataSet, programs, events });
            if (dataSet) {
                console.log({
                    oldRes: this.buildCategories(dataSet, infoNotes),
                    newRes: this.buildCategoriesNew(programs, events, infoNotes),
                });
                return Future.success(this.buildCategoriesNew(programs, events, infoNotes));
                // return Future.success(this.buildCategories(dataSet, infoNotes));
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
        sectionsEvent: D2Event | undefined
    ): PolicyExplorerSubcategory[] {
        const sectionDataElementsIds = sectionDataElements.map(({ id }) => id);
        // .filter(de => de.valueType === "LONG_TEXT")
        const subcategories = sectionsEvent?.dataValues
            .filter(e => sectionDataElementsIds.includes(e.dataElement))
            .map(e => {
                const { code, id } = _(sectionDataElements).find({ id: e.dataElement }) || { id: "", code: "" };
                return {
                    id,
                    code,
                    name: e.value,
                };
            });

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
            .map(({ id, name }) => ({ id, name }))
            .value();

        return sortedSubcategories;
    }

    private buildCategoriesNew(
        programMetadata: D2Program | undefined,
        sectionsEvent: D2Event | undefined,
        infoNotes: InfoNotes
    ): PolicyExplorerCategory[] {
        const sections = programMetadata?.programStages[0]?.programStageSections || [];
        const changesInCoveragePolicyMergedCategory = this.getChangesInCoveragePolicyMergedCategory(infoNotes);
        return [
            ...sections
                .filter(({ id }) => !Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID).includes(id))
                .map((section): PolicyExplorerCategory => {
                    const notes = infoNotes ? infoNotes[section.id] || "" : "";
                    return {
                        id: section.id,
                        name: section.displayName.replace("Policy Explorer - ", ""),
                        subcategories:
                            CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES === section.id
                                ? []
                                : this.sortSubcategories(section.dataElements, sectionsEvent),
                        description: notes,
                    };
                }),
            changesInCoveragePolicyMergedCategory,
        ];
    }

    private buildCategories(data: D2DataSet, infoNotes: InfoNotes): PolicyExplorerCategory[] {
        const sections = data?.sections.filter(section => sectionsList.includes(section.id)) || [];
        const changesInCoveragePolicyMergedCategory = this.getChangesInCoveragePolicyMergedCategory(infoNotes);

        return [
            ...sections
                .filter(({ id }) => !Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID).includes(id))
                .map(section => {
                    const notes = infoNotes ? infoNotes[section.id] || "" : "";

                    return {
                        id: section.id,
                        name: section.displayName.replace("UHCW_", ""),
                        subcategories:
                            CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES === section.id
                                ? []
                                : this.getSubcategories(section.dataElements),
                        description: notes,
                    };
                }),
            changesInCoveragePolicyMergedCategory,
        ];
    }

    private getChangesInCoveragePolicyMergedCategory(infoNotes: InfoNotes): PolicyExplorerCategory {
        const notes = infoNotes ? infoNotes[CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019] || "" : "";

        const changesInCoveragePolicyMergedCategory: PolicyExplorerCategory = {
            id: CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID,
            name: "Changes in coverage policy",
            subcategories: [],
            description: notes,
        };
        return changesInCoveragePolicyMergedCategory;
    }

    private getSubcategories(sectionDataElements?: D2DataElements[]): PolicyExplorerSubcategory[] {
        const subcategories = sectionDataElements
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
            description: true,
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

type D2DataElements = MetadataPick<{
    dataElements: { fields: typeof dataElementsFields };
}>["dataElements"][number];

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
