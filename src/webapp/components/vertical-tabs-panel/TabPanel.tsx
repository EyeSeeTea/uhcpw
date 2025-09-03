import React from "react";
import { Box } from "@material-ui/core";

type TabPanelProps = {
    children: React.ReactNode;
    value: number;
    index: number;
    title: string;
};

export const TabPanel: React.FC<TabPanelProps> = props => {
    const { children, value, index, title } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${title}-${index}`}
            style={{ width: "100%" }}
        >
            {value === index && (
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
};
