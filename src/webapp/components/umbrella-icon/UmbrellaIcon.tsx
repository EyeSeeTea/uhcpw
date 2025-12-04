import React from "react";

import { FinancialProtectionStatus } from "../../../domain/entities/FinancialProtectionStatus";
import UmbrellaWeak from "../../assets/country-page/umbrella-weak.svg";
import UmbrellaGap from "../../assets/country-page/umbrella-gaps.svg";
import UmbrellaStrong from "../../assets/country-page/umbrella-strong.svg";
import InsufficientData from "../../assets/country-page/insufficient-data.svg";
import UmbrellaVeryWeak from "../../assets/country-page/umbrella-very-weak.svg";
import UmbrellaEmerging from "../../assets/country-page/umbrella-emerging.svg";

type UmbrellaIconProps = {
    status: FinancialProtectionStatus;
};

export const UmbrellaIcon: React.FC<UmbrellaIconProps> = props => {
    const { status } = props;

    switch (status) {
        case "VeryWeak":
            return <img src={UmbrellaVeryWeak} width={100} alt={"umbrella very weak"} />;
        case "Weak":
            return <img src={UmbrellaWeak} width={100} alt={"umbrella weak"} />;
        case "Gaps":
            return <img src={UmbrellaGap} width={100} alt={"umbrella gap"} />;
        case "Emerging":
            return <img src={UmbrellaEmerging} width={100} alt={"umbrella emerging"} />;
        case "Strong":
            return <img src={UmbrellaStrong} width={100} alt={"umbrella strong"} />;
        case "InsufficientData":
            return <img src={InsufficientData} width={100} alt={"insufficient data"} />;
    }
};
