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
    panelFourChartOne: string;
    hasPanelFourChartOne: boolean;
    panelFourChartOneTitle: string;
    panelFourChartOneTextAbove: string;
    panelFourChartOneTextBelow: string;
    panelFourChartOneInfoText: string;
    panelFourProgressText: string;

    panelFiveTitle: string;
    panelFiveMainText: string;
    panelFiveChartOne: string;
    hasPanelFiveChartOne: boolean;
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
    panelSixChartOne: string;
    hasPanelSixChartOne: boolean;
    panelSixChartOneTextAbove: string;
    panelSixChartOneTextBelow: string;
    panelSixChartOneInfoText: string;
    panelSixProgressText: string;

    panelSevenTitle: string;
    panelSevenMainText: string;
    panelSevenChartOneTitle: string;
    panelSevenChartOne: string;
    hasPanelSevenChartOne: boolean;
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
