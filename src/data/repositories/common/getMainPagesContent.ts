import { Future, FutureData } from "../../../domain/entities/Future";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export const mainPagesProgram = "ai5rB7mcqHH";

export function getMainPagesContent(api: D2Api): FutureData<DataValue[]> {
    return apiToFuture(
        api.events.get({
            fields: eventsFields,
            skipPaging: true,
            program: mainPagesProgram,
        })
    ).flatMap(response => {
        if (response.events.length === 0) {
            return Future.error("No main pages found");
        }

        const event = response.events[0];

        return Future.success(event?.dataValues || []);
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
