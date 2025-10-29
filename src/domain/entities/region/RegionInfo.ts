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
    panelOneChartOneText: string;
    panelOneProgressText: string;

    panelTwoTitle: string;
    panelTwoMainText: string;
    panelTwoChartOne: string;
    panelTwoChartOneText: string;
    panelTwoProgressText: string;

    panelThreeTitle: string;
    panelThreeMainText: string;
    panelThreeChartOne: string;
    panelThreeChartOneText: string;
    panelThreeProgressText: string;

    panelFourTitle: string;
    panelFourMainText: string;
    panelFourChartOne: string;
    panelFourChartOneText: string;
    panelFourProgressText: string;

    panelFiveTitle: string;
    panelFiveMainText: string;
    panelFiveChartOne: string;
    panelFiveChartOneText: string;
    panelFiveChartTwo: string;
    panelFiveChartTwoText: string;
    panelFiveChartThree: string;
    panelFiveChartThreeText: string;
    panelFiveProgressText: string;

    panelSixTitle: string;
    panelSixMainText: string;
    panelSixChartOne: string;
    panelSixChartOneText: string;
    panelSixProgressText: string;

    panelSevenTitle: string;
    panelSevenMainText: string;
    panelSevenChartOne: string;
    panelSevenChartOneText: string;
    panelSevenProgressText: string;
};

export type RegionInfo = {
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelContent: RegionNumbersPanelContent;
    gapsInCoverageContent: GapsInCoverageContent;
    policyChecklistContent: PolicyChecklistContent;
};
