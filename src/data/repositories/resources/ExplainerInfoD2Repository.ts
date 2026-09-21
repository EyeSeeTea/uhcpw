import { Future, FutureData } from "../../../domain/entities/Future";
import { ExplainerInfo } from "../../../domain/entities/resources/ExplainerInfo";
import { ExplainerInfoRepository } from "../../../domain/repositories/resources/ExplainerInfoRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { getMainPagesEvent } from "../common/getMainPagesContent";

// FILE data element of the main pages program that holds the explainer video
const explainerVideoDataElementId = "R3va0rPB42z";
const defaultVideoMimeType = "video/mp4";

export class ExplainerInfoD2Repository implements ExplainerInfoRepository {
    constructor(private api: D2Api) {}

    // NOTICE: the whole video file is downloaded to be played from a local object URL because the events files
    // endpoint does not serve byte ranges, so a <video src> pointing to it cannot seek reliably.
    get(): FutureData<ExplainerInfo> {
        return getMainPagesEvent(this.api).flatMap(event => {
            const hasVideo = event.dataValues.some(
                dataValue => dataValue.dataElement === explainerVideoDataElementId && dataValue.value
            );

            if (!hasVideo) return Future.error("The explainer video has not been uploaded");

            return apiToFuture(
                this.api.request<Blob>({
                    method: "get",
                    url: "/events/files",
                    params: { dataElementUid: explainerVideoDataElementId, eventUid: event.event },
                    responseDataType: "raw",
                    headers: { Accept: "*/*" },
                })
            ).map(video => ({ video: withVideoMimeType(video) }));
        });
    }
}

function withVideoMimeType(file: Blob): Blob {
    return file.type.startsWith("video/") ? file : new Blob([file], { type: defaultVideoMimeType });
}
