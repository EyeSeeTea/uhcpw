import { useMediaQuery, useTheme } from "@material-ui/core";

type State = {
    isXs: boolean;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
};

function useBreakpoint(): State {
    const theme = useTheme();

    return {
        isXs: useMediaQuery(theme.breakpoints.only("xs")),
        isSm: useMediaQuery(theme.breakpoints.only("sm")),
        isMd: useMediaQuery(theme.breakpoints.only("md")),
        isLg: useMediaQuery(theme.breakpoints.only("lg")),
        isXl: useMediaQuery(theme.breakpoints.only("xl")),
    };
}

export default useBreakpoint;
