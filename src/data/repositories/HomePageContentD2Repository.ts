import { FutureData } from "../../domain/entities/Future";
import { HomePageContent } from "../../domain/entities/HomePageContent";
import { HomePageContentRepository } from "../../domain/repositories/HomePageContentRepository";
import { D2Api } from "../../types/d2-api";
import { DataValue, getMainPagesContent } from "./common/getMainPagesContent";

export class HomePageContentD2Repository implements HomePageContentRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<HomePageContent> {
        return getMainPagesContent(this.api).map(dataValues => this.buildHomePageContent(dataValues));
    }

    buildHomePageContent(dataValues: DataValue[]): HomePageContent {
        return {
            explorers: {
                title: dataValues.find(dv => dv.dataElement === "KpyjdWU235A")?.value || "",
                subtitle: dataValues.find(dv => dv.dataElement === "Hp6hYaoKOoJ")?.value || "",
                indicator: {
                    title: dataValues.find(dv => dv.dataElement === "JK20iGDaqRm")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "tWEnsQ6gfqO")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "kpzr2XPNCdL")?.value || "",
                },
                policy: {
                    title: dataValues.find(dv => dv.dataElement === "qGYZubI0Wd8")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "F1ksGHvzhTV")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "LWqNfdyS1JV")?.value || "",
                },
            },
            analysis: {
                title: dataValues.find(dv => dv.dataElement === "CkA1bW7jfMT")?.value || "",
                subtitle: dataValues.find(dv => dv.dataElement === "J5mOLwFoqo1")?.value || "",
                countries: {
                    title: dataValues.find(dv => dv.dataElement === "F3gWD69Fme4")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "ZgY7XuAhb0o")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "MWBXipF0xxJ")?.value || "",
                },
                regional: {
                    title: dataValues.find(dv => dv.dataElement === "hvp6EKlgXMX")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "VsidPy2O456")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "eeOs9Cegtri")?.value || "",
                },
            },
            methods: {
                title: dataValues.find(dv => dv.dataElement === "W9amq4m0VsD")?.value || "",
                subtitle: dataValues.find(dv => dv.dataElement === "hTJXBephuMD")?.value || "",
                column1: {
                    title: dataValues.find(dv => dv.dataElement === "j3ZodhTcOly")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "tcNygLDHOq3")?.value || "",
                },
                column2: {
                    title: dataValues.find(dv => dv.dataElement === "islfoEB6Y2u")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "NTRCLMyqi7N")?.value || "",
                },
                column3: {
                    title: dataValues.find(dv => dv.dataElement === "TX5VeXTeg5a")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "lPZ0Gfkd2AY")?.value || "",
                },
            },
        };
    }
}
