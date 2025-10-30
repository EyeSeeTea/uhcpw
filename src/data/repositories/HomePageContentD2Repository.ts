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
            mainMapPanel: {
                title: dataValues.find(dv => dv.dataElement === "H3x21OGOjhn")?.value || "",
                description: dataValues.find(dv => dv.dataElement === "CPpA7kDtOfM")?.value || "",
                buttonText: dataValues.find(dv => dv.dataElement === "fIsJ5Wn0T3J")?.value || "",
                buttonLink: dataValues.find(dv => dv.dataElement === "XKV6Or4MYLu")?.value || "",
                videoLink: dataValues.find(dv => dv.dataElement === "XRhm3MPFjLA")?.value || "",
            },
            explorers: {
                title: dataValues.find(dv => dv.dataElement === "KpyjdWU235A")?.value || "",
                subtitle: dataValues.find(dv => dv.dataElement === "Hp6hYaoKOoJ")?.value || "",
                indicator: {
                    title: dataValues.find(dv => dv.dataElement === "JK20iGDaqRm")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "tWEnsQ6gfqO")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "kpzr2XPNCdL")?.value || "",
                    buttonLink: dataValues.find(dv => dv.dataElement === "OlSNAHCkM4J")?.value || "",
                },
                policy: {
                    title: dataValues.find(dv => dv.dataElement === "qGYZubI0Wd8")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "F1ksGHvzhTV")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "LWqNfdyS1JV")?.value || "",
                    buttonLink: dataValues.find(dv => dv.dataElement === "SzUNsjs49ZC")?.value || "",
                },
            },
            analysis: {
                title: dataValues.find(dv => dv.dataElement === "CkA1bW7jfMT")?.value || "",
                subtitle: dataValues.find(dv => dv.dataElement === "J5mOLwFoqo1")?.value || "",
                countries: {
                    title: dataValues.find(dv => dv.dataElement === "F3gWD69Fme4")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "ZgY7XuAhb0o")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "MWBXipF0xxJ")?.value || "",
                    buttonLink: dataValues.find(dv => dv.dataElement === "mg7kSoSStzc")?.value || "",
                },
                regional: {
                    title: dataValues.find(dv => dv.dataElement === "hvp6EKlgXMX")?.value || "",
                    text: dataValues.find(dv => dv.dataElement === "VsidPy2O456")?.value || "",
                    buttonText: dataValues.find(dv => dv.dataElement === "eeOs9Cegtri")?.value || "",
                    buttonLink: dataValues.find(dv => dv.dataElement === "GsiYRlaUFWH")?.value || "",
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
                buttonLink: dataValues.find(dv => dv.dataElement === "CZ8syDdSQi3")?.value || "",
            },
            resources: {
                buttonLink: dataValues.find(dv => dv.dataElement === "U0o5J5iU6Iq")?.value || "",
            },
            newsletter: {
                buttonText: dataValues.find(dv => dv.dataElement === "qdJWVPUS3gn")?.value || "",
                buttonLink: dataValues.find(dv => dv.dataElement === "q2xV2rgnt31")?.value || "",
            },
            mobileDialog: { text: dataValues.find(dv => dv.dataElement === "QoZHLL4UoGC")?.value || "" },
        };
    }
}
