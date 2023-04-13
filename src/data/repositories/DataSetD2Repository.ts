import { Future, FutureData } from "../../domain/entities/Future";
import { DataSet } from "../../domain/entities/metadata/DataSet";
import { DataSetRepository } from "../../domain/repositories/metadata/DataSetRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export class DataSetD2Repository implements DataSetRepository {
    constructor(private api: D2Api) {}

    public getById(id: string): FutureData<DataSet> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: dataSetFields,
                filter: { id: { eq: id } },
            })
        ).flatMap(response => {
            const data = response.objects[0];

            if (data) {
                return Future.success(this.buildDataSet(data));
            } else {
                return Future.error(`DataSet with id ${id} not found`);
            }
        });
    }

    private buildDataSet(data: D2DataSet): DataSet {
        return {
            id: data.id,
            name: data.name,
            openFuturePeriods: data.openFuturePeriods,
        };
    }
}

const dataSetFields = {
    id: true,
    name: true,
    openFuturePeriods: true,
    sections: { id: true, displayName: true },
} as const;

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];
