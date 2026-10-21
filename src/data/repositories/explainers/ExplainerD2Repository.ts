import { Future, FutureData } from "../../../domain/entities/Future";
import { Explainer, ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { Id } from "../../../domain/entities/Ref";
import { ExplainerRepository } from "../../../domain/repositories/explainers/ExplainerRepository";
import { D2Api } from "../../../types/d2-api";
import { getMainPagesContent } from "../common/getMainPagesContent";

const videoDataElementByPage: Readonly<Partial<Record<ExplainerPage, Id>>> = {
    resources: "T41zn5w2Wqh",
};

export class ExplainerD2Repository implements ExplainerRepository {
    constructor(private api: D2Api) {}

    get(page: ExplainerPage): FutureData<Explainer> {
        const dataElementId = videoDataElementByPage[page];
        if (!dataElementId) return Future.error(`No explainer video configured for page ${page}`);

        return getMainPagesContent(this.api).flatMap(dataValues => {
            const videoUrl = dataValues.find(dataValue => dataValue.dataElement === dataElementId)?.value;

            return videoUrl
                ? Future.success({ page, videoUrl })
                : Future.error(`The explainer video of page ${page} is not available.`);
        });
    }
}
