import { WEEKLY, DAILY, AnalyticsResponse } from "@dhis2/analytics";

export const computeYoYMatrix = (responses: AnalyticsResponse[], relativePeriodTypeUsed: string) => {
    const periodGroups = responses.reduce((list: string[][], res: AnalyticsResponse) => {
        const periods = res.metaData.dimensions["pe"];

        if (periods) {
            list.push(periods);
        }

        return list;
    }, []);

    if (relativePeriodTypeUsed === DAILY) {
        // periodGroups.sort((a, b) =>{
        //     return  a[0]?.substr(-2) - b?[0].substr(-2)});

        const periodKeyAxisIndexMatrix = periodGroups.shift()?.map((periodId: string) => [periodId]) || [];

        periodGroups.forEach(periodGroup => {
            periodGroup.forEach(periodId => {
                const matchGroups = periodId.match(/(\d{4})(\d{2})(\d{2})/);

                if (matchGroups && periodKeyAxisIndexMatrix) {
                    const month = matchGroups[2];
                    const day = matchGroups[3];

                    // find same month/day in 1st "serie"
                    const xAxisIndexForPeriod = periodKeyAxisIndexMatrix.findIndex(
                        periodKeys => periodKeys[0]?.substr(4) === `${month}${day}`
                    );

                    if (xAxisIndexForPeriod !== -1) {
                        periodKeyAxisIndexMatrix[xAxisIndexForPeriod]?.push(periodId);
                    } else if (month === "02" && day === "29") {
                        // February 29 special case
                        // find index for february 28
                        const indexForFeb28 = periodKeyAxisIndexMatrix.findIndex(
                            periodKeys => periodKeys.findIndex(periodKey => /0228$/.test(periodKey)) !== -1
                        );

                        if (indexForFeb28 !== -1) {
                            periodKeyAxisIndexMatrix.splice(indexForFeb28 + 1, 0, [periodId]);
                        } else {
                            periodKeyAxisIndexMatrix.push([periodId]);
                        }
                    } else {
                        periodKeyAxisIndexMatrix.push([periodId]);
                    }
                }
            });
        });

        return periodKeyAxisIndexMatrix;
    } else if (relativePeriodTypeUsed === WEEKLY) {
        //periodGroups.sort((a, b) => b[0].split("W")[1] - a[0].split("W")[1]);

        const periodKeyAxisIndexMatrix = periodGroups.shift()?.map(periodId => [periodId]) || [];

        periodGroups.forEach(periodGroup => {
            periodGroup.forEach(periodId => {
                const [year, week] = periodId.split("W");

                if (periodKeyAxisIndexMatrix) {
                    // find week number in 1st "serie"
                    const xAxisIndexForPeriod = periodKeyAxisIndexMatrix.findIndex(
                        periodKeys => periodKeys[0]?.split("W")[1] === week
                    );

                    if (xAxisIndexForPeriod !== -1) {
                        periodKeyAxisIndexMatrix[xAxisIndexForPeriod]?.push(periodId);
                    } else if (week === "1") {
                        const indexForW2 = periodKeyAxisIndexMatrix.findIndex(
                            periodKeys => periodKeys.findIndex(periodKey => /W2$/.test(periodKey)) !== -1
                        );

                        if (indexForW2 !== -1) {
                            periodKeyAxisIndexMatrix[indexForW2]?.push(periodId);
                        } else {
                            periodKeyAxisIndexMatrix.push([periodId]);
                        }
                    } else {
                        // find the right spot considering also the year
                        const indexForPrevWeekInYear = periodKeyAxisIndexMatrix.findIndex(
                            periodKeys =>
                                periodKeys.findIndex(periodKey => periodKey === `${year}W${week || 1 - 1}`) !== -1
                        );

                        periodKeyAxisIndexMatrix.splice(indexForPrevWeekInYear + 1, 0, [periodId]);
                    }
                }
            });
        });

        return periodKeyAxisIndexMatrix;
    } else {
        const periodKeyAxisIndexMatrix = periodGroups.reduce(
            (list: string[][], periodGroup) => {
                periodGroup.forEach((periodId, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    list[index]!.push(periodId);
                });

                return list;
            },
            Array.from({ length: (periodGroups[0] || []).length }, () => [])
        );

        return periodKeyAxisIndexMatrix;
    }
};

export const computeGenericPeriodNamesFromMatrix = (
    periodKeyAxisIndexMatrix: string[][],
    relativePeriodTypeUsed: string
) => {
    switch (relativePeriodTypeUsed) {
        case WEEKLY:
            return (
                periodKeyAxisIndexMatrix
                    // remove year, return "Wnn"
                    .map(periodKeys => periodKeys[0]?.substr(4))
                    .flat()
            );
        case DAILY:
            return periodKeyAxisIndexMatrix
                .map(periodKeys =>
                    // remove year, return "dd-mm"
                    periodKeys[0]?.substr(4).replace(/(\d{2})(\d{2})/, "$2-$1")
                )
                .flat();
    }
};

export const computeGenericPeriodNames = (responses: AnalyticsResponse[]) => {
    const xAxisRes = responses.reduce((out, res) => {
        if (out.metaData) {
            const periodsRes = res.metaData.dimensions["pe"] || [];
            const periodsOut = out.metaData.dimensions["pe"] || [];

            if (periodsRes.length > periodsOut.length) {
                out = res;
            }
        } else {
            out = res;
        }

        return out;
    }, {} as AnalyticsResponse);

    const metadata = xAxisRes.metaData;

    const periods = metadata.dimensions["pe"] || [];

    return periods.reduce((genericPeriodNames: string[], periodId: string) => {
        const name = metadata.items[periodId]?.name || "";

        // until the day the backend will support this in the API:
        // trim off the trailing year in the period name
        // english names should all have the year at the end of the string
        genericPeriodNames.push(name.replace(/\s+\d{4}$/, ""));

        return genericPeriodNames;
    }, []);
};
