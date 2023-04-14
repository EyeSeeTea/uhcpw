import { Year } from "../../entities/Year";

export function generateYears(maxYear?: number): Year[] {
    const minYear = 1999;

    return generate(maxYear ? maxYear : new Date().getFullYear() - 1, minYear);
}

function generate(maxYear: number, minYear: number): Year[] {
    return Array.from({ length: maxYear - minYear }, (_, i) => maxYear - i).map(year => ({
        id: year.toString(),
    }));
}
