import { DAILY, getRelativePeriodsOptionsById, WEEKLY } from "@dhis2/analytics";

export const getRelativePeriodTypeUsed = (periodItems: { id: string; name: string }[]) => {
    if (
        getRelativePeriodsOptionsById(WEEKLY)
            ?.getPeriods()
            .find(period => period.id === periodItems[0]?.id)
    ) {
        return WEEKLY;
    } else if (
        getRelativePeriodsOptionsById(DAILY)
            ?.getPeriods()
            .find(period => period.id === periodItems[0]?.id)
    ) {
        return DAILY;
    } else {
        //TODO: Review this return
        return "";
    }

    // } else if (
    //     getRelativePeriodsOptionsById(DAILY)
    //         .getPeriods()
    //         .find((period) => period.id === periodItems[0].id)
    // ) {
    //     return DAILY
    // }
};
