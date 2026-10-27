import { useEffect, useState } from "react";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { ExplainerVideoFile } from "../../../domain/entities/explainers/ExplainerVideoFile";
import { Maybe } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

export type ExplainerVideoFileState =
    | Readonly<{ kind: "loading" }>
    | Readonly<{ kind: "loaded"; videoFile: ExplainerVideoFile }>
    | Readonly<{ kind: "error"; message: string }>;

export function useExplainerVideoFile(page: ExplainerPage, enabled: boolean): ExplainerVideoFileState {
    const { compositionRoot } = useAppContext();
    const [videoFile, setVideoFile] = useState<Maybe<ExplainerVideoFile>>(undefined);
    const [error, setError] = useState<Maybe<string>>(undefined);
    const getVideoFile = compositionRoot.explainers.getVideoFile;

    useEffect(() => {
        if (!enabled || videoFile) return undefined;

        setError(undefined);

        return getVideoFile.execute(page).run(setVideoFile, message => {
            console.error(message);
            setError(message);
        });
    }, [enabled, videoFile, getVideoFile, page]);

    if (videoFile) return { kind: "loaded", videoFile };
    if (error) return { kind: "error", message: error };
    return { kind: "loading" };
}
