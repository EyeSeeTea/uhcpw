import _ from "lodash";

import { Future, FutureData } from "../../../domain/entities/Future";
import { ResourceTheme } from "../../../domain/entities/resources/ResourceTheme";
import { ResourceCategoryRepository } from "../../../domain/repositories/resources/ResourceCategoryRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { InmemoryCache } from "../../cache/InmemoryCache";

const resourceThemeOptionSet = "ie8po5iPlaw";

const THEME_OPTION_FP = "XtkFOVtkBtT";
const THEME_OPTION_VIH = "nyzMcROMpmY";
const THEME_OPTION_GPB = "nPnx6YQDuIA";

const themeOptionsDisplayedName: Readonly<Record<string, Readonly<{ showCode: boolean }>>> = {
    [THEME_OPTION_FP]: {
        showCode: true,
    },
    [THEME_OPTION_VIH]: {
        showCode: true,
    },
    [THEME_OPTION_GPB]: {
        showCode: true,
    },
};

export class ResourceThemeD2Repository implements ResourceCategoryRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public getAll(): FutureData<ResourceTheme[]> {
        return this.cache.getOrFuture(
            "themes",
            apiToFuture(
                this.api.models.optionSets.get({
                    fields: optionSetFields,
                    filter: { id: { eq: resourceThemeOptionSet } },
                })
            ).flatMap(response => {
                const optionSet = response.objects[0];

                if (!optionSet) {
                    return Future.error("An error has ocurred retrieving resource Categories");
                } else {
                    return Future.success(this.buildResourceCategories(optionSet));
                }
            })
        );
    }

    private buildResourceCategories(optionSet: D2OptionSet): ResourceTheme[] {
        return optionSet.options.map(option => {
            const name = option.displayName.replace("UHCW_", "");
            const displayedName = themeOptionsDisplayedName[option.id]?.showCode
                ? `${_.capitalize(option.code)} (${name})`
                : name;
            return {
                id: option.id,
                name,
                displayedName,
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
