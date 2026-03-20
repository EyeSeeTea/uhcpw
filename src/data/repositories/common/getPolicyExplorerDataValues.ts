import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { Id } from "../../../domain/entities/Ref";
import { D2Api, DataValueSetsDataValue } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export const policyExplorerDataSet_ID = "asMJECXNLpV";
const CHUNK_SIZE = 5;
const CONCURRENCY_LIMIT = 5;

export function getPolicyExplorerDataValues(
    d2Api: D2Api,
    periods: string[],
    orgUnitIds: Id[]
): FutureData<DataValueSetsDataValue[]> {
    const periodChunks = _.chunk(periods, CHUNK_SIZE);

    if (periodChunks.length === 0) {
        return Future.error("No periods provided for fetching policy explorer data values.");
    }

    const $requests = periodChunks.map(chunk => fetchDataValuesChunk(d2Api, chunk, orgUnitIds));

    return Future.parallel($requests, { maxConcurrency: CONCURRENCY_LIMIT }).map(dataValuesResponses =>
        dataValuesResponses.reduce((accDataValues, dataValuesResponse) => [...accDataValues, ...dataValuesResponse], [])
    );
}

function fetchDataValuesChunk(d2Api: D2Api, periods: string[], orgUnitIds: Id[]): FutureData<DataValueSetsDataValue[]> {
    return apiToFuture(
        d2Api.dataValues.getSet({
            dataSet: [policyExplorerDataSet_ID],
            orgUnit: orgUnitIds,
            period: periods,
        })
    ).flatMap(response => {
        return Future.success(response?.dataValues || []);
    });
}
