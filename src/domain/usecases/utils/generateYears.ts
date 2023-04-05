import { Year } from "../../entities/Year";

export function generateYears(maxYear: number, minYear: number): Year[] {
    return Array.from({ length: maxYear - minYear }, (_, i) => maxYear - i).map(year => ({
        id: year.toString(),
    }));
}
