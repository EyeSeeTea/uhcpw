import { useEffect, useState } from "react";
import { Method } from "../../../domain/entities/Method";
import { useAppContext } from "../../contexts/app-context";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";

export const useMethods = () => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [methods, setMethods] = useState<Method[]>([]);
    const [isExpanded, setExpanded] = useState<boolean[]>([]);

    useEffect(() => {
        compositionRoot.method.get.execute().run(
            methods => {
                setMethods(methods);
            },
            () => {
                snackbar.error(i18n.t("Error fetching Methods"));
            }
        );
    }, [compositionRoot.method.get, snackbar]);

    useEffect(() => {
        setExpanded(new Array(methods.length).fill(false));
    }, [methods]);

    return {
        methods,
        isExpanded,
        setExpanded,
    };
};
