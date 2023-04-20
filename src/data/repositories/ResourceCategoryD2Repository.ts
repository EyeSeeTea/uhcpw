import { Future, FutureData } from "../../domain/entities/Future";
import { ResourceCategory } from "../../domain/entities/ResourceCategory";
import { ResourceCategoryRepository } from "../../domain/repositories/ResourceCategoryRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

const resourceCategoryOptionSet = "TsAMVqUknEm";

export class ResourceCategoryD2Repository implements ResourceCategoryRepository {
    constructor(private api: D2Api) {}

    public getAll(): FutureData<ResourceCategory[]> {
        return apiToFuture(
            this.api.models.optionSets.get({
                fields: optionSetFields,
                filter: { id: { eq: resourceCategoryOptionSet } },
                level: 3,
            })
        ).flatMap(response => {
            const optionSet = response.objects[0];

            if (!optionSet) {
                return Future.error("An error has ocurred retrieving resource Categories");
            } else {
                return Future.success(this.buildResourceCategories(optionSet));
            }
        });
    }

    private buildResourceCategories(optionSet: D2OptionSet): ResourceCategory[] {
        return optionSet.options.map(option => {
            return {
                id: option.id,
                name: option.displayName,
                code: option.code,
            };
        });
    }
}

const optionSetFields = {
    id: true,
    options: { id: true, code: true, displayName: true },
} as const;

type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetFields };
}>["optionSets"][number];
