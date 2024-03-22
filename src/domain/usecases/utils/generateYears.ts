import { Year } from "../../entities/Year";

export function generateYears(maxYear?: number): Year[] {
    const minYear = 1999;

    return generate(maxYear ? maxYear : new Date().getFullYear() - 1, minYear);
}

export function generateYearsUntilToday(maxYear?: number): Year[] {
    const minYear = 1899;

    return generate(maxYear ? maxYear : new Date().getFullYear(), minYear);
}

function generate(maxYear: number, minYear: number): Year[] {
    return Array.from({ length: maxYear - minYear }, (_, i) => maxYear - i).map(year => ({
        id: year.toString(),
    }));
}

export function generateRangeOfYears(startYear: number, endYear?: number): Year[] {
    const end = endYear ?? new Date().getFullYear();
    if (startYear > end) {
        return [];
    }
    return Array.from({ length: end - startYear + 1 }, (_, i) => startYear + i).map(year => ({
        id: year.toString(),
    }));
}
