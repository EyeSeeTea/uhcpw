import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { Id } from "../../../domain/entities/Ref";

type ExplainerDataElements = Readonly<{
    videoFile: Id;
    videoUrl: Id;
}>;

export const explainerDataElementsByPage: Readonly<Record<ExplainerPage, ExplainerDataElements>> = {
    resources: { videoFile: "bzSZLAF1bD5", videoUrl: "T41zn5w2Wqh" },
    policyExplorer: { videoFile: "i4fffUmdR9x", videoUrl: "QOYyX9amsqf" },
    indicatorExplorer: { videoFile: "tiPXMfgfbjC", videoUrl: "iwPSqDyQJTb" },
    country: { videoFile: "k5JtNaVEIGm", videoUrl: "CzKEpb61FdK" },
    regional: { videoFile: "zhkWd94tuN7", videoUrl: "Ktp7RTRNkEF" },
};
