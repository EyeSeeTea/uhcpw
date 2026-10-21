export type ExplainerPage = "resources" | "indicatorExplorer" | "policyExplorer" | "country" | "regional";

export type Explainer = Readonly<{
    page: ExplainerPage;
    videoUrl: string;
}>;
