import { useCallback, useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import {
    RegionInfo,
    RegionMainMapPanelContent,
    RegionNumbersPanelTitles,
} from "../../../domain/entities/region/RegionInfo";
import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";
import { Future } from "../../../domain/entities/Future";
import { ChecklistPolicyMakers } from "../../../domain/entities/region/ChecklistPolicyMakers";

export type ChecklistPolicyMakersState = ChecklistPolicyMakers & {
    progressInfo?: string;
};

type RegionalPageInfo = {
    financialProtectionStatus: FinancialProtectionStatus;
    mainMapPanelContent: RegionMainMapPanelContent;
    numbersPanelTitles: RegionNumbersPanelTitles;
    checklistPolicyMakers: ChecklistPolicyMakersState;
};

export type RegionalPageInfoState = {
    info: RegionalPageInfo | undefined;
    isLoading: boolean;
    onDownloadPolicyChecklist: (checklist: string[], selections: boolean[]) => void;
};

export function useRegionalPageInfo(selectedRegionId?: Id): RegionalPageInfoState {
    const { compositionRoot, regions } = useAppContext();
    const [info, setInfo] = useState<RegionalPageInfo | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const regionOrgUnitId = regions.find(region => region.id === selectedRegionId)?.linkedOrgUnitId;
        if (!regionOrgUnitId) {
            console.error("Region not found for the selected ID:", selectedRegionId);
            setInfo(undefined);
            return;
        }

        setIsLoading(true);

        Future.joinObj({
            regionalInfo: compositionRoot.regions.getInfo.execute(regionOrgUnitId),
            checklistPolicyMakers: compositionRoot.regions.getChecklistPolicyMakers.execute(),
        }).run(
            ({ regionalInfo, checklistPolicyMakers }) => {
                setIsLoading(false);
                setInfo(buildRegionalPageInfo(regionalInfo, checklistPolicyMakers));
            },
            error => {
                setInfo(undefined);
                console.error(error);
                setIsLoading(false);
            }
        );
    }, [compositionRoot.regions.getChecklistPolicyMakers, compositionRoot.regions.getInfo, regions, selectedRegionId]);

    const onDownloadPolicyChecklist = useCallback(
        (checklist: string[], selections: boolean[]) => {
            const data: string[][] = checklist.map((item, index) => [item, selections[index] ? "✓" : ""]);
            return compositionRoot.regions.downloadChecklistPolicyMakers.execute(data).runAsync();
        },
        [compositionRoot.regions.downloadChecklistPolicyMakers]
    );

    return {
        info: info,
        isLoading: isLoading,
        onDownloadPolicyChecklist: onDownloadPolicyChecklist,
    };
}

function buildRegionalPageInfo(
    regionalInfo: RegionInfo,
    checklistPolicyMakers: ChecklistPolicyMakers
): RegionalPageInfo {
    return {
        financialProtectionStatus: regionalInfo.financialProtectionStatus,
        mainMapPanelContent: regionalInfo.mainMapPanelContent,
        numbersPanelTitles: regionalInfo.numbersPanelTitles,
        checklistPolicyMakers: {
            ...checklistPolicyMakers,
            progressInfo: progressTextBoxInfo,
        },
    };
}

const progressTextBoxInfo =
    "1. Act on the evidence and re-design coverage policy.\n\n 2. Start by improving financial protection for the people who need it most.\n\n 3. Follow good practice: a checklist for policy-makers.";
