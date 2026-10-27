import { FutureData } from "../../../domain/entities/Future";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { ExplainerVideoFile } from "../../../domain/entities/explainers/ExplainerVideoFile";
import { ExplainerVideoFileRepository } from "../../../domain/repositories/explainers/ExplainerVideoFileRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { getMainPagesEvent } from "../common/getMainPagesContent";
import { explainerDataElementsByPage } from "./explainerDataElements";

const defaultVideoMimeType = "video/mp4";

export class ExplainerVideoFileD2Repository implements ExplainerVideoFileRepository {
    constructor(private api: D2Api) {}

    // NOTICE: the events files endpoint does not serve byte ranges, so a <video src> to it does not play on
    // Safari/iOS and cannot seek elsewhere. The file is downloaded whole and played from a local object URL.
    get(page: ExplainerPage): FutureData<ExplainerVideoFile> {
        const dataElementId = explainerDataElementsByPage[page].videoFile;

        return getMainPagesEvent(this.api).flatMap(event =>
            apiToFuture(
                this.api.request<Blob>({
                    method: "get",
                    url: "/events/files",
                    params: { dataElementUid: dataElementId, eventUid: event.event },
                    responseDataType: "raw",
                    headers: { Accept: "*/*" },
                })
            ).map(file => ({ page, file: withVideoMimeType(file) }))
        );
    }
}

function withVideoMimeType(file: Blob): Blob {
    return file.type.startsWith("video/") ? file : new Blob([file], { type: defaultVideoMimeType });
}
