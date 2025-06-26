import { Future, FutureData } from "../../../domain/entities/Future";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { Maybe } from "../../../types/utils";

export const methodProgram = "ncAcyjKwLSS";

export function getMethodsProgramEvent(api: D2Api): FutureData<Maybe<D2Event>> {
    return apiToFuture(
        api.events.get({
            fields: eventsFields,
            skipPaging: true,
            program: methodProgram,
        })
    ).flatMap(response => {
        if (response.events.length === 0) {
            return Future.error("No main pages found");
        }

        return Future.success(response.events[0]);
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
