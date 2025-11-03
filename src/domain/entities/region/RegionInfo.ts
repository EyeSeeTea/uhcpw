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

export type GapsInCoverageContent = {
    panelOneTitle: string;
    panelOneMainText: string;
    panelOneChartOne: string;
    panelOneChartOneTextAbove: string;
    panelOneChartOneTextBelow: string;
    panelOneChartOneInfoText: string;
    panelOneProgressText: string;

    panelTwoTitle: string;
    panelTwoMainText: string;
    panelTwoChartOne: string;
    panelTwoChartOneTextAbove: string;
    panelTwoChartOneTextBelow: string;
    panelTwoChartOneInfoText: string;
    panelTwoProgressText: string;

    panelThreeTitle: string;
    panelThreeMainText: string;
    panelThreeChartOne: string;
    panelThreeChartOneTextAbove: string;
    panelThreeChartOneTextBelow: string;
    panelThreeChartOneInfoText: string;
    panelThreeProgressText: string;

    panelFourTitle: string;
    panelFourMainText: string;
    panelFourChartOne: string;
    panelFourChartOneTextAbove: string;
    panelFourChartOneTextBelow: string;
    panelFourChartOneInfoText: string;
    panelFourProgressText: string;

    panelFiveTitle: string;
    panelFiveMainText: string;
    panelFiveChartOne: string;
    panelFiveChartOneTextAbove: string;
    panelFiveChartOneTextBelow: string;
    panelFiveChartOneInfoText: string;
    panelFiveChartTwo: string;
    panelFiveChartTwoTextAbove: string;
    panelFiveChartTwoTextBelow: string;
    panelFiveChartTwoInfoText: string;
    panelFiveChartThree: string;
    panelFiveChartThreeTextAbove: string;
    panelFiveChartThreeTextBelow: string;
    panelFiveChartThreeInfoText: string;
    panelFiveProgressText: string;

    panelSixTitle: string;
    panelSixMainText: string;
    panelSixChartOne: string;
    panelSixChartOneTextAbove: string;
    panelSixChartOneTextBelow: string;
    panelSixChartOneInfoText: string;
    panelSixProgressText: string;

    panelSevenTitle: string;
    panelSevenMainText: string;
    panelSevenChartOne: string;
    panelSevenChartOneTextAbove: string;
    panelSevenChartOneTextBelow: string;
    panelSevenChartOneInfoText: string;
    panelSevenProgressText: string;
};

export type RegionInfo = {
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelContent: RegionNumbersPanelContent;
    gapsInCoverageContent: GapsInCoverageContent;
    policyChecklistContent: PolicyChecklistContent;
};
