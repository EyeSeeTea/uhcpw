import { useEffect, useState } from "react";
import { Explainer, ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { Maybe } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

// NOTICE: undefined while the explainer loads and when the page has no explainer video configured,
// so pages show the button and its layout only when there is a video
export function useExplainer(page: ExplainerPage): Maybe<Explainer> {
    const { compositionRoot } = useAppContext();
    const [explainer, setExplainer] = useState<Maybe<Explainer>>(undefined);
    const getExplainer = compositionRoot.explainers.get;

    useEffect(() => {
        return getExplainer.execute(page).run(setExplainer, message => console.error(message));
    }, [getExplainer, page]);

    return explainer;
}
