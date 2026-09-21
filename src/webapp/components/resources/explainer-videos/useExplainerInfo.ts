import { useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";

export type ExplainerInfoState =
    | Readonly<{ kind: "loading" }>
    | Readonly<{ kind: "loaded"; videoUrl: string }>
    | Readonly<{ kind: "error"; message: string }>;

/**
 * The explainer info is requested the first time the hook is enabled and kept while the component using it stays
 * mounted, so enabling it again does not download the video twice. Disabling it before the download ends cancels it.
 */
export function useExplainerInfo(enabled: boolean): ExplainerInfoState {
    const { compositionRoot } = useAppContext();
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const getExplainerInfo = compositionRoot.resources.getExplainerInfo;

    useEffect(() => {
        if (!enabled || videoUrl) return undefined;

        setError(undefined);

        return getExplainerInfo.execute().run(
            info => setVideoUrl(URL.createObjectURL(info.video)),
            message => {
                console.error(message);
                setError(message);
            }
        );
    }, [enabled, videoUrl, getExplainerInfo]);

    useEffect(() => {
        return videoUrl ? () => URL.revokeObjectURL(videoUrl) : undefined;
    }, [videoUrl]);

    if (videoUrl) return { kind: "loaded", videoUrl };
    if (error) return { kind: "error", message: error };
    return { kind: "loading" };
}
