import { useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { RegionMainMapPanelContent } from "../../../domain/entities/region/RegionInfo";
import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";

export type RegionalPageInfoState = {
    financialProtectionStatus: FinancialProtectionStatus;
    mainMapPanelContent: RegionMainMapPanelContent;
};

export function useRegionalPageInfo(selectedRegionId?: Id): RegionalPageInfoState {
    const { compositionRoot, regions } = useAppContext();
    const [info, setInfo] = useState<RegionalPageInfoState>(emptyRegionalPageInfoState);

    useEffect(() => {
        const regionOrgUnitId = regions.find(region => region.id === selectedRegionId)?.linkedOrgUnitId;
        if (!regionOrgUnitId) {
            console.error("Region not found for the selected ID:", selectedRegionId);
            setInfo(emptyRegionalPageInfoState);
            return;
        }

        compositionRoot.regions.getInfo.execute(regionOrgUnitId).run(
            content => setInfo(content),
            error => {
                setInfo(emptyRegionalPageInfoState);
                console.error(error);
            }
        );
    }, [compositionRoot.regions.getInfo, regions, selectedRegionId]);

    return info;
}

const emptyRegionalPageInfoState: RegionalPageInfoState = {
    financialProtectionStatus: "Gaps",
    mainMapPanelContent: {
        title: "",
        description: "",
    },
};
