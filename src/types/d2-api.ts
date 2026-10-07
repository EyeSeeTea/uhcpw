import { D2Api } from "@eyeseetea/d2-api/2.36";
import { getMockApiFromClass } from "@eyeseetea/d2-api";

// Explicit runtime exports keep Vite's CommonJS interop from losing the barrel.
export {
    D2ApiVersioned,
    D2ApiGeneric,
    getMockApiFromClass,
    ApiContext,
    useD2,
    useD2Api,
    useD2ApiData,
    HttpError,
    isCancel,
    Events,
    CancelableResponse,
} from "@eyeseetea/d2-api";
export {
    D2ApiResponse,
    Analytics,
    CurrentUser,
    DataStore,
    DataValues,
    Metadata,
    Model,
    models,
    D2Api,
} from "@eyeseetea/d2-api/2.36";
export type * from "@eyeseetea/d2-api";
export type * from "@eyeseetea/d2-api/2.36";
export const getMockApi = getMockApiFromClass(D2Api);
