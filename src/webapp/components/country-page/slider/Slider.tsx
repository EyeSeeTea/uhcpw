import { SetStateAction, useCallback, useState } from "react";
import { Box, Tab, Tabs, makeStyles } from "@material-ui/core";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { SlideGraph } from "./SlideGraph";
import oneOne from "../../../assets/country-page/slider/1-1.jpg";
import oneTwo from "../../../assets/country-page/slider/1-2.jpg";
import twoOne from "../../../assets/country-page/slider/2-1.jpg";
import twoTwo from "../../../assets/country-page/slider/2-2.jpg";
import threeOne from "../../../assets/country-page/slider/3-1.jpg";
import threeTwo from "../../../assets/country-page/slider/3-2.jpg";
import fourOne from "../../../assets/country-page/slider/4-1.jpg";
import fourTwo from "../../../assets/country-page/slider/4-2.jpg";
import fiveOne from "../../../assets/country-page/slider/5-1.jpg";
import sixOne from "../../../assets/country-page/slider/6-1.jpg";
import sixTwo from "../../../assets/country-page/slider/6-2.jpg";
import sevenOne from "../../../assets/country-page/slider/7-1.jpg";
import sevenTwo from "../../../assets/country-page/slider/7-2.jpg";
import eightOne from "../../../assets/country-page/slider/8-1.jpg";
import eightTwo from "../../../assets/country-page/slider/8-2.jpg";
import nineOne from "../../../assets/country-page/slider/9-1.jpg";
import nineTwo from "../../../assets/country-page/slider/9-2.jpg";
import { SlideInfoOne } from "./SlideInfoOne";
import { SlideInfoTwo } from "./SlideInfoTwo";
import i18n from "../../../../locales";

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
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
    },
    tabs: {
        maxWidth: "30px",
        minWidth: "30px",
        paddingBlock: "24px",
        "& .MuiTabs-flexContainer": {
            height: "100%",
        },
        [theme.breakpoints.up("md")]: {
            minWidth: "35%",
            paddingInlineStart: "24px",
            "& .MuiTabs-indicator": {
                display: "none",
            },
            paddingBlock: "70px",
        },
    },
    tab: {
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

export const Slider: React.FC = () => {
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

    return (
        <div className={classes.root} aria-label="country-page-slider">
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
                    label={i18n.t("How many people experience financial hardship: impoverishing health spending?")}
                />
                <Tab
                    className={classes.tab}
                    {...a11yProps(1)}
                    label={i18n.t("Catastrophic health spending. How many people experience financial hardship?")}
                />
                <Tab className={classes.tab} {...a11yProps(2)} label={i18n.t("Who experiences financial hardship?")} />
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
                <Tab className={classes.tab} {...a11yProps(5)} label="How many people experience unmet need?" />
                <Tab className={classes.tab} {...a11yProps(6)} label="Who experiences unmet need?" />
                <Tab className={classes.tab} {...a11yProps(7)} label="How much does Bulgaria spend on health?" />
                <Tab
                    className={classes.tab}
                    {...a11yProps(8)}
                    label={i18n.t("How much does Bulgaria spend on health? International comparison")}
                />
                <Tab
                    className={classes.tab}
                    {...a11yProps(9)}
                    label={i18n.t("What are the main gaps in publicly financed coverage?")}
                />
                <Tab
                    className={classes.tab}
                    {...a11yProps(10)}
                    label={i18n.t("How can Bulgaria strengthen financial protection?")}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <SlideGraph
                    title="How many people experience financial hardship: impoverishing health spending?"
                    graphOne={{
                        title: "Households with impoverishing health spending",
                        theme: "Financial hardship",
                        image: oneOne,
                        dialogInfo: {
                            infoNotes: [
                                "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Households with impoverishing health spending, 2019 or latest available year before COVID-19",
                        theme: "Comparative chart",
                        image: oneTwo,
                        dialogInfo: {
                            infoNotes: [
                                "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SlideGraph
                    title="Catastrophic health spending. 
                    How many people experience financial hardship?"
                    graphOne={{
                        title: "Households with catastrophic health spending",
                        theme: "Financial hardship",
                        image: twoOne,
                        dialogInfo: {
                            infoNotes: [
                                "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Households with catastrophic health spending, 2019 or latest available year before COVID-19",
                        theme: "Comparative charts",
                        image: twoTwo,
                        dialogInfo: {
                            infoNotes: [
                                "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <SlideGraph
                    title="Who experiences financial hardship?"
                    graphOne={{
                        title: "Households with catastrophic health spending by consumption quintile",
                        theme: "Financial hardship",
                        image: threeOne,
                        dialogInfo: {
                            infoNotes: [
                                "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Households with catastrophic health spending by consumption quintile, 2019 or latest available year before COVID-19",
                        theme: "International comparison",
                        image: threeTwo,
                        dialogInfo: {
                            infoNotes: [
                                "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <SlideGraph
                    title="Which health services are responsible for financial hardship?"
                    graphOne={{
                        title: "Breakdown of catastrophic health spending by type of care",
                        theme: "Financial hardship",
                        image: fourOne,
                        dialogInfo: {
                            infoNotes: [
                                "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs).",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Breakdown of catastrophic health spending by type of care and consumption quintile",
                        theme: "Financial Hardship",
                        image: fourTwo,
                        dialogInfo: {
                            infoNotes: [
                                "Analysis as of 2018. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Consumption quintiles are based on per person consumption using OECD equivalence scales.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <SlideGraph
                    title="Which health services are responsible for financial hardship? International comparison"
                    graphOne={{
                        title: "Breakdown of catastrophic health spending by type of care, 2019 or latest available year before COVID-19",
                        theme: "Comparative charts",
                        image: fiveOne,
                        dialogInfo: {
                            infoNotes: [
                                "The different types of health care are sorted by the incidence of catastrophic health spending and the unweighted average across countries. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). In Spain dentures are classified as medical products in the household budget survey; in most other countries they are classified as dental care. In Ukraine the medicines category includes inpatient medicines; in most other countries the medicines category refers to outpatient medicines only. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                            ],
                            sourceName: "WHO Barcelona Office for Health Systems Financing",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <SlideGraph
                    title="How many people experience unmet need?"
                    graphOne={{
                        title: "Unmet need for health care due to cost, distance and waiting time",
                        theme: "Unmet need",
                        image: sixOne,
                        dialogInfo: {
                            infoNotes: ["Health care refers to ‘medical examination or treatment’."],
                            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Unmet need for dental care due to cost, distance and waiting time",
                        theme: "Unmet need",
                        image: sixTwo,
                        dialogInfo: {
                            infoNotes: ["Dental care refers to ‘dental examination or treatment’."],
                            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={6}>
                <SlideGraph
                    title="Who experiences unmet need?"
                    graphOne={{
                        title: "Unmet need for health care due to cost, distance and waiting time by income quintile",
                        theme: "Unmet need",
                        image: sevenOne,
                        dialogInfo: {
                            infoNotes: [
                                "Income quintiles are based on the equivalized disposable income of each household member.",
                            ],
                            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Unmet need for dental care due to cost, distance and waiting time by quintile",
                        theme: "Unmet need",
                        image: sevenTwo,
                        dialogInfo: {
                            infoNotes: [
                                "Income quintiles are based on the equivalized disposable income of each household member.",
                            ],
                            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={7}>
                <SlideGraph
                    title="How much does Bulgaria spend on health?"
                    graphOne={{
                        title: "Current spending on health per person by financing scheme",
                        theme: "Spending on health (health accounts)",
                        image: eightOne,
                        dialogInfo: {
                            infoNotes: [
                                "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment.",
                            ],
                            sourceName: "WHO Global Health Expenditure Database",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Out-of-pocket payments as a share of current spending on health",
                        theme: "Spending on health (health accounts)",
                        image: eightTwo,
                        dialogInfo: {
                            infoNotes: ["EU average include the United Kingdom up to and including 2019."],
                            sourceName: "WHO Global Health Expenditure Database",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={8}>
                <SlideGraph
                    title="How much does Bulgaria spend on health? International comparison"
                    graphOne={{
                        title: "Public spending on health as a share of government spending, 2019",
                        theme: "Comparative chart",
                        image: nineOne,
                        dialogInfo: {
                            infoNotes: [
                                "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. It excludes San Marino.  EU average include the United Kingdom up to and including 2019.",
                            ],
                            sourceName: "WHO Global Health Expenditure Database",
                            sourceLink: "",
                        },
                    }}
                    graphTwo={{
                        title: "Public spending on health as a share of GDP",
                        theme: "Spending on health (health accounts)",
                        image: nineTwo,
                        dialogInfo: {
                            infoNotes: [
                                "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. EU average include the United Kingdom up to and including 2019.",
                            ],
                            sourceName: "WHO Global Health Expenditure Database",
                            sourceLink: "",
                        },
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={9}>
                <SlideInfoOne />
            </TabPanel>
            <TabPanel value={value} index={10}>
                <SlideInfoTwo />
            </TabPanel>
        </div>
    );
};
