export type HomePageContent = {
    mainMapPanel: MainMapPanelContent;
    explorers: ExplorersContent;
    analysis: AnalysisContent;
    methods: MethodsContent;
};

export type MainMapPanelContent = {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
};

type ColumnContent = {
    title: string;
    text: string;
    buttonText?: string;
};

export type ExplorersContent = {
    title: string;
    subtitle: string;
    indicator: ColumnContent;
    policy: ColumnContent;
};

export type AnalysisContent = {
    title: string;
    subtitle: string;
    countries: ColumnContent;
    regional: ColumnContent;
};

export type MethodsContent = {
    title: string;
    subtitle: string;
    column1: ColumnContent;
    column2: ColumnContent;
    column3: ColumnContent;
};
