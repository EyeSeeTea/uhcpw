import { SetStateAction, useCallback, useMemo, useState } from "react";
import { Box, CircularProgress, Grid, Tab, Tabs, makeStyles } from "@material-ui/core";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { SlideGraph } from "./SlideGraph";
import { SlideInfoOne } from "./SlideInfoOne";
import { SlideInfoTwo } from "./SlideInfoTwo";
import i18n from "../../../../locales";
import { useCountryInfo } from "../../../pages/country/useCountryInfo";
import { generateYears } from "../../../../domain/usecases/utils/generateYears";
import { LatestCOVID19 } from "../../../../domain/entities/Year";
import { useAppContext } from "../../../contexts/app-context";

interface EventListenerArgs {
    capture?: boolean;
}

interface AddEventListenerArgs extends EventListenerArgs {
    passive?: boolean;
    once?: boolean;
}

type AddEventListener = (type: string, listener: (event: Event) => void, options?: AddEventListenerArgs) => void;

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any }) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: "100%" }}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    tabs: {
        maxWidth: "30px",
        minWidth: "30px",
        paddingBlock: "24px",
        "& .MuiTabs-flexContainer": {
            height: "100%",
        },
        [theme.breakpoints.up("md")]: {
            width: "100%",
            maxWidth: "unset",
            paddingInlineStart: "0px",
            "& .MuiTabs-indicator": {
                display: "none",
            },
            paddingBlock: "70px",
        },
    },
    tab: {
        opacity: 1,
        borderRight: `10px solid ${colors.accentPrimary}`,
        marginBottom: "4px",
        maxWidth: "30px",
        minWidth: "30px",
        textTransform: "none",
        color: `${colors.white}`,
        "& span": {
            display: "none",
        },
        [theme.breakpoints.up("md")]: {
            width: "100%",
            maxWidth: "unset",
            borderRight: "unset",
            transition: "background-color 0.3s ease-in-out",
            backgroundColor: `${colors.accentPrimary}`,
            minHeight: "60px",
            padding: "15px 25px",
            "& span": {
                display: "inline",
                textAlign: "start",
            },
            '&[aria-selected="true"]': {
                backgroundColor: `${colors.accentPrimaryDark}`,
            },
        },
    },
}));

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

