import { Future, FutureData } from "../../../domain/entities/Future";
import { InfoBoxContent } from "../../../domain/entities/InfoBoxContent";
import { Id } from "../../../domain/entities/Ref";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export const mainPagesProgram = "ai5rB7mcqHH";

export function getMainPagesEvent(api: D2Api): FutureData<MainPagesEvent> {
    return apiToFuture(
        api.events.get({
            fields: eventsFields,
            skipPaging: true,
            program: mainPagesProgram,
        })
    ).flatMap(response => {
        const event = response.events[0];

        return event
            ? Future.success({ event: event.event, dataValues: event.dataValues || [] })
            : Future.error("No main pages found");
    });
}

export function getMainPagesContent(api: D2Api): FutureData<DataValue[]> {
    return getMainPagesEvent(api).map(event => event.dataValues);
}

export type InfoBoxDataElements = Readonly<Record<keyof InfoBoxContent, Id>>;

export function buildInfoBoxContent(
    dataValues: ReadonlyArray<DataValue>,
    dataElements: InfoBoxDataElements
): InfoBoxContent {
    const getValue = (dataElement: Id): string => dataValues.find(dv => dv.dataElement === dataElement)?.value || "";

    return { title: getValue(dataElements.title), text: getValue(dataElements.text) };
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

export type MainPagesEvent = Pick<D2Event, "event" | "dataValues">;
