import { Box, CircularProgress, Grid, Tab, Tabs, makeStyles } from "@material-ui/core";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { SlideGraph } from "./SlideGraph";
import i18n from "../../../../locales";
import { useCountrySlider } from "../../../pages/country/useCountrySlider";
import { SlideInfo } from "./SlideInfo";

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
    const classes = useStyles();
    const { tabValue, sliderGraphsConfig, sliderInfoConfig, handleTabChange, onWheel, disableScroll, enableScroll } =
        useCountrySlider(countryId);

    if (!countryId) return <CircularProgress />;

    return (
        <Grid container aria-label="country-page-slider">
            <Grid item md={5} lg={4} xs={1}>
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={handleTabChange}
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
                    {[...sliderGraphsConfig, ...sliderInfoConfig].map(config => (
                        <Tab
                            key={config.tab}
                            className={classes.tab}
                            {...a11yProps(config.tab)}
                            label={i18n.t(config.tabTitle, {
                                nsSeparator: false,
                            })}
                        />
                    ))}
                </Tabs>
            </Grid>
            <Grid item xs={11} md={7} lg={8}>
                {sliderGraphsConfig.map(config => (
                    <TabPanel key={`sliderGraphsConfig_${config.tab}`} value={tabValue} index={config.tab}>
                        <SlideGraph
                            title={config.tabTitle}
                            graphOne={config.graphOne}
                            graphTwo={config.graphTwo}
                            countryId={countryId}
                        />
                    </TabPanel>
                ))}
                {sliderInfoConfig.map(config =>
                    config?.sliderContent ? (
                        <TabPanel key={`sliderInfoConfig_${config.tab}`} value={tabValue} index={config.tab}>
                            <SlideInfo
                                sliderInfo={config?.sliderContent}
                                titleColor={config.titleColor}
                                icon={config.icon}
                            />
                        </TabPanel>
                    ) : null
                )}
            </Grid>
        </Grid>
    );
};
