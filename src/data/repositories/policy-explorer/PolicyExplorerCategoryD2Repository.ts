import { FutureData } from "../../../domain/entities/Future";
import {
    PolicyExplorerCategory,
    PolicyExplorerSubcategory,
} from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerCategoryRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export const CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID = {
    UP_TO_AND_INCLUDING_2019: "FtRwT2aBET4",
    SINCE_2020: "Dg4b8bTfEIr",
};

export const CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES = {
    AREA_OF_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
        "KDsEXYarBTu",
        "ewpOQ5y97nj",
        "hDGqtzIFTAg",
        "Ed553tXFkcC",
        "G90HxQdY44N",
        "NYOzeiIIuer",
        "sbJ5LiyNmKl",
        "WA27bUg63Dh",
        "xGDYpRE0Vvl",
        "uF05inoJDh5",
    ],
    HEALTH_SERVICES_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
        "gOtySPsOkmn",
        "ueyZG15lJNe",
        "oR85dLJrBWB",
        "GMqwcTkBm5u",
        "GwYOC7auTo3",
        "qOJSgPcqcL2",
        "WR7QyEwmqtq",
        "x3jxJF9DqNy",
        "YzGXBvmFVYm",
        "iP2LBbjXJMD",
    ],
    PEOPLE_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
        "CnlZeapVRTA",
        "Dg9FyroZ53d",
        "Ak3h87SXFws",
        "OAFiKkIj9AV",
        "VqZfgxa6KhX",
        "jRzKTIos828",
        "vmfNUlnK3D3",
        "B12VprnJrCs",
        "uPUoqXkGxWx",
        "NG7PK1qyFuN",
    ],
    POLICY_OF_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
        "u50ywFZ6gum",
        "pnUIywtp441",
        "fVrKY8v7ZRy",
        "xZjl72SoX34",
        "RPDIUoT8kU7",
        "D4F1hKgVhkm",
        "vWyHWGYlxGx",
        "os0IgAMStfl",
        "OE3asNfDFlf",
        "LzUtOANFszs",
    ],
};

export const CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES = {
    AREA_OF_CHANGE_IN_COVERAGE_POLICY: [
        "xP4nCc5rpV4",
        "AFxIxVuvvsZ",
        "IjpUXUVF9bn",
        "Soj201VJFWL",
        "JfqWVc1eCJl",
        "CEjDnfFPHAn",
        "PRq7KFCDGWc",
        "oVgaMvPvL3R",
        "eohpuMxhpeT",
        "e4ieVLuEisR",
    ],
    POLICY_OF_CHANGE_IN_COVERAGE_POLICY: [
        "mQYv2QxdflF",
        "dfWsuiDvDlR",
        "JMYOe9wMIoE",
        "tdlh9Z0uktG",
        "PyBU3BkN3oQ",
        "kUBtnGm4EKp",
        "TH73JJkBEXA",
        "gdZ63nAVakA",
        "O5Z0EpAy0HE",
        "IVVTmrOelXA",
    ],
    HEALTH_SERVICES_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY: [
        "peIML3XRBaN",
        "FKBHFNqiFM4",
        "AZgRUJmVPNi",
        "jq0sGqVVTNW",
        "zvBP5xebI2D",
        "SfaynclXRLx",
        "QMd8Ch70DMO",
        "zNkK3T9RC20",
        "qbUvq6u68Vp",
        "SLw4hji7Eqz",
    ],
    PEOPLE_TARGETED_IN_CHARGE_IN_COVERAGE_POLICY: [
        "CUSj5kPkJ0W",
        "fgsOChZT1Yp",
        "M90TwNwsXjY",
        "XZbHFY1652W",
        "b5kKyrRkcHG",
        "Azmt9ndZOE2",
        "S9zr8VMFxu7",
        "DzK5t6bz3En",
        "GJ7LuLvC5NP",
        "l26WfNjfVSx",
    ],
    WAS_THIS_A_RESPONSE_TO_THE_COVID19_PANDEMIC: [
        "mdnjNf5baYj",
        "qJ9dWNT1HU1",
        "rxDjH7GshzX",
        "BYbKtpEB0Hn",
        "L9klgnq75d8",
        "pUFqAJjXUfY",
        "KT9GQze7Pii",
        "bP4RX98OLaj",
        "kCOZDO02mN1",
        "BGY8hoKzw0B",
    ],
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

        return sections.map(section => ({
            id: section.id,
            name: section.displayName.replace("UHCW_", ""),
            subcategories: this.getSubcategories(section.id, section.dataElements),
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
    sections: { id: true, displayName: true, dataElements: dataElementsFields },
} as const;

type D2DataElements = MetadataPick<{
    dataElements: { fields: typeof dataElementsFields };
}>["dataElements"][number];

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];
