import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { Future, FutureData } from "../../../../domain/entities/Future";
import { apiToFuture } from "../../../../utils/futures";
import { Id } from "../../../../domain/entities/Ref";

const PROGRAM_ID = "mCGrTrZYFLW";
const EVENT_ID = "VjWcznud4co";
const SECTION_ID = "Mi2Ff6ghH6k";

const VISUALIZATION_ID_DATA_ELEMENT_CODE_PATTERN = "UHCW_IndicatorTemplates_";

export function getVisualizationTemplate(api: D2Api, visualizationId: Id): FutureData<ArrayBuffer> {
    return Future.joinObj({
        eventsResponse: apiToFuture(
            api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: PROGRAM_ID,
                event: EVENT_ID,
            })
        ),
        programMetadata: apiToFuture(
            api.models.programs.get({
                fields: programFields,
                filter: { id: { eq: PROGRAM_ID } },
            })
        ),
    }).flatMap(({ eventsResponse, programMetadata }) => {
        const dataElementTemplateId = getDataElementIdByVisualizationId(programMetadata.objects[0], visualizationId);

        const event = eventsResponse.events[0];

        if (!dataElementTemplateId || !event) {
            return Future.error(`Could not find template id for visualization id ${visualizationId}`);
        }

        return downloadChartFileArrayBufferTemplate(api, dataElementTemplateId, event.event);
    });
}

function getDataElementIdByVisualizationId(
    programMetadata: D2Program | undefined,
    visualizationId: Id
): Id | undefined {
    const dataElementsInTemplates = programMetadata?.programStages[0]?.programStageSections.find(
        ({ id }) => id === SECTION_ID
    )?.dataElements;

    return dataElementsInTemplates?.find(
        ({ code }) => code === `${VISUALIZATION_ID_DATA_ELEMENT_CODE_PATTERN}${visualizationId}`
    )?.id;
}

function downloadChartFileArrayBufferTemplate(api: D2Api, templateId: Id, eventId: Id): FutureData<ArrayBuffer> {
    return apiToFuture(
        api.request<any>({
            url: `events/files?dataElementUid=${templateId}&eventUid=${eventId}`,
            method: "get",
            responseDataType: "raw",
        })
    ).flatMap(blob => {
        return Future.fromPromise(blob.arrayBuffer());
    });
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
