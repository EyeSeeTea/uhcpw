export function getMaxAxisValue(data: number[], tickInterval?: number): number {
    const maxXValue = Math.max(...data);
    const tick = tickInterval || (maxXValue <= 1 ? 0.2 : maxXValue <= 5 ? 1 : 5);
    return Math.ceil(maxXValue / tick) * tick;
}

export function getTickIntervalByMaxAxisValue(maxAxisValue: number): number {
    if (maxAxisValue <= 1) return 0.2;
    if (maxAxisValue <= 5) return 1;
    if (maxAxisValue <= 10) return 2;

    const magnitude = Math.floor(Math.log10(maxAxisValue));
    const baseInterval = 10 ** magnitude;

    if (maxAxisValue <= 1 * baseInterval) return baseInterval * 0.2;
    if (maxAxisValue <= 2.4 * baseInterval) return baseInterval * 0.4;
    if (maxAxisValue <= 4.5 * baseInterval) return baseInterval * 0.5;
    if (maxAxisValue <= 8 * baseInterval) return baseInterval * 1;
    if (maxAxisValue <= 9 * baseInterval) return baseInterval * 1.5;

    return baseInterval * 2;
}

export function getXTickInterval(maxXAxis: number) {
    switch (true) {
        case maxXAxis <= 1:
            return 0.2;
        case maxXAxis <= 5:
            return 1;
        case maxXAxis <= 10:
            return 2;
        case maxXAxis <= 24:
            return 4;
        case maxXAxis <= 45:
            return 5;
        case maxXAxis <= 80:
            return 10;
        case maxXAxis <= 90:
            return 15;
        default:
            return 20;
    }
}

export function getMaxAxisAndTickInterval(maxValuesInSeriesData: number[]): { max: number; tickInterval: number } {
    const maxAxis = getMaxAxisValue(maxValuesInSeriesData);
    const tickInterval = getTickIntervalByMaxAxisValue(maxAxis);
    const adjustedMaxAxis = getMaxAxisValue(maxValuesInSeriesData, tickInterval);

    return {
        max: adjustedMaxAxis,
        tickInterval: tickInterval,
    };
}

export function sumSeriesData(seriesData: (number | null)[][]): number[] {
    const maxLength = Math.max(...seriesData.map(arr => arr.length));

    return Array.from({ length: maxLength }, (_, i) => seriesData.reduce((sum, arr) => sum + (arr[i] || 0), 0));
}

export function getMaxValuesInSeriesData(seriesData: number[][]): number[] {
    const maxLength = Math.max(...seriesData.map(arr => arr.length));

    return Array.from({ length: maxLength }, (_, i) => seriesData.reduce((max, arr) => Math.max(max, arr[i] || 0), 0));
}

export function isNumberData(value: unknown): value is number {
    return typeof value === "number" && !isNaN(value);
}
