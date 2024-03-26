import { Future, FutureData } from "../entities/Future";
import { HomePageContent } from "../entities/HomePageContent";

export class GetHomePageContentUseCase {
    public execute(): FutureData<HomePageContent> {
        return Future.success({
            explorers: {
                title: "Explorers",
                subtitle: "Assess the current situation, monitor trends, compare countries",
                indicator: {
                    title: "Indicator explorer",
                    text: "Over 50 indicators of financial hardship, unmet need for health care and spending on health",
                    buttonText: "Explore data",
                },
                policy: {
                    title: "Policy explorer",
                    text: "Information on population coverage, service coverage, user charges and voluntary health insurance",
                    buttonText: "Explore data",
                },
            },
            analysis: {
                title: "Analysis",
                subtitle: "Country-level and comparative analysis of financial protection",
                countries: {
                    title: "Countries in context",
                    text: "Find out about the health system factors that strengthen and undermine financial protection at country level",
                    buttonText: "Country pages",
                },
                regional: {
                    title: "The region at a glance",
                    text: "Compare financial protection indicators, identify gaps in coverage, explore good practice",
                    buttonText: "Regional report",
                },
            },
            methods: {
                title: "Methods",
                subtitle: "How financial protection is monitored matters",
                column1: {
                    title: "A focus on equity",
                    text: "We measure financial hardship using an approach that accounts for people's capacity to pay for health care",
                },
                column2: {
                    title: "Numbers and stories",
                    text: "UHC Watch identifies the factors that influence financial protection at country level, drawing on insights from comparative analysis",
                },
                column3: {
                    title: "Actionable evidence",
                    text: "UHC Watch provides clear guidance for policy by identifying who lacks financial protection, driven by which health services and why",
                },
            },
        });
    }
}
