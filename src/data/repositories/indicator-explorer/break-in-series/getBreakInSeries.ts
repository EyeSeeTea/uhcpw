import { D2Api } from "@eyeseetea/d2-api/2.36";
import { d } from "msw/lib/glossary-de6278a9";
import { Future, FutureData } from "../../../../domain/entities/Future";
import { apiToFuture } from "../../../../utils/futures";
import { isValidUid } from "../../../../utils/uid";

const breakInSeriesProgram = "uoOqwxmquTH";

const orgUnitIdDE = "ULemve5LPPR";
const yearDE = "xH7Z4T1S9Pg";
const descriptionDE = "D2s74Z1oOr5";
const visualizationDECodePattern = "BreakInSeries_";

/**
 * Example the BreakInSeries domain structure:
 *
 * {
 *    "visualizationId1": {
 *       counties: {
 *          "county1":{
 *             years: ["2020", "2021"],
 *             description: "Description"
 *          },
 *          "county2":{
 *             years: ["2020", "2021"],
 *             description: "Description"
 *          }
 *       }
 *    },
 *     "visualizationId1": {
 *       counties: {
 *          "county1":{
 *             years: ["2020"],
 *             description: "Description"
 *          },
 *       }
 *    },
 */

// Move to domain/entities/BreakInSeries.ts
export type BreakInSeries = Map<string, VisualizationBreakInSeries>;

export type VisualizationBreakInSeries = {
    counties: Map<string, CountryBreakInSeries>;
};

export type CountryBreakInSeries = {
    years: string[];
    description: string;
};

export function getBreakInSeries(api: D2Api): FutureData<BreakInSeries> {
    return Future.joinObj({
        eventsResponse: apiToFuture(
            api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: breakInSeriesProgram,
            })
        ),
        dataElementsResponse: apiToFuture(
            // Try retrieve dataElements in program to reduce response
            api.models.dataElements.get({
                fields: dataElementFields,
                paging: false,
            })
        ),
    }).map(({ eventsResponse, dataElementsResponse }) => {
        const events = eventsResponse.events;
        const visualizationIds = dataElementsResponse.objects
            .filter(dataElement => dataElement.code && dataElement.code.includes(visualizationDECodePattern))
            .map(dataElement => dataElement.code.replace(visualizationDECodePattern, ""))
            .filter(visualizationId => isValidUid(visualizationId));

        const breakInSeries = visualizationIds.reduce((breakInSeries, visualizationId) => {}, new BreakInSeries());

        debugger;

        const breakInSeries = eventsResponse.events.reduce((breakInSeries, event) => {
            const visualizationIds = event.dataValues
                .filter(dataValue => dataValue.dataElement.includes(visualizationDECodePattern))
                .map(dataValue => dataValue.value);

            // if (visualizationId) {
            //     const item = breakInSeries.get(visualizationId) || { counties: [], years: [], description: "" };
            //     const orgUnitId = event.dataValues.find(dataValue => dataValue.dataElement === orgUnitIdDE)?.value;
            //     const year = event.dataValues.find(dataValue => dataValue.dataElement === yearDE)?.value;
            //     const description = event.dataValues.find(dataValue => dataValue.dataElement === descriptionDE)?.value;
            //     if (orgUnitId) item.counties.push(orgUnitId);
            //     if (year) item.years.push(year);
            //     if (description) item.description = description;
            //     return breakInSeries.set(visualizationId, item);
            // }
            return breakInSeries;
        }, new BreakInSeries());

        return new BreakInSeries();
    });
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

const dataElementFields = {
    id: true,
    code: true,
} as const;

export interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
