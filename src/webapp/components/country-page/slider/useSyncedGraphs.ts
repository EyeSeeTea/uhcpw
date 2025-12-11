import { useCallback, useMemo, useState } from "react";
import { getTickIntervalByMaxAxisValue } from "../../visualization/utils/getMaxAxisAndTickInterval";

export type SyncGraphsState = {
    sharedMaxYAxisConfig?: {
        max: number;
        tickInterval: number;
    };
    updateSharedYAxisMax: (newMax: number) => void;
    isSyncGraphs?: boolean;
};
export function useSyncedGraphs(isSyncGraphs?: boolean): SyncGraphsState {
    const [sharedYAxisMax, setSharedYAxisMax] = useState<number>();

    const updateSharedYAxisMax = useCallback(
        (newMax: number) => {
            if (!isSyncGraphs) return;
            setSharedYAxisMax(prevMax => (prevMax === undefined || newMax > prevMax ? newMax : prevMax));
        },
        [isSyncGraphs]
    );

    const sharedMaxYAxisConfig = useMemo(() => {
        if (!isSyncGraphs || !sharedYAxisMax) return undefined;
        return { max: sharedYAxisMax || 0, tickInterval: getTickIntervalByMaxAxisValue(sharedYAxisMax) };
    }, [isSyncGraphs, sharedYAxisMax]);

    return {
        sharedMaxYAxisConfig: sharedMaxYAxisConfig,
        updateSharedYAxisMax: updateSharedYAxisMax,
        isSyncGraphs: isSyncGraphs,
    };
}
