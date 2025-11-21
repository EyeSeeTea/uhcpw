import React, { useCallback } from "react";
import { Grid, Tab, Tabs, makeStyles } from "@material-ui/core";
import styled from "styled-components";

import { colors } from "../../pages/app/themes/dhis2.theme";
import i18n from "../../../locales";
import { TabPanel } from "./TabPanel";

const useStyles = makeStyles(theme => ({
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
    Component: React.ComponentType<any> | null;
    props?: Record<string, any>;
};

type TabsPanelProps = {
    tabsConfig: VerticalTabConfig[];
    tabValue: number;
    onChangeTabValue: (event: React.ChangeEvent<{}>, newValue: number) => void;
    ariaLabel: string;
    isSecondaryColor?: boolean;
    onTabsWidthChange?: (width: number) => void;
    sidePanelWidth?: number;
};

export const VerticalTabsPanel: React.FC<TabsPanelProps> = props => {
    const {
        tabsConfig,
        onChangeTabValue,
        tabValue,
        ariaLabel,
        isSecondaryColor = false,
        onTabsWidthChange,
        sidePanelWidth,
    } = props;
    const classes = useStyles();
    const gridItemRef = React.useRef<HTMLDivElement | null>(null);

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

    const getLabel = useCallback((key: string) => {
        const text = i18n.t(key, { nsSeparator: false });

        const className = startWithNumber(text) ? "start-with-number-label" : undefined;

        return <span className={className}>{text}</span>;
    }, []);

    React.useEffect(() => {
        if (!onTabsWidthChange) return;

        const handleResize = () => {
            if (gridItemRef.current) {
                onTabsWidthChange(gridItemRef.current.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [onTabsWidthChange]);

    return (
        <StyledGridContainer container aria-label={ariaLabel}>
            <StyledGridItem
                item
                ref={gridItemRef}
                xs={1}
                md={4}
                lg={4}
                isSecondaryColor={isSecondaryColor}
                sidePanelWidth={sidePanelWidth}
            >
                <StyledTabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={onChangeTabValue}
                    isSecondaryColor={isSecondaryColor}
                    classes={{ indicator: classes.indicator }}
                    onWheel={onWheel}
                    onMouseEnter={disableScroll}
                    onMouseLeave={enableScroll}
                >
                    {tabsConfig.map(config => (
                        <StyledTab
                            key={`TabConfig_${config.tabTitle}`}
                            isSecondaryColor={isSecondaryColor}
                            {...a11yProps(config.tab, config.tabTitle)}
                            label={getLabel(config.tabTitle)}
                        />
                    ))}
                </StyledTabs>
            </StyledGridItem>

            <RightPanelGrid item xs={11} md={8} lg={8}>
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
        </StyledGridContainer>
    );
};

const StyledGridContainer = styled(Grid)`
    flex-wrap: nowrap;
`;

const RightPanelGrid = styled(Grid)`
    .MuiBox-root {
        padding: 0;
    }
`;

const StyledGridItem = styled(Grid)<{ isSecondaryColor?: boolean; sidePanelWidth?: number }>`
    background-color: ${props => (props.isSecondaryColor ? colors.blue20 : colors.accentPrimary)};
    border-inline-end: none;
    margin-block-end: 4px;

    @media (max-width: 960px) {
        background-color: ${colors.white};
        border-inline-end: 6px solid ${props => (props.isSecondaryColor ? colors.blue20 : colors.accentPrimary)};
        width: 30px;
        flex-basis: unset;
    }

    @media (min-width: 960px) {
        box-sizing: border-box;

        ${({ sidePanelWidth }) =>
            sidePanelWidth
                ? `
                    width: ${sidePanelWidth}px;
                    max-width: ${sidePanelWidth}px;
                    flex: 0 0 ${sidePanelWidth}px;
                `
                : `
                    width: 100%;
                `}
    }
`;

const StyledTabs = styled(Tabs)<{ isSecondaryColor?: boolean }>`
    max-width: 30px;
    min-width: 30px;
    & .MuiTabs-flexContainer {
        height: 100%;
    }
    background-color: ${colors.white};
    border-block-end: 4px solid ${colors.white};

    @media (min-width: 960px) {
        background-color: ${props => (props.isSecondaryColor ? colors.blue20 : colors.accentPrimary)};
        width: 100%;
        max-width: unset;
        padding-inline-start: 0px;
        & .MuiTabs-indicator {
            display: none;
        }
        border-block-end: none;
        padding-block-end: 70px;
    }
`;

const StyledTab = styled(Tab)<{ isSecondaryColor?: boolean }>`
    opacity: 1;
    border-inline-end: 150px solid ${props => (props.isSecondaryColor ? colors.blue20 : colors.accentPrimary)};
    border-block-start: 4px solid ${colors.white};
    max-width: 50px;
    min-width: 30px;
    text-transform: none;
    color: ${props => (props.isSecondaryColor ? colors.black : colors.white)};
    font-size: 16px;
    & span {
        display: none;
    }
    &:first-child {
        border-block-start: 4px solid ${colors.white};
    }

    @media (min-width: 960px) {
        width: 100%;
        max-width: unset;
        border-right: unset;
        transition: background-color 0.3s ease-in-out;
        background-color: ${props => (props.isSecondaryColor ? colors.blue20 : colors.accentPrimary)};
        min-height: 60px;
        padding: 15px 50px;
        padding-inline-start: 64px;
        & span {
            display: inline;
            text-align: start;
        }

        & .start-with-number-label {
            display: inline-block;
            padding-left: 10px;
            text-indent: -12px;
        }

        &[aria-selected="true"] {
            background-color: ${props => (props.isSecondaryColor ? colors.blue50 : colors.accentPrimaryDark)};
            font-weight: ${props => (props.isSecondaryColor ? "bold" : "normal")};
        }
        &:last-child {
            border-block-end: 4px solid ${colors.white};
        }
    }
`;

function startWithNumber(text: string) {
    const numberedRegex = /^\d+\s/;
    return numberedRegex.test(text);
}
