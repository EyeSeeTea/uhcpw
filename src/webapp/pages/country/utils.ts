import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";

export const getBackgroundColorByFinancialProtectionStatus = (status?: FinancialProtectionStatus) => {
    switch (status) {
        case "InsufficientData":
            return "linear-gradient(90deg, #808080 0%, #f0f0f0 100%)";
        case "VeryWeak":
            return "linear-gradient(90deg, #920C09 1.8%, #E6B0AA 100%)";
        case "Weak":
            return "linear-gradient(90deg, #c42929 1.8%, #ffe1d0 60.94%)";
        case "Gaps":
            return "linear-gradient(90deg, #FF8D4E 1.8%, #FFD3A5 100%)";
        case "Emerging":
            return "linear-gradient(90deg, #FFC844 1.8%, #FFF4D1 100%)";
        case "Strong":
            return "linear-gradient(90deg, #4FAD56 70.8%, #9CD77B 100%)";
    }
};
