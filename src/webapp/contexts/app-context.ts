import React, { useContext } from "react";
import { CompositionRoot } from "../../CompositionRoot";
import { Country } from "../../domain/entities/Country";
import { ResourceTheme } from "../../domain/entities/resources/ResourceTheme";
import { User } from "../../domain/entities/User";
import { D2Api } from "../../types/d2-api";
import { GeneralContent } from "../../domain/entities/GeneralContent";
import { Maybe } from "../../types/utils";

export interface AppContextState {
    api: D2Api;
    currentUser: User;
    compositionRoot: CompositionRoot;
    countries: Country[];
    themes: ResourceTheme[];
    generalContent: Maybe<GeneralContent>;
    countriesAndSubregions: Country[];
}

export const AppContext = React.createContext<AppContextState | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (context) {
        return context;
    } else {
        throw new Error("App context uninitialized");
    }
}
