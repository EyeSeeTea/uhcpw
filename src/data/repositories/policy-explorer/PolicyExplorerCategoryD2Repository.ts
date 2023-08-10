import { FutureData } from "../../../domain/entities/Future";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerCategoryRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const sectionsList = [
    "uG2PbDfOc0w",
    "W4CqlzcDPB1",
    "uImM4yTeeV3",
    "e6cfI6vWYEF",
    "mCMVwmnGWJF",
    "u800TAhsIBY",
    "lHk8jtKonPh",
    "FtRwT2aBET4",
    "Dg4b8bTfEIr",
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

        return sections.map(section => ({ id: section.id, name: section.displayName.replace("UHCW_", "") }));
    }
}

const dataSetFields = {
    sections: { id: true, displayName: true },
} as const;

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];
