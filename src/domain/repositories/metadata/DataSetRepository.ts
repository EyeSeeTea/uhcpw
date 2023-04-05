import { FutureData } from "../../entities/Future";
import { DataSet } from "../../entities/metadata/DataSet";
import { Id } from "../../entities/Ref";

export interface DataSetRepository {
    getById(id: Id): FutureData<DataSet>;
}
