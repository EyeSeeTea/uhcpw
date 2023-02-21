import { FeedbackOptions } from "@eyeseetea/feedback-component";

export const appConfig: AppConfig = {
    appKey: "dhis2-app-skeleton",
    feedback: {
        repositories: {
            clickUp: {
                listId: "176458462",
                title: "[User feedback] {title}",
                body: "## dhis2\n\nUsername: {username}\n\n{body}",
            },
        },
        layoutOptions: {
            buttonPosition: "bottom-end",
        },
    },
};

export interface AppConfig {
    appKey: string;
    feedback?: FeedbackOptions;
}
