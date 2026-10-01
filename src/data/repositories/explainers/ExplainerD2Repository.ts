import { Future, FutureData } from "../../../domain/entities/Future";
import { Explainer, ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { Id } from "../../../domain/entities/Ref";
import { ExplainerRepository } from "../../../domain/repositories/explainers/ExplainerRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { getMainPagesEvent } from "../common/getMainPagesContent";

const videoDataElementByPage: Readonly<Partial<Record<ExplainerPage, Id>>> = {
    resources: "T41zn5w2Wqh",
};

const defaultVideoMimeType = "video/mp4";

export class ExplainerD2Repository implements ExplainerRepository {
    constructor(private api: D2Api) {}

    // NOTICE: the events files endpoint does not serve byte ranges, so a <video src> to it does not play on
    // Safari/iOS and cannot seek elsewhere. The file is downloaded whole and played from a local object URL.
    get(page: ExplainerPage): FutureData<Explainer> {
        const dataElementId = videoDataElementByPage[page];
        if (!dataElementId) return Future.error(`No explainer video configured for page ${page}`);

        return getMainPagesEvent(this.api).flatMap(event => {
            const hasVideo = event.dataValues.some(
                dataValue => dataValue.dataElement === dataElementId && dataValue.value
            );

            if (!hasVideo) return Future.error(`The explainer video of page ${page} is not available.`);

            return apiToFuture(
                this.api.request<Blob>({
                    method: "get",
                    url: "/events/files",
                    params: { dataElementUid: dataElementId, eventUid: event.event },
                    responseDataType: "raw",
                    headers: { Accept: "*/*" },
                })
            ).map(file => ({ page, video: withVideoMimeType(file) }));
        });
    }
}

function withVideoMimeType(file: Blob): Blob {
    return file.type.startsWith("video/") ? file : new Blob([file], { type: defaultVideoMimeType });
}
