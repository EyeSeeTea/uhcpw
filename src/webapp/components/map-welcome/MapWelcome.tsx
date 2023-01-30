import React from "react";
import { Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";

export const MapWellcome: React.FC = () => {
    return (
        <>
            <Typography variant="h4">{i18n.t("Welcome to UHC Policy Watch,")}</Typography>
            <p>
                <strong>
                    {i18n.t("A platform for evidence on financial protection in Europe and Central Asia. ")}
                </strong>
                {i18n.t(
                    "Financial protection is at the heart of universal health coverage (UHC). Without it, people face barries to access or experience finalcial hardship when using health servicea, undetermining progress towardsUHC."
                )}
            </p>
            <p>
                <strong>{i18n.t("UHC Policy Watch allows  you to:")}</strong>
                <ul>
                    <li>{i18n.t("Access datam information and analysis for 50 countries")}</li>
                    <li>{i18n.t("Compare progress across countries")}</li>
                    <li>{i18n.t("Find out how to ensure access to health care is ")}</li>
                </ul>
            </p>
        </>
    );
};
