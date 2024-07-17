import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { Future, FutureData } from "../../../../domain/entities/Future";
import { apiToFuture } from "../../../../utils/futures";
import { isValidUid } from "../../../../utils/uid";
import { BreakInSeries, CountryBreakInSeries } from "../../../../domain/entities/indicator-explorer/BreakInSeries";
import { Id } from "../../../../domain/entities/Ref";

const BREAK_IN_SERIES_PROGRAM_ID = "uoOqwxmquTH";

const BREAK_IN_SERIES_CHARTS_SECTION_ID = "UOb51uJ4eoE";

const ORGANISATION_UNIT_ID_DATA_ELEMENT_ID = "ULemve5LPPR";
const YEARS_DATA_ELEMENT_ID = "xH7Z4T1S9Pg";
const DESCRIPTION_DATA_ELEMENT_ID = "D2s74Z1oOr5";

const VISUALIZATION_DATA_ELEMENT_CODE_PATTERN = "BreakInSeries_";

export function getBreakInSeries(api: D2Api): FutureData<BreakInSeries> {
    return Future.joinObj({
        eventsResponse: apiToFuture(
            api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: BREAK_IN_SERIES_PROGRAM_ID,
            })
        ),
        programMetadata: apiToFuture(
            api.models.programs.get({
                fields: programFields,
                filter: { id: { eq: BREAK_IN_SERIES_PROGRAM_ID } },
            })
        ),
    }).map(({ eventsResponse, programMetadata }) => {
        const visualizationIdByDataElementId = getVisualizationIdByDataElementId(programMetadata.objects[0]);

        const breakInSeriesWithVisualizationIds = Array.from(visualizationIdByDataElementId.values()).reduce(
            (breakInSeries, visualizationId) => {
                breakInSeries.addVisualization(visualizationId);
                return breakInSeries;
            },
            new BreakInSeries()
        );

        return eventsResponse.events.reduce((breakInSeries, event) => {
            const visualizationIds = event.dataValues
                .filter(
                    dataValue =>
                        dataValue.value === "true" && visualizationIdByDataElementId?.get(dataValue.dataElement)
                )
                .map(dataValue => visualizationIdByDataElementId?.get(dataValue.dataElement))
                .filter(Boolean) as Id[];

            return visualizationIds.length
                ? addCountryBreakInSeries(breakInSeries, visualizationIds, event.dataValues)
                : breakInSeries;
        }, breakInSeriesWithVisualizationIds);
    });
}

function getVisualizationIdByDataElementId(programMetadata: D2Program | undefined): Map<Id, Id> {
    const dataElementsInBreakInSeriesCharts = programMetadata?.programStages[0]?.programStageSections.find(
        ({ id }) => id === BREAK_IN_SERIES_CHARTS_SECTION_ID
    )?.dataElements;

    return (dataElementsInBreakInSeriesCharts || [])?.reduce((map, dataElement) => {
        if (dataElement.code && dataElement.code.includes(VISUALIZATION_DATA_ELEMENT_CODE_PATTERN)) {
            const visualizationId = dataElement.code.replace(VISUALIZATION_DATA_ELEMENT_CODE_PATTERN, "");
            return isValidUid(visualizationId) ? map.set(dataElement.id, visualizationId) : map;
        }
        return map;
    }, new Map<Id, Id>());
}

function addCountryBreakInSeries(
    currentBreakInSeries: BreakInSeries,
    visualizationIds: Id[],
    dataValues: DataValue[]
): BreakInSeries {
    return visualizationIds.reduce((breakInSeries, visualizationId) => {
        const orgUnitId = dataValues.find(
            dataValue => dataValue.dataElement === ORGANISATION_UNIT_ID_DATA_ELEMENT_ID
        )?.value;
        if (!orgUnitId) return breakInSeries;
        const updatedCountryBreakInSeries = getCountryBreakInSeries(
            breakInSeries,
            dataValues,
            visualizationId,
            orgUnitId
        );
        breakInSeries.addCountry(visualizationId, orgUnitId, updatedCountryBreakInSeries);
        return breakInSeries;
    }, currentBreakInSeries);
}

function getCountryBreakInSeries(
    breakInSeries: BreakInSeries,
    dataValues: DataValue[],
    visualizationId: Id,
    orgUnitId: Id
): CountryBreakInSeries {
    const countryBreakInSeries = breakInSeries.getCountry(visualizationId, orgUnitId) || {
        years: [],
        description: "",
    };

    const yearsMerged = dataValues.find(dataValue => dataValue.dataElement === YEARS_DATA_ELEMENT_ID)?.value;
    const years = yearsMerged?.split(";");

    const description = dataValues.find(dataValue => dataValue.dataElement === DESCRIPTION_DATA_ELEMENT_ID)?.value;

    const updatedCountryBreakInSeries = {
        years: years
            ? [...new Set([...countryBreakInSeries.years, ...years])]
            : [...new Set([...countryBreakInSeries.years])],
        description: description || countryBreakInSeries.description,
    };

    return updatedCountryBreakInSeries;
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
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

const programFields = {
    id: true,
    programStages: {
        id: true,
        name: true,
        programStageSections: {
            id: true,
            dataElements: {
                id: true,
                code: true,
            },
        },
    },
} as const;

type D2Program = MetadataPick<{
    programs: { fields: typeof programFields };
}>["programs"][number];
