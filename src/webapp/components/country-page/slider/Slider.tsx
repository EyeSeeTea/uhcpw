import { SetStateAction, useState } from "react";
import { Box, Tab, Tabs, Typography, makeStyles } from "@material-ui/core";
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

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any }) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
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
        marginTop: "50px",
        paddingBottom: "50px",
    },
    tab: {
        borderRight: `10px solid ${colors.accentPrimary}`,
        marginBottom: "4px",
        maxWidth: "30px",
        minWidth: "30px",
        /* "&.Mui-selected": {
            backgroundColor: colors.accentPrimaryLight,
        }, */
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

    return (
        <div className={classes.root}>
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
            >
                <Tab className={classes.tab} {...a11yProps(0)} />
                <Tab className={classes.tab} {...a11yProps(1)} />
                <Tab className={classes.tab} {...a11yProps(2)} />
                <Tab className={classes.tab} {...a11yProps(3)} />
                <Tab className={classes.tab} {...a11yProps(4)} />
                <Tab className={classes.tab} {...a11yProps(5)} />
                <Tab className={classes.tab} {...a11yProps(6)} />
                <Tab className={classes.tab} {...a11yProps(7)} />
                <Tab className={classes.tab} {...a11yProps(8)} />
                <Tab className={classes.tab} {...a11yProps(9)} />
                <Tab className={classes.tab} {...a11yProps(10)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <SlideGraph
                    title="How many people experience financial hardship: impoverishing health spending?"
                    graphOne={{
                        title: "Households with impoverishing health spending",
                        theme: "Bulgaria",
                        image: oneOne,
                    }}
                    graphTwo={{
                        title: "Households with impoverishing health spending, 2019 or latest available year before COVID-19",
                        theme: "International comparison",
                        image: oneTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SlideGraph
                    title="How many people experience financial hardship: catastrophic health spending?"
                    graphOne={{
                        title: "Households with catastrophic health spending",
                        theme: "Bulgaria",
                        image: twoOne,
                    }}
                    graphTwo={{
                        title: "Households with catastrophic health spending, 2019 or latest available year before COVID-19",
                        theme: "International comparison",
                        image: twoTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <SlideGraph
                    title="Who experiences financial hardship?"
                    graphOne={{
                        title: "Households with catastrophic health spending by consumption quintile",
                        theme: "Bulgaria",
                        image: threeOne,
                    }}
                    graphTwo={{
                        title: "Households with catastrophic health spending by consumption quintile, 2019 or latest available year before COVID-19",
                        theme: "International comparison",
                        image: threeTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <SlideGraph
                    title="Which health services are responsible for financial hardship?"
                    graphOne={{
                        title: "Breakdown of catastrophic health spending by type of care",
                        theme: "Bulgaria",
                        image: fourOne,
                    }}
                    graphTwo={{
                        title: "Breakdown of catastrophic health spending by type of care and consumption quintile",
                        theme: "Bulgaria",
                        image: fourTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <SlideGraph
                    title="Which health services are responsible for financial hardship? International comparison"
                    graphOne={{
                        title: "Breakdown of catastrophic health spending by type of care, 2019 or latest available year before COVID-19",
                        theme: "International comparison",
                        image: fiveOne,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <SlideGraph
                    title="How many people experience unmet need?"
                    graphOne={{
                        title: "Unmet need for health care due to cost, distance and waiting time",
                        theme: "International comparison",
                        image: sixOne,
                    }}
                    graphTwo={{
                        title: "Unmet need for dental care due to cost, distance and waiting time",
                        theme: "International comparison",
                        image: sixTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={6}>
                <SlideGraph
                    title="Who experiences unmet need?"
                    graphOne={{
                        title: "Unmet need for health care due to cost, distance and waiting time by income quintile",
                        theme: "Bulgaria",
                        image: sevenOne,
                    }}
                    graphTwo={{
                        title: "Unmet need for dental care due to cost, distance and waiting time by quintile",
                        theme: "Bulgaria",
                        image: sevenTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={7}>
                <SlideGraph
                    title="How much does Bulgaria spend on health?"
                    graphOne={{
                        title: "Current spending on health per person by financing scheme",
                        theme: "Bulgaria",
                        image: eightOne,
                    }}
                    graphTwo={{
                        title: "Out-of-pocket payments as a share of current spending on health",
                        theme: "International comparison",
                        image: eightTwo,
                    }}
                />
            </TabPanel>
            <TabPanel value={value} index={8}>
                <SlideGraph
                    title="How much does Bulgaria spend on health? International comparison"
                    graphOne={{
                        title: "Public spending on health as a share of government spending, 2019",
                        theme: "International comparison",
                        image: nineOne,
                    }}
                    graphTwo={{
                        title: "Public spending on health as a share of GDP",
                        theme: "International comparison",
                        image: nineTwo,
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
