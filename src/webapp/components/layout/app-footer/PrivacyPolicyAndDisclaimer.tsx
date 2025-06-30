import React from "react";
import { Typography, Link } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";

export const PrivacyPolicyAndDisclaimer: React.FC = () => {
    const { generalContent } = useAppContext();

    return (
        <div>
            <Cookies href={generalContent?.cookies.policyUrl} target="_blank">
                <Typography variant="body2">{i18n.t("WHO privacy policy")}</Typography>
            </Cookies>
            <Disclaimer variant="body2">
                {i18n.t(
                    generalContent?.footer.disclaimer ||
                        "* All references to Kosovo should be understood to be in the context of the United Nations Security Council resolution 1244 (1999)"
                )}
            </Disclaimer>
        </div>
    );
};

const Cookies = styled(Link)`
    color: white;
    display: flex;
`;

const Disclaimer = styled(Typography)`
    margin-block-start: 16px;
    padding-inline-start: 0.3125rem;
    max-width: 43.75rem;
`;