export const Slider: React.FC<{ countryId: string }> = ({ countryId }) => {
    const { countries } = useAppContext();
    const country = useCountryInfo(countryId);
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (_event: any, newValue: SetStateAction<number>) => {
        setValue(newValue);
    };

    const preventDefault = (e: any) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    };

    const enableScroll = useCallback(() => {
        (document.removeEventListener as AddEventListener)("wheel", preventDefault, { passive: false });
    }, []);

    const disableScroll = useCallback(() => {
        document.addEventListener("wheel", preventDefault, {
            passive: false,
        });
    }, []);

    const onWheel = useCallback(
        (e: React.WheelEvent<HTMLButtonElement>) => {
            if (e.deltaY > 10 && value < 10) {
                setTimeout(() => setValue(value + 1), 800);
            } else if (e.deltaY < -10 && value > 0) {
                setTimeout(() => setValue(value - 1), 800);
            }
        },
        [value]
    );

    const sliderGraphsConfig = useMemo(
        () => [
            {
                tab: 0,
                tabTitle: "How many people experience financial hardship: impoverishing health spending?",
                graphOne: {
                    visualizationId: "jFtGKQIQTGp",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "dbc87Ljw8uN",
                    years: [LatestCOVID19.id],
                    countries: countries.map(({ id }) => id),
                },
            },
            {
                tab: 1,
                tabTitle: "Catastrophic health spending. How many people experience financial hardship?",
                graphOne: {
                    visualizationId: "Y31jQX5PVdI",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "NOukqSxCI63",
                    years: [LatestCOVID19.id],
                    countries: countries.map(({ id }) => id),
                },
            },
            {
                tab: 2,
                tabTitle: "Who experiences financial hardship?",
                graphOne: {
                    visualizationId: "geNXcoXc3mf",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "GimM6ANOKhd",
                    years: [LatestCOVID19.id],
                    countries: countries.map(({ id }) => id),
                },
            },
            {
                tab: 3,
                tabTitle: "Which health services are responsible for financial hardship?",
                graphOne: {
                    visualizationId: "hpO1ZyFXpCz",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "ZxNdsDM8NSb",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
            },
            {
                tab: 4,
                tabTitle: "Which health services are responsible for financial hardship? International comparison",
                graphOne: {
                    visualizationId: "VB7bdJ8ZXya",
                    years: [LatestCOVID19.id],
                    countries: countries.map(({ id }) => id),
                },
                graphTwo: {
                    visualizationId: "mcNfvQaVbfy",
                    years: [LatestCOVID19.id],
                    countries: countries.map(({ id }) => id),
                },
            },
            {
                tab: 5,
                tabTitle: "How many people experience unmet need?",
                graphOne: {
                    visualizationId: "xJhFIBuwGVC",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "zkEtsohZTTf",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
            },
            {
                tab: 6,
                tabTitle: "Who experiences unmet need?",
                graphOne: {
                    visualizationId: "rT39aStYqI3",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "nhaxK33nlhb",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
            },
            {
                tab: 7,
                tabTitle: `How much does ${country?.name} spend on health?`,
                graphOne: {
                    visualizationId: "OB4SCQfCzwz",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
                graphTwo: {
                    visualizationId: "d3kq9OCv8tH",
                    years: generateYears().map(year => year.id),
                    countries: [countryId],
                },
            },
            {
                tab: 8,
                tabTitle: `How much does ${country?.name} spend on health? International comparison`,
                graphOne: {
                    visualizationId: "B4CnzUqVR3n",
                    years: [LatestCOVID19.id],
                    countries: countries.map(({ id }) => id),
                },
                graphTwo: {
                    visualizationId: "BYAT5Woc9EJ",
                    years: [LatestCOVID19.id],
                    countries: [countryId],
                },
            },
        ],
        [countryId, countries, country?.name]
    );

    // NOTICE: This is done because i18next-scanner optional chaining throws error
    const countryName = useMemo(() => country?.name, [country?.name]);

    if (!countryId) return <CircularProgress />;

    return (
        <Grid container aria-label="country-page-slider">
            <Grid item md={5} lg={4} xs={1}>
                <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: colors.accentPrimaryDark,
                            width: "10px",
                        },
                    }}
                    onWheel={onWheel}
                    onMouseEnter={disableScroll}
                    onMouseLeave={enableScroll}
                >
                    <Tab
                        className={classes.tab}
                        {...a11yProps(0)}
                        label={i18n.t("How many people experience financial hardship: impoverishing health spending?", {
                            nsSeparator: false,
                        })}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(1)}
                        label={i18n.t("Catastrophic health spending. How many people experience financial hardship?")}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(2)}
                        label={i18n.t("Who experiences financial hardship?")}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(3)}
                        label={i18n.t("Which health services are responsible for financial hardship?")}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(4)}
                        label={i18n.t(
                            "Which health services are responsible for financial hardship? International comparison"
                        )}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(5)}
                        label={i18n.t("How many people experience unmet need?")}
                    />
                    <Tab className={classes.tab} {...a11yProps(6)} label={i18n.t("Who experiences unmet need?")} />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(7)}
                        label={i18n.t("How much does {{country}} spend on health?", { country: countryName })}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(8)}
                        label={i18n.t("How much does {{country}} spend on health? International comparison", {
                            country: countryName,
                        })}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(9)}
                        label={i18n.t("What are the main gaps in publicly financed coverage?")}
                    />
                    <Tab
                        className={classes.tab}
                        {...a11yProps(10)}
                        label={i18n.t("How can {{country}} strengthen financial protection?", { country: countryName })}
                    />
                </Tabs>
            </Grid>
            <Grid item xs={11} md={7} lg={8}>
                {sliderGraphsConfig.map(tabConfig => (
                    <TabPanel key={tabConfig.tab} value={value} index={tabConfig.tab}>
                        <SlideGraph
                            title={tabConfig.tabTitle}
                            graphOne={tabConfig.graphOne}
                            graphTwo={tabConfig.graphTwo}
                            countryId={countryId}
                        />
                    </TabPanel>
                ))}
                {country && (
                    <>
                        <TabPanel value={value} index={9}>
                            <SlideInfoOne country={country} />
                        </TabPanel>
                        <TabPanel value={value} index={10}>
                            <SlideInfoTwo country={country} />
                        </TabPanel>
                    </>
                )}
            </Grid>
        </Grid>
    );
};
