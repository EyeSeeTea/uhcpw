import { FutureData } from "../../../domain/entities/Future";
import {
    Explainer,
    ExplainerVideo,
    explainerPages,
    getExplainerEmbedUrl,
} from "../../../domain/entities/explainers/Explainer";
import { Id } from "../../../domain/entities/Ref";
import { ExplainerRepository } from "../../../domain/repositories/explainers/ExplainerRepository";
import { D2Api } from "../../../types/d2-api";
import { Maybe } from "../../../types/utils";
import { getMainPagesContent } from "../common/getMainPagesContent";
import { explainerDataElementsByPage } from "./explainerDataElements";

export class ExplainerD2Repository implements ExplainerRepository {
    constructor(private api: D2Api) {}

    getAll(): FutureData<ReadonlyArray<Explainer>> {
        return getMainPagesContent(this.api).map(dataValues => {
            const getValue = (dataElementId: Id) =>
                dataValues.find(dataValue => dataValue.dataElement === dataElementId)?.value;

            return explainerPages.flatMap(page => {
                const dataElements = explainerDataElementsByPage[page];
                const video = getVideo(getValue(dataElements.videoFile), getValue(dataElements.videoUrl));

                return video ? [{ page, video }] : [];
            });
        });
    }
}

// NOTICE: an uploaded video file takes priority over the video URL when both are configured
function getVideo(videoFile: Maybe<string>, videoUrl: Maybe<string>): Maybe<ExplainerVideo> {
    if (videoFile) return { type: "file" };
    if (videoUrl) return { type: "url", url: getExplainerEmbedUrl(videoUrl) };
    return undefined;
}
