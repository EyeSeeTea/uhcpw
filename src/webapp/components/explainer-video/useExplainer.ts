import { useMemo } from "react";
import { Explainer, ExplainerPage } from "../../../domain/entities/explainers/Explainer";
import { Maybe } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

// NOTICE: the explainers are loaded with the app, so a page knows from its first render whether it has an
// explainer video and its header does not change when it arrives. Undefined when the page has none.
export function useExplainer(page: ExplainerPage): Maybe<Explainer> {
    const { explainers } = useAppContext();

    return useMemo(() => explainers.find(explainer => explainer.page === page), [explainers, page]);
}
