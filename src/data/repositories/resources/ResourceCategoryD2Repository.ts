import { Future, FutureData } from "../../../domain/entities/Future";
import { ResourceCategory } from "../../../domain/entities/resources/ResourceCategory";
import { ResourceCategoryRepository } from "../../../domain/repositories/resources/ResourceCategoryRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

const resourceCategoryOptionSet = "TsAMVqUknEm";

export class ResourceCategoryD2Repository implements ResourceCategoryRepository {
    constructor(private api: D2Api) {}

    public getAll(): FutureData<ResourceCategory[]> {
        return apiToFuture(
            this.api.models.optionSets.get({
                fields: optionSetFields,
                filter: { id: { eq: resourceCategoryOptionSet } },
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
        return optionSet.options
            .map(option => {
                return {
                    id: option.id,
                    name: option.displayName.replace("UHCW_", ""),
                    code: option.code,
                };
            })
            .sort((opt1, opt2) => opt1.name.localeCompare(opt2.name));
    }
}

const optionSetFields = {
    id: true,
    options: { id: true, code: true, displayName: true },
} as const;

type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetFields };
}>["optionSets"][number];
