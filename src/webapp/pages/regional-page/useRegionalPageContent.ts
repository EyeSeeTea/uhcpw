import { useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import {
    GapsInCoverageContent,
    RegionInfo,
    RegionMainMapPanelContent,
    RegionNumbersPanelContent,
} from "../../../domain/entities/region/RegionInfo";

type RegionalPageContent = {
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelContent: RegionNumbersPanelContent;
    gapsInCoverageContent: GapsInCoverageContent;
    policyChecklistContent: {
        textSectionLeft: string;
        textSectionRight: string;
    };
};

export type RegionalPageContentState = {
    content: RegionalPageContent | undefined;
    isLoading: boolean;
};

export function useRegionalPageContent(selectedRegionId?: Id): RegionalPageContentState {
    const { compositionRoot, regions } = useAppContext();
    const [content, setContent] = useState<RegionalPageContent | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const regionOrgUnitId = regions.find(region => region.id === selectedRegionId)?.linkedOrgUnitId;
        if (!regionOrgUnitId) {
            console.error("Region not found for the selected ID:", selectedRegionId);
            setContent(undefined);
            return;
        }

        setIsLoading(true);

        compositionRoot.regions.getInfo.execute(regionOrgUnitId).run(
            regionalInfo => {
                setIsLoading(false);
                setContent(buildRegionalPageInfo(regionalInfo));
            },
            error => {
                setContent(undefined);
                console.error(error);
                setIsLoading(false);
            }
        );
    }, [compositionRoot.regions.getChecklistPolicyMakers, compositionRoot.regions.getInfo, regions, selectedRegionId]);

    return {
        content: content,
        isLoading: isLoading,
    };
}

function buildRegionalPageInfo(regionalInfo: RegionInfo): RegionalPageContent {
    return {
        mainMapPanelContent: regionalInfo.mainMapPanelContent,
        numbersPanelContent: regionalInfo.numbersPanelContent,
        gapsInCoverageContent: regionalInfo.gapsInCoverageContent,
        policyChecklistContent: regionalInfo.policyChecklistContent,
    };
}
