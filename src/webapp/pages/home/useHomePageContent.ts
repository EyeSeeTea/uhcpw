import { useEffect, useState } from "react";
import { HomePageContent } from "../../../domain/entities/HomePageContent";
import { useAppContext } from "../../contexts/app-context";

export function useHomePageContent(): HomePageContent {
    const [content, setContent] = useState<HomePageContent>(emptyHomePageContent);

    const { compositionRoot } = useAppContext();

    useEffect(() => {
        compositionRoot.home.getPageContent.execute().run(
            content => setContent(content),
            error => {
                setContent(emptyHomePageContent);
                console.error(error);
            }
        );
    }, [compositionRoot.home.getPageContent]);

    return content;
}

const emptyHomePageContent: HomePageContent = {
    mainMapPanel: {
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
    },
    explorers: {
        title: "",
        subtitle: "",
        indicator: {
            title: "",
            text: "",
            buttonText: "",
        },
        policy: {
            title: "",
            text: "",
            buttonText: "",
        },
    },
    analysis: {
        title: "",
        subtitle: "",
        countries: {
            title: "",
            text: "",
            buttonText: "",
        },
        regional: {
            title: "",
            text: "",
            buttonText: "",
        },
    },
    methods: {
        title: "",
        subtitle: "",
        column1: {
            title: "",
            text: "",
        },
        column2: {
            title: "",
            text: "",
        },
        column3: {
            title: "",
            text: "",
        },
    },
};
