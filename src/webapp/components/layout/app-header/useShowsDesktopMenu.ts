import { RefObject } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { useFitsInOneLine } from "../../../common/hooks/screen/useFitsInOneLine";

export function useShowsDesktopMenu(menuRowRef: RefObject<HTMLElement>): boolean {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
    const fitsInOneLine = useFitsInOneLine(menuRowRef);

    return isLargeScreen && fitsInOneLine;
}
