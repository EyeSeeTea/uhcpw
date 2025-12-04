export type RegionMainMapPanelContent = {
    title: string;
    description: string;
};

export type RegionNumbersPanelContent = {
    panelOneTitle: string;
    panelOneGraphOneTitle: string;
    panelOneGraphOneText: string;

    panelTwoTitle: string;
    panelTwoGraphOneTitle: string;
    panelTwoGraphOneText: string;

    panelThreeTitle: string;
    panelThreeGraphOneTitle: string;
    panelThreeGraphOneText: string;
    panelThreeGraphTwoTitle: string;
    panelThreeGraphTwoText: string;

    panelFourTitle: string;
    panelFourGraphOneTitle: string;
    panelFourGraphOneText: string;
    panelFourGraphTwoText: string;
    panelFourGraphTwoTitle: string;

    panelFiveTitle: string;
    panelFiveGraphOneTitle: string;
    panelFiveGraphOneText: string;
    panelFiveGraphTwoTitle: string;
    panelFiveGraphTwoText: string;
    panelFiveGraphThreeTitle: string;
    panelFiveGraphThreeText: string;

    panelSixTitle: string;
    panelSixGraphOneTitle: string;
    panelSixGraphOneText: string;
    panelSixGraphTwoTitle: string;
    panelSixGraphTwoText: string;
    panelSixGraphThreeTitle: string;
    panelSixGraphThreeText: string;
    panelSixGraphFourTitle: string;
    panelSixGraphFourText: string;
};

export type PolicyChecklistContent = {
    textSectionLeft: string;
    textSectionRight: string;
    downloadFile: string;
    hasDownloadFile: boolean;
};

export type GapsInCoverageContent = {
    panelOneTitle: string;
    panelOneMainText: string;
    panelOneChartOneTitle: string;
    hasPanelOneChartOne: boolean;
    panelOneChartOne: string;
    panelOneChartOneTextAbove: string;
    panelOneChartOneTextBelow: string;
    panelOneChartOneInfoText: string;
    panelOneProgressText: string;

    panelTwoTitle: string;
    panelTwoMainText: string;
    panelTwoChartOne: string;
    hasPanelTwoChartOne: boolean;
    panelTwoChartOneTitle: string;
    panelTwoChartOneTextAbove: string;
    panelTwoChartOneTextBelow: string;
    panelTwoChartOneInfoText: string;
    panelTwoProgressText: string;

    panelThreeTitle: string;
    panelThreeMainText: string;
    panelThreeChartOne: string;
    hasPanelThreeChartOne: boolean;
    panelThreeChartOneTitle: string;
    panelThreeChartOneTextAbove: string;
    panelThreeChartOneTextBelow: string;
    panelThreeChartOneInfoText: string;
    panelThreeProgressText: string;

    panelFourTitle: string;
    panelFourMainText: string;
    panelFourChartOneTitle: string;
    panelFourChartOneTextAbove: string;
    panelFourChartOneTextBelow: string;
    panelFourChartOneInfoText: string;
    panelFourProgressText: string;

    panelFiveTitle: string;
    panelFiveMainText: string;
    panelFiveChartOneTitle: string;
    panelFiveChartOneTextAbove: string;
    panelFiveChartOneTextBelow: string;
    panelFiveChartOneInfoText: string;
    panelFiveChartTwo: string;
    panelFiveChartTwoTitle: string;
    hasPanelFiveChartTwo: boolean;
    panelFiveChartTwoTextAbove: string;
    panelFiveChartTwoTextBelow: string;
    panelFiveChartTwoInfoText: string;
    panelFiveChartThree: string;
    hasPanelFiveChartThree: boolean;
    panelFiveChartThreeTitle: string;
    panelFiveChartThreeTextAbove: string;
    panelFiveChartThreeTextBelow: string;
    panelFiveChartThreeInfoText: string;
    panelFiveProgressText: string;

    panelSixTitle: string;
    panelSixChartOneTitle: string;
    panelSixMainText: string;
    panelSixChartOneTextAbove: string;
    panelSixChartOneTextBelow: string;
    panelSixProgressText: string;

    panelSevenTitle: string;
    panelSevenMainText: string;
    panelSevenChartOneTitle: string;
    panelSevenChartOneTextAbove: string;
    panelSevenChartOneTextBelow: string;
    panelSevenProgressText: string;
};

export type RegionInfo = {
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelContent: RegionNumbersPanelContent;
    gapsInCoverageContent: GapsInCoverageContent;
    policyChecklistContent: PolicyChecklistContent;
};
