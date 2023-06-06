import chart1_bul from "../../../assets/charts/2_COMP_How many people experience financial hardship-catastrophic health spending.jpg";
import chart1_spa from "../../../assets/charts/4_COMP_How many people experience financial hardship-impoverishing health spending.jpg";
import chart1_bel from "../../../assets/charts/6_BUL_Which health services are responsible for financial hardship.jpg";
import chart2 from "../../../assets/charts/9_COMP_Which health services are responsible for financial hardship-international comparison.jpg";

/**
 * ESP = DVnpk4xiXGJ
 * BUL = AjeCGGb8H76
 * BEL = KwgjnBBpe5b
 */

export type CategoryConfig = {
    metadata: { filterByCountry: boolean; chartName: string };
    data: ChartData[];
};

export type ChartData = {
    countryId?: string;
    image: string;
};
export const categoriesConfig: Record<string, CategoryConfig> = {
    "Financial Hardship: Households with catastrophic health spending by consumption quintile": {
        metadata: {
            filterByCountry: true,
            chartName: "Households with catastrophic health spending by consumption quintile",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart1_spa,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart1_bul,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart1_bel,
            },
        ],
    },
    "Comparative charts: Households with catastrophic health spending, 2019 or latest available year before COVID-19": {
        metadata: {
            filterByCountry: false,
            chartName: "Households with catastrophic health spending, 2019 or latest available year before COVID-19",
        },
        data: [
            {
                image: chart2,
            },
        ],
    },
};
