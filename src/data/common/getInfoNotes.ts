import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Future, FutureData } from "../../domain/entities/Future";
import { apiToFuture } from "../../utils/futures";

const infoNotesProgram = "CXVECIdnmM1";

export type InfoNotes = Record<string, string>;

export function getInfoNotes(api: D2Api): FutureData<InfoNotes> {
    return Future.joinObj({
        notes: apiToFuture(
            api.events.get({
                fields: eventsFields,
                skipPaging: true,
                program: infoNotesProgram,
            })
        ),
        dataElements: apiToFuture(
            api.models.dataElements.get({
                fields: dataElementFields,
                paging: false,
            })
        ),
    }).map(({ notes, dataElements }) => {
        return (
            notes.events[0]?.dataValues.reduce((acc, dataValue) => {
                const dataElement = dataElements.objects.find(dataElement => dataElement.id === dataValue.dataElement);

                const code = dataElement?.code || "";

                return { ...acc, [code]: dataValue.value };
            }, {}) || {}
        );
    });
}

const dataElementFields = {
    id: true,
    code: true,
} as const;

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
