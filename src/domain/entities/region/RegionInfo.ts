export type RegionMainMapPanelContent = {
    title: string;
    description: string;
};

export type RegionNumbersPanelContent = {
    panelOneTitle: string;
    panelOneGraphOneText: string;

    panelTwoTitle: string;
    panelTwoGraphOneText: string;

    panelThreeTitle: string;
    panelThreeGraphOneText: string;
    panelThreeGraphTwoText: string;

    panelFourTitle: string;
    panelFourGraphOneText: string;
    panelFourGraphTwoText: string;

    panelFiveTitle: string;
    panelFiveGraphOneText: string;
    panelFiveGraphTwoText: string;
    panelFiveGraphThreeText: string;

    panelSixTitle: string;
    panelSixGraphOneText: string;
    panelSixGraphTwoText: string;
    panelSixGraphThreeText: string;
    panelSixGraphFourText: string;
};

export type PolicyChecklistContent = {
    textSectionLeft: string;
    textSectionRight: string;
};

export type RegionInfo = {
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelContent: RegionNumbersPanelContent;
    policyChecklistContent: PolicyChecklistContent;
};
