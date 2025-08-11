import { createTheme } from "@material-ui/core/styles";

export const colors = {
    gradientPrimary: "linear-gradient(90deg, rgba(10,160,244,1) 0%, rgba(240,247,252,1) 100%)",
    gradientPrimary2: "linear-gradient(90deg, rgba(103, 163, 195, 1) 0%, rgba(9, 74, 148, 1) 100%)",
    accentPrimary: "#0089d6",
    accentPrimaryDark: "#004BA0",
    accentPrimaryLight: "#63A4FF",
    accentPrimaryLightest: "#EAF4FF",

    gradientPrimaryMobile: "linear-gradient(90deg, #185698 0%, #0AA0F4 100%)",

    accentSecondary: "#fb8c00",
    accentSecondaryLight: "#f57c00",
    accentSecondaryDark: "#ff9800",

    black: "#000000",
    greyBlack: "#494949",
    grey: "#9E9E9E",
    greyLight: "#E0E0E0",
    greyDisabled: "#8E8E8E",
    blueGrey: "#ECEFF1",
    snow: "#F4F6F8",
    white: "#FFFFFF", // Not included in palette!

    negative: "#E53935",
    warning: "#F19C02",
    positive: "#3D9305",
    info: "#EAF4FF",
    chartContent: "#212934",

    orange: "#FF9355",
    blue: "#0089D6",
    darkBlue: "#0360A6",
    green: "#4FAD56",
    carouselBackground: "#E5E5EA",
    carouselDotBackground: "#B6B6B6",

    regionalPageBlueDark: "#96dcf8",
    regionalPageBlueLight: "#caeefb",
};

export const palette = {
    common: {
        white: colors.white,
        black: colors.black,
    },
    action: {
        active: colors.greyBlack,
        disabled: colors.greyDisabled,
    },
    text: {
        primary: colors.black,
        secondary: colors.white,
        disabled: colors.greyDisabled,
        hint: colors.grey,
        chartContent: colors.chartContent,
    },
    primary: {
        main: colors.accentPrimary,
        dark: colors.accentPrimaryDark,
        light: colors.accentPrimaryLight,
        lightest: colors.accentPrimaryLightest, // Custom extension, not used by default
        // contrastText: 'white',
    },
    secondary: {
        main: colors.accentSecondary,
        light: colors.accentSecondaryLight,
        dark: colors.accentSecondaryDark,
        contrastText: "#fff",
    },
    error: {
        main: colors.negative, // This is automatically expanded to main/light/dark/contrastText, what do we use here?
    },
    status: {
        //Custom colors collection, not used by default in MUI
        negative: colors.negative,
        warning: colors.warning,
        positive: colors.positive,
        info: colors.info,
    },
    background: {
        paper: colors.white,
        default: colors.snow,
        grey: "#FCFCFC",
        hover: colors.greyLight,
    },
    divider: colors.greyLight,
    shadow: colors.grey,
};

export const muiTheme = createTheme({
    // colors,
    palette,
    typography: {
        fontFamily: ["Lato", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        // useNextVariants: true,
    },
    overrides: {
        MuiDivider: {
            light: {
                backgroundColor: palette.divider, // No light dividers for now
            },
        },
        MuiCssBaseline: {},
    },
});
