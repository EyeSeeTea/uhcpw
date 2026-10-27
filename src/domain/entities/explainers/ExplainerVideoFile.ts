import { ExplainerPage } from "./Explainer";

export type ExplainerVideoFile = Readonly<{
    page: ExplainerPage;
    file: Blob;
}>;
