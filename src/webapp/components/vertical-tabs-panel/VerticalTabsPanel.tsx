import React, { useCallback } from "react";
import { Grid, Tab, Tabs, makeStyles } from "@material-ui/core";
import styled from "styled-components";

import { colors } from "../../pages/app/themes/dhis2.theme";
import i18n from "../../../locales";
import { TabPanel } from "./TabPanel";

const useStyles = makeStyles(theme => ({
    gridItem: {
        backgroundColor: colors.accentPrimary,
        borderInlineEnd: "none",
        marginBlockEnd: "4px",
        [theme.breakpoints.down("sm")]: {
            backgroundColor: colors.white,
            borderInlineEnd: `6px solid ${colors.accentPrimary}`,
            width: "30px",
            flexBasis: "unset",
        },
    },
    tabs: {
        maxWidth: "30px",
        minWidth: "30px",
        "& .MuiTabs-flexContainer": {
            height: "100%",
        },
        backgroundColor: colors.white,
        borderBlockEnd: `4px solid ${colors.white}`,
        [theme.breakpoints.up("md")]: {
            backgroundColor: colors.accentPrimary,
            width: "100%",
            maxWidth: "unset",
            paddingInlineStart: "0px",
            "& .MuiTabs-indicator": {
                display: "none",
            },
            borderBlockEnd: "none",
            paddingBlockEnd: "70px",
        },
    },
    tab: {
        opacity: 1,
        borderInlineEnd: `150px solid ${colors.accentPrimary}`,
        borderBlockStart: `4px solid ${colors.white}`,
        maxWidth: "30px",
        minWidth: "30px",
        textTransform: "none",
        color: `${colors.white}`,
        "& span": {
            display: "none",
        },
        "&:first-child": {
            borderBlockStart: `4px solid ${colors.white}`,
        },
        [theme.breakpoints.up("md")]: {
            width: "100%",
            maxWidth: "unset",
            borderRight: "unset",
            transition: "background-color 0.3s ease-in-out",
            backgroundColor: `${colors.accentPrimary}`,
            minHeight: "60px",
            padding: "15px 25px",
            paddingInlineStart: "64px",
            "& span": {
                display: "inline",
                textAlign: "start",
            },
            '&[aria-selected="true"]': {
                backgroundColor: `${colors.accentPrimaryDark}`,
            },
            "&:last-child": {
                borderBlockEnd: `4px solid ${colors.white}`,
            },
        },
    },
    indicator: {
        backgroundColor: colors.accentPrimaryDark,
        width: "10px",
        borderBlock: `4px solid ${colors.white}`,
        [theme.breakpoints.up("md")]: {
            backgroundColor: colors.accentPrimaryDark,
            width: "10px",
        },
    },
}));

function a11yProps(index: number, tabTitle: string) {
    return {
        id: `vertical-tab-${tabTitle}-${index}`,
        "aria-controls": `vertical-tabpanel-${tabTitle}-${index}`,
    };
}

export type VerticalTabConfig = {
    tab: number;
    tabTitle: string;
    Component: React.ComponentType<any>;
    props?: Record<string, any>;
};

type TabsPanelProps = {
    tabsConfig: VerticalTabConfig[];
    tabValue: number;
    onChangeTabValue: (event: React.ChangeEvent<{}>, newValue: number) => void;
    ariaLabel: string;
};

export const VerticalTabsPanel: React.FC<TabsPanelProps> = props => {
    const { tabsConfig, onChangeTabValue, tabValue, ariaLabel } = props;
    const classes = useStyles();

    const onWheel = useCallback(
        (event: React.WheelEvent<HTMLButtonElement>) => {
            if (event.deltaY > 10 && tabValue < tabsConfig.length - 1) {
                setTimeout(() => onChangeTabValue(event, tabValue + 1), 800);
            } else if (event.deltaY < -10 && tabValue > 0) {
                setTimeout(() => onChangeTabValue(event, tabValue - 1), 800);
            }
        },
        [onChangeTabValue, tabValue, tabsConfig.length]
    );

    const preventDefault = useCallback((event: Event) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = true;
    }, []);

    const enableScroll = useCallback(() => {
        const options: AddEventListenerOptions = { passive: false };
        document.removeEventListener("wheel", preventDefault, options);
    }, [preventDefault]);

    const disableScroll = useCallback(() => {
        document.addEventListener("wheel", preventDefault, { passive: false });
    }, [preventDefault]);

    return (
        <Grid container aria-label={ariaLabel}>
            <Grid item xs={1} md={5} lg={4} className={classes.gridItem}>
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={onChangeTabValue}
                    className={classes.tabs}
                    classes={{ indicator: classes.indicator }}
                    onWheel={onWheel}
                    onMouseEnter={disableScroll}
                    onMouseLeave={enableScroll}
                >
                    {tabsConfig.map(config => (
                        <Tab
                            key={`TabConfig_${config.tabTitle}`}
                            className={classes.tab}
                            {...a11yProps(config.tab, config.tabTitle)}
                            label={i18n.t(config.tabTitle, {
                                nsSeparator: false,
                            })}
                        />
                    ))}
                </Tabs>
            </Grid>
            <RightPanelGrid item xs={11} md={7} lg={8}>
                {tabsConfig.map(config => (
                    <TabPanel
                        key={`TabPanelConfig_${config.tabTitle}`}
                        value={tabValue}
                        index={config.tab}
                        title={config.tabTitle}
                    >
                        {config.Component ? <config.Component {...config.props} /> : null}
                    </TabPanel>
                ))}
            </RightPanelGrid>
        </Grid>
    );
};

const RightPanelGrid = styled(Grid)`
    .MuiBox-root {
        padding: 0;
    }
`;
