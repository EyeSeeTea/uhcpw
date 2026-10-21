import { useEffect, useState } from "react";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { useAppContext } from "../../contexts/app-context";

export type ExplainerVideoState =
    | Readonly<{ kind: "loading" }>
    | Readonly<{ kind: "loaded"; videoUrl: string }>
    | Readonly<{ kind: "error"; message: string }>;

export function useExplainerVideo(page: ExplainerPage, enabled: boolean): ExplainerVideoState {
    const { compositionRoot } = useAppContext();
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const getExplainer = compositionRoot.explainers.get;

    useEffect(() => {
        if (!enabled || videoUrl) return undefined;

        setError(undefined);

        return getExplainer.execute(page).run(
            explainer => setVideoUrl(explainer.videoUrl),
            message => {
                console.error(message);
                setError(message);
            }
        );
    }, [enabled, videoUrl, getExplainer, page]);

    if (videoUrl) return { kind: "loaded", videoUrl };
    if (error) return { kind: "error", message: error };
    return { kind: "loading" };
}
