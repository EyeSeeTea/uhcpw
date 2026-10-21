import { useEffect, useState } from "react";
import { ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { Maybe } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

export function useExplainerVideoUrl(page: ExplainerPage): Maybe<string> {
    const { compositionRoot } = useAppContext();
    const [videoUrl, setVideoUrl] = useState<Maybe<string>>(undefined);
    const getExplainer = compositionRoot.explainers.get;

    useEffect(() => {
        return getExplainer.execute(page).run(
            explainer => setVideoUrl(explainer?.videoUrl),
            message => console.error(message)
        );
    }, [getExplainer, page]);

    return videoUrl;
}
