import { FutureData } from "../../domain/entities/Future";
import { GeneralContent } from "../../domain/entities/GeneralContent";
import { GeneralContentRepository } from "../../domain/repositories/GeneralContentRepository";
import { D2Api } from "../../types/d2-api";
import { DataValue, getMainPagesContent } from "./common/getMainPagesContent";

export class GeneralContentD2Repository implements GeneralContentRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<GeneralContent> {
        return getMainPagesContent(this.api).map(dataValues => this.buildGeneralContent(dataValues));
    }

    buildGeneralContent(dataValues: DataValue[]): GeneralContent {
        return {
            footer: {
                disclaimer: dataValues.find(dv => dv.dataElement === "zCBDjsjnsC0")?.value || "",
            },
            aboutUs: {
                title: dataValues.find(dv => dv.dataElement === "gYzFGI0mMLQ")?.value || "",
                subtitle: dataValues.find(dv => dv.dataElement === "aY5eSBLrOMc")?.value || "",
            },
        };
    }
}
